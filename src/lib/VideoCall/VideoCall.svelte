<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import adapter from 'webrtc-adapter';
    import CallingAnim from "../../assets/CallingAnim.svelte";

    const HOSTNAME = window.location.hostname;

    export let userData: {id: string};
    export let targetData: {id: string};
    export let defaults: {video: boolean, audio: boolean} = {video: true, audio: true};
    export let onHangup;

    
    let canHangup = false;
    let videoEnabled = defaults.video;
    let audioEnabled = defaults.audio;
    let chatMsgs = [];
    let clientID;
    let connection;
    let myUsername = userData.id;
    let targetUsername = targetData.id;      // To store username of other peer
    let myPeerConnection = null;    // RTCPeerConnection

    function sendToServer(msg) {
        var msgJSON = JSON.stringify(msg);

        connection.send(msgJSON);
    }

    // Called when the "id" message is received; this message is sent by the
    // server to assign this login session a unique ID number; in response,
    // this function sends a "username" message to set our username for this
    // session.
    function setUsername() {
        sendToServer({
            name: userData.id,
            date: Date.now(),
            id: clientID,
            type: "username"
        });
    }

    onMount(() => {
        connect();
    })

    onDestroy(() => {
      if (myPeerConnection) {
        myPeerConnection.close();
      }
      if (connection) {
        connection.close();
      }
    })

// Open and configure the connection to the WebSocket server.

function connect() {
  var serverUrl;
  var scheme = "ws";

  // If this is an HTTPS connection, we have to use a secure WebSocket
  // connection too, so add another "s" to the scheme.

  if (document.location.protocol === "https:") {
    scheme += "s";
  }
  serverUrl = scheme + `://${HOSTNAME}:6503`;

  connection = new WebSocket(serverUrl, "json");

  connection.onopen = function(evt) {
    canHangup = true;
    getWebcamStream(audioEnabled, videoEnabled).then((stream) => myVideo.srcObject = stream);
  };

  connection.onerror = function(evt) {
    console.dir(evt);
  }

  connection.onmessage = function(evt) {
    let msg = JSON.parse(evt.data);
    let text = {time: new Date(msg.date), text: ""};

    switch(msg.type) {
      case "id":
        clientID = msg.id;
        setUsername();
        break;

      case "username":
        break;
      case "message":
        text.text = `${msg.name}: ${msg.text}`;
        break;

      case "rejectusername":
        myUsername = msg.name;
        text.text = "Your username has been set to " + myUsername +
          "because the name you chose is in use.";
        break;

      case "userlist":      // Received an updated user list
        handleUserlistMsg(msg);
        break;

      // Signaling messages: these messages are used to trade WebRTC
      // signaling information during negotiations leading up to a video
      // call.

      case "video-offer":  // Invitation and offer to chat
        handleVideoOfferMsg(msg);
        break;

      case "video-answer":  // Callee has answered our offer
        handleVideoAnswerMsg(msg);
        break;

      case "new-ice-candidate": // A new ICE candidate has been received
        handleNewICECandidateMsg(msg);
        break;

      case "hang-up": // The other peer has hung up the call
        handleHangUpMsg(msg);
        break;

      // Unknown message; output to console for debugging.

      default:
        console.error("Unknown message received.", msg)
    }

    // If there's text to insert into the chat buffer, do so now, then
    // scroll the chat panel so that the new text is visible.

    if (text.text.length) {
        chatMsgs = [...chatMsgs, text];
    }
  };
}

// Handles a click on the Send button (or pressing return/enter) by
// building a "message" object and sending it to the server.
function sendChat(message: string) {
  var msg = {
    text: message,
    type: "message",
    id: clientID,
    date: Date.now()
  };
  sendToServer(msg);
}

// Create the RTCPeerConnection which knows how to talk to our
// selected STUN/TURN server and then uses getUserMedia() to find
// our camera and microphone and add that stream to the connection for
// use in our video call. Then we configure event handlers to get
// needed notifications on the call.

async function createPeerConnection() {
  // Create an RTCPeerConnection which knows to use our chosen
  // STUN server.

  myPeerConnection = new RTCPeerConnection({
    iceServers: [     // ICE servers are a headache...
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  });

  // Set up event handlers for the ICE negotiation process.

  myPeerConnection.onicecandidate = handleICECandidateEvent;
  myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
  myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
  myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
  myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
  myPeerConnection.ontrack = handleTrackEvent;
}

// Called by the WebRTC layer to let us know when it's time to
// begin, resume, or restart ICE negotiation.

async function handleNegotiationNeededEvent() {

  try {
    const offer = await myPeerConnection.createOffer();

    // If the connection hasn't yet achieved the "stable" state,
    // return to the caller. Another negotiationneeded event
    // will be fired when the state stabilizes.

    if (myPeerConnection.signalingState != "stable") {
      return;
    }

    // Establish the offer as the local peer's current
    // description.
    await myPeerConnection.setLocalDescription(offer);

    // Send the offer to the remote peer.
    sendToServer({
      name: myUsername,
      target: targetUsername,
      type: "video-offer",
      sdp: myPeerConnection.localDescription
    });
  } catch(err) {
    reportError(err);
  };
}

// Called by the WebRTC layer when events occur on the media tracks
// on our WebRTC call. This includes when streams are added to and
// removed from the call.
//
// track events include the following fields:
//
// RTCRtpReceiver       receiver
// MediaStreamTrack     track
// MediaStream[]        streams
// RTCRtpTransceiver    transceiver
//
// In our case, we're just taking the first stream found and attaching
// it to the <video> element for incoming media.

function handleTrackEvent(event) {
    try {
        if (theirVideo) {
            theirVideo.srcObject = event.streams[0].active ? event.streams[0] : null;
        }
    } catch (e) {
        console.warn("Can't set video right now...")
    }
    canHangup = true;
}

// Handles |icecandidate| events by forwarding the specified
// ICE candidate (created by our local ICE agent) to the other
// peer through the signaling server.

function handleICECandidateEvent(event) {
  if (event.candidate) {

    sendToServer({
      type: "new-ice-candidate",
      target: targetUsername,
      candidate: event.candidate
    });
  }
}

// Handle |iceconnectionstatechange| events. This will detect
// when the ICE connection is closed, failed, or disconnected.
//
// This is called when the state of the ICE agent changes.

function handleICEConnectionStateChangeEvent(event) {
    switch(myPeerConnection.iceConnectionState) {
        case "failed":
        case "closed":
        case "disconnected":
        closeVideoCall();
        break;
    }
}

// Set up a |signalingstatechange| event handler. This will detect when
// the signaling connection is closed.
//
// NOTE: This will actually move to the new RTCPeerConnectionState enum
// returned in the property RTCPeerConnection.connectionState when
// browsers catch up with the latest version of the specification!

function handleSignalingStateChangeEvent(event) {
  switch(myPeerConnection.signalingState) {
    case "closed":
      closeVideoCall();
      break;
  }
}

// Handle the |icegatheringstatechange| event. This lets us know what the
// ICE engine is currently working on: "new" means no networking has happened
// yet, "gathering" means the ICE engine is currently gathering candidates,
// and "complete" means gathering is complete. Note that the engine can
// alternate between "gathering" and "complete" repeatedly as needs and
// circumstances change.
//
// We don't need to do anything when this happens, but we log it to the
// console so you can see what's going on when playing with the sample.

function handleICEGatheringStateChangeEvent(event) {
  //console.log("*** ICE gathering state changed to: " + myPeerConnection.iceGatheringState);
}

// Given a message containing a list of usernames, this function
// populates the user list box with those names, making each item
// clickable to allow starting a video call.

function handleUserlistMsg(msg) {
    if (msg.users.includes(targetUsername)) {
        invite(targetUsername);
    }
}

// Close the RTCPeerConnection and reset variables so that the user can
// make or receive another call if they wish. This is called both
// when the user hangs up, the other user hangs up, or if a connection
// failure is detected.

function closeVideoCall() {
    // Close the RTCPeerConnection

    if (myPeerConnection) {
        // Disconnect all our event listeners; we don't want stray events
        // to interfere with the hangup while it's ongoing.

        myPeerConnection.ontrack = null;
        myPeerConnection.onnicecandidate = null;
        myPeerConnection.oniceconnectionstatechange = null;
        myPeerConnection.onsignalingstatechange = null;
        myPeerConnection.onicegatheringstatechange = null;
        myPeerConnection.onnotificationneeded = null;

        // Stop all transceivers on the connection

        myPeerConnection.getTransceivers().forEach(transceiver => transceiver.stop());

        // Stop the webcam preview as well by pausing the <video>
        // element, then stopping each of the getUserMedia() tracks
        // on it.

        // Close the peer connection

        myPeerConnection.close();
        myPeerConnection = null;
    }

    if (myVideo.srcObject) {
        myVideo.srcObject.getTracks().forEach(track => {
            track.stop();
        });
        myVideo.srcObject = null;
    }

    // Disable the hangup button

    onHangup();
    canHangup = false;
    targetUsername = null;
}

// Handle the "hang-up" message, which is sent if the other peer
// has hung up the call or otherwise disconnected.

function handleHangUpMsg(msg) {

  closeVideoCall();
}

// Hang up the call by closing our end of the connection, then
// sending a "hang-up" message to the other peer (keep in mind that
// the signaling is done on a different connection). This notifies
// the other peer that the connection should be terminated and the UI
// returned to the "no call in progress" state.

function hangUpCall() {
  sendToServer({
    name: myUsername,
    target: targetUsername,
    type: "hang-up"
  });

  closeVideoCall();
}

// Handle a click on an item in the user list by inviting the clicked
// user to video chat. Note that we don't actually send a message to
// the callee here -- calling RTCPeerConnection.addTrack() issues
// a |notificationneeded| event, so we'll let our handler for that
// make the offer.

async function invite(username: string) {
    if (myPeerConnection) {
        myPeerConnection.close();
        myPeerConnection = null;
    } else {
        var clickedUsername = username;

        // Don't allow users to call themselves, because weird.

        if (clickedUsername === myUsername) {
        alert("I'm afraid I can't let you talk to yourself. That would be weird.");
        return;
        }

        // Record the username being called for future reference

        targetUsername = clickedUsername;

        // Call createPeerConnection() to create the RTCPeerConnection.
        // When this returns, myPeerConnection is our RTCPeerConnection
        // and webcamStream is a stream coming from the camera. They are
        // not linked together in any way yet.

        createPeerConnection();
        console.log(myPeerConnection)

        // Get access to the webcam stream and attach it to the
        // "preview" box (id "local_video").

        if (myVideo) {
            try {
                myVideo.srcObject = await getWebcamStream(audioEnabled, videoEnabled);
                myVideo.srcObject.getTracks().forEach(
                    track => myPeerConnection.addTransceiver(track, {streams: [myVideo.srcObject]})
                );
            } catch(err) {
                handleGetUserMediaError(err);
                return;
            }
        }
    }
}

// Accept an offer to video chat. We configure our local settings,
// create our RTCPeerConnection, get and attach our local camera
// stream, then create and send an answer to the caller.

async function handleVideoOfferMsg(msg) {
  targetUsername = msg.name;

  // If we're not already connected, create an RTCPeerConnection
  // to be linked to the caller.

  if (!myPeerConnection) {
    createPeerConnection();
  }

  // We need to set the remote description to the received SDP offer
  // so that our local WebRTC layer knows how to talk to the caller.

  var desc = new RTCSessionDescription(msg.sdp);

  // If the connection isn't stable yet, wait for it...

  if (myPeerConnection.signalingState != "stable") {

    // Set the local and remove descriptions for rollback; don't proceed
    // until both return.
    await Promise.all([
      myPeerConnection.setLocalDescription({type: "rollback"}),
      myPeerConnection.setRemoteDescription(desc)
    ]);
    return;
  } else {
    await myPeerConnection.setRemoteDescription(desc);
  }

  // Get the webcam stream if we don't already have it

  if (!myVideo.srcObject) {
    let webcamStream = await getWebcamStream(audioEnabled, videoEnabled);

    if (myVideo) myVideo.srcObject = webcamStream;

    // Add the camera stream to the RTCPeerConnection

    try {
        if (webcamStream)
            webcamStream.getTracks().forEach(
                track => myPeerConnection.addTransceiver(track, {streams: [webcamStream]})
            );
    } catch(err) {
      handleGetUserMediaError(err);
    }
  }

  await myPeerConnection.setLocalDescription(await myPeerConnection.createAnswer());

  sendToServer({
    name: myUsername,
    target: targetUsername,
    type: "video-answer",
    sdp: myPeerConnection.localDescription
  });
}

// Responds to the "video-answer" message sent to the caller
// once the callee has decided to accept our request to talk.

async function handleVideoAnswerMsg(msg) {

  // Configure the remote description, which is the SDP payload
  // in our "video-answer" message.

  var desc = new RTCSessionDescription(msg.sdp);
  await myPeerConnection.setRemoteDescription(desc).catch(reportError);
}

// A new ICE candidate has been received from the other peer. Call
// RTCPeerConnection.addIceCandidate() to send it along to the
// local ICE framework.

async function handleNewICECandidateMsg(msg) {
  var candidate = new RTCIceCandidate(msg.candidate);

  try {
    await myPeerConnection.addIceCandidate(candidate)
  } catch(err) {
    reportError(err);
  }
}

// Handle errors which occur when trying to access the local media
// hardware; that is, exceptions thrown by getUserMedia(). The two most
// likely scenarios are that the user has no camera and/or microphone
// or that they declined to share their equipment when prompted. If
// they simply opted not to share their media, that's not really an
// error, so we won't present a message in that situation.

    function handleGetUserMediaError(e) {
        switch(e.name) {
            case "NotFoundError":
            alert("Unable to open your call because no camera and/or microphone" +
                    "were found.");
            break;
            case "SecurityError":
            case "PermissionDeniedError":
            // Do nothing; this is the same as the user canceling the call.
            break;
            default:
                throw e
                alert("Error opening your camera and/or microphone: " + e.message);
                break;
        }
        console.log(e)

        // Make sure we shut down our end of the RTCPeerConnection so we're
        // ready to try again.

        closeVideoCall();
    }

    async function getWebcamStream(audio: boolean, video: boolean) {
        if (!audio && !video) return null;
        let mediaConstraints = {
            audio: audio,            // We want an audio track
            video: video ?
            { aspectRatio: {ideal: 0.5625, max: 1} } : // prefer 9:16 (vertical)
            false
        }

        return await navigator.mediaDevices.getUserMedia(mediaConstraints);
    }

    function recalculateStream() {
        getWebcamStream(audioEnabled, videoEnabled).then((stream) => {
            console.log(myPeerConnection.getTransceivers())
            myPeerConnection.getTransceivers().forEach(transceiver => {
                if (transceiver.mid !== null && transceiver.sender.track) {
                    transceiver.sender.track.stop();
                    transceiver.stop();
                }
            });
            myVideo.srcObject = stream;
            if (!stream) return;
            stream.getTracks().forEach(
                track => {
                    track.enabled = true;
                    myPeerConnection.addTransceiver(track, {streams: [stream]})
                }
            );
        })
        .catch(handleGetUserMediaError);
    }

    const validate = () => myVideo && myPeerConnection;

    $: {
        if (validate()) {
            if (!videoEnabled) {
                myVideo.srcObject = null;
            }
            if (audioEnabled) {
                //
            }
            recalculateStream();
        }
    }

    let myVideo, theirVideo, chatInput;
</script>

<main class="videoCall">
    <div class="myWindow">
        <span class="videoDisabled">Video Disabled</span>
        <span>{userData.id}</span>
        <video bind:this={myVideo} autoplay muted />
    </div>
    <div class="theirWindow">
        {#if myPeerConnection}
        <span class="videoDisabled">Video Disabled</span>
        {:else}
        <CallingAnim />
        {/if}
        <span>{targetData.id}</span>
        <video bind:this={theirVideo} autoplay />
        <div class="videoActions">
            <button on:click={() => videoEnabled = !videoEnabled}>
                {#if videoEnabled}
                Disable video
                {:else}
                Enable video
                {/if}
            </button>
            <button style="background-color: red" disabled={!canHangup} on:click={hangUpCall}>Hang up</button>
            <button on:click={() => audioEnabled = !audioEnabled}>
                {#if audioEnabled}
                Disable audio
                {:else}
                Enable audio
                {/if}
            </button>
        </div>
    </div>
    <div class="chat">
        <h2>Chat</h2>
        <div class="chatScrollable">
            {#each chatMsgs as msg}
            <div><span>{msg.time.toLocaleTimeString()}</span> {msg.text}</div>
            {/each}
        </div>
        <div class="chatInputBox">
            <input bind:value={chatInput} placeholder="Send a message..." type="text" />
            <button on:click={() => { sendChat(chatInput); chatInput = ""}}>send</button>
        </div>
    </div>
</main>

<style>
    .videoCall {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 100%;
        padding: 5px;
    }
    .videoCall > * {
        width: calc(90vh * calc(9 / 16));
        height: 90%;
        overflow: hidden;
        border-radius: 10px;
        background-color: #111;
        position: relative;
    }
    .chat {
        width: 300px;
        height: calc(90% - 10px);
        text-align: left;
        padding: 5px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .chat h2 {
        margin: 10px;
    }
    .chatScrollable > * > span {
        color: #777;
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
    }
    .chatInputBox {
        display: flex;
        gap: 10px;
        padding: 5px;
    }
    .videoCall > * > span:not(.videoDisabled) {
        position: absolute;
        top: 5px;
        left: 5px;
        border-radius: 5px;
        padding: 5px 10px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 1;
    }
    .videoCall .videoActions {
        position: absolute;
        bottom: 10px;
        width: calc(100% - 20px);
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .videoCall .videoDisabled {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .videoCall video {
        position: absolute;
        top: 50%;
        left: 50%;
        min-width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
    }
    @media screen and (max-width: 1000px) {
      .myWindow {
        position: fixed;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
        top: 10px;
        right: 10px;
        width: max(20vw, 20vh);
        height: calc(max(20vw, 20vh) * calc(16 / 9));
        z-index: 5;
      }
      .theirWindow {
        max-width: calc(100% - 10px);
        max-height: calc(calc(100% - 10px) * calc(16 / 9));
      }
      .chat {
        display: none;
      }
    }
</style>