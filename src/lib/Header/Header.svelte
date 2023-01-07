<script>
    import HumanGreetingProximity from "svelte-material-icons/HumanGreetingProximity.svelte";
    import { targetData, view } from "../../GlobalStore";

</script>

<header>
    <h2 on:click={() => { if (!$targetData) view.set("peer")} }>
        <span>
            <HumanGreetingProximity />
        </span>
        PeerConnect
    </h2>
</header>

<style>
    header {
        background-color: var(--primary);
        height: 50px;
        color: white;
    }
    header h2 {
        margin: 0;
        line-height: 50px;
        cursor: pointer;
        user-select: none;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    header h2 span {
        font-size: 1.8em;
    }
</style>