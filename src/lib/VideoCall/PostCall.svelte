<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { quintInOut } from "svelte/easing";
    import Emoticon from "svelte-material-icons/Emoticon.svelte";
    import EmoticonNeutral from "svelte-material-icons/EmoticonNeutral.svelte";
    import EmoticonSad from "svelte-material-icons/EmoticonSad.svelte";
    import Flag from "svelte-material-icons/Flag.svelte";

    export let user;
    export let onRating = (rating: string) => {};
</script>

<div class="modal" transition:fade|local={{duration: 200}} on:click={() => onRating(null)}>
    <div class="modalInner" transition:scale|local={{duration: 200, easing: quintInOut}} on:click={(e) => e.stopPropagation()}>
        <h3>How would you rate this advisor?</h3>
        <div class="user">
            <img src={user.pfp} alt={user.name} />
            <h3>{user.name}</h3>
        </div>
        <div class="callReactions">
            <button on:click={() => onRating("positive")}>
                <Emoticon />
            </button>
            <button on:click={() => onRating("neutral")}>
                <EmoticonNeutral />
            </button>
            <button on:click={() => onRating("negative")}>
                <EmoticonSad />
            </button>
        </div>
        <button class="reportBtn" on:click={() => onRating("reported")}>
            <span><Flag /></span>
            Report this Advisor
        </button>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 50;
    }
    .modalInner {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }
    .callReactions {
        display: flex;
        flex-direction: row;
        gap: 20px;
        align-items: center;
    }
    .callReactions > * {
        font-size: 50px;
        margin: 0;
        padding: 0;
        line-height: 0;
        background-color: transparent;
        border-radius: 100%;
        cursor: pointer;
        transition: color 0.2s ease-in-out;
    }
    .callReactions > *:hover, .callReactions > *:focus-visible {
        color: var(--primary);
    }
    .reportBtn {
        background-color: var(--danger);
        color: white;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }
    .reportBtn span {
        line-height: 0;
        font-size: 24px;
    }
    .user {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }
    .user img {
        width: 50px;
        height: 50px;
        border-radius: 100%;
    }
</style>