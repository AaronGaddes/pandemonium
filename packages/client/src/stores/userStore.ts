import { createSignal } from "solid-js";
import { User } from "../../../shared/src";

export const userStore = createSignal<User | null>(null);
