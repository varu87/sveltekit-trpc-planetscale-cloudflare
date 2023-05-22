import { user } from "./routes/user";
import { t } from "./t";

export const router = t.router({
  user,
});

export type Router = typeof router;
export type CreateCaller = ReturnType<typeof router.createCaller>;
