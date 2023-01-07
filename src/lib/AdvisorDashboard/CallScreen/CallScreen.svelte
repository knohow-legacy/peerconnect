<script lang="ts">
    import { userData, dismissedPeerIds } from "../../../GlobalStore";
    import Refresh from "svelte-material-icons/Refresh.svelte";

    import Video from "svelte-material-icons/Video.svelte";
    import VideoOff from "svelte-material-icons/VideoOff.svelte";
    import Microphone from "svelte-material-icons/Microphone.svelte";
    import MicrophoneOff from "svelte-material-icons/MicrophoneOff.svelte";

    import NoPeers from "../../../assets/NoPeers.svelte"
    import API from "../../../API";
    import { onDestroy, onMount } from "svelte";
    import Peer from "./Peer.svelte";

    export let onCalling = (targetId: string) => {};
    export let callDefaultsStore;
    let peerList = [];
    let interval;
    let callSince = new Date();
    let canRefresh = true;

    onMount(() => {
        interval = setInterval(async () => {
            peerList = await API.fetchPeerList();
        }, 10000)
        API.fetchPeerList().then((list) => peerList = list);
    })

    function refreshPeerList() {
        clearInterval(interval);
        canRefresh = false;
        API.fetchPeerList().then((list) => peerList = list);
        setTimeout(() => {
            canRefresh = true;
            setInterval(async () => {
                peerList = await API.fetchPeerList();
            }, 10000)
        }, 5000);
    }

    onDestroy(() => {
        clearInterval(interval);
    })

    function dismissCall(id: string) {
        dismissedPeerIds.update((list) => [...list, id]);
    }

</script>

<div class="callScreen">
    <h2>On call since {callSince.toLocaleTimeString()}</h2>
    <div class="peerList">
        {#each peerList.filter((a) => !$dismissedPeerIds.includes(a.id)).sort((a, b) => b.similarity / b.similarityMax - a.similarity / a.similarityMax) as peer, i}
            <Peer peer={{...peer, position: i + 1}} onCalling={onCalling} dismissCall={dismissCall} />
        {/each}
        {#if peerList.length == 0}
            <NoPeers />
        {:else}
        <div style="padding-top: 100px; width: 100%" />
        {/if}
    </div>
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
    <button class="refreshList" disabled={!canRefresh} on:click={refreshPeerList}>
        <Refresh /> {canRefresh ? "Refresh" : "Refreshed"}
    </button>
</div>

<style>
    .callScreen {
        position: relative;
        height: 100%;
        width: min(500px, 100vw);
        min-width: min(500px, 100vw);
        max-height: calc(100vh - 50px);
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
    .peerList {
        display: flex;
        flex-direction: column;

        overflow-y: auto;
        flex-grow: 1;
        padding: 10px;
        gap: 10px;
        height: 100%;
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
