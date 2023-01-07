import { writable } from "svelte/store";

export let userData = writable(null);
export let targetData = writable(null);
export let view = writable<"client"|"advisor"|"home">("client");