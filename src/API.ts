import axios from "axios";
import { get } from "svelte/store";
import { userData } from "./GlobalStore";

export const ENDPOINT = 'http://localhost:3000/api';
export const WS_ENDPOINT = 'ws://localhost:6503';

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
        
        if (!data) return null;

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

        let resp = await this.POST(`${ENDPOINT}/join-queue`, {attributes: filters, id: user.id});

        let interval = setInterval(async () => {
            console.log("interval ran")
            let target = await this.checkCallQueue();

            if (target) {
                clearInterval(interval);
                onMatch(target);
            }
        }, 5000);

        function cancel() {
            clearInterval(interval);
        }
        return interval;
    }

    /* MENTOR */
    /**
     * [MENTOR] Fetches a list of potential clients.
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
     * [MENTOR] Accepts the client with the given ID.
     */
    async acceptCall(id: string) {
        let user = get(userData);
        if (!user || !user.token) return;

        return await this.POST(`${ENDPOINT}/accept-user`, {id}, {
            'Authorization': `Bearer ${user.token}`
        });
    }
}

export default new APIBase();