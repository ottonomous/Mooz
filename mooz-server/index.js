const PORT = 8081;

const expressLib = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const express = expressLib();
const server = http.createServer(express);
const io = require('socket.io').listen(server);


server.listen(PORT, null, () => {
   console.log("Listening on port " + PORT); 
}); 

express.get('/', function(req, res){ res.sendFile(__dirname + '/client.html'); });

const channels = {}
const sockets = {}

io.sockets.on('connection', socket => {
  socket.channels = {};
  sockets[socket.id] = socket;

  const leave = channel => {
    console.log("["+ socket.id + "] leaving ");
    if (!(channel in socket.channels)) {
      console.log("["+ socket.id + "] ERROR: already joined ", channel);
      return; // already disconnected or not in channel
    }

    delete socket[channels][channel];
    delete channels[channel][socket.id];

    for (id in channels[channel]) {
      channels[channel][id].emit('removePeer', {'peerId': socket.id});
      socket.emit('removePeer', {'peerId': id});
    }
  }
  
  socket.on('disconnect', () => {
    for (var channel in socket.channels) {
      leave(channel);
    }
    delete sockets[socket.id];
  })


  socket.on('join', (config) => {
    var channel = config.channel;
    var userData = config.userData;

    if (channel in socket.channels) {
      return; // already joined
    }

    if (!(channel in channels)) {
      channels[channel] = {};
    }

    for (id in channels[channel]) {
      channels[channel][id].emit('addPeer', {'peerId': socket.id, 'shouldCreateOffer': false});
      socket.emit('addPeer', {'peerId': id, 'shouldCreateOffer': true});
    }

    channels[channel][socket.id] = socket;
    socket.channels[channel] = channel;
  });

  socket.on('part', leave);

  socket.on('relayICECandidate', (config) => {
    var peerId = config.peerId;
    var iceCandidate = config.iceCandidate;
    console.log("["+ socket.id + "] relaying ICE candidate to [" + peerId + "] ", iceCandidate);

    if (peerId in sockets) {
        sockets[peerId].emit('iceCandidate', {'peerId': socket.id, 'iceCandidate': iceCandidate});
    }
  });

  socket.on('relaySessionDescription', (config) => {
    var peerId = config.peerId;
    var sessionDescription = config.sessionDescription;
    console.log("["+ socket.id + "] relaying session description to [" + peer_id + "] ", session_description);

    if(peerId in sockets) {
      sockets[peerId].emit('sessionDescription', {'peerId': socket.id, 'sessionDescription': sessionDescription});
    }
  })
});