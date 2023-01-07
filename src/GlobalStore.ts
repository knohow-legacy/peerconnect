import { writable } from "svelte/store";
import API from "./API";

export let userData = writable(null);
export let targetData = writable(null);
export let view = writable<"client"|"advisor"|"home">("client");
export let dismissedClientIds = writable([]);
export let sendChat = writable((text: string) => {});
export let chatMsgsStore = writable([]);

if (localStorage.getItem('peerconnect-token')) {
    API.getUserByToken(localStorage.getItem('peerconnect-token')).then((user) => {
        userData.set(user);
        view.set(user.isAdvisor ? "advisor" : "client")
    }).catch(() => {})
}