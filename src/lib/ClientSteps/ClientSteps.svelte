<script lang="ts">
    import { fly } from 'svelte/transition';
    import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
    import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte";
    import Video from "svelte-material-icons/Video.svelte";
    import VideoOff from "svelte-material-icons/VideoOff.svelte";
    import MatchingAnim from '../../assets/MatchingAnim.svelte';
    import Hotlines from '../../assets/Hotlines.svelte';
    import { targetData, userData, view } from '../../GlobalStore';
    import API from '../../API';
    import Filters from '../Filters/Filters.svelte';
    import { writable } from 'svelte/store';
    let step = 1;

    let cameraOK = false;
    let startedMatching = Date.now();
    let interval;
    let filterStore = writable([]);

    function step1(isClient: boolean) {
        if (!isClient) {
            // is tutor
        }
        step = 2;
    }

    function step2(needToTalk: boolean) {
        if (needToTalk) {
            // client needs to talk
        } else {
            // client wants advice; allow more tutors
        }
        step = 3;
    }

    function step3(isCameraOK: boolean) {
        cameraOK = isCameraOK;
        step = 4;
        startedMatching = Date.now();
    }

    async function startMatching() {
        let user = await API.clientLogin();
        userData.set(user);

        console.log("Joining queue")
        
        interval = await API.joinCallQueue($filterStore, async (targetId) => {
            console.log("Found one!")
            let target = await API.getUser(targetId);
            targetData.set(target);
        })
    }

    $: {
        if (step === 4 && !interval) {
            startMatching();
        } else if (step !== 4 && interval) {
            clearInterval(interval);
            interval = null;
        }
    }
</script>
<div class="steps">
    {#if step !== 1}
    <button on:click={() => { step = Math.ceil(step - 1)} } transition:fly={{x: 200, duration: 200}} class="backBtn">
        <ChevronLeft />
        BACK
    </button>
    {/if}
    {#if step === 1}
    <main class="step step1" in:fly={{x: 200, duration: 200}} out:fly={{x: -200, duration: 200}}>
        <h1>Welcome!</h1>
        <div class="options">
            <button class="option" on:click={() => step1(true)}>
                <h2>I need help.</h2>
                <p>Match yourself with someone to get advice, or just someone to talk to.</p>
                <span class="arrow">
                    <ChevronRight />
                </span>
            </button>
            <button class="option" on:click={() => view.set("advisor")}>
                <h2>I want to help.</h2>
                <p>Want to become a peer advisor and help those who need it?</p>
                <span class="arrow">
                    <ChevronRight />
                </span>
            </button>
        </div>
    </main>
    {:else if step === 2}
    <main class="step step2" in:fly={{x: 200, duration: 200}} out:fly={{x: -200, duration: 200}}>
        <h1>What do you want to do?</h1>
        <div class="options">
            <button class="option" on:click={() => step2(true)}>
                <h2>I want to talk to somebody.</h2>
                <p>You'll be matched with someone who's ready to listen.</p>
                <span class="arrow">
                    <ChevronRight />
                </span>
            </button>
            <button class="option" on:click={() => { step = 2.4 }}>
                <h2>I need advice.</h2>
                <p>Just want to ask a question? You'll be matched with someone knowledgable.</p>
                <span class="arrow">
                    <ChevronRight />
                </span>
            </button>
            <button class="option" on:click={() => { step = 2.2 }}>
                <h2 style="color: red">It's urgent.</h2>
                <p>Hotlines are available 24/7-- there's always someone available for you!</p>
                <span class="arrow">
                    <ChevronRight />
                </span>
            </button>
        </div>
    </main>
    {:else if step === 2.2}
    <main class="step hotlines" in:fly={{x: 200, duration: 200}} out:fly={{x: -200, duration: 200}}>
        <Hotlines />
    </main>
    {/if}
    {#if step === 2.4}
    <main class="step filters" in:fly={{x: 200, duration: 200}} out:fly={{x: -200, duration: 200}}>
        <div class="options">
        <Filters filterStore={filterStore} />
        <button class="option" on:click={() => step = 3}>
            <h2>Next</h2>
            <span class="arrow">
                <ChevronRight />
            </span>
        </button>
    </div>
    </main>
    {:else if step === 3}
    <main class="step step3" in:fly={{x: 200, duration: 200}} out:fly={{x: -200, duration: 200}}>
        <h1>Camera OK?</h1>
        <div class="options">
            <button class="option" on:click={() => step3(true)}>
                <span class="icon">
                    <Video />
                </span>
                <h2>Camera OK.</h2>
                <span class="arrow">
                    <ChevronRight />
                </span>
            </button>
            <button class="option" on:click={() => step3(false)}>
                <span class="icon">
                    <VideoOff />
                </span>
                <h2>Camera NOT OK.</h2>
                <p>Don't feel comfortable with a camera? No problem.<br />You'll still have the option to enable it later.</p>
                <span class="arrow">
                    <ChevronRight />
                </span>
            </button>
        </div>
    </main>
    {:else if step === 4}
    <main style:display={step !== 4 ? "none" : ""} class="step matching" in:fly={{x: 200, duration: 200}} out:fly={{x: -200, duration: 200}}>
        <MatchingAnim />
    </main>
    {/if}
</div>

<style>
    .steps {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        gap: 10px;
    }
    .steps .backBtn {
        position: absolute;
        left: 0;
        top: 0;
        margin: 10px;
        border: 0;
        color: black;
        font-weight: bold;
        background-color: transparent;
        outline: none;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        z-index: 2;
    }
    .step {
        min-width: min(100%, 500px);
        max-width: 500px;
        margin: 0 auto;
        position: absolute;
        top: 0;
    }
    .step.hotlines {
        height: 100%;
        margin-top: 4em;
    }
    .step.matching {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .options .option > *:not(span) {
        margin-left: 30px;
        margin-right: 30px;
    }
    .options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 10px;
    }
    .option {
        position: relative;
        text-align: left;
    }
    .option .arrow, .option .icon {
        font-size: 30px;
        line-height: 0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .option .arrow {
        right: 10px;
    }
    .option .icon {
        left: 10px;
    }
    .steps h1 {
        margin-top: 2em; 
        font-size: 2rem;
    }
    h2 {
        margin: 10px 0;
    }
</style>