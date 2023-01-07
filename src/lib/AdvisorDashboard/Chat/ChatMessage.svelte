<script lang="ts">
    import { userData } from "../../../GlobalStore";
    import Katex from "./Katex.svelte";

    export let msg;
    let output = msg.text.split("$");
</script>

<div style:color={(msg.author === $userData.name || msg.author === "You") ? "#777" : "black"}>
    <span>{msg.time.toLocaleTimeString()}</span> {msg.author}: 
    {#each msg.text.split("$") as fragment, i}
    {#if i % 2 === 1}
    <Katex math={fragment} />
    {:else}
    <span>{fragment}</span>
    {/if}
    {/each}
</div>