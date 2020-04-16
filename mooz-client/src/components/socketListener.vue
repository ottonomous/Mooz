<template>
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
</template>

<script>
export default {
  data() {
    return {
      isConnected: false,
      socketMessage: '',
      channelConnection: false
    }
  },

  sockets: {
    connect() {
      console.log('socket connected')
      this.isConnected = true;
    },

    disconnect() {
      console.log('socket disconnected')
      this.isConnected = false;
    },

    addPeer(config) {
     console.log('Signaling server said to add peer:', config);
     var peer_id = config.peer_id;
      if (peer_id in peers) {
        console.log("Already connected to peer ", peer_id);
        return;
      }
      var peer_connection = new RTCPeerConnection(
        {"iceServers": ICE_SERVERS},
        {"optional": [{"DtlsSrtpKeyAgreement": true}]} 
      );
      peers[peer_id] = peer_connection;
    },

    whateverYouWantHereChannel(data) {
      console.log("connected to channel")
      this.channelConnection = true
      console.log(data)
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
      this.$socket.emit('part', {"channel": channel});
    },
    
    disconnectServer() {  
      this.$socket.emit('disconnect');
    }
    
  }
}
</script>

<style lang="stylus" scoped>
.button-box
  display: flex
  flex-direction: row
</style>