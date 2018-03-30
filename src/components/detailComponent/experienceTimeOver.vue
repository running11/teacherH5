<script>

  export default {
    components: {},
    data: () => ({
    }),
    props: ['tips','height','type'],
    methods: {},
    mounted(){
      if(this.height=='210'){
        this.$refs.timeOver.style = 'height:210px'
      }else{
        this.$refs.timeOver.style = 'height:160px'
      }
    }
  }
</script>

<template>
  <div ref="timeOver">
    <p><img src="../../assets/img/ic_regret.png">{{tips}}</p>
    <button>请积分购买后收听完整{{type}}</button>
  </div>
</template>

<style scoped="">
  div {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    background: rgba(0,0,0,0.70);
    /*height: 160px;*/
    color: #fff;
    box-sizing: border-box;
    z-index: 999;
  }
  div p {
    margin-top: 20%;
    font-family: PingFangSC-Regular;
    font-size: 17px;
  }
  p img {
    width: 5vw;
    height: 3vh;
  }
  div button {
    color: #fff;
    font-family: PingFangSC-Light;
    font-size: 14px;
    background: rgba(0,0,0,0.70);
    border-radius: 25px;
    width: 60%;
    height: 5vh;
    margin-top: 5%;
  }

</style>
