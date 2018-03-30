<template>
  <section style="background-color: #F7F7F7;" v-bind:style="{minHeight: cheight + 'px'}">

    <div class="noFollow" v-show='follow_sum == ""'>
      <img src="../../assets/img/ic_blank_follow@2x.png" alt="">
      <p>你还未关注老师</p>
    </div>

    <ul style="background-color: #F7F7F7;" class="follow-list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled = "false"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check = true>
      <li v-for="(tm, index) in teacherMessages"
          class="follow"
          @touchstart="getIndex(tm.uid, index)"
          @click="goDetail(tm.uid)">
        <!--v-bind:class="{'noNew':tm.article_title == ''}"-->

        <mt-cell-swipe v-if="tm.article_title != ''"
                :right="[{
         content: '取消关注',
         style: { background: '#FF3B30', color: '#fff',fontFamily: 'PingFangSC-Regular',fontWeight:'normal'},
         handler: () => cancelFo(tm.uid,index)
       }]">
          <div class="follower">
            <div @click="goDetail(tm.uid)" class="basic-message">
              <div class="basic-left">
                <img :src="tm.teacher_img" :onerror="defaultHead"  class="follow-teacher"/>
              </div>
              <div class="teacher-message">
                <h2>{{tm.teacher_name}}</h2>
                <ul>
                  <!--<li>{{tm.description?`${tm.description.substring(0, 60)}...`:''}}</li>-->
                  <li v-html="tm.brief"> </li>
                </ul>
              </div>
            </div>
            <div class="txt-content" v-show="tm.article_type != ''">
              <img v-if="tm.article_type == 1" src="../../assets/img/ic_txt.png"/>
              <img v-else src="../../assets/img/ic_video.png"/>
              <!--<span>{{tm.brief?`${tm.brief.substring(0, 15)}...`:' '}}</span>-->
              <span>{{tm.article_title}}</span>
            </div>
            <div class="bottom-bar">

              <span class="bbtxt"><img src="../../assets/img/list_follow.png" class="favorite"/><span>{{tm.followeds}}</span></span>
              <span class="bbtxt txt"><img src="../../assets/img/list_txt.png"/><span>{{tm.articles}}</span></span>

              <span class="last-update">最近更新: {{tm.article_last_time}}</span>
            </div>
          </div>
        </mt-cell-swipe>

        <mt-cell-swipe v-else
          :right="[{
         content: '取消关注',
         style: { background: 'red', color: '#fff','padding-top': '54px'},
         handler: () => cancelFo(tm.uid,index)
       }]">
          <div class="follower">
            <div class="basic-message">
              <div class="basic-left">
                <img :src="tm.teacher_img" :onerror="defaultHead"  class="follow-teacher"/>
              </div>
              <div class="teacher-message">
                <h2>{{tm.teacher_name}}</h2>
                <ul>
                  <!--<li>{{tm.description?`${tm.description.substring(0, 60)}...`:''}}</li>-->
                  <li v-html="tm.brief"> </li>
                </ul>
              </div>
            </div>
            <div class="txt-content" v-show="tm.article_type != ''">
              <img v-if="tm.article_type == 1" src="../../assets/img/ic_txt.png"/>
              <img v-else src="../../assets/img/ic_video.png"/>
              <!--<span>{{tm.brief?`${tm.brief.substring(0, 15)}...`:' '}}</span>-->
              <span>{{tm.article_title}}</span>
            </div>
            <div class="bottom-bar">

              <span class="bbtxt"><img src="../../assets/img/list_follow.png" class="favorite"/><span>{{tm.followeds}}</span></span>
              <span class="bbtxt txt"><img src="../../assets/img/list_txt.png"/><span>{{tm.articles}}</span></span>

              <span class="last-update">最近更新: {{tm.article_last_time}}</span>
            </div>
          </div>
        </mt-cell-swipe>
      </li>
    </ul>
    <div style="text-align: center" v-show="hadMore" class="loadings">{{isAll}}</div>
    <!--<Prompt :messages="myMessage" v-on:ensure="isDel"></Prompt>-->
  </section>
</template>

<script>
  import commonHeader from '../../components/CommonHeader'
  import header from '../../assets/logo.png'
  import Prompt from '../../components/prompt.vue'
  import { API } from '../../service/api'
  import { InfiniteScroll } from 'mint-ui'
  import { timestampToTime } from '../../service/timestamp'
  import MtSwipeItem from '../../../node_modules/mint-ui/packages/swipe/src/swipe-item'
  import MtCellSwipe from '../../../node_modules/mint-ui/packages/cell-swipe/src/cell-swipe'
  import { Toast } from 'mint-ui'
  import { MessageBox } from 'mint-ui'
  import defaultHeader from '../../assets/img/face_200.png'
  export default {
    name: "follow",
    data() {
      return {
        teacherMessages :[],
        loading_number: 1,
        total_page: 0,
        realDeleteIndex : 0,
        fakeDeleteIndex: 0,
        isAll: '加载中...',
        myMessage: {
          isShow: false,
          tips: '不再关注这位了吗?',
          title: '确定取消关注吗?',
        },
        hadMore: false,
        follow_sum: 1,
        defaultHead: 'this.src="' + defaultHeader + '"',
        cheight: ''
      }
    },
    components:{
      MtCellSwipe,
      MtSwipeItem,
      commonHeader,
      Prompt
    },
    created(){
      // const shareFlag = "caonima";
      // JSAction.getWebShareElement(shareFlag)
    },
    methods :{
      cancel() {
         this.myMessage.isShow = true
      },
      getIndex(uid, index) {
        this.realDeleteIndex = uid
        this.fakeDeleteIndex = index

      },
      getTimestamp(timestamp) {
        return timestampToTime(timestamp)
      },
      goDetail(id) {
        var path = '/teachers?tid=' + id;
        this.$router.push({path: path});

        // this.$router.push('/teachers?tid=' + id);
      },
      isDel(data) {
        if(data) {
          API.get(`api/?method=quan.unfollow&uid=${this.realDeleteIndex}`).then(res => {
            // console.log(res)
            this.teacherMessages.splice(this.fakeDeleteIndex, 1)
          })
        }
      },
      cancelFo(id,index){
      	MessageBox.confirm('不再关注这位老师了吗？','确定取消关注吗').then(action => {
      		let method = 'quan.unfollow';
					let str = '&uid=' + id;
					const fUri = this.basePath + method + str + this.token;
					this.axios.get(fUri)
					.then(res => {
						let data = res.data.response;
						if(data.status == 200){
							this.teacherMessages.splice(index,1);
							Toast({
			          message: '取消关注成功',
			          position: 'middle',
			          duration: 1000
			        });
							let flen = this.teacherMessages.length;
							if(flen == 0){
							  this.follow_sum = "";
              }
						}else{
							MessageBox({
							  title: '提示',
							  message: data.msg,
							  showCancelButton: false
							});
						}
					})
      	});

      },
      loadMore() {
        this.loading = true
        this.loading_number++
        if(this.loading_number > this.total_page) {
          this.isAll = '到底啦!'
        }
        if(this.total_page > 1 && this.loading_number <= this.total_page) {
        	let furl = this.basePath + 'quan.followClick' + `&page=${this.loading_number}` + this.token;
        	this.axios.get(furl).then( res => {
        		setTimeout(() => {
                let last = res.data.response.teacher_list
                for(let i = 0; i < last.length; i ++) {
                  this.teacherMessages.push(last[i])
                }
                this.loading = false
              }, 500)
        	})
        }

      },
    },
    mounted() {
      this.cheight = this.getCHeight();
      //判断网络状况
      if(navigator.onLine){
        let url = this.basePath + `quan.followClick&page=${this.loading_number}` + this.token;
        this.axios.get(url).then(res => {
          res = res.data.response
          this.teacherMessages = res.teacher_list
          this.total_page = Math.ceil(res.follow_sum / 10);
          this.follow_sum = res.follow_sum;
          // console.log(this.follow_sum);
          if(this.total_page > 1){
            this.hadMore = true;
          }
        })
      }else{
        this.$router.push({path: this.offPath});
      }
    },
    metaInfo: {
      title: "关注",
      meta: [{
        name: 'xiaoheiban_disable_share',
        content: 'true'
      }]
    }
  }
</script>

<style lang="less">
  .mint-cell-wrapper {
    padding: 0;
  }
  .mint-cell-right {
    background-color: red;
  }
  .mint-cell-value {
    width: 100%;
    padding: 1vh 3vw;
    background-color: #fff;
  }
  .follow {
    margin-bottom: 5px;
  }
  .follower {
    width: 100%;
    color: #000;
  }
  .basic-message {
    /*display: flex;*/
    /*justify-content: space-between;*/
    height: 100px;
    margin-bottom: 7px;
  }
  .basic-message h2 {
    font-size: 17px;
    margin-bottom: 10px;
    font-family: PingFangSC-Regular;
    padding-top: 10px;
  }
  .basic-message ul {
    font-size: 14px;
  }
  .basic-message ul li {
    margin-bottom: 1vh;
    font-family: PingFangSC-Light;
    line-height: 19px;
    height: 56px;
    overflow: hidden;
  }
  .teacher-message {
    margin-left: 115px;
    height: 90px;
  }
  .txt-content {
    margin-top: 7px;
    background-color: #f7f7f7;
   padding-left: 10px;
   overflow: hidden;
    padding: 5.5px 0 6px 10px;
  }
  .txt-content img {
      width: 10px;
    }
  .txt-content span {
      font-size: 14px;
      display: inline-block;
      overflow: hidden;
    }
  .bottom-bar {
    font-size: 14px;
    /*line-height: 21px;*/
    padding: 10px 10px 0;
  }
  .last-update{
    /*padding-top: 3px;*/
  }
  .favorite {
    width: 12px;
    margin-right: 5px;
  }
  .txt img {
    width: 10px;
    margin-right: 5px;
    margin-left: 15px;
  }
  .last-update {
    display: inline-block;
    text-align: right;
    float: right;
  }
  .mint-cell-swipe-button {
    line-height: 22px;
    font-size: 20px;
    width: 80px;
    padding: 68px 18px 0;
    box-sizing: border-box;
    text-align: center;
  }
  .bottom-bar{
  	color: #aaa;
  	padding-right: 0;
  }
  .loadings{
  	height: 40px;
  	line-height: 40px;
  }
  .mint-cell-value{
  	padding: 15px;
  	box-sizing: border-box!important;
  }
  .basic-message h2{
  	font-family: PingFangSC-Regular;
		font-size: 17px;
		color: #000000;
		line-height: 17px;
  }
  .basic-message ul li{
  	font-family: PingFangSC-Light;
		font-size: 14px;
		color: #000000;
		line-height: 22px;
		height: 62px;
  	margin-bottom: 0;
  }
  .txt-content span{
  	font-family: PingFangSC-Light;
		font-size: 14px;
		color: #000000;
		letter-spacing: -0.34px;
  }
  .bottom-bar span{
  	font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
  }
  .noNew{
    padding-top: 55px;
  }
  .bbtxt{
    float: left;
    display: table-cell;
    vertical-align: middle;
  }
  .bottom-bar{
    overflow: hidden;
  }
</style>
