<script lang="ts">
    import API from "../../API";
    import App from "../../App.svelte";
    import { targetData, userData } from "../../GlobalStore";
    import VideoCall from "../VideoCall/VideoCall.svelte";
    import CallScreen from "./CallScreen/CallScreen.svelte";
    import EditProfile from "./EditProfile/EditProfile.svelte";
    import Guidebook from "./Guidebook/Guidebook.svelte";

    let isInCall = false;
    let videoEnabled = true;
    let audioEnabled = true;

    async function onCalling(targetId: string) {
        await API.acceptCall(targetId);
        targetData.set({id: targetId});
        isInCall = true;
    }
</script>
{#if $userData}
<main class="advisorDashboard">
    <EditProfile />
    {#if isInCall}
    <VideoCall 
        userData={$userData}
        targetData={$targetData}
        onHangup={() => {isInCall = false; targetData.set(null)}}
        defaults={{video: videoEnabled, audio: audioEnabled}}
    />
    {:else}
    <CallScreen onCalling={onCalling} />
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
        gap: 10px;
        height: 100%;
        width: 100%;
        background-color: #ddd;
    }
</style>