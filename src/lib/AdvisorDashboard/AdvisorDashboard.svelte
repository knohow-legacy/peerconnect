<script lang="ts">
    import { writable } from "svelte/store";
    import API from "../../API";
    import App from "../../App.svelte";
    import { targetData, userData } from "../../GlobalStore";
    import VideoCall from "../VideoCall/VideoCall.svelte";
    import CallScreen from "./CallScreen/CallScreen.svelte";
    import Chat from "./Chat/Chat.svelte";
    import EditProfile from "./EditProfile/EditProfile.svelte";
    import Guidebook from "./Guidebook/Guidebook.svelte";

    let isInCall = false;
    let callDefaultsStore = writable({video: true, audio: true});

    async function onCalling(targetId: string) {
        await API.acceptCall(targetId);
        targetData.set({id: targetId});
        isInCall = true;
    }
</script>
{#if $userData}
<main class="advisorDashboard">
    {#if isInCall}
    <Chat />
    <VideoCall
        userData={$userData}
        targetData={$targetData}
        forceMiniPlayer={true}
        onHangup={() => {isInCall = false; targetData.set(null)}}
        defaults={$callDefaultsStore}
    />
    {:else}
    <EditProfile />
    <CallScreen onCalling={onCalling} callDefaultsStore={callDefaultsStore} />
    {/if}
    <Guidebook />
</main>
{:else}
<main class="login">
    Log in with your Google account to continue.
</main>
{/if}
<style>
    .advisorDashboard {
        display: flex;
        flex-direction: row;
        gap: max(10px, 5vw);
        height: 100%;
        flex-shrink: 1;
        width: 100%;
        background-color: #ddd;
    }
</style>