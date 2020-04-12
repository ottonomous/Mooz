
import VueSocketIO from 'vue-socket.io'
import Vue from 'vue'
import VueResource from 'vue-resource'
import store from '../store'
import { url } from '../utils/config'

Vue.use(new VueSocketIO({
  debug: true,
  connection: `${url}/video-chat`,
  vuex: {
    store, // Attach the store
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
}))

Vue.use(VueResource)