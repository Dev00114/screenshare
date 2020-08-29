
 const videoElem = document.getElementById("localVideo");
 const remoteElem = document.getElementById("remoteVideo");
 const startElem = document.getElementById("start");
 const stopElem = document.getElementById("stop");

// Generate random room name if needed
$(".control_text").text("share screen");

if (!location.hash) {
    location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }
  const roomHash = location.hash.substring(1);
  // TODO: Replace with your own channel ID
  const drone = new ScaleDrone("yiS12Ts5RdNhebyM");
  // Room name needs to be prefixed with 'observable-'
  const roomName = "observable-" + roomHash;
  const configuration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
  let room;
  let pc;
  function onSuccess() { }
  function onError(error) {
    console.log("configuration", configuration);
  }

  drone.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    room = drone.subscribe(roomName);
    console.log("room", room)
    room.on("open", (error) => {
      if (error) {
        onError(error);
      }
    });
    // We're connected to the room and received an array of 'members'
    // connected to the room (including us). Signaling server is ready.
    room.on("members", (members) => {
      console.log(members.length);
      // If we are the second user to connect to the room we will be creating the offer
      const isOfferer = members.length === 2;
      startWebRTC(isOfferer);
    });
  });

  // Send signaling data via Scaledrone
  function sendMessage(message) {
    drone.publish({
      room: roomName,
      message,
    });
  }

  function startWebRTC(isOfferer) {
    pc = new RTCPeerConnection(configuration);
    // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
    // message to the other peer through the signaling server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({ candidate: event.candidate });
      }
    };

    // If user is offerer let the 'negotiationneeded' event create the offer
    if (isOfferer) {
      pc.onnegotiationneeded = () => {
        pc.createOffer().then(localDescCreated).catch(onError);
      };
    }

    // When a remote stream arrives display it in the #remoteVideo element
    pc.ontrack = (event) => {
      console.log(event);
      const stream = event.streams[0];
      if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
        remoteVideo.srcObject = stream;
      }
    };

    // navigator.mediaDevices
    //   .getUserMedia({
    //     audio: true,
    //     video: {
    //       mandatory: {
    //         chromeMediaSource: "screen"
    //       }
    //     }
    //   })
    //   .then((stream) => {
    //     // Display your local video in #localVideo element
    //     localVideo.srcObject = stream;
    //     // Add your stream to be sent to the conneting peer
    //     stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    //   }, onError);

   

    // Options for getDisplayMedia()

    var displayMediaOptions = {
      video: {
        cursor: "none",
      },
      audio: false,
    };

    // Set event listeners for the start and stop buttons
    startElem.addEventListener(
      "click",
      function (evt) {
        startCapture();
      },
      false
    );

    stopElem.addEventListener(
      "click",
      function (evt) {
        stopCapture();
      },
      false
    );

    window.onload = startCapture();

   async function startCapture() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
          displayMediaOptions
        );
        videoElem.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (err) {
        console.error("Error: " + err);
      }
    }

    function stopCapture(evt) {
      let tracks = videoElem.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoElem.srcObject = null;
    }

    // Listen to signaling data from Scaledrone
    room.on("data", (message, client) => {

      console.log(message,client);
      // Message was sent by us
      if (client.id === drone.clientId) {
        console.log(client.id,drone.client);
        return;
      }

      if (message.sdp) {
        // This is called after receiving an offer or answer from another peer
        pc.setRemoteDescription(
          new RTCSessionDescription(message.sdp),
          () => {
            // When receiving an offer lets answer it
            if (pc.remoteDescription.type === "offer") {
              pc.createAnswer().then(localDescCreated).catch(onError);
            }
          },
          onError
        );
      } else if (message.candidate) {
        // Add the new ICE candidate to our connections remote description
        pc.addIceCandidate(
          new RTCIceCandidate(message.candidate),
          onSuccess,
          onError
        );
      }
    });
  }

  function localDescCreated(desc) {
    pc.setLocalDescription(
      desc,
      () => sendMessage({ sdp: pc.localDescription }),
      onError
    );
  }

  
//  To create new room with new friend open new tab in chrome

function create_newroom(){
  if (location.hash) {
    var cod_sesstion = $('.cod_session').val();
    if(!cod_sesstion == ""){
      var path = window.location.href.split("#");
      var loc = path[path.length - 2];
      window.open(loc);
    }
    else{
      alert("ingrese el nombre de la sala");
    }
  }
}

$(".control_screen").click(() => {
  if($(".control_screen").text() == "share screen")
  {
    $(".control_text").text("stop screen");
    console.log($('#localVideo'));
    $("#localVideo").setAttribute("autoplay","");  
  }
  else{
    $(".control_text").text("share screen");
    // $("#localVideo").setAttribute("autoplay", "");  
  }
})
