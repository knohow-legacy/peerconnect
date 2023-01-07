import axios from "axios";
import { get } from "svelte/store";
import { userData } from "./GlobalStore";
// peerconnect-backend.azurewebsites.net
let forcePROD = true;
export const ENDPOINT = import.meta.env.DEV && !forcePROD ? 
    'http://localhost:8080/api' :
    'https://peerconnect-backend.azurewebsites.net/api';
export const WS_ENDPOINT = import.meta.env.DEV && !forcePROD ? 
    'ws://localhost:8080' :
    'wss://peerconnect-backend.azurewebsites.net';

class APIBase {
    constructor() {
    }

    private async POST(url: string, data: any = null, additionalHeaders: any = {}) {
        let headers = { 'Accept': 'application/json', ...additionalHeaders }
        let resp = await axios.post(
            url, 
            data,
            { headers }
        );

        if (resp.status !== 200) {
            throw new Error(resp.data.error);
        }

        return resp.data;
    }

    private async PATCH(url: string, data: any = null, additionalHeaders: any = {}) {
        let headers = { 'Accept': 'application/json', ...additionalHeaders }
        let resp = await axios.patch(
            url, 
            data,
            { headers }
        );

        if (resp.status !== 200) {
            throw new Error(resp.data.error);
        }

        return resp.data;
    }

    private async GET(url: string, additionalHeaders: any = {}) {
        let headers = { 'Accept': 'application/json', ...additionalHeaders }
        let resp = await axios.get(
            url,
            { headers }
        );

        if (resp.status !== 200) {
            throw new Error(resp.data.error);
        }

        return resp.data;
    }

    /**
     * Login to the API with a Google account.
     * @param {string} userID
     * @param {string} name
     * @param {string} pfp
     * @param {string} email
     */
    async login(userID: string, name: string, pfp: string, email: string) {
        let response = await this.POST(
            `${ENDPOINT}/google-sign-in`, 
            {
                userID,
                name,
                pfp,
                email
            }
        );

        return {...response.user, token: response.token};
    }

    /**
     * Creates a temporary client user.
     * @returns the client object.
     */
    async clientLogin() {
        return await this.POST(
            `${ENDPOINT}/sign-in`
        );
    }

    /**
     * Gets the user's data.
     */
    async getUser(id: string) {
        return await this.GET(
            `${ENDPOINT}/fetch-user-by-id/${id}`
        );
    }

    private async checkCallQueue() {
        let user = get(userData);
        if (!user) return null;

        let data = await this.POST(`${ENDPOINT}/ping-queue`, {id: user.id}).catch(() => null);
        
        if (!data) return false;

        if (data.hasBeenChosen) {
            return data.hasBeenChosenBy;
        }
    }

    /**
     * [CLIENT] Joins the call queue.
     * @returns Cancel function, or null if failed
     */
    async joinCallQueue(filters: any|null, onMatch: (targetID: string) => void) {
        let user = get(userData);
        if (!user) return null;

        await this.POST(`${ENDPOINT}/join-queue`, {attributes: filters, id: user.id});

        let interval = setInterval(async () => {
            let target = await this.checkCallQueue();

            if (target === false) {
                // if request failed, rejoin queue
                await this.POST(`${ENDPOINT}/join-queue`, {attributes: filters, id: user.id});
            } else if (target) {
                clearInterval(interval);
                onMatch(target);
            }
        }, 5000);

        function cancel() {
            clearInterval(interval);
        }
        return interval;
    }

    /**
     * [CLIENT] Leaves the call queue.
     */
    async leaveCallQueue() {
        let user = get(userData);
        if (!user) return;

        await this.POST(`${ENDPOINT}/leave-queue`, {id: user.id});
    }

    /* ADVISOR */
    /**
     * [ADVISOR] Fetches a list of potential clients.
     * @returns a list of potential clients.
     */
    async fetchClientList() {
        let user = get(userData);
        if (!user || !user.token) return [];

        return await this.GET(`${ENDPOINT}/fetch-queue`, {
            'Authorization': `Bearer ${user.token}`
        });
    }

    /**
     * [ADVISOR] Accepts the client with the given ID.
     */
    async acceptCall(id: string) {
        let user = get(userData);
        if (!user || !user.token) return;

        return await this.POST(`${ENDPOINT}/accept-user`, {id}, {
            'Authorization': `Bearer ${user.token}`
        });
    }

    /**
     * [ADVISOR] Updates the attributes of the advisor.
     */
    async updateAttributes(attributes: {name: string, category: string}[]) {
        let user = get(userData);
        if (!user || !user.token) return;

        return await this.PATCH(`${ENDPOINT}/patch-attributes`, {attributes}, {
            'Authorization': `Bearer ${user.token}`
        });
    }
}

export default new APIBase();