import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";
import { DATABASE_URL } from "$env/static/private";
import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import type { DB } from "$lib/db/types";
// import type { RequestInit, RequestInitCfProperties } from "@cloudflare/workers-types";

const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: DATABASE_URL,
    /*fetch: (url: string, init: RequestInit<RequestInitCfProperties>) => {
    delete (init as any)["cache"]; // Remove cache header
    return fetch(url, init);
  }*/
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
