<template>
  <div style="background-color: #F7F7F7;" v-bind:style="{minHeight: cheight + 'px'}">
    <div class="teacher-detail">
      <div class="teacher-detail-header">
        <div class="basic-left">
          <img :src="teacher.teacher_img" :onerror="defaultHead">
        </div>
        <div class="teacher-message">
          <p class="teacher-name">{{teacher.teacher_name}}</p>
          <ul>
            <li>{{teacher.brief? `${teacher.brief.substring(0, 50)}...`:teacher.brief}}</li>
            <!--<li>市重点多年初三把关老师</li>-->
            <!--<li>新课标教育中心资深教师</li>-->
          </ul>
        </div>
      </div>
      <div v-html="teacherSay" class="teacher-say ql-editor" @click="hideSay">

      </div>
      <!--<div class="teacher-say">-->
      <span class="showAll" @click="showAll" v-show="isAll">显示全部</span>
      <!--</div>-->
      <div class="detail-bottom">
        <span><img src="../../../assets/img/list_txt.png">
        <span>已发表文章{{ article_sum }}篇</span></span>
        <span>
          <span>已有{{ teacher.followeds }}人关注</span>
          <img v-show="isShare != 1" :src="isFavorite?favoriteImage:favoriteImageNo" @click="cancelFollow(teacher.uid)">
          <!--<img :src="favoriteImage" @click="cancelFollow(teacher.uid)">-->
        </span>
      </div>
    </div>
    <!--<Production :teacherId="teacher.uid"></Production>-->

    <div class="products">
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10">
        <li v-for="item in articleList" class="product" @click="goArticleDetail(item.type,item.article_id)">
          <div class="list-con">
            <div class="content-right">
              <img :src="item.cover" >
              <img src="../../../assets/img/ic_video_play_video@2x.png" class="video-button" v-show="item.type == 3">
              <img src="../../../assets/img/ic_music_play_music@2x.png" class="video-button" v-show="item.type == 2">
            </div>
            <div class="product-content content-left">
              <p>{{item.title}}</p>
              <div class="product-bar">
                <span>{{item.comments}}评论</span>
                <!--<span v-if="item.integration != 'ok'">{{item.points}}积分</span>-->
                <!--<span class="isHave" v-if="item.integration === 'ok'"><img src="../../../assets/img/ic_buy.png"><a>已购</a></span>-->
                <span>{{item.update_time}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div style="text-align: center" class="loadings" v-show="hadMore">{{txt}}</div>
    </div>
  </div>
</template>

<script>
  import headers from '../../../assets/logo.png'
  import Production from '../../../components/production.vue'
  import heartOK from '../../../assets/img/list_follow_ok.png'
  import heartNO from '../../../assets/img/list_follow.png'
  import {Toast} from 'mint-ui';
  import {API} from '../../../service/api'
  import favorite from '../../../assets/img/list_follow.png'
  import favoriteOK from '../../../assets/img/list_follow_ok.png'
  import { MessageBox } from 'mint-ui'
  import defaultHeader from '../../../assets/img/face_200.png'

  export default {
    components: {Production},
    data: () => ({
      teacher: {uid: window.location.href.split('?')[1]},
      isFollow: 0,
      isAll: false,
      followImage: heartNO,
      article: false,
      teacherSay: '',
      uid: '',
      articleList: [],
      loading: false,
      loadingNumber: 0,
      totalPage: 1,
      txt: '加载中...',
      hadMore: false,
      favoriteImage: favoriteOK,
      favoriteImageNo: favorite,
      isFavorite: false,
      article_sum:0,
      isShare: 0,
      defaultHead: 'this.src="' + defaultHeader + '"',
      cheight: ''
    }),
    methods: {
      showAll() {
        this.teacherSay = this.teacher.description;
        this.isAll = false
      },
      //收起展示详情
      hideSay() {
        this.teacherSay = this.teacher.description.substring(0, 67) + '...';
        this.isAll = true
      },
      //关注or取消
      cancelFollow(uid) {
        let method;
        if (this.isFavorite) {
          method = 'quan.unfollow';
        } else {
          method = 'quan.follow';
        }
        let str = '&uid=' + uid;
        const fUri = this.basePath + method + str + this.token;
        this.axios.get(fUri)
          .then(res => {
            let data = res.data.response;
            if (data.status == 200) {
              if (this.isFavorite == false) {
                Toast({
                  message: '关注成功,教师圈将会优先推荐他的文章',
                  // duration: -1
                });
                ++this.teacher.followeds;
                this.returnIndex = true;
              } else {
                Toast('取消关注成功');
                --this.teacher.followeds;
              }
              this.isFavorite = !this.isFavorite;
            }else{
              MessageBox({
                title: '提示',
                message: data.msg,
                showCancelButton: false
              });
            }

          })

      },
      getUid() {
        console.log(this.uid);
      },
      //获取教师详情
      getData(page) {
        let method = 'quan.teacherDetail';
        let str = '&uid=' + this.uid + '&page=' + page;
        const url = this.basePath + method + str + this.token;
        this.axios.get(url).then(res => {
          if (res.data.response.is_follow === 1) {
            this.followImage = heartOK
          }
          if (res.data.response.article_list.length > 0) {
            this.article = true
          }
          this.teacher = res.data.response.teacher_detail;
          if (this.teacher.description.length >= 67) {
            this.teacherSay = this.teacher.description.substring(0, 67) + '...';
            this.isAll = true
          }

          this.articleList = this.articleList.concat(res.data.response.article_list)
          this.totalPage = Math.ceil(res.data.response.article_sum/10);
          this.isFavorite = res.data.response.is_follow == 0 ? false : true;
          // console.log(this.isFavorite)
          this.isShare = res.data.response.is_share;
          if(this.totalPage == 0){
            this.txt = '暂无文章!'
            this.loading = true;
          }
        }, (err) => {
        })
      },
      loadMore() {
        this.loading = false;
        this.loadingNumber++;
        if (this.loadingNumber > this.totalPage) {
          this.txt = '到底啦!'
          this.loading = true;
        }
        if (this.totalPage > 1 && this.loadingNumber <= this.totalPage) {
          this.getData(this.loadingNumber);
        }
      },
      goArticleDetail(type, id) {
        type = parseInt(type);
        let arurl = '';
        switch (type) {
          case 1:
            let path = '/article?aid=' + id;
            this.$router.push({path: path});
            // this.$router.push('/article?aid=' + id);
            break;
          case 2:
            let path1 = '/audio?aid=' + id;
            this.$router.push({path: path1});
            // this.$router.push('/audio?aid=' + id);
            break;
          case 3:
            let path2 = '/video?aid=' + id;
            this.$router.push({path: path2});
            // this.$router.push('/video?aid=' + id);
        }
      }
    },
    mounted() {
      this.cheight = this.getCHeight();
      //判断网络状况
      this.uid = this.GetQueryString('tid');
      if(navigator.onLine){
        this.getData(1);
      }else{
        this.$router.push({path: this.offPath});
      }
      /*window.addEventListener("popstate", function(e) {
        console.log('back...');
        window.history.back();
      }, false);*/
    },
    metaInfo: {
      title: "教师详情",
      content: ""
    }
  }
</script>

<style lang="scss" scoped>
  .teacher-detail {
    padding: 4vw;
    background-color: #fff;
  }

  .teacher-detail-header {
    .basic-left{
      float: left;
    }
    img {
      height: 100px;
      width: 100px;
    }
  }

  .teacher-message {
    height: 100px;
    margin-left: 115px;
    .teacher-name {
      font-family: PingFangSC-Regular;
      font-size: 17px;
      height: 3vh;
    }
    ul {
      margin-top: 10px;
      font-family: PingFangSC-Light;
      font-size: 14px;
      height: 66px;
      overflow: hidden;
      li {
        margin-bottom: 1vh;
      }
    }
  }

  .teacher-say {
    font-size: 14px;
    margin-top: 2vh;
    line-height: 20px;
  }

  .showAll {
    color: #259BDA;
  }

  .detail-bottom {
    font-size: 14px;
    width: 100%;
    border-top: 1px solid #EDEDED;
    /*margin-top: 15px;*/
    padding-top: 15px;
    margin-right: 0;
    display: flex;
    justify-content: space-between;
    span {
      &:first-of-type {
        img {
          width: 10px;
        }
      }
      &:last-of-type {
        img {
          width: 15px;
        }
      }
    }
  }

  .products {
    margin-top: 10px;
  }

  .product {
    background-color: #fff;
    margin-bottom: 5px;
  }

  .product-content p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  .product img {
    width: 86px;
    height: 86px;
  }

  .product-bar {
    font-size: 14px;
    color: #AAA;
    width: 100%;
    position: absolute;
    bottom: 3px;
  }

  .product-bar span:last-of-type {
	  display: inline-block;
	  float: right;
  }

  .isHave img {
    width: 3vw;
    height: 2vh;
  }

  .loadings img {
    height: 30px;
    width: 30px;
    animation: loading 1000ms infinite linear;
    margin-right: 10px;
  }

  @keyframes loading {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
	.teacher-message .teacher-name{
		font-family: PingFangSC-Regular;
		font-size: 17px;
		color: #000000;
		line-height: 17px;
    padding-top: 8px;
	}
	.teacher-message ul li{
		font-family: PingFangSC-Light;
		font-size: 14px;
		color: #000000;
		line-height: 22px;
	}
	.detail-bottom{
		font-family: PingFangSC-Light;
		font-size: 14px;
		color: #000000;
		line-height: 14px;
	}
	.product-content p{
		font-family: PingFangSC-Light;
		font-size: 17px;
		color: #000000;
		letter-spacing: -0.41px;
		line-height: 21px;
	}
	.product-bar{
		font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		line-height: 14px;
	}
	.teacher-say{
		font-family: PingFangSC-Light;
		font-size: 14px;
		color: #000000;
		line-height: 20px;
    padding-bottom: 15px;
	}
	.showAll{
		display: inline-block;
    float: right;
    margin-top: -30px;
    font-family: PingFangSC-Light;
		font-size: 14px;
		color: #259BDA;
		margin-right: 7px;
	}
  .content-left{
    margin-right: 101px;
    position: relative;
    height: 86px;
  }

  .content-right{
    position: relative;
  }
  .video-button{
    width: 25px!important;
    height: 25px!important;
    position: absolute;
    left: 32px;
    bottom: 30px;
  }
</style>
