<script lang="ts">
    import Steps from './lib/ClientSteps/ClientSteps.svelte';
    import Header from './lib/Header/Header.svelte';
    import VideoCall from './lib/VideoCall/VideoCall.svelte';
    import { view, userData, targetData } from './GlobalStore';
    import AdvisorDashboard from './lib/AdvisorDashboard/AdvisorDashboard.svelte';
    import API from './API';
    let myId, theirId;
    let defaults = {video: true, audio: true}

    // google sign in
    function decodeJwtResponse(token) {
        let base64Url = token.split('.')[1]
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload)
    }

    // @ts-ignore
    window.handleCredentialResponse = async (response) => {
        // decodeJwtResponse() is a custom function defined by you
        // to decode the credential response.
        let data = decodeJwtResponse(response.credential);

        let apiData = await API.login(data.sub, data.name, data.picture, data.email)
        userData.set(apiData);
    }

</script>

<Header />
{#if $view === 'client'}
    {#if !$targetData}
    <Steps />
    {:else}
    <VideoCall
        userData={{id: myId}}
        targetData={{id: theirId}}
        onHangup={() => targetData.set(null)}
        defaults={defaults}
    />
    {/if}
{:else if $view === 'advisor'}
    {#if $userData}
    <AdvisorDashboard />
    {:else}
    <p>Login to Google to continue.</p>
    {/if}
{/if}
<svelte:head>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div id="g_id_onload"
    data-client_id="869385602749-9elqfom3fsdr71en2iovlrcjkcv9l5of.apps.googleusercontent.com"
    data-callback="handleCredentialResponse" />

{#if !$userData || !$userData.isAdvisor}
<div class="g_id_signin"
    style:display={$view === 'advisor' && (!$userData || !$userData.isAdvisor) ? 'block' : 'none'}
    data-type="standard"
    data-size="large"
    data-theme="outline"
    data-text="sign_in_with"
    data-shape="rectangular"
    data-logo_alignment="left" />
{/if}

<style>
    .g_id_signin {
        margin: 0 auto;
    }
</style>