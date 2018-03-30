<template>
  <!--<section>-->
    <div class="main" v-bind:style="{height: cheight + 'px'}">
      <div class="search-head">
        <button class="btn" @click="search()" v-bind:class="{'active': isActive}" ref="btn">搜索</button>
        <div class="search-left">
          <input v-if="isIOS" style="padding: 7px 0 8px;" type="text" class="content" placeholder="请输入教师名称或文章关键字" @change="txt" v-model="searchContent">
          <input v-if="isAND" style="padding: 9px 0 8px;" type="text" class="content" placeholder="请输入教师名称或文章关键字" @change="txt" v-model="searchContent">
          <i class="search left"></i>
          <i class="clearIn" @click="cleartxt" v-show="isActive"></i>
        </div>
      </div>
      <div class="search-body">
        <!--默认页面-->
        <p class="search-first" v-show="origin">您可以搜索文章标题、内容、作者的关键字</p>

        <!--没有内容-->
        <div class="search-null" v-show="!origin&!results">
          <img src="../../assets/img/ic_blank_search.png" style="width:168px;height:123px;">
          <div>
            <p>没有符合关键字的搜索结果</p>
            <p>请更换输入其他关键字后重试</p>
          </div>
        </div>
        <!--有内容-->
        <div class="search-some" v-show="!origin&results" :style="{'-webkit-overflow-scrolling': scrollMode}">
          <h5 class="some-title">搜索结果</h5>
          <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" :bottomDropText="'加载中...'">
          <!--文章列表-->
            <div>
            <ul class="index-list">
              <li  v-for="item in articleList" @click="getDetails(item.type,item.article_id)">
                <div class="list-con">
                  <div class="list-head">
                    <!--<img :src="item.img" :onerror="defaultHead" class="head-image">-->
                    <img :src="item.img" :onerror="defaultHead" class="head-image">
                    <span class="head-name">{{item.user_name}}</span>
                    <span class="head-time">{{item.update_time}}</span>
                  </div>
                  <div class="list-content">
                    <div class="content-right">
                      <img :src="item.cover" class="content-image">
                      <img src="../../assets/img/ic_video_play_video.png" class="video-button" v-show="item.type == 3">
                    </div>
                    <div class="content-left">
                      <div v-if="isIOS" class="content-word" v-html="item.title.replace(searchContent,`<span style='display: inline-block;color: #F8E71C;margin-top: -4px;'>${searchContent}</span>`)"></div>
                      <div v-if="isAND" class="content-word" v-html="item.title.replace(searchContent,`<span style='display: inline-block;color: #F8E71C;margin-top: 0px;'>${searchContent}</span>`)"></div>
                      <div class="content-bottom">
                        <span class="content-comment">{{item.comments | comments(item.comments)}}评论</span>
                        <!--<span class="content-integral" v-if="item.is_charge>0">{{item.points}}积分</span>-->
                        <!--<span class="content-integral" v-else-if="item.buyState<0"><i class="is-buy" style="top:50%;margin-top:-4px;"></i>&nbsp;&nbsp;&nbsp;已购</span>-->
                        <!--<span class="content-integral" v-else-if="item.is_charge==0">免费</span>-->
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!--教师列表-->
          </v-loadmore>
        </div>
      </div>
    </div>
  <!--</section>-->
</template>

<script>
  import { API } from '../../service/api';
  import { Loadmore } from 'mint-ui';
  import defaultHeader from '../../assets/img/face_200.png'
  export default {
    name: "search",
    components:{'v-loadmore':Loadmore},
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
      comments:function (num) {
        if(num>=1000){
          return (num/10000).toFixed(1) + '万'
        }else{
          return num
        }
      },
      signKey: function(title){
        let str = '<span class="sKey">' + this.searchContent + '</span>';
        return title.replace(this.searchContent,str)
      }
    },
    data(){
      return{
        searchContent:'',
        articleList:[],
        teacherList:[],
        origin: true,
        results: false,
        allLoaded: false, //false可以上拉，true为禁止上拉
        scrollMode:"auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        totalPage:0,
        page: 1,
        isActive: false,
        isAND:false,
        isIOS:false,
        defaultHead: 'this.src="' + defaultHeader + '" ',
        uagent: 'isAND',
        cheight: '300'
      }
    },
    watch:{
      searchContent(searchContent) {
        if(searchContent!==''){
          this.isActive = true;
        }else{
          this.isActive = false;
        }
      }
    },
    methods:{
      search(word){
        //判断网络状况
        if(!navigator.onLine){
          this.$router.push({path: this.offPath});
          return false;
        }
        const search = 'quan.searchClick';
        const baseUrl = 'http://quan-dev.xiaoheiban.cn/api/?method=';
        const keyword = word ||this.searchContent;
        let surl = this.basePath + 	`${search}&keyword=${keyword}&page=1` + this.token;

        this.axios.get(surl).then(res => {
         console.log('search res:',res);
          this.origin = false;
          this.totalPage = Math.ceil(res.data.response.total_num/10);
          this.articleList = res.data.response.article_list;
          if(res.data.response.article_list.length<=0){
            this.results = false;
          }else{
            this.results = true;
          }
        },(err)=>{
          console.log(err);
        })
      },
      getDetails(type,id){
        type = parseInt(type);
				let arurl = '';
        switch (type) {
          case 1:
            var path = '/article?aid=' + id;
            this.$router.push({path: path});
            break;
          case 2:
            var path = '/audio?aid=' + id;
            this.$router.push({path: path});
            break;
          default:
            var path = '/video?aid=' + id;
            this.$router.push({path: path});
        }
	  	},
      loadBottom:function() {
        // 上拉加载
        this.more();// 上拉触发的分页查询
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      loadPageList:function (){
          // 是否还有下一页，加个方法判断，没有下一页要禁止上拉
          // this.isHaveMore(data.result.haveMore);
          // this.pageList = data.result.pageList;
          this.$nextTick(function () {
            this.scrollMode = "touch";
          });

      },
      more:function (){
        // 分页查询
        var haveMore = true;
        if(this.totalPage>this.page){
          this.page++
        }else {
          haveMore = false;
        }
        const search = 'quan.searchClick';
        const baseUrl = 'http://quan-dev.xiaoheiban.cn/api/?method=';
        const keyword = this.searchContent;
        let msurl = this.basePath + `${search}&keyword=${keyword}&page=${this.page}` + this.token;

        this.axios.get(msurl).then(res => {
          this.origin = false;
          if(haveMore){
            this.articleList = this.articleList.concat(res.data.response.article_list);
          }
          this.isHaveMore(haveMore);
          if(res.data.response.article_list.length<=0){
            this.results = false;
          }else{
            this.results = true;
          }
        },(err)=>{
          console.log(err);
        })
      },
      isHaveMore:function(isHaveMore){
        this.allLoaded = true; //true是禁止上拉加载
        if(isHaveMore){
          this.allLoaded = false;
        }
      },
      txt() {
        window.sessionStorage.setItem('keywords',this.searchContent);
        console.log('txt:',this.searchContent);
      },
      cleartxt (){
        window.sessionStorage.clear();
        this.searchContent = '';
      }
    },
    mounted() {
      this.cheight = this.getCHeight();

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
    created() {
      if(!window.sessionStorage.getItem('keywords')){
        this.results = true;
      }else{
        var w = window.sessionStorage.getItem('keywords');
        this.search(w);
        this.searchContent = w;
      }

    },
    metaInfo: {
      title: "搜索",
      meta: [{
        name: 'xiaoheiban_disable_share',
        content: 'true'
      }]
    }

  }
</script>

<style scoped>
  .video-button {
    width: 25px;
    height: 25px;
    position: absolute;
    right: 43px;
    top: 85px;
  }
.main{
  width: 100%;
  height: 100%;
  background-color: rgb(247,247,247);
  font-family: PingFangSC-Light;
}
.main .search-head{
  background-color: #fff;
  position: relative;
  padding: 7px 15px;
}
input::placeholder{
  font-size: 14px;
  color: #aaa;
  font-family: PingFangSC-Light;
}
.main .content{
  width: 100%;
  border-radius: 2px;
  background-color: #f8f8f8;
  font-size: 14px;
  text-indent: 33px;
  padding: 8px 0;
}
.left{
  z-index: 10;
  position: absolute;
  left: 10px;
  top: 6px;
}
.btn{
  float: right;
  width: 60px;
  height: 32px;
  border-radius: 2px;
  background-color: #ddd;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #AAAAAA;
  line-height: normal;
}

.search-body{
  /*text-align: center;*/
}
.search-first{
  color: #aaa;
  font-size: 14px;
  padding-top: 30px;
  text-align: center;
}
.search-null{
  margin-top: 50px;
  text-align: center;
}
.search-null div{
  padding-top: 25px;
}
.search-null p{
  display: block;
  font-family: PingFangSC-Light;
  font-size: 17px;
  line-height: 21px;
  color: #aaa;
}
  .search-some{
  }
.search-some .some-title{
  height: 14px;
  font-size: 14px;
  width: 100%;
  color: #aaa;
  background-color: #f8f8f8;
  padding: 10px 0;
  text-indent: 15px;
}
.index-list li{
  width: 100%;
  height: 154px;
  background-color: #fff;
  margin-bottom: 6px;
  position: relative;
}
/*.index-list .list-head{
  position: relative;
  top: 14px;
  color: #aaa;
  font-size: 14px;
  padding-left: 15px;
  height: 28px;
  line-height: 28px;
  width: 100%;
}
.index-list .list-head .head-image{
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.index-list .list-head .head-name{
  margin-left: 5px;
}
.index-list .list-head .head-time{
  position: absolute;
  right: 30px;
  top: 2px;
}
.index-list .list-content .content-word{
  width: 244px;
  height: 42px;
  font-size: 17px;
  position: absolute;
  left: 15px;
  top: 53px;
}
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
  position: absolute;
  right: 15px;
  top: 53px;
}
*/
.detail-main{
  margin-top: 5px;
  width: 100%;
  height: 159px;
  background-color: #fff;
  border-radius: 2px;
}
.detail-main .detail-top{
  padding: 15px;
  height: 100px;
}
.detail-main .detail-top .head-image{
  width: 100px;
  height: 100px;
  margin-right: 15px;
}
.detail-main .detail-top .detail-word{
  display: inline-block;
}
 .teacherCircle-container .top-nav li span{
  	font-family: PingFangSC-Light;
		font-size: 17px;
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
		line-height: 14px;
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
  .search{
    background: url("../../assets/img/search87.png") center center no-repeat;
    background-size: 13px;
  }
  .search-left{
    overflow: hidden;
    position: relative;
    margin-right: 70px;
  }
  .active{
    background: #F8E71C!important;
    color: #000!important;
  }
  .clearIn{
    display: inline-block;
    width: 16px;
    height: 32px;
    position: absolute;
    right: 10px;
    top: 0;
    background: url("../../assets/img/ic_input_box_clean_nor@2x.png") center center no-repeat;
    background-size: 16px;
  }
  .sKey{
    color: #F8E71C;
  }
  .searchContent{
    color: #F8E71C;
  }
</style>
