import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { createContext } from "$lib/trpc/context";
import { router } from "$lib/trpc/router";

const authHandle: Handle = async ({ event, resolve }) => {
  const session = {
    email: "myname@email.com",
  };

  event.locals.session = session;

  const context = await createContext(event);
  const caller = router.createCaller(context);

  event.locals.trpcCaller = caller;

  return resolve(event);
};

export const handle = sequence(authHandle);
