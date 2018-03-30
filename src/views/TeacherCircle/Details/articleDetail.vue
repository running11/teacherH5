<template>
  <div style="position: relative;background: #fff;">
    <!--<img src="../../../assets/img/ic_buy.png" class="buy-tab" v-show="isBuy>=1">-->
  <div class="article-detail">
    <h2>{{article.title}}</h2>
    <div class="author-bar">
      <img :src="article.teacher_img" :onerror="defaultHead">
      <span>{{article.teacher_name}}</span>
      <span>{{article.update_time}}</span>
    </div>
    <div style="position: relative" class="articleStyle">
      <div class="article-content ql-editor" v-html="article.show_content?article.show_content:article.content"></div>
      <!--<div class="attachment">-->
        <!--&lt;!&ndash;<img src="../../../assets/img/triangle_down_fill.svg">&ndash;&gt;-->
      <!--</div>-->
      <!--<div class="have-message" v-show="isBuy===1">
        <span>{{ buyTime | timestampToYMD(buyTime)}}</span>
        <span>已购</span>
      </div>-->
      <!--<div class="charge-content" v-show = "isBuy<1">
        <img src="../../../assets/img/mask.png" class="charge-hide">
        <charge category="文章" action="阅读" :points="article.user_points" :articlePoint="article.points"></charge>
      </div>-->
      <!-- 附件部分 -->
      <div v-if="article.attachment_name" @click="download" class="attachment">
        <img src="../../../assets/img/ic_attachment@2x.png" alt="附件"/>
        <span v-text="article.attachment_name">article.attachment_name</span>
      </div>
    </div>
  </div>
    <comment></comment>
    <!--<free-prompt></free-prompt>-->
    <!-- 点击附件 底部弹出 -->
    <mt-popup v-model="popupVisible" position="bottom" style="width:100%;">
        <!--<div v-if="isAND" class="and-div">-->
            <!--<div class="div1">保存附件</div>-->
            <!--<div @click="save" class="div2">保存到我的晓书包</div>-->
            <!--<div @click="save1" class="div3">保存到手机</div>-->
            <!--<div class="div4" @click="popupVisible=false">取消</div>-->
        <!--</div>-->
        <div class="ios-div">
            <div class="div1">保存附件</div>
            <div @click="save" class="div2">保存到我的晓书包</div>
            <div class="div4" @click="popupVisible=false">取消</div>
        </div>
    </mt-popup>
  </div>
</template>

<script>
  import comment from '../../../components/detailComponent/comment.vue'
  import charge from  '../../../components/detailComponent/charge.vue'
  import freePrompt from '../../../components/detailComponent/freeIntegrate.vue'
  import { API } from '../../../service/api'
  import { MessageBox,Popup } from 'mint-ui'
  import defaultHeader from '../../../assets/img/face_200.png'
  import { Toast } from 'mint-ui'
  export default {
    components: { comment, charge, freePrompt },
    filters:{
      timestampToMD:function (timestamp) {
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
    data: () => ({
      article: {},
      isFree: false,
      showContent: '',
      isBuy: 0,
      articleId:0,
      buyTime:'',
      popupVisible: false,
      isAND:true,
      isIOS:false,
      isShare: 0,
      defaultHead: 'this.src="' + defaultHeader + '"'
    }),
    beforeMount(){
      this.getArticleId();
    },
    methods: {
      getArticles(){
        const detail = 'quan.articleDetail';
        const page = 1;
        // const url = this.basePath + `${detail}&article_id=${this.articleId}&page=${page}&type=1` + this.token;
        const url = this.basePath + `${detail}` + this.token;

        let param = {
          'seacher': this.articleId,
          'article_id_test': this.articleId,
          'page': page,
          'type': 1
        }
        // alert(url);
        this.axios.post(url,param).then(res => {
//        console.log(res);return false;
          let data = res.data.response;
          if(data.status == 200){
            this.isBuy = data.is_buy;
            this.buyTime = data.buy_time;
            this.article = data.article_detail;
            this.articleId = data.article_detail.article_id;
            this.isShare = data.is_share;
            this.isFree = data.article_detail.is_charge===0?true:false;
          }else{
            MessageBox({
              title: '提示',
              message: '未找到文章信息',
              showCancelButton: false
            });
          }
        },err=>{})
      },
      getArticleId(){
        this.articleId = this.GetQueryString('aid');
        console.log(this.articleId)
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
        //quan-attachmentSave
        const detail = 'quan.attachmentSave';
        const page = 1;
        const url = this.basePath + `${detail}&article_id=${this.articleId}&page=${page}&type=1` + this.token;

        this.axios.get(url).then(res => {
          let data = res.data;
          console.log('data:',data);
          if(data.code == 200){
            MessageBox('提示', '保存成功 ！').then(()=>this.popupVisible=false);
          }else{
            MessageBox('提示', data.message).then(()=>this.popupVisible=false);
          }
        },err=>{})
      },
      save1() {
        MessageBox('提示', '保存成功 ！').then(()=>this.popupVisible=false);
      }

    },
    mounted() {
      //判断网络状况
      if(navigator.onLine){
        this.getArticles();
      }else{
        this.$router.push({path: this.offPath});
      }

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
      title: "文章详情",
      content: ""
    }
  }
</script>

<style lang="scss" scoped="">
  .have-message {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAA;
    text-align: right;
    margin: 1.5vh 0;
  }
  .charge-content {
    position: absolute;
    bottom: 0;
  }
  .charge-hide {
    width: 100%;
    background-image: linear-gradient(-180deg, rgba(255,255,255,0.00) 0%, #FFFFFF 100%);
  }
  .buy-tab {
    position: fixed;
    width: 2vw;
    height: 1.6vh;
    left: 4vw;
  }
	.article-detail {
	  padding: 15px;
	  background-color: #fff;
	  h2 {
	    margin-bottom: 15px;
	  }
	  .author-bar {
	    color: #222;
	    margin-bottom: 20px;
	    img {
	      width: 28px;
	      height: 28px;
	      border-radius: 50%;
	    }
	    span {
	        font-size: 14px;
	      &:last-of-type {
	        float: right;
	        line-height: 30px;
	        color: #AAAAAA;
	      }
	    }

	  }
	}
	.article-content{
		line-height: 24px;
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
  .article-detail .author-bar span{
  	font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #222222;
		letter-spacing: -0.34px;
		line-height: 14px;
  }
  .article-detail h2{
  	font-family: PingFangSC-Medium;
		font-size: 20px;
		color: #000000;
		letter-spacing: -0.48px;
		line-height: 24px;
  }
</style>
