<template>
  <div style="min-height: 100%;">
    <router-view/>
  </div>
</template>

<script>
//import { API } from './service/api'
export default {
  name: 'App',
  components:{},
  data(){
    return{
    }
  },
}
</script>

<style lang="less">
  @import "assets/css/reset.css";
  @import "../node_modules/mint-ui/lib/style.css";
  @import "assets/css/common.css";
  @import "assets/css/style.css";
  @import "assets/css/swiper.min.css";
#app {
  width: 100%;
  position: relative;
  min-height: 100%;
  font-family: PingFangSC-Light;
}
.loadings{
	height: 40px;
	line-height: 40px;
}
.v-main .v-con img{
	max-width: 100%;
	margin-top: 10px;
}
.articleStyle .article-content img{
	max-width: 100%;
}
.v-main .v-title{
	font-family: PingFangSC-Medium;
	font-size: 20px;
	color: #000000;
	letter-spacing: -0.48px;
	line-height: 24px;
}
.v-main .v-info span{
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #222222;
	letter-spacing: -0.34px;
	line-height: 14px;
}
.v-main .v-con p{
	font-family: PingFangSC-Light;
	font-size: 17px;
	color: #000000;
	letter-spacing: 0;
	line-height: 25px;
}
  .article-content p{
  	font-family: PingFangSC-Light;
		font-size: 17px;
		color: #000000;
		letter-spacing: 0;
		line-height: 25px;
  }

  .noFollow{
    text-align: center;
  }
  .noFollow img {
    width: 50%;
    margin-top: 140px;
  }
  .noFollow p{
    font-family: PingFangSC-Light;
    font-size: 17px;
    color: #AAAAAA;
    text-align: center;
    line-height: 21px;
    margin-top: 20px;
  }
  .basic-message img{
    border: none!important;
  }

  .index-list .list-head {
    position: relative;
    color: #aaa;
    font-size: 14px;
    height: 28px;
    line-height: 28px;
  }

  .index-list .list-head .head-image {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }

  .index-list .list-head .head-time {
    float: right;
  }
  .index-list .list-content .content-word {
    /*width: 244px;*/
    height: 42px;
    font-size: 17px;
    line-height: 22px;
    word-wrap: break-word;
    overflow: hidden;
  }
  .index-list .list-content .content-bottom {
    color: #aaa;
    font-size: 14px;
    position: absolute;
    left: 15px;
    bottom: 16px;
  }

  .index-list .list-content .content-bottom .content-comment {
    margin-right: 20px;
  }

  .index-list .list-content .content-image {
    width: 86px;
    height: 86px;
  }

  .list-content{
    overflow: hidden;
    margin-top: 10px;
  }
  .content-right{
    float: right;
    width: 86px;
    height: 86px;
    position: relative;
  }
  .list-con{
    padding: 15px;
    overflow: hidden;
  }

  .basic-left{
    float: left;
  }
  .basic-message img{
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
  }
  .teacher-say img{
    max-width: 100%;
    margin: 15px 0;
  }
  .mint-toast{
    background: #000;
    opacity: 0.9;
    padding: 10px 20px!important;
    width: 216px;
  }
  .mint-toast-text{
    font-family: PingFangSC-Light;
    font-size: 17px;
    color: #FFFFFF;
    line-height: 21px;
    opacity: 0.9;
  }
  .article-content span{
    display: block;
    font-family: PingFangSC-Light;
    font-size: 17px;
    color: #000000;
    letter-spacing: 0;
    line-height: 25px;
  }

  .mint-msgbox{
    color: #FFF!important;
    background-color: #2B2B2B!important;
    border: 2px solid #E3C277!important;
    border-radius: 10px!important;
    padding-top: 10px!important;

    .mint-msgbox-content{
      border: none;
      font-family: STHeitiSC-Light;
      font-size: 17px;
      color: #FFFFFF;
      letter-spacing: -0.41px;
      line-height: 21px;
    }
    .mint-msgbox-message{
      color: #FFFFFF;
      font-size: 17px;
    }
  }
  .mint-msgbox-title{
    font-family: PingFangSC-Light;
    font-size: 20px;
    color: #FFFFFF!important;
    letter-spacing: -0.48px;
    line-height: 20px;
  }
  .mint-msgbox-btns{
    padding-bottom: 15px;

    .mint-msgbox-btn{
      background-color: #2B2B2B;
      font-family: PingFangSC-Light;
      font-size: 17px;
      color: #F8E71C;
      letter-spacing: -0.41px;
      line-height: 17px;
      border: none;
    }
  }
  .mint-msgbox-btn:active{
    background: none!important;
  }
  .zIndex{
    z-index: 1000000;
  }

  .attachment img{
    float: left;
  }
  .attachment span{
    line-height: 17px;
    height: 36px;
    overflow: hidden;
    padding-top: 4px;
    padding-left: 6px;
    display: table-cell;
    vertical-align: middle;
  }
  .attachment{
    width: auto!important;
    margin: 0!important;
    background: rgba(239,239,239,0.5)!important;
  }

  body{
    background: #fff!important;
  }
</style>

