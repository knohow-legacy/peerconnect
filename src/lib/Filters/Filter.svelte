<script lang="ts">
    import Check from "svelte-material-icons/Check.svelte";

    export let name;
    export let category;
    export let filterStore;
    let selected = false;

    let filter = {name: name, category: category};
    
    function toggleSelected() {
        if (selected) {
            filterStore.update(filters => {
                let index = filters.indexOf(filter);
                if (index > -1) {
                    filters.splice(index, 1);
                }
                return filters;
            });
        } else {
            filterStore.update(filters => {
                filters.push(filter);
                return filters;
            });
        }
        selected = !selected;
    }
</script>

<button class="filter" class:selected={selected} on:click={toggleSelected}>
    {#if selected}
    <span>
        <Check />
    </span>
    {/if}
    {name}
</button>

<style>
    .filter {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 10px;
        outline: none;
        background-color: #fff;
        border: 3px solid #eee;
        line-height: 20px;
    }
    .filter.selected {
        background-color: #eee;
    }
    .filter span {
        line-height: 0;
        font-size: 20px;
    }
</style>