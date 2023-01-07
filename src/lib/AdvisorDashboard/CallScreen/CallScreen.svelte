<script lang="ts">
    import { userData, dismissedClientIds } from "../../../GlobalStore";
    import Phone from "svelte-material-icons/Phone.svelte";
    import PhoneHangup from "svelte-material-icons/PhoneHangup.svelte";
    import PowerSleep from "svelte-material-icons/PowerSleep.svelte";
    import Check from "svelte-material-icons/Check.svelte";
    import API from "../../../API";
    import { onDestroy, onMount } from "svelte";

    export let onCalling = (targetId: string) => {};
    let clientList = [];
    let interval;

    onMount(() => {
        interval = setInterval(async () => {
            clientList = await API.fetchClientList();
        }, 10000)
        API.fetchClientList().then((list) => clientList = list);
    })

    onDestroy(() => {
        clearInterval(interval);
    })

    function dismissCall(id: string) {
        dismissedClientIds.update((list) => [...list, id]);
    }

</script>

<div class="callScreen">
    <div class="clientList">
        {#each clientList.filter((a) => !$dismissedClientIds.includes(a)) as client}
        <div class="client">
            <h3>Client</h3>
            <div class="attributes">
                {#each client.attributes as attribute}
                <div class="attribute">
                    {attribute}
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
    </div>
</div>

<style>
    .callScreen {
        position: relative;
        width: 100%;

        display: flex;
        flex-direction: column;
    }
    .clientList {
        overflow-y: auto;
    }
    
</style>
