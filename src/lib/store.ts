import { writable } from "svelte/store";
import type { User } from "$lib/models/User";

export const currentUser = writable<User | null>(null);
