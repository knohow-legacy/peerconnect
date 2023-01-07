<script lang="ts">
    import { onDestroy } from 'svelte';
    import { slide } from 'svelte/transition';
    import Hotlines from './Hotlines.svelte';

    export let startTime = Date.now();
    let elapsed = 0;

    let last_time = window.performance.now();
    let frame;

    (function update() {
        frame = requestAnimationFrame(update);

        const time = window.performance.now();
        elapsed += time - last_time;

        last_time = time;
    }());

    onDestroy(() => {
        cancelAnimationFrame(frame);
    });
</script>


<div class="matchingAnim">
    <h1>Matching...</h1>
    <span>{(elapsed / 1000).toFixed(1)}s elapsed</span>
    <div class="circle">
        <div class="dot one" />
        <div class="dot two" />
        <div class="dot three" />
        <div class="dot four" />
    </div>
    {#if elapsed > 60000}
    <div class="takingAWhile" transition:slide>
        <h2>Hmm... this is taking a while.</h2>
        <p>Don't worry! Somone'll be with you in a moment.</p>
    </div>
    {/if}

    <Hotlines alignBottom={true} />
</div>

<style>
    .matchingAnim {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .matchingAnim h1 {
        position: absolute;
        margin: 0;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .matchingAnim span {
        position: absolute;
        top: calc(30% + 40px);
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
    }
    .matchingAnim .takingAWhile {
        position: absolute;
        top: calc(30% + 120px);
        margin: 10px;
        width: calc(100% - 40px);
        font-size: 20px;
        text-align: left;

        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        border-radius: 10px;
        background-color: orange;
    }
    .matchingAnim .takingAWhile > * {
        margin: 0;
        line-height: 1em;
    }
    .matchingAnim .circle {
        position: absolute;
        width: min(200px, 70vw);
        height: min(200px, 70vw);
        border-radius: 50%;
        left: 50%;
        top: 30%;
        transform: translate(-50%, -50%);
        animation: spin 3s ease-in-out infinite;
        z-index: -1;
    }
    .circle .dot {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #ccc;
        animation: dot 1s linear infinite;
    }
    .circle .dot.one {
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        animation-delay: 0s;
    }
    .circle .dot.two {
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        animation-delay: 0.25s;
    }
    .circle .dot.three {
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        animation-delay: 0.5s;
    }
    .circle .dot.four {
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        animation-delay: 0.75s;
    }

    @keyframes spin {
        from {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
            transform: translate(-50%, -50%) rotate(720deg);
        }
    }

    @keyframes dot {
        0% {
            width: 20px;
            height: 20px;
            opacity: 0.5;
        }
        50% {
            width: 30px;
            height: 30px;
            opacity: 1;
        }
    }
</style>