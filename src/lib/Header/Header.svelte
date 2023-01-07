<script>

    import { view } from "../../GlobalStore";

</script>

<header>
    <h2 on:click={() => view.set("client")}>PeerConnect</h2>
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
    }
</style>