<template>
<div>
  <div v-for="stream in chatStreams" :key="stream.key">
    <single-stream
      :audio="stream.audio"
      :video="stream.video"
    />
  </div>
</div>
</template>

<script>
 import io from 'socket.io'

export default {
  name: 'videoChat',
  data() {
    return {
      things: 'stuff'
    }
  },
  computed: {
    chatStreams () {
      const chatStreams = ""
      return chatStreams
    }
  }
}
</script>

<style lang="stylus">

</style>

