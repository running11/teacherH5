<template>
    <div class="noFollow">
      <img :src="offImg" alt="">
      <p>网络连接不给力，请确认后重试</p>
    </div>
</template>

<script>
    import offImg from '../assets/img/ic_blank_wifi@2x.png';
    export default {
        name: "outline",
        data() {
          return {
            offImg: offImg
          }
        }
    }
</script>

<style scoped>

</style>
