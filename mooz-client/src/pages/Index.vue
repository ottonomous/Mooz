<template>
  <q-page class="flex flex-center">
    <socket-listener/>
  </q-page>
</template>

<script>
import socketListener from '../components/socketListener'
export default {
  name: 'PageIndex',
  components: {
    socketListener
  }
}
</script>
