import { TRPCError } from "@trpc/server";
import { t } from "$lib/trpc/t";

export const auth = t.middleware(async ({ next, ctx }) => {
  if (!ctx.email) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next();
});
