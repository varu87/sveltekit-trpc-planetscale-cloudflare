import type { ColumnType, GeneratedAlways } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const UserHomeRoles = {
    OWNER: "OWNER",
    MEMBER: "MEMBER"
} as const;
export type UserHomeRoles = (typeof UserHomeRoles)[keyof typeof UserHomeRoles];
export type Home = {
    id: string;
    name: string;
    isActive: number;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
    country: string | null;
};
export type User = {
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string;
    isActive: number;
};
export type UserHome = {
    userId: string;
    homeId: string;
    role: UserHomeRoles;
};
export type DB = {
    Home: Home;
    User: User;
    UserHome: UserHome;
};
