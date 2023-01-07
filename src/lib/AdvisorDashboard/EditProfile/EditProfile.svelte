<script lang="ts">
    import { userData, view } from "../../../GlobalStore";
    import Filters from "../../Filters/Filters.svelte";
    import { writable } from "svelte/store";
    import { onDestroy } from "svelte";
    import API from "../../../API";

    let userAttributesStore = writable($userData.attributes);

    let unsubscribe = userAttributesStore.subscribe((attributes) => {
        userData.update((data) => {
            data.attributes = attributes;
            return data;
        })
        API.updateAttributes(attributes);
    })

    onDestroy(() => {
        unsubscribe();
    })

    function logOut() {
        userData.set(null);
        localStorage.removeItem("peerconnect-token");
        view.set("client");
    }

    function deleteAccount() {
        if (confirm("Are you sure you want to delete your Advisor account? This action cannot be undone.")) {
            API.deleteAccount();
            logOut();
        }
    }
</script>

<aside class="editProfile">
    <h2>Edit your profile</h2>
    <div class="userInfo">
        <img src={$userData.pfp} alt="Profile" />
        <div class="userData">
            <input type="text" value={$userData.name} disabled maxlength="32" />
            <div class="userActions">
                <button on:click={logOut}>
                    Log out
                </button>
                <button style="background-color: var(--danger); color: white" on:click={deleteAccount}>
                    Delete account
                </button>
            </div>
        </div>
    </div>

    <h2>Help people find you</h2>
    <Filters filterStore={userAttributesStore} isAdvisor={true} />
    <div style="height: 2em" />
</aside>

<style>
    .editProfile {
        flex: 1;
        background-color: #fff;
        border-radius: 0 10px 10px 0;
        padding: 10px;
        max-height: calc(100vh - 70px);
        overflow-y: auto;
        overflow-x: hidden;
    }
    .userInfo {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: 2px solid #ccc;
        padding: 10px;
        border-radius: 10px;
    }
    .userInfo .userData {
        display: flex;
        flex-direction: column;
        align-items: left;
        gap: 10px;
        flex: 1;
        width: 100%;
    }
    .userActions {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
    .userInfo input {
        background-color: #ccc;
        border: 2px solid #777;
        color: black;
        outline: none;
        border-radius: 10px;
        padding: 10px;
        font-size: 1em;
        flex: 1;
        width: calc(100% - 24px);
    }
</style>