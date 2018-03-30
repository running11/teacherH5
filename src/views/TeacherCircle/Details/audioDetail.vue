<template>
  <section>
    <div class="v-main" style="background-color: #fff;">
      <!--视频-->
      <div class="v-audio">
        <audio :src="articleDetail.media" ref="media"></audio>
        <div v-if="articleDetail.cover != ''" class="audio-cover"><img :src="articleDetail.cover" alt="" /></div>
        <div v-else class="audio-cover"><img src="../../../assets/img/bg.png" alt="" /></div>
        <!--<experienceOver :tips="timeOver" v-show="isTryOver" height="160" type="视频"></experienceOver>-->
        <div class="outer" ref="outdiv"><img src="../../../assets/img/ic_video_play_video.png" class="palyload" @click="play"></div>
        <span class="videoTime" v-show="originStatus">{{videoData.duration}}</span>
        <div class="v-control" v-if="!originStatus">
          <div><img src="../../../assets/img/play_fill.svg" @click="play" class="start" v-if="playStatus"></div>
          <div><img src="../../../assets/img/stop.svg" @click="paused" class="stop" v-if="!playStatus"></div>
          <div class="v-progresss">
            <mt-range
              v-model="currentTime"
              :max="maxTime"
              :step="0.01"
              :bar-height="2"
            >
              <div slot="start" class="v-word">{{process.current}}</div>&nbsp;
              <div slot="end" class="v-word">{{process.max}}</div>
            </mt-range>
            <span class="hide-line"></span>
            <!--<span class="v-word">{{currentTime}}</span>-->
            <!--<progress :max="maxTime" :value="currentTime" class="processbar"></progress>-->
            <!--<span class="v-word">{{maxTime}}</span>-->
          </div>
        </div>
      </div>
      <div class="is-buy" style="left: 11px;" v-show="isBuy===1"></div>
      <charge category="音频" action="收听" :points="articleDetail.user_points" :articlePoint="articleDetail.points" v-show="chargeShow"></charge>
      <!--标题-->
      <div class="v-title">
        <p>{{articleDetail.title}}</p>
      </div>
      <!--简介-->
      <div class="v-info">
        <img :src="articleDetail.teacher_img" :onerror="defaultHead" style="width: 28px;height: 29px;border-radius: 93px">
        <span>{{ articleDetail.teacher_name }}</span>
        <span>{{ articleDetail.update_time}}</span>
      </div>
      <!--内容-->
      <div class="v-con" v-html="articleDetail.content"></div>

      <div style="padding: 0 15px 15px;">
        <div v-if="articleDetail.attachment_name" @click="download" class="attachment">
          <img src="../../../assets/img/ic_attachment@2x.png" alt="附件"/>
          <span v-text="articleDetail.attachment_name">articleDetail.attachment_name</span>
        </div>
      </div>

      <div class="have-message" v-show="isBuy===1">
        <span>{{ buyTime | timestampToYMD(buyTime) }}</span>
        <span>已购</span>
      </div>
      <!--评论-->
      <div class="comment-main">
        <comment></comment>
      </div>
      <!--<free-prompt></free-prompt>-->
      <!-- 点击附件 底部弹出 -->
      <mt-popup v-model="popupVisible" position="bottom" style="width:100%;">
        <!--<div v-if="isAND" class="and-div">-->
            <!--<div class="div1">保存附件</div>-->
            <!--<div @click="save" class="div2">保存到我的晓书包</div>-->
            <!--<div class="div3">保存到手机</div>-->
            <!--<div class="div4" @click="popupVisible=false">取消</div>-->
        <!--</div>-->
        <div class="ios-div">
            <div class="div1">保存附件</div>
            <div @click="save" class="div2">保存到我的晓书包</div>
            <div class="div4" @click="popupVisible=false">取消</div>
        </div>
      </mt-popup>
    </div>
  </section>
</template>

<script>
  import freePrompt from '../../../components/detailComponent/freeIntegrate'
  import Comment from '../../../components/detailComponent/comment'
  import experienceOver from '../../../components/detailComponent/experienceTimeOver.vue'
  import charge from '../../../components/detailComponent/charge.vue'
  import { API } from '../../../service/api'
  import { changeFormat } from '../../../service/utils'
  import { MessageBox,Popup,Toast } from 'mint-ui'
  import defaultHeader from '../../../assets/img/face_200.png'

  export default {
    name: "audio-detail",
    components:{
      comment: Comment,
      experienceOver,
      charge,
      freePrompt
    },
    filters:{
      timestampToMD:function (timestamp) {
        if(!timestamp){
          timestamp = +new Date()/1000;
        }
        const date = new Date(timestamp * 1000);
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        const D = date.getDate() + ' ';
        return M+'/'+D;
      },
      timestampToYMD:function (timestamp) {
        if(!timestamp){
          timestamp = +new Date()/1000;
        }
        const date = new Date(timestamp * 1000);
        const Y = date.getFullYear();
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        const D = date.getDate() + ' ';
        return Y+'/'+M+'/'+D;
      }
    },
    data(){
      return{
        videoData:{
          duration:0,
          currentTime: '',
        },
        originStatus: true,
        playStatus:true,
        media:{},
        timeOver: '试看时间结束',
        isTryOver: false,
        maxTime:0,//总时间
        currentTime: 0,//当前时间
        isBuy: 0,//
        chargeShow: false,
        articleId:0,
        articleDetail:{},
        process:{
          current:'',
          max:''
        },
        buyTime:'',
        popupVisible: false,
        isAND:true,
        isIOS:false,
        isShare: 0,
        defaultHead: 'this.src="' + defaultHeader + '"'
      }
    },
    watch: {

    },
    methods:{
      play(){
        this.$refs.media.play();
        this.$refs.outdiv.style.display = 'none';
        this.originStatus = false;
        this.playStatus = false;
      },
      paused(){
        this.$refs.media.pause();
        this.playStatus = true;
      },
      getAudios(){
        const detail = 'quan.articleDetail';
        const page = 1;
        const url = `http://quan-dev.xiaoheiban.cn/api/?method=`;
        // let aurl = this.basePath + `${detail}&article_id=${this.articleId}&page=${page}&type=1` + this.token;
        let aurl = this.basePath + `${detail}` + this.token;
        let param = {
          'seacher': this.articleId,
          'article_id_test': this.articleId,
          'page': page,
          'type': 1
        }
        this.axios.post(aurl,param).then(res => {
//        console.log(res);
          this.buyTime = res.data.response.buy_time;
          this.isBuy = res.data.response.is_buy;
          this.isShare = res.data.response.is_share;
          this.articleDetail = Object.assign(res.data.response.article_detail)
        },err=>{})
      },
      getArticleId(){
        // this.articleId = window.location.href.split('?')[1]
        // this.articleId = window.location.hash.split('?')[1]
        this.articleId = this.GetQueryString('aid');
        // alert(this.articleId)
      },
      download() {
        if(this.isShare == 1){
          Toast({
            message: '请在晓黑板中下载此附件',
            className: 'zIndex'
          });
          return false;
        }
        this.popupVisible = true;
      },
      save() {
        // 保存附件到我的晓书包
        //quan-attachmentSave
        const detail = 'quan.attachmentSave';
        const page = 1;
        const url = this.basePath + `${detail}&article_id=${this.articleId}&page=${page}&type=1` + this.token;

        this.axios.get(url).then(res => {
          let data = res.data;
          // alert(js)
          if(data.code == 200){
            MessageBox('提示', '保存成功！').then(()=>this.popupVisible=false);
          }else{
            MessageBox('提示', data.message).then(()=>this.popupVisible=false);
          }
        },err=>{})
      }
    },
    beforeMount(){
      this.getArticleId();//获取articleId
    },
    beforeDestroy() {
      console.log('离开了')
      this.$refs.media.pause();
    },
    destroyed() {
      console.log('离开了')
      this.$refs.media.pause();
    },
    mounted() {
      //判断网络状况
      if(navigator.onLine){
        this.getAudios()//获取数据
      }else{
        this.$router.push({path: this.offPath});
      }
      let video = document.getElementsByTagName('audio')[0];
      video.oncanplay = () => {
        let videoTotalTime = video.duration;
        this.videoData.duration = changeFormat(videoTotalTime);
        this.maxTime = videoTotalTime;
        this.process.max = changeFormat(videoTotalTime);
        video.addEventListener('timeupdate', () => {
          this.process.current = changeFormat(video.currentTime);
          this.currentTime = video.currentTime;
          if(this.isBuy<1){
            if(video.currentTime > videoTotalTime/3) {
              video.pause();
              this.isTryOver = true;
              this.playStatus = true;
              this.chargeShow = true
            }
          }
        });
        video.addEventListener('ended',()=>{
          this.playStatus = true;
        })
      };

      //判断手机类型
      var ua = navigator.userAgent.toLowerCase();

      if(/android/.test(ua)){
          console.log('android');
          this.isAND = true;
          this.isIOS = false;
        }

      if(/iphone|ipad|ipod/.test(ua)){
          console.log('ios');
          this.isIOS = true;
          this.isAND = false;
        }

    },
    metaInfo: {
      title: "音频详情",
      content: ""
    }
  }
</script>

<style lang="scss">

  .have-message {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAA;
    text-align: right;
    margin: 1.5vh 0;
    padding-right: 15px;
  }
  .v-main{
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  .v-main .v-audio{
    width: 100%;
    height: 160px;
    position: relative;
    /*background: url("../../../assets/img/bg.png") center center no-repeat;*/
  }
  .v-main .v-audio .v-control{
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 14px;
    padding: 0 15px 14px 15px;
    line-height: 14px;
  }
  .start{
    width: 22px;
    height: 23px;
    position: absolute;
    top: 30%;
    margin-top: -6px;
    z-index: 9;
  }
  .stop{
    width: 22px;
    height: 23px;
    position: absolute;
    top: 30%;
    margin-top: -6px;
  }
  .v-main .outer{
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .v-main .v-audio .palyload{
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -20px;
  }
  .v-main .videoTime{
    position: absolute;
    width: 42px;
    height: 19px;
    border-radius: 25px;
    background-color: rgba(0,0,0,.71);
    font-family: PingFangSC-Light;
    font-size: 10px;
    color: #FFFFFF;
    letter-spacing: -0.3px;
    line-height: 19px;
    text-align: center;
    bottom: 10px;
    right: 10px;
  }
  .v-main .v-title{
    padding: 20px 15px 15px 15px;
  }
  .v-main .v-title p{
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #000000;
    letter-spacing: -0.48px;
    line-height: 24px;
  }
  .v-main .v-info{
    height: 28px;
    padding: 0 15px;
    line-height: 28px;
  }
  .v-main .v-info  span:first-child{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #222222;
    letter-spacing: -0.34px;
    line-height: 14px;
  }
  .v-main .v-info  span:last-child{
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAAAAA;
    letter-spacing: -0.34px;
    line-height: 14px;
    float: right;
    margin-top: 4px;
  }
  .v-main .v-con{
    padding: 20px 15px 15px 15px;
    font-family: PingFangSC-Light;
    font-size: 17px;
    color: #000000;
    letter-spacing: 0px;
    line-height: 25px;
    word-break: break-word;
  }
  .v-main .v-con .con-img{
    margin: 15px 0;
    width: 100%;
    height: 194px;
  }
  .v-progresss{
    padding-left: 7%;
    width: 83%;
    /*position: absolute;*/
    /*height: 14px;*/
    /*margin-top: -14px;*/
    /*top: 50%;*/
  }
  .processbar{
    height: 2px;
    width: 70%;
    border-radius: 8px;
    background-color: rgba(255,255,255,.3);
    color: #fff;
  }
  .v-word{
    /*padding-top: 2px;*/
    display: inline-block;
    vertical-align: center;
    font-family: PingFangSC-Light;
    font-size: 10px;
    color: #FFFFFF;
    letter-spacing: -0.24px;
    line-height: 14px;
    padding-top: 8px;
    width: 29px;
  }

  progress::-webkit-progress-bar {
    background-color: rgba(255,255,255,.3);
  }

  progress::-webkit-progress-value {
    background-color: #fff;
  }

  progress::-moz-progress-bar {
    background-color: rgba(255,255,255,.3);
  }
  .mt-range .mt-range-content .mt-range-runway{
    margin: 0 20px;
    /*border-top-width: 0 !important;*/
  }
  .mt-range .mt-range-content .mt-range-thumb{
    width: 10px !important;
    height: 10px !important;
    top: 50%;
    margin-top: -5px;
  }
  .mt-range-content{
    margin-left: 4px;
    margin-right:  16px !important;
  }
  .hide-line{
    width: 12px;
    height: 8px;
    background-color: rgba(200,0,0,.5);
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10000;
  }
  .audio-cover{
  	width: 100%;
  	height: 160px;
  	position: absolute;
  	left: 0;
  	top: 0;
  	text-align: center;

  	img{
  		/*width: 100%;*/
  		height: 160px;
  	}
  }

  .attachment{
    width: 345px;
    height: 44px;
    margin: 10px auto;
    background: #EFEFEF;
    span{
    }
    img{
      width: 44px;
      height: 44px;
    }
  }
  .and-div{
    width: 100%;
    height: 230px;
    background: #2B2B2B;
    .div1{
      height:54px;
      line-height: 54px;
      font-size: 14px;
      text-indent: 12px;
      color: #AAAAAA;
    }
    .div2{
      height:54px;
      line-height: 54px;
      text-align: center;
      font-size: 17px;
      color: #FFFFFF;
      background: #363636;
    }
    .div3{
      height:54px;
      line-height: 54px;
      text-align: center;
      font-size: 17px;
      color: #FFFFFF;
      background: #363636;
      margin-bottom: 20px;
      border-top: 1px solid #2A2A2A;
    }
    .div4{
      height:54px;
      line-height: 54px;
      text-align: center;
      font-size: 17px;
      color: #FFFFFF;
      background: #363636;
    }
  }
  .ios-div{
    width: 100%;
    height: 180px;
    background: #2B2B2B;
    .div1{
      height:54px;
      line-height: 54px;
      font-size: 14px;
      text-indent: 12px;
      color: #AAAAAA;
    }
    .div2{
      height:54px;
      line-height: 54px;
      text-align: center;
      font-size: 17px;
      color: #FFFFFF;
      background: #363636;
      margin-bottom: 20px;
    }
    .div4{
      height:54px;
      line-height: 54px;
      text-align: center;
      font-size: 17px;
      color: #FFFFFF;
      background: #363636;
    }
  }
</style>
