<script>
  import bus from '../../service/bus';
  import FreeIntegrate from './freeIntegrate'
  export default {
    components: {
      FreeIntegrate
    },
    data: () => ({
      score: {
        needSore: 10,
        haveScore: 5,
      },
    }),
   props: ['category','action','points','articlePoint'],
    methods: {
      getShow() {
         bus.$emit('showPrompt', true)
      },
    },
  }
</script>
<template>
  <!--<div class="charge" v-show="!isShow">-->
  <div>
    <!--<img src="../../assets/img/mask.png" class="charge-hide">-->
    <!--<div class="charge-message">
      <p class="need-score">{{action}}完整{{category}}需要{{ articlePoint }}积分</p>
      <div class="score-enough" v-show="score.haveScore-score.needSore >= 0">
        <p class="have-score">{{`您共有${score.haveScore}积分`}}</p>
        <button style=" width: 45%;">消耗积分阅读</button>
      </div>
      <div class="score-less" v-show="score.haveScore-score.needSore < 0">
        <p class="have-score">{{`您的积分不足为${points}`}}</p>
        <div>
        <button @click="getShow">直接购买￥1</button><button @click="getShow">免费获取积分</button></div>
      </div>
    </div>-->
  </div>
</template>

<style>
  /*.charge {*/
    /*position: absolute;*/
    /*bottom: 0;*/
  /*}*/
  /*.charge-hide {*/
    /*width: 100%;*/
    /*background-image: linear-gradient(-180deg, rgba(255,255,255,0.00) 0%, #FFFFFF 100%);*/
  /*}*/
  .charge-message {
    text-align: center;
    background: #fff;
    padding: 2vh 0;
  }
  .need-score {
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #000;
    margin-bottom: 2vh;
  }
  .have-score {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAA;
    margin-bottom: 1.5vh;
  }
  .charge-message button {
    background: #F8E71C;
    border: 0 solid #F8E71C;
    border-radius: 30px;
    font-family: PingFangSC-Light;
    font-size: 17px;
    color: #222222;
    height: 6vh;
  }
  .score-less div {
    display: flex;
    justify-content: space-around;
  }
  .score-less button {
    width: 40%;
  }

</style>
