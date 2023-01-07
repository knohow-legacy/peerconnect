<script lang="ts">
    import PowerSleep from "svelte-material-icons/PowerSleep.svelte";
</script>

<div class="noPeers">
    <h2>No peers</h2>
    <p>When someone calls, they'll show up here.</p>
    <span>
        <PowerSleep />
    </span>
</div>

<style>
    .noPeers {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    .noPeers h2 {
        position: absolute;
        font-size: 2.5em;
        top: calc(50% - 40px);
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 1;
        transform: translateY(-50%);
    }
    .noPeers p {
        position: absolute;
        top: calc(50% + 30px);
        left: 0;
        width: 100%;
        z-index: 1;
        transform: translateY(-50%);
    }
    .noPeers span {
        font-size: calc(calc(50vh - 100px) * calc(9 / 16));
        line-height: 0;
        color: #777;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>