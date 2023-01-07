<script lang="ts">
    import CallIcon from './call.svg';
</script>

<p class="callText">Sit tight! We're connecting you...</p>
<img src={CallIcon} class="calling" width="20%" height="20%" />
<div class="callDot one" />
<div class="callDot two" />
<div class="callDot three" />

<style>
    .callText {
        position: absolute;
        width: 100%;
        top: 60%;
        font-size: 1.5em;
        line-height: 1.5em;
        text-align: center;
        z-index: 0;
    }
    .calling {
        animation: phoneVibrate 1.5s infinite;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }
    @keyframes phoneVibrate {
        5% {
            transform: translate(-50%, -50%) rotate(10deg) scale(1.1);
        }
        10% {
            transform: translate(-50%, -50%) scale(1.2);
        }
        15% {
            transform: translate(-50%, -50%) rotate(-10deg) scale(1.3);
        }
        20% {
            transform: translate(-50%, -50%) scale(1.4);
        }
        25% {
            transform: translate(-50%, -50%) rotate(10deg) scale(1.4);
        }
        30% {
            transform: translate(-50%, -50%) scale(1.4);
        }
        35% {
            transform: translate(-50%, -50%) rotate(-10deg) scale(1.4);
        }
        40% {
            transform: translate(-50%, -50%) scale(1.4);
        }
        45% {
            transform: translate(-50%, -50%) rotate(10deg) scale(1.3);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
        }
        55% {
            transform: translate(-50%, -50%) rotate(-10deg) scale(1.1);
        }
    }
    .callDot {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #fff;
        animation: callDot 1.5s infinite;
    }
    .callDot.one {
        left: 40%;
        animation-delay: 0.5s;
    }
    .callDot.two {
        left: 50%;
        animation-delay: 0.75s;
    }
    .callDot.three {
        left: 60%;
        animation-delay: 1s;
    }

    @keyframes callDot {
        0% {
            background-color: #222;
        }
        50% {
            background-color: #ccc;
        }
        100% {
            background-color: #222;
        }
    }
</style>