<script lang="ts">
    import { userData } from "../../../GlobalStore";
    import ChatMessage from "./ChatMessage.svelte";
    import { writable } from "svelte/store";
    import { onDestroy } from "svelte";
    import API from "../../../API";
    import Send from "svelte-material-icons/Send.svelte";
    import { chatMsgsStore, sendChat } from "../../../GlobalStore";

    let chatInput;
    let userAttributesStore = writable($userData.attributes);

    let unsubscribe = userAttributesStore.subscribe((attributes) => {
        userData.update((data) => {
            data.attributes = attributes;
            return data;
        })
        API.updateAttributes(attributes);
    })
    
    function handleKeyUp(event) {
        if (event.key === "Enter") {
            $sendChat(chatInput);
            chatInput = "";
        }
    }

    onDestroy(() => {
        unsubscribe();
    })
</script>

<aside class="chat">
    <h2>Chat</h2>
    <div class="chatScrollable">
        {#each $chatMsgsStore as msg}
            <ChatMessage msg={msg} />
        {/each}
        {#if $chatMsgsStore.length === 0}
            <div style="text-align: center; color: #aaa;">No messages yet</div>
        {/if}
    </div>
    <div class="chatInputBox">
        <input on:keyup={handleKeyUp} bind:value={chatInput} placeholder="Send a message..." type="text" />
        <button on:click={() => { $sendChat(chatInput); chatInput = ""}}><Send /></button>
    </div>
</aside>

<style>
    .chat {
        flex: 1;
        background-color: #fff;
        border-radius: 0 10px 10px 0;
        padding: 10px;
        max-height: calc(100vh - 70px);
        height: calc(100% - 20px);
        overflow-y: auto;
        overflow-x: hidden;
        text-align: left;

        display: flex;
        flex-direction: column;
    }
    .chat h2 {
        margin: 10px;
        text-align: center;
    }
    .chatScrollable > * > span {
        color: #aaa;
    }
    .chatScrollable {
        flex-grow: 1;
        overflow-y: auto;
        overflow-wrap: break-word;
    }
    .chatInputBox > input {
        flex-grow: 1;
        border: 0;
        padding: 10px;
        border-radius: 10px;
        outline: none;
        background-color: #ddd;
    }
    .chatInputBox {
        display: flex;
        gap: 10px;
        padding: 5px;
    }
    .chatInputBox button {
        line-height: 0;
        padding: 10px;
        font-size: 1.5em;
    }
</style>