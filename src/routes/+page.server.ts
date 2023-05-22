import { z } from "zod";
import { zfd } from "zod-form-data";
import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { User } from "$lib/models/User";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const { session, trpcCaller } = locals;

    if (!session) throw new Error("Session not initialized");
    if (!trpcCaller) throw new Error("tRPC not initialized");

    let user: User | null = null;

    const userData = await trpcCaller.user.getUser();

    if (userData && userData.homes.length > 0)
      user = {
        firstname: userData.firstname ?? null,
        lastname: userData.lastname ?? null,
        email: userData.email ?? "",
        homes: userData.homes.map((u) => ({
          name: u.name,
          role: u.role,
        })),
      };

    return {
      user,
    };
  } catch (err) {
    const e = err as Error;
    throw error(500, { message: e.message });
  }
};

export const actions: Actions = {
  createUser: async ({ request, locals }) => {
    const { session, trpcCaller } = locals;

    if (!session) throw new Error("Session not initialized");
    if (!trpcCaller) throw new Error("tRPC not initialized");

    const formData = await request.formData();

    const schema = zfd.formData({
      firstname: z
        .string()
        .min(1, { message: "Please enter your first name." }),
      lastname: z.string().min(1, { message: "Please enter your last name." }),
      addressLine1: z.string().nullable(),
      addressLine2: z.string().nullable(),
      city: z.string().nullable(),
      state: z.string().nullable(),
      postcode: z.string().nullable(),
      country: z.string().nullable(),
    });

    const parsedFormData = schema.safeParse(formData);

    if (!parsedFormData.success) {
      const response = {
        data: Object.fromEntries(formData),
        errors: parsedFormData.error.flatten().fieldErrors,
      };
      return fail(400, response);
    }

    try {
      const { data } = parsedFormData;
      const {
        firstname,
        lastname,
        addressLine1,
        addressLine2,
        city,
        state,
        postcode,
        country,
      } = data;

      const homeName = `${firstname}'s Home`;

      const user = await trpcCaller.user.createUserAndHome({
        firstname,
        lastname,
        addressLine1,
        addressLine2,
        city,
        state,
        postcode,
        country,
        homeName,
      });

      return {
        user,
      };
    } catch (err) {
      const error = err as Error;
      return fail(500, {
        error,
      });
    }
  },
  removeUser: async ({ locals }) => {
    const email = locals.session?.email;
    if (email) {
      await locals.trpcCaller?.user.remove(email);
      return {
        success: true,
      };
    }
  },
};
