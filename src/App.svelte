<script lang="ts">
    import Steps from './lib/Steps/Steps.svelte';
  import VideoCall from './lib/VideoCall/VideoCall.svelte';
  let myId, theirId;
  let call = false;
  let defaults = {video: true, audio: true}
</script>

{#if !call}
<Steps />
{:else}
<VideoCall
  userData={{id: myId}}
  targetData={{id: theirId}}
  onHangup={() => call = false}
  defaults={defaults}
/>
{/if}