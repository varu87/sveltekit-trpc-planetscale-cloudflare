import type { UserHomeRoles } from "$lib/db/types";

export interface User {
  firstname: string | null;
  lastname: string | null;
  email: string;
  homes: UserHome[];
}

interface UserHome {
  name: string | null;
  role: UserHomeRoles | null;
}
