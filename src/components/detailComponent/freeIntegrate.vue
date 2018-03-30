<script>
  import bus from '../../service/bus'
  export default {
    components: {},
    data: () => ({
      promptShow: false,
    }),
    methods: {
      closeIt() {
        this.promptShow = false
      },
    },
    mounted() {
      bus.$on('showPrompt', e => {
        this.promptShow = e
      })
    }
  }
</script>

<template>
  <div class="integrate-prompt" v-show="promptShow">
    <div class="integrate-dialog">
      <h2>免费获取积分</h2>
      <p>途径1：拨打客服电话400-820-1227索取</p>
      <p>途径2：晓黑板私聊中联系晓客服索取</p>
      <button @click="closeIt">我知道啦</button>
    </div>
  </div>
</template>

<style scoped="" lang="scss">
  .integrate-prompt {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background: rgba(0,0,0,0.70);
    z-index: 10000;
  }
  .integrate-dialog {
    position: fixed;
    top: 20%;
    left: 5%;
    width: 90%;
    height: 23vh;
    background: #2B2B2B;
    border: 2px solid #BBAB71;
    border-radius: 10px;
    color: #fff;
    text-align: center;
    padding: 2vh 0;
    z-index: 100000;
    h2 {
      font-family: PingFangSC-Light;
      font-size: 20px;
      margin-bottom: 3vh;
    }
    p {
      text-align: left;
      margin-left: 5vw;
    }
    button {
      margin-top: 4vh;
      width: 90%;
      height: 6vh;
      background: #F8E71C;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      color: #000000;
    }
  }


</style>
