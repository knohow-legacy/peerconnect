<script lang="ts">
    import { userData } from "../../../GlobalStore";
    import PowerSleep from "svelte-material-icons/PowerSleep.svelte";
    import Check from "svelte-material-icons/Check.svelte";
    import API from "../../../API";
    import { onDestroy, onMount } from "svelte/types/runtime/internal/lifecycle";

    let clientList = [];
    let interval;

    onMount(() => {
        interval = setInterval(async () => {
            clientList = await API.fetchClientList();
        }, 10000)
    })

    onDestroy(() => {
        clearInterval(interval);
    })

</script>

<div class="callScreen">
    <div class="clientList">
        {#each clientList as client}
        <div class="client">
            <h3>Client</h3>
            <div class="attributes">
                {#each client.attributes as attribute}
                <div class="attribute">
                    {attribute}
                </div>
                {/each}
            </div>
            <button class="acceptCall">
                Accept
            </button>
            <button class="dismissCall">
                Dismiss
            </button>
        </div>
        {/each}
    </div>
</div>

<style>
    .callScreen {
        position: relative;
        width: 100%;
    }
    
</style>
