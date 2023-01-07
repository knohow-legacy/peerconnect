<script lang="ts">
    import App from "../../App.svelte";
    import { userData } from "../../GlobalStore";
    import CallScreen from "./CallScreen/CallScreen.svelte";
    import EditProfile from "./EditProfile/EditProfile.svelte";
    import GoogleSignIn from "./GoogleSignIn.svelte";
    import Guidebook from "./Guidebook/Guidebook.svelte";
</script>
{#if $userData}
<main class="advisorDashboard">
    <EditProfile />
    <CallScreen />
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
    }
</style>