<template>
  <section style="background: #F7F7F7;" v-bind:style="{minHeight: cheight + 'px'}">

    <div v-if="outline" class="noFollow">
      <img src="../../assets/img/ic_blank_wifi@2x.png" alt="">
      <p>网络连接不给力，请确认后重试</p>
    </div>

    <div v-else class="teacherCircle-container">
    	<mt-loadmore :top-method="loadTop" ref="loadmore">
      <!--轮播图-->
      <mt-swipe :auto="4000" class="swipeContent">
        <mt-swipe-item v-for="item in swipeImage" :key="item.ad_id">
          <!--<a :href="item.link"><img :src="item.ad_img" alt=""></a>-->
          <img :src="item.ad_img" @click="goNewPage(item.link)" style="width:100%" />
          <!-- <div :style="{background:`url(${item.ad_img})`,backgroundSize:'cover',backgroundRepeat:'no-repeat',backgroundPositon:'center',paddingTop:'36.5%'}"></div> -->
        </mt-swipe-item>
      </mt-swipe>

      <!--跳转链接-->
      <div class="top-nav">
        <ul>
          <li>
            <div @click="goNext('search')">
              <img src="../../assets/img/ic_search.png" alt="">
              <span class="font">搜索</span>
            </div>
          </li>
          <li>
            <div @click="goNext('follow')">
              <img src="../../assets/img/ic_follow.png" alt="">
              <span class="font">关注</span>
            </div>
          </li>
          <li>
            <div @click="goNext('favorite')">
              <img src="../../assets/img/ic_favorite.png" alt="">
              <span class="font">收藏</span>
            </div>
          </li>
          <div class="clearfix"></div>
        </ul>
      </div>

      <!--列表-->
      <div class="index-list-con">
        <ul class="index-list">
          <li @click="getDetails(item.type,item.article_id)" v-for="item in indexList">
            <div class="list-con">
              <div class="list-head">
                <img :src="item.img" :onerror="defaultHead" class="head-image">
                <span class="head-name">{{item.user_name}}</span>
                <span class="head-time">{{item.update_time}}</span>
              </div>
              <div class="list-content">
                <div class="content-right">
                  <img :src="item.cover" class="content-image">
                  <img src="../../assets/img/ic_video_play_video@2x.png" class="video-button" v-show="item.type == 3">
                  <img src="../../assets/img/ic_music_play_music@2x.png" class="video-button" v-show="item.type == 2">
                </div>
                <div class="content-left">
                  <p class="content-word">{{item.title}}</p>
                  <div class="content-bottom">
                    <span class="content-comment">{{item.comments}}评论</span>
                    <!--<span class="content-integral" v-if="item.points>0">{{item.points}}积分</span>
                    <span class="content-integral" v-else-if="item.points<0"><i class="is-buy" style="top:50%;margin-top:-4px;"></i>&nbsp;&nbsp;&nbsp;已购</span>
                    <span class="content-integral" v-else-if="item.points==0">免费</span>-->
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!--明师推荐-->
      <div class="recommend-list" v-show="followList.length > 0">
        <h5 class="recommend-title">不可错过的名师推荐   <span>测试版本号：1.0.0.1</span></h5>
        <div class="recommend-all">
          <ul class="recommend-content"
              id="teacher-list"
		          v-infinite-scroll="loadTeacher"
		          infinite-scroll-disabled="isloading"
		          infinite-scroll-distance="0"
		          infinite-scroll-immediate-check = true
              ref="teacher_list">
            <li class="recommend-detail" v-for="(item,index) in followList" :key="item.id" @click="goTeacherDetail(item.uid)">
              <div class="detail-top">
                <img :src="item.teacher_img" class="recommend-headImage">
                <!--<img :src="item.teacher_img" onerror="src=''../../../assets/img/bg.png''" class="recommend-headImage">-->
                <h5>{{item.teacher_name}}</h5>
              </div>
              <p>{{item.brief?item.brief.substring(0, 17):''}}</p>
              <div class="recommend-follow" >
                <p>{{item.followeds}}人关注</p>
                <button @click.stop="follow(item,index)" class="follow-btn" v-if="item.is_follow == 0"><i class="follow-heart"></i><span>关注</span></button>
                <button @click.stop="unFollow(item,index)" class="btn-ok" v-else><i class="follow-ok"></i></button>
              </div>
            </li>
            <li v-show="hadMore" class="teacher_loading" ref="loading" >{{ teacher_loading }}</li>
          </ul>
        </div>
      </div>
        <ul
         v-infinite-scroll="more"
         infinite-scroll-disabled="isloading"
         infinite-scroll-distance="0"
         infinite-scroll-immediate-check = true
         class="index-list">
          <li @click="getDetails(item.type,item.article_id)" v-for="item in bottomList">
            <div class="list-con">
              <div class="list-head">
                <img :src="item.img" :onerror="defaultHead" class="head-image">
                <span class="head-name">{{item.user_name}}</span>
                <span class="head-time">{{item.update_time}}</span>
              </div>
              <div class="list-content">
                <div class="content-right">
                  <img :src="item.cover" class="content-image">
                  <img src="../../assets/img/ic_video_play_video@2x.png" class="video-button" v-show="item.type == 3">
                  <img src="../../assets/img/ic_music_play_music@2x.png" class="video-button" v-show="item.type == 2">
                </div>
                <div class="content-left">
                  <p class="content-word">{{item.title}}</p>
                  <div class="content-bottom">
                    <span class="content-comment">{{item.comments}}评论</span>
                    <!--<span class="content-integral" v-if="item.points>0">{{item.points}}积分</span>
                    <span class="content-integral" v-else-if="item.points<0"><i class="is-buy" style="top:50%;margin-top:-4px;"></i>&nbsp;&nbsp;&nbsp;已购</span>
                    <span class="content-integral" v-else-if="item.points==0">免费</span>-->
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div style="text-align: center" class="loadings">{{isAll}}</div>
      </mt-loadmore>
    </div>
  </section>
</template>

<script>
  import { API } from '../../service/api'
  import { Toast } from 'mint-ui'
  import { MessageBox } from 'mint-ui'
  import defaultHeader from '../../assets/img/face_200.png'

  export default {
    name: "index",
    data(){
          return {
            swipeImage: [],
            followList:[],
            indexList:[],
            bottomList:[],
            current_page: 1,
            bottomStatus: 'loading',
            allLoaded: true,
            current_teacher_page: 1,
            total_teacher_page: 1,
            teacher_loading: '加载中',
            isFollow: false,
            teacherPage: '',
            isloading: false,
            isAll:'',
            total_article_page: 1,
            returnInde: false,
            hadMore: false,
            outline: false,
            defaultHead: 'this.src="' + defaultHeader + '"',
            cheight: ''
          }
    },
    watch: {
    },
    methods:{
      //下拉刷新
      loadTop() {
      	window.location.reload();
      	this.returnIndex = true;
      },
      //轮播图跳转
      goNewPage(url){
        JSAction.openUrl(url);
      },
      //滚动加载名师推荐列表
      loadTeacher() {
				this.isloading = true;
        if(this.current_teacher_page >= this.total_teacher_page) {
          this.teacher_loading = '到底啦!';
          return;
        }else{
        	this.current_teacher_page ++
        	let uuurl = this.basePath + 'quan.unfollowTeachersList' + `&page=${this.current_teacher_page}&type=2` + this.token;
//        API.get(`api/?method=quan.unfollowTeachersList&page=${this.current_teacher_page}&type=2`)
          this.axios.get(uuurl)
          .then(res => {
              for(let i = 0; i<res.data.response.teacher_list.length; i++) {
              this.followList = this.followList.concat(res.data.response.teacher_list)
              this.isloading = false;
            }
          })
        }
      },
      //跳转至名师详情
      goTeacherDetail(id) {
      	if(this.useragent == 0){
      		var path = '/teachers?tid=' + id;
		      this.$router.push({path: path});
      	}else{
      		const teacherUrl = this.jsPath + `teachers?tid=${id}`
        	JSAction.openUrl(teacherUrl)
      	}
      },
      //跳转至文章详情
      getDetails(type,id){
        type = parseInt(type);
//    	console.log(type);
				let arurl = '';
				if(this.useragent == 0){
					switch (type) {
		        case 1:
		          let path = '/article?aid=' + id;
		          this.$router.push({path: path});
		          break;
		        case 2:
		          let path1 = '/audio?aid=' + id;
		          this.$router.push({path: path1});
		          break;
		        case 3:
		          let path2 = '/video?aid=' + id;
		          this.$router.push({path: path2});
		     	}
				}else{
					switch (type) {
		        case 1:
		          arurl = this.jsPath + `article?aid=${id}`;
		          JSAction.openUrl(arurl);
		          break;
		        case 2:
		          arurl = this.jsPath + `audio?aid=${id}`;
		          JSAction.openUrl(arurl);
		          break;
		        case 3:
		          arurl = this.jsPath + `video?aid=${id}`;
		          JSAction.openUrl(arurl);
		     	}
				}
      },
      //搜索、关注、收藏跳转
      goNext(path) {
				if(this.useragent == 0){
					this.$router.push({path: path});
				}else{
					let url = this.jsPath + `${path}`;
         	JSAction.openUrl(url)
				}
      },
      //关注名师
      follow(item,index){
				let method = 'quan.follow';
				let str = '&uid=' + item.uid;
				const fUri = this.basePath + method + str + this.token;
				this.axios.get(fUri)
				.then(res => {
					let data = res.data.response;
					if(data.status == 200){
						this.followList[index].is_follow = 1;
						Toast({
		          message: '关注成功',
		          position: 'middle',
		          duration: 1000
		        });
					}else{
						MessageBox({
						  title: '提示',
						  message: data.msg,
						  showCancelButton: false
						});
					}
				})
      },
      //取消关注名师
      unFollow(item,index) {
      	let method = 'quan.unfollow';
				let str = '&uid=' + item.uid;
				const fUri = this.basePath + method + str + this.token;
				this.axios.get(fUri)
				.then(res => {
					console.log(res);
					let data = res.data.response;
					if(data.status == 200){
						this.followList[index].is_follow = 0;
						Toast({
		          message: '取消关注成功',
		          position: 'middle',
		          duration: 1000
		        });
					}else{
						MessageBox({
						  title: '提示',
						  message: data.msg,
						  showCancelButton: false
						});
					}
				})
      },
      //上拉加载
      loadBottom() {
        //this.more();
        //this.allLoaded = true;// 若数据已全部获取完毕
        this.$refs.loadmore.onTopLoaded();
      },
      //上拉加载请求
      more() {
        this.isloading = true;
        this.current_page++;
        if(this.current_page > this.total_article_page) {
          this.isAll = '到底啦!';
          return;
        }else{
        	let aaurl = this.basePath + `quan.articleList&page=${this.current_page}&type=2` + this.token;
          this.axios.get(aaurl)
          .then(res => {
          	if(res.data.response.status == 200){
	              for(let i = 0; i<res.data.response.article_list.length; i++) {
	              this.bottomList.push( res.data.response.article_list[i] )
	              this.isloading = false;
	            }
          	}
          })
        }

      },
      //初始化数据
      fetchData() {
      	let method = 'quan.index';
				const url = this.basePath + method + this.token;
				this.axios.get(url)
	      .then(res => {
	        // if(res.data.status){}
	        res = res.data.response;
	        this.swipeImage = res.ad_list;
	        this.indexList = res.article_list.slice(0, 2);
	        this.followList = res.teacher_list;
	        this.total_teacher_page = Math.ceil(res.teacher_sum / 10);
	        this.total_article_page = Math.ceil(res.aiticle_sum / 10);

	        if(this.total_teacher_page > 1){
	        	this.hadMore = true;
	        }
	        this.bottomList = res.article_list.slice(2,res.article_list.length);
	      })
      },
    },
    //初始加载
    mounted() {
      this.cheight = this.getCHeight();
      this.fetchData();
    },
  }
  function returnIndex() {
  	alert('return index');
  }
//returnIndex();
</script>

<style scoped>
/*修复字体*/
  .font{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #030303;
  }
  .video-button {
    width: 40px;
    height: 40px;
    position: absolute;
    opacity: 0.8;
    left: 50%;
    top: 50%;
    margin: -20px 0 0 -20px;
  }
  .music-button {
    width: 40px;
    height: 40px;
    position: absolute;
    opacity: 0.8;
    left: 50%;
    top: 50%;
    margin: -20px 0 0 -20px;
  }
  .swipeContent {
    width: 100%;
    /*height: 19vh;*/
   height: 126px;
   text-align: center;
  }

  .swipeContent img {
    /*height: 19vh;*/
   height: 126px;
    width: 100%;
    border: none;
  }

  .index-list li {
    width: 100%;
    height: 154px;
    background-color: #fff;
    margin-top: 6px;
    position: relative;
  }

  .recommend-list {
    width: 100%;
    height: 249px;
    background-color: #fff;
    margin-top: 5px;
    color: #aaa;
  }

  .recommend-list .recommend-title {
    padding: 15px 0 0 15px;
    font-size: 14px;
  }

  .recommend-list .recommend-all {
    box-sizing: border-box;
    height: 200px;
    overflow-y: hidden;
  }

  .recommend-list .recommend-content {
    width: 100%;
    display: -webkit-box;
    -webkit-overflow-scrolling: touch;
  }

  .recommend-list .recommend-content .recommend-detail {
    width: 138px;
    height: 185px;
    margin-top: 20px;
    text-align: center;
    position: relative;
    margin-bottom: 2px;
  }

  /*.recommend-list .recommend-content .recommend-detail::after {}*/
.index-list .list-content .content-bottom{
  color: #aaa;
  font-size: 14px;
  position: absolute;
  left: 15px;
  bottom: 16px;
}
.index-list .list-content .content-bottom .content-comment{
  margin-right: 20px;
}
.index-list .list-content .content-image{
  width: 86px;
  height: 86px;
}
.recommend-list{
  width: 100%;
  height: 249px;
  background-color: #fff;
  margin-top: 5px;
  color: #aaa;
  overflow-y: hidden;
}
.recommend-list .recommend-title{
  padding: 15px 0 0 15px;
  font-size: 14px;
}
.recommend-list .recommend-all{
  box-sizing: border-box;
  height: 200px;
}
.recommend-list .recommend-content{
  width: 100%;
  display: -webkit-box;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.recommend-list .recommend-content .recommend-detail{
  width: 138px;
  height: 185px;
  margin-top: 20px;
  text-align: center;
  position: relative;
  margin-bottom: 2px;
}
  .recommend-list .recommend-content .recommend-detail::after{
    content: "";
    width: 1px;
    height: 149px;
    background-color: #EDEDED;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
  }

  .recommend-content .recommend-detail .recommend-headImage {
    width: 60px;
    height: 60px;
    border-radius: 93px;
  }

  .recommend-content .recommend-detail h5 {
    color: #000;
    font-size: 17px;
    margin-top: 5px;
  }

  .recommend-content .recommend-detail p {
    font-size: 12px;
    color: #888;
    height: 26px;
    padding: 6px 6px 0;
    line-height: 16px;
  }

  .recommend-content .recommend-follow {
    position: relative;
  }

  .recommend-content .recommend-follow p {
    font-size: 14px;
    color: #aaa;
    padding: 0;
  }
  .recommend-content .recommend-detail .recommend-follow p{
  	height: 20px;
  	line-height: 20px;
  	margin-top: 13px;
  }

  .recommend-content .recommend-follow .follow-btn {
    /*margin-top: 5px;*/
    background-color: #F8E71C;
    border-radius: 30px;
    width: 65px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #000;
    position: relative;
    margin-bottom: 5px;
  }

  .recommend-content .recommend-follow .follow-btn i {
    left: 10px;
    top: 50%;
    margin-top: -5px;
  }

  .recommend-content .recommend-follow .follow-btn span {
    margin-left: 15px;
  }

  .btn-ok {
    border: 1px #F8E71C solid;
    background-color: #fff;
    /*margin-top: 5px;*/
    border-radius: 30px;
    width: 65px;
    height: 28px;
    position: relative;
  }

  .recommend-content .recommend-follow .btn-ok i {
    left: 50%;
    margin-left: -8px;
    top: 50%;
    margin-top: -6px;
  }

  .teacher_loading {
    width: 80px;
    padding-top: 20%;
    text-align: center;
    font-size: 14px;
  }
  .mint-swipe-indicator{
  	opacity: 0.7;
  }
  .mint-swipe-indicator.is-active{
  	/*width: 10px;*/
  }
  .hidden{
  	display: none!important;
  }
  .teacherCircle-container .top-nav li img{
  	width: 20px;
  	height: 20px;
  }
  .index-list .list-head span{
  	font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		/*line-height: 14px;*/
  }
  .index-list .list-content .content-word{
  	font-family: PingFangSC-Light;
		font-size: 17px;
		color: #000000;
		letter-spacing: -0.41px;
		line-height: 21px;
  }
  .index-list .list-content .content-bottom{
  	font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		line-height: 14px;
  }
  .recommend-list .recommend-title{
  	font-family: STHeitiSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
  }
  .recommend-content .recommend-detail h5{
  	font-family: PingFangSC-Regular;
		font-size: 17px;
		color: #000000;
		letter-spacing: -0.41px;
		line-height: 21px;
  }
  .recommend-content .recommend-detail p{
  	font-family: PingFangSC-Light;
		font-size: 12px;
		color: #888888;
		letter-spacing: 0;
		line-height: 16px;
  }
  .recommend-content .recommend-detail .recommend-follow p{
  	font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		line-height: 14px;
  }
  .recommend-content .recommend-follow .follow-btn{
  	font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #000000;
		letter-spacing: -0.34px;
		line-height: 14px;
  }
</style>
