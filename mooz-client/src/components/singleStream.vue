<template>
  <div>
    <video
    autoplay
    :src="video"
    /> 

    <audio
    autoplay
    :src="audio"
    />

  </div>
</template>

<script>
export default {
  name: 'singleStream',
  props: {
    audio: {
      type: String,
      required: true
    },
    video: {
      type: String,
      required: true
    }
  }

}
</script>

<style>

</style>