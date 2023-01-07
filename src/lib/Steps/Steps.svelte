<script lang="ts">
    import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
    import Video from "svelte-material-icons/Video.svelte";
    import VideoOff from "svelte-material-icons/VideoOff.svelte";
    let step = 1;

    let cameraOK = false;

    function step1(isClient: boolean) {
        if (!isClient) {
            // is tutor
        }
        step = 2;
    }
</script>
{#if step === 1}
<main class="step step1">
    <div class="options">
        <button class="option" on:click={() => step1(true)}>
            <h2>I need help.</h2>
            <p>Other text here</p>
            <span class="arrow">
                <ChevronRight />
            </span>
        </button>
        <button class="option" on:click={() => step1(false)}>
            <h2>I want to help.</h2>
            <p>Want to become a peer counselor?</p>
            <span class="arrow">
                <ChevronRight />
            </span>
        </button>
    </div>
</main>
{/if}
{#if step === 2}
<main class="step step2">
    <div class="options">
        <button class="option">
            <h2>I want to talk to somebody.</h2>
            <p>You'll be matched with.</p>
            <span class="arrow">
                <ChevronRight />
            </span>
        </button>
        <button class="option">
            <h2>I need advice.</h2>
            <span class="arrow">
                <ChevronRight />
            </span>
        </button>
        <div>or, sort by <a>advanced filters</a>.</div>
    </div>
</main>
{/if}
{#if step === 3}
<main class="step step3">
    <div class="options">
        <button class="option">
            <span class="icon">
                <Video />
            </span>
            <h2>Camera OK.</h2>
        </button>
        <button class="option">
            <span class="icon">
                <VideoOff />
            </span>
            <h2>Camera NOT OK.</h2>
        </button>
    </div>
</main>
{/if}

<style>
    .step {
        max-width: 500px;
        margin: 0 auto;
    }
    .options .option > *:not(img) {
        margin-left: 20px;
    }
    .options {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .option {
        position: relative;
        text-align: left;
    }
    .option .arrow {
        font-size: 30px;
        line-height: 0;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
</style>