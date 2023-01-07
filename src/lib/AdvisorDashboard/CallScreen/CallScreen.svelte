<script lang="ts">
    import { userData, dismissedClientIds } from "../../../GlobalStore";
    import Phone from "svelte-material-icons/Phone.svelte";
    import PhoneHangup from "svelte-material-icons/PhoneHangup.svelte";
    import Refresh from "svelte-material-icons/Refresh.svelte";
    import Check from "svelte-material-icons/Check.svelte";
    import NoClients from "../../../assets/NoClients.svelte"
    import API from "../../../API";
    import { onDestroy, onMount } from "svelte";

    export let onCalling = (targetId: string) => {};
    let clientList = [];
    let interval;
    let callSince = new Date();
    let canRefresh = false;

    onMount(() => {
        interval = setInterval(async () => {
            clientList = await API.fetchClientList();
        }, 10000)
        API.fetchClientList().then((list) => clientList = list);
    })

    function refreshClientList() {
        canRefresh = false;
        API.fetchClientList().then((list) => clientList = list);
        setTimeout(() => canRefresh = true, 5000);
    }

    onDestroy(() => {
        clearInterval(interval);
    })

    function dismissCall(id: string) {
        dismissedClientIds.update((list) => [...list, id]);
    }

</script>

<div class="callScreen">
    <h2>On call since {callSince.toLocaleTimeString()}</h2>
    <div class="clientList">
        {#each clientList.filter((a) => !$dismissedClientIds.includes(a)) as client}
            <div class="client">
                <h3>
                    Client
                    <br />
                    <span>
                        {#if client.similarityMax === 0}
                        Unsure of match
                        {:else}
                        Similarity {client.similarity}%/{client.similarityMax}
                        {/if}
                    </span>
                </h3>
                <div class="attributes">
                    {#each client.attributes as attribute}
                    <div class="attribute">
                        {attribute.name}
                    </div>
                    {/each}
                </div>
                <button class="acceptCall" on:click={() => { onCalling(client.id); dismissCall(client.id) }}>
                    <Phone />
                </button>
                <button class="dismissCall" on:click={() => dismissCall(client.id)}>
                    <PhoneHangup />
                </button>
            </div>
        {/each}
        {#if clientList.length == 0}
            <NoClients />
        {/if}
        <button class="refreshList" disabled={canRefresh} on:click={refreshClientList}>
            <Refresh /> {canRefresh ? "Refresh" : "Refreshed"}
        </button>
    </div>
</div>

<style>
    .callScreen {
        position: relative;
        height: 100%;
        width: calc(calc(100vh - 50px) * calc(9 / 16));
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        background-color: #222;
        color: white;

        display: flex;
        flex-direction: column;
    }
    .clientList {
        overflow-y: auto;
        flex-grow: 1;
        padding: 10px;
    }
    .client {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 100%;
        text-align: left;
        align-items: center;
    }
    .client h3 span {
        font-size: 0.8em;
        color: #ccc;
    }
    .client .attributes {
        flex-grow: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .client .attribute {
        background-color: #333;
        padding: 5px 10px;
        border-radius: 5px;
    }
    .acceptCall, .dismissCall {
        background-color: var(--success);
        color: white;
        line-height: 0;
        padding: 10px 20px;
        border-radius: 100px;
        font-size: 1.5em;
        margin: 0;
    }
    .dismissCall {
        background-color: var(--danger);
    }
    .refreshList {
        position: absolute;
        bottom: 30px;
        right: 50%;
        transform: translateX(50%);

        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    }
</style>
