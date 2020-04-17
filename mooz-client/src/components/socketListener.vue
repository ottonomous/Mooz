<template>
<div>
  <div class="remote-videos-container"
    
  >
    <video
      v-if="streams.length"
      :v-for="(stream, index) in streams"
      :key="index"
      class="video-player"
      autoplay
      playsinline
      muted
      mirror
      :src-object.prop="stream"
    />

  </div>
  <div class="self-video-container">
    <video
      class="self-video-player"
      autoplay
      playsinline
      muted
      mirror
      :src-object.prop="selfStream"
    />
  </div>
  <div class="button-box">
    <div>
      <button @click="connectServer()">Connect to the Server</button>
    </div>
     <div>
      <button v-if="isConnected" @click="relayIceCandidate()">relayICECandidate</button>
    </div>
    <div>
      <button v-if="isConnected" @click="joinChannel()">Join Channel</button>
    </div>
    <div>
      <button v-if="isConnected" @click="leaveChannel()">Leave Channel</button>
    </div>
    <div>
      <button v-if="isConnected" @click="disconnectServer()">Disconnect From Server</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      isConnected: false,
      socketMessage: '',
      channelConnection: false,
      peers: [],
      iceServers: [
        {urls:"stun:stun.l.google.com:19302"}
      ],
      local_media_stream: null,
      selfStream: null,
      streams: []
    }
  },
  mounted () {
    console.log('created')
    this.connectServer()
  },
  sockets: {
    connect() {
      console.log('socket connected')
      this.connectMediaStream()
      this.isConnected = true;
    },

    disconnect() {
      console.log('socket disconnected')
      this.isConnected = false;
    },

    addPeer(config) {
      console.log('Signaling server said to add peer:', config);
      var peer_id = config.peer_id;

      if (peer_id in this.peers) {
        console.log("Already connected to peer ", peer_id);
        return;
      }

      const peer_connection = new RTCPeerConnection(
        {"iceServers": this.iceServers},
        {"optional": [{"DtlsSrtpKeyAgreement": true}]} 
      );

      this.peers[peer_id] = peer_connection;
      
      peer_connection.onicecandidate = event => {
        if (event.candidate) {
            this.$socket.emit('relayICECandidate', {
              'peer_id': peer_id, 
              'ice_candidate': {
                'sdpMLineIndex': event.candidate.sdpMLineIndex,
                'candidate': event.candidate.candidate
              }
          });
        }
      }

      peer_connection.onaddstream = function(event) {
        console.log("onAddStream", event);
        this.streams.push(event)
      }

      peer_connection.addStream(this.selfStream)
      console.log(peer_connection)
      
    },

    whateverYouWantHereChannel(data) {
      console.log("connected to channel")
      this.channelConnection = true
    }
  },

  methods: {
    connectServer() {
      this.$socket.emit('connect')
    },

    joinChannel() {
      const channel = 'some-global-channel-name'
      const userData = {'whatever-you-want-here': 'stuff'}

     this.$socket.emit('join', {"channel": channel, "userdata": userData});
    },

    relayIceCandidate() {
      const config = {

      }
      this.$socket.emit('relayICECandidate', config)
    },

    leaveChannel () {
      const channel = 'some-global-channel-name'
      this.$socket.emit('part', channel);
    },
    
    disconnectServer() {  
      this.$socket.emit('disconnect')
    },
    
    connectMediaStream() {
      // function setup_local_media(callback, errorback) {
      if (this.local_media_stream != null) {  /* ie, if we've already been initialized */
        // if (callback) callback();
        return; 
      }
      /* Ask user for permission to use the computers microphone and/or camera, 
        * attach it to an <audio> or <video> tag if they give us access. */
      console.log("Requesting access to local audio / video inputs");


      navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

      // attachMediaStream = function(element, stream) {
      //   console.log('DEPRECATED, attachMediaStream will soon be removed.');
      //   element.srcObject = stream;
      // };

      if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
        navigator.getUserMedia({
          audio: { echoCancellation: true, facingMode: "user", noiseSuppression: true, autoGainControl: true },
          video: true
        }, function(stream) {
          this.selfStream = stream
          // if (callback) callback();
        }, function(error) {
          logVideoAudioError(error);
        });
      } else {
        // SAFARI SUPPORT (iOS, macOS)
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: { echoCancellation: true, facingMode: "user", noiseSuppression: true, autoGainControl: true }
        })
        .then((stream) => {
          this.selfStream = stream
        })
        .catch(function(error) {
           console.log("Error enabling video / audio " + error);
        });

        // function attachVideoToBody(stream) {
          // console.log("Access granted to audio/video");
          // this.local_media_stream = stream;
          
          // var local_media = USE_VIDEO ? $("<video autoplay controls playsinline muted>") : $("<audio>");
          // local_media.attr("autoplay", '');
          // local_media.attr("playsinline", '');
          // local_media.attr("muted", "true"); /* always mute ourselves by default */
          // local_media.attr("controls", '');


          // speechEvents = hark(stream, {});

          // $('.video-box').append(local_media);    
          // attachMediaStream(local_media[0], stream);
        // }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.button-box
  display: flex
  flex-direction: row
.self-video-player
  transform: rotateY(180deg)
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg)
.video-container
  transform: rotateY(180deg)
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg)
</style>