<script lang="ts">
    import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
    import Phone from "svelte-material-icons/Phone.svelte";
    import PhoneHangup from "svelte-material-icons/PhoneHangup.svelte";
    import { slide } from "svelte/transition";
    import { userData } from "../../../GlobalStore";

    export let peer;
    export let onCalling;
    export let dismissCall;

    let expanded = false;
</script>

<div class="peer" transition:slide={{duration: 200}}>
    <div class="header" on:click={() => expanded = !expanded}>
        <span class="icon" style:transform={expanded ? "rotate(90deg)" : ""}>
            <ChevronRight />
        </span> 
        <h3>
            Peer {peer.position}
            <br />
            <span>
                {#if peer.similarityMax === 0}
                Unsure of match
                {:else}
                {Math.round(peer.similarity / peer.similarityMax * 100)}% match ({peer.similarity}/{peer.similarityMax} traits in common)
                {/if}
            </span>
        </h3>
        <button class="acceptCall" on:click={() => { onCalling(peer.id); dismissCall(peer.id) }}>
            <Phone />
        </button>
        <button class="dismissCall" on:click={() => dismissCall(peer.id)}>
            <PhoneHangup />
        </button>
    </div>
    {#if expanded}
    <div class="attributes" transition:slide={{duration: 200}}>
        {#each peer.attributes as attribute}
            {#if attribute.name === "Here to talk"}
            <div class="attribute" style:color="var(--danger)">
                Needs to talk
            </div>
            {:else}
            <div class="attribute" class:shared={$userData.attributes.some(a => a.name === attribute.name && a.category === attribute.category)}>
                {attribute.name}
            </div>
            {/if}
        {/each}
    </div>
    {/if}
</div>

<style>
    .peer {
        background-color: #333;
        border-radius: 5px;
        padding: 5px;
    }
    .peer .header {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 100%;
        text-align: left;
        align-items: center;
        user-select: none;
    }
    .peer .header .icon {
        transition: transform 0.2s ease-in-out;
        font-size: 24px;

    }
    .peer .header h3 {
        flex-grow: 1;
    }
    .peer h3 span {
        font-size: 0.8em;
        color: #ccc;
    }
    .peer .attributes {
        flex-grow: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        background-color: #222;
        padding: 10px;
        border-radius: 5px;
    }
    .peer .attribute {
        background-color: #333;
        padding: 5px 10px;
        border-radius: 5px;
    }
    .attribute.shared {
        color: orange;
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
</style>