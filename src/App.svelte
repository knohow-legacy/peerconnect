<script lang="ts">
    import Steps from './lib/ClientSteps/ClientSteps.svelte';
    import Header from './lib/Header/Header.svelte';
    import VideoCall from './lib/VideoCall/VideoCall.svelte';
    import { view, userData, targetData } from './GlobalStore';
    import AdvisorDashboard from './lib/AdvisorDashboard/AdvisorDashboard.svelte';
    import API from './API';
    import { fly } from 'svelte/transition';
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
    let signInRef;

    function rerenderButton() {
        // The button needs to be rerendered when it is shown
        setTimeout(() => 
        // @ts-ignore
            window.google.accounts.id.renderButton(signInRef, {
                theme: 'white',
                size: 'large',
                type: 'standard',
                text: 'continue_with',
            })
        , 0)
    }

    $: {
        if ($view === 'advisor' && (!$userData || !$userData.isAdvisor)) {
            rerenderButton()

        }
    }

</script>

<svelte:head>
    <script src="https://accounts.google.com/gsi/client" async defer />
</svelte:head>

<Header />
{#if $view === 'client'}
    {#if !$targetData}
    <Steps />
    {:else}
    <VideoCall
        userData={$userData}
        targetData={$targetData}
        onHangup={() => { targetData.set(null)}}
        defaults={defaults}
    />
    {/if}
{:else if ($view === 'advisor' && $userData && $userData.isAdvisor)}
    <AdvisorDashboard />
{:else if $view === 'advisor'}
<div class="googleSignIn" in:fly={{x: 200, duration: 200}} out:fly={{x: -200, duration: 200}}>
    <p>Sign in with Google to continue.</p>
    <div class="g_id_signin" 
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
        bind:this={signInRef}
    />
</div>
{/if}

<div id="g_id_onload"
    data-client_id="869385602749-9elqfom3fsdr71en2iovlrcjkcv9l5of.apps.googleusercontent.com"
    data-callback="handleCredentialResponse" />

<style>
    .g_id_signin {
        margin: 0 auto;
    }
    .googleSignIn {
        height: calc(100% - 50px);
        width: 100%;
        margin: auto;
        top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        position: absolute;
    }
</style>