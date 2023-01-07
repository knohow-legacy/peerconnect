<script lang="ts">
    import { userData, dismissedClientIds } from "../../../GlobalStore";
    import Refresh from "svelte-material-icons/Refresh.svelte";

    import Video from "svelte-material-icons/Video.svelte";
    import VideoOff from "svelte-material-icons/VideoOff.svelte";
    import Microphone from "svelte-material-icons/Microphone.svelte";
    import MicrophoneOff from "svelte-material-icons/MicrophoneOff.svelte";

    import NoClients from "../../../assets/NoClients.svelte"
    import API from "../../../API";
    import { onDestroy, onMount } from "svelte";
    import Client from "./Client.svelte";

    export let onCalling = (targetId: string) => {};
    export let callDefaultsStore;
    let clientList = [];
    let interval;
    let callSince = new Date();
    let canRefresh = true;

    onMount(() => {
        interval = setInterval(async () => {
            clientList = await API.fetchClientList();
        }, 10000)
        API.fetchClientList().then((list) => clientList = list);
    })

    function refreshClientList() {
        clearInterval(interval);
        canRefresh = false;
        API.fetchClientList().then((list) => clientList = list);
        setTimeout(() => {
            canRefresh = true;
            setInterval(async () => {
                clientList = await API.fetchClientList();
            }, 10000)
        }, 5000);
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
        {#each clientList.filter((a) => !$dismissedClientIds.includes(a.id)) as client}
            <Client client={client} onCalling={onCalling} dismissCall={dismissCall} />
        {/each}
        {#if clientList.length == 0}
            <NoClients />
        {/if}
        <button class="callBtn video" class:off={!$callDefaultsStore.video} on:click={() => callDefaultsStore.update((value) => { return {...value, video: !value.video} })}>
            {#if $callDefaultsStore.video}
            <Video />
            {:else}
            <VideoOff />
            {/if}
        </button>
        <button class="callBtn audio" class:off={!$callDefaultsStore.audio}  on:click={() => callDefaultsStore.update((value) => { return {...value, audio: !value.audio} })}>
            {#if $callDefaultsStore.audio}
            <Microphone />
            {:else}
            <MicrophoneOff />
            {/if}
        </button>
        <button class="refreshList" disabled={!canRefresh} on:click={refreshClientList}>
            <Refresh /> {canRefresh ? "Refresh" : "Refreshed"}
        </button>
    </div>
</div>

<style>
    .callScreen {
        position: relative;
        height: 100%;
        width: min(500px, 100vw);
        min-width: min(500px, 100vw);
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        background-color: #222;
        color: white;

        display: flex;
        flex-direction: column;
    }
    .callScreen .callBtn {
        position: absolute;
        bottom: 30px;
    }
    .callScreen .callBtn.video {
        left: 30px;
    }
    .callScreen .callBtn.audio {
        right: 30px;
    }
    .clientList {
        overflow-y: auto;
        flex-grow: 1;
        padding: 10px;
        gap: 10px;
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
