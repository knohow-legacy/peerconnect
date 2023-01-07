<script lang="ts">
    import Check from "svelte-material-icons/Check.svelte";
    import RadioboxMarked from "svelte-material-icons/RadioboxMarked.svelte";
    import RadioboxBlank from "svelte-material-icons/RadioboxBlank.svelte";
    import { onDestroy } from "svelte";

    export let name;
    export let category;
    export let filterStore;
    export let multiselect;
    let selected = false;

    let filter = {name: name, category: category};
    
    function toggleSelected() {
        if (selected) {
            filterStore.update(filters => {
                let f = filters.find(f => f.name === name && f.category === category);
                let index = filters.indexOf(f);
                if (index > -1) {
                    filters.splice(index, 1);
                }
                return filters;
            });
        } else {
            filterStore.update(filters => {
                if (!multiselect) {
                    filters = filters.filter(f => f.category !== filter.category);
                }
                filters.push(filter);
                return filters;
            });
        }
    }

    let unsubscribe = filterStore.subscribe(filters => {
        selected = filters.some(f => f.name === filter.name && f.category === filter.category);
    });

    onDestroy(() => {
        unsubscribe();
    })
</script>

<button class="filter" class:selected={selected} on:click={toggleSelected}>
    {#if multiselect && selected}
    <span>
        <Check />
    </span>
    {:else if (!multiselect)}
    <span>
        {#if selected}
        <RadioboxMarked />
        {:else}
        <RadioboxBlank />
        {/if}
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