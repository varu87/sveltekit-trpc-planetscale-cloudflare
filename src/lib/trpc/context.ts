import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";
import { DATABASE_URL } from "$env/static/private";
import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import type { DB } from "$lib/db/types";

const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: DATABASE_URL,
  }),
});

export const createContext = async (event: RequestEvent) => {
  let email: string | null = null;
  const session = event.locals.session;

  if (session) email = session.email;
  return {
    db,
    email,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
