import { z } from "zod";
import { t } from "../t";
import { protectedProcedure } from "../utils";
import { UserHomeRoles, type DB, type User } from "$lib/db/types";
import { createId } from "@paralleldrive/cuid2";

export const user = t.router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userFromDb = await ctx.db
      .selectFrom("User")
      .leftJoin("UserHome", "User.id", "UserHome.userId")
      .leftJoin("Home", "UserHome.homeId", "Home.id")
      .select([
        "User.id",
        "User.firstname",
        "User.lastname",
        "User.email",
        "Home.id as homeId",
        "Home.name as homeName",
        "UserHome.role",
      ])
      .where("User.email", "=", ctx.email)
      .execute();

    const user = {
      id: userFromDb.at(0)?.id,
      firstname: userFromDb.at(0)?.firstname,
      lastname: userFromDb.at(0)?.lastname,
      email: userFromDb.at(0)?.email,
      homes: userFromDb.map((u) => ({
        id: u.homeId,
        name: u.homeName,
        role: u.role,
      })),
    };

    return user;
  }),
  createUserAndHome: protectedProcedure
    .input(
      z.object({
        firstname: z.string().nullable(),
        lastname: z.string().nullable(),
        homeName: z.string().min(1, { message: "Home name missing." }),
        addressLine1: z.string().nullable(),
        addressLine2: z.string().nullable(),
        city: z.string().nullable(),
        state: z.string().nullable(),
        postcode: z.string().nullable(),
        country: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.transaction().execute(async (tx) => {
        const userId = createId();
        const homeId = createId();
        await tx
          .insertInto("User")
          .values({
            id: userId,
            firstname: input.firstname,
            lastname: input.lastname,
            email: ctx.email!,
            isActive: 1,
          })
          .execute();

        await tx
          .insertInto("Home")
          .values({
            id: homeId,
            name: input.homeName,
            addressLine1: input.addressLine1,
            addressLine2: input.addressLine2,
            city: input.city,
            state: input.state,
            postcode: input.postcode,
            country: input.country,
            isActive: 1,
          })
          .execute();

        await ctx.db
          .insertInto("UserHome")
          .values({
            homeId: homeId,
            userId: userId,
            role: UserHomeRoles.OWNER,
          })
          .execute();

        return {
          id: userId,
          firstname: input.firstname,
          lastname: input.lastname,
          email: ctx.email,
          homes: [
            {
              name: input.homeName,
              role: UserHomeRoles.OWNER,
            },
          ],
        };
      });
      return user;
    }),
  remove: protectedProcedure
    .input(z.string().min(1, { message: "Email missing" }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction().execute(async (tx) => {
        const user = await tx
          .selectFrom("User")
          .leftJoin("UserHome", "User.id", "UserHome.userId")
          .leftJoin("Home", "UserHome.homeId", "Home.id")
          .select([
            "User.id",
            "User.firstname",
            "User.lastname",
            "User.email",
            "Home.id as homeId",
            "Home.name as homeName",
            "UserHome.role",
          ])
          .where("User.email", "=", ctx.email)
          .executeTakeFirst();
        if (user) {
          const userId = user.id;
          const homeId = user.homeId;

          await tx
            .deleteFrom("UserHome")
            .where("userId", "=", userId)
            .execute();
          await tx.deleteFrom("User").where("id", "=", userId).execute();
          await tx.deleteFrom("Home").where("id", "=", homeId).execute();
        }
      });
    }),
});
