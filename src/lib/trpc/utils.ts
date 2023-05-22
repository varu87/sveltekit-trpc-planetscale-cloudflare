import { auth } from "./middleware/auth";
import { t } from "./t";

export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(auth);
