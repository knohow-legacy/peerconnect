<script lang="ts">
    import PowerSleep from "svelte-material-icons/PowerSleep.svelte";
</script>

<div class="noClients">
    <h2>No clients</h2>
    <p>When someone calls, they'll show up here.</p>
    <span>
        <PowerSleep />
    </span>
</div>

<style>
    .noClients {
        height: calc(100% - 70px);
        position: relative;
    }
    .noClients h2 {
        position: absolute;
        font-size: 2.5em;
        top: 50%;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 1;
        transform: translateY(-50%);
    }
    .noClients p {
        position: absolute;
        top: calc(50% + 60px);
        left: 0;
        width: 100%;
        z-index: 1;
        transform: translateY(-50%);
    }
    .noClients span {
        font-size: calc(calc(50vh - 100px) * calc(9 / 16));
        line-height: 0;
        color: #777;
        position: absolute;
        top: calc(50% + 50px);
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>