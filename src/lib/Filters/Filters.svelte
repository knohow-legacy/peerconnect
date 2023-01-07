<script lang="ts">
    import { writable } from "svelte/store";
    import Filter from "./Filter.svelte";

    let filters = [
        {
            displayName: null,
            name: "general",
            multiselect: true,
            options: [
                "Here to talk",
                "Certified mentor"
            ]
        },
        {
            name: "grade",
            displayName: "Grade",
            multiselect: false,
            options: [
                "9th",
                "10th",
                "11th",
                "12th",
                "Other"
            ]
        },
        {
            name: "gender",
            displayName: "Gender",
            multiselect: false,
            options: [
                "Male",
                "Female",
                "Non-Binary",
                "Other"
            ]
        },
        {
            name: "interests",
            displayName: "Interests and Expertise",
            multiselect: true,
            options: [
                "🏈 Sports",
                "🎵 Music",
                "🎭 Drama",
                "💻 Tech",
                "🎨 Art",
                "💼 Career",
                "🎓 College Prep"
            ]
        },
        {
            name: "academics",
            displayName: "Academics",
            multiselect: true,
            options: [
                "➗ Math",
                "🧪 Science",
                "📚 English",
                "📜 History"
            ]
        },
    ]

    export let filterStore = writable([]);
    export let isMentor = false;
</script>

<div>
    <h3>Select all that apply</h3>
    {#each filters as filter}
        {#if filter.displayName}
        <h4>{filter.displayName} {isMentor && !filter.multiselect ? "(select one)" : ""}</h4>
        {/if}
        <div class="filterList">
        {#each filter.options as option}
            <Filter multiselect={isMentor ? filter.multiselect : true} category={filter.name} name={option} filterStore={filterStore} />
        {/each}
        </div>
    {/each}
</div>
<style>
    .filterList {
        flex-grow: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
</style>