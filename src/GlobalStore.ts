import { writable } from "svelte/store";
import API from "./API";

export let userData = writable(null);
export let targetData = writable(null);
export let view = writable<"peer"|"advisor"|"home">("peer");
export let dismissedPeerIds = writable([]);
export let sendChat = writable((text: string) => {});
export let chatMsgsStore = writable([]);

if (localStorage.getItem('peerconnect-token')) {
    API.getUserByToken(localStorage.getItem('peerconnect-token')).then((user) => {
        userData.set(user);
        view.set(user.isAdvisor ? "advisor" : "peer")
    }).catch(() => {})
}