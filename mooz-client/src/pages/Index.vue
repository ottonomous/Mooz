<template>
  <q-page class="flex flex-center">
    <video-chat/>
  </q-page>
</template>

<script>
import videoChat from '../components/videoChat'
export default {
  name: 'PageIndex',
  components: {
    videoChat
  }
}
</script>
