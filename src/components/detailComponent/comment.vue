
<template>
  <div class="comment-content" id="commentCon">
    <h3>评论区</h3>
    <div class="comment-list-container" v-bind:class="{'commentHeight' : isCH}">
      <ul class="comment-list"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled = "false"
          infinite-scroll-distance="0"
          infinite-scroll-immediate-check = true>
        <li v-for="(item,index) in article_comment_list" class="comment">
          <label>
            <span v-if="item.from_username != ''">{{item.from_username}}</span>
            <span v-else>匿名</span>
            <span v-show="item.type == 2">
              <a style="color: #AAAAAA">回复</a>
              <a v-if="item.to_username != ''">{{item.to_username}}</a>
              <a v-else>匿名</a>
            </span>：
          </label>
          <span class="contents">{{item.content}}</span>
          <div class="comment-bar">
            <span class="bar-0">{{item.create_time}}</span>
            <span class="bar-1" v-show="is_show === 1" @click.stop="isUp(item.article_id,item.comment_id, item.status,index)"><span v-if='item.status == "3"' style="color: #FF3B30;">{{commentStatus(item.status)}}</span><span v-if='item.status == "2"'>{{commentStatus(item.status)}}</span><span v-if="item.status == '1'" class='blcakt'>{{commentStatus(item.status)}}</span></span>
            <span class="bar-2" v-show="isShare != 1" @click="openCommentBox(1,item.from_username, item.comment_id)">回复</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="comment-bottom" v-show='hadMore'>——到底啦——</div>
    <div class="reply-bar" v-show="isShare != 1">
      <div class="reply-right">
        <img :src="isFavorite?favoriteImage:favoriteImageNo" class="comment-favorite" @click="isFavorited">
      </div>
      <div class="reply-left">
        <div class="inRight">
          <a href="#commentCon">
            <span>
              <img src="../../assets/img/comment_ic.png">
              <a style="vertical-align: top">{{comment_sum}}</a>
            </span>
          </a>
        </div>
        <div class="inLeft">
          <input placeholder="写评论" @click="openCommentBox(2)" readonly="readonly">
        </div>
      </div>
    </div>

    <div class="comment-box-container" v-show="showCommentBox" @click="hideCommentBox">
      <div class="comment-box"  @click.stop="showCommentBox = true">
        <h2>发表评论</h2>
        <div class="areaDiv">
          <textarea placeholder="请输入评论内容（6-300字）" v-model="commentText"></textarea>
        </div>
        <div class="publish">
          <span @click.stop="showCommentBox = false">取消</span>
          <button @click="publishComment(type)" v-bind:class="{'active': isActive}">发表</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import favorite from '../../assets/img/comment_ic_favorite.png'
  import favoriteOK from '../../assets/img/comment_ic_favorite_ok.png'
  import { API } from '../../service/api'
  import { timestampToTime } from '../../service/timestamp'
  import { InfiniteScroll } from 'mint-ui'
  import { Toast } from 'mint-ui'
  import { MessageBox } from 'mint-ui'
  import defaultHeader from '../../assets/img/face_200.png'
  export default {
    data: () => ({
      isFavorite: false,
      favoriteImage: favoriteOK,
      favoriteImageNo: favorite,
      showCommentBox: false,
      article_comment_list: [],
      commentText: '',
      replyMessage: {
        answer: false,
        author: '',
        comment_id: '',
        article_id: '',
        content: '',
        isReplyOther: false
      },
      total_page: '',
      current_page: 1,
      originLength:0,//控制长度
      is_show: false,
      article_id: '',
      loadList: [],
      allLoaded: false,
      hadMore: false,
      type: false,
      isActive: false,
      isShare: 0,
      defaultHead: 'this.src="' + defaultHeader + '"',
      comment_sum: '',
      isCH: false
    }),
    watch:{
      commentText(commentText) {
        if(commentText.length >= 6 && commentText.length <= 300){
          this.isActive = true;
          this.type = true;
        }else{
          this.isActive = false;
          this.type = false;
        }
      }
    },
    methods: {
      openCommentBox(type,username,commentid) {
      	if(type == 1){
      		this.replyMessage.isReplyOther = true;
      		this.replyMessage.comment_id = commentid;
      		this.commentText = `回复${username}:`;
      		this.replyMessage.author = username;
      	}else{
      		this.replyMessage.isReplyOther = false;
      		this.replyMessage.article_id = this.article_id;
      		this.commentText = '';
      	}
      	this.showCommentBox = true;
      },
      hideCommentBox() {
      	this.showCommentBox = false;
      },
      publishComment() {
      	let method = '';
      	let obj = {};
      	if(!this.type){
      	  return;
        }
        if(this.replyMessage.isReplyOther){
        	let spliceNum = 3 + this.replyMessage.author.length;
          this.replyMessage.content = this.commentText.substring(spliceNum);
          method = 'quan.commentReply';
        	obj.comment_id = this.replyMessage.comment_id;
        }else{
        	this.replyMessage.content = this.commentText;
        	method = 'quan.comment';
        	obj.article_id = this.replyMessage.article_id;
        }
        obj.content = this.replyMessage.content;
        method = this.basePath + method + this.token;
//      console.log(obj);
				this.axios.post(method,obj).then( res => {
//					console.log(res);
					let data = res.data.response;
					if(data.status == 200){
						Toast({
		          message: data.msg,
		          position: 'middle',
		          duration: 1000
		        });
		        this.showCommentBox = false;
					}else{
						MessageBox({
						  title: '提示',
						  message: data.msg,
						  showCancelButton: false
						});
					}
				})
      },
      commentStatus(statusId) {
        switch (statusId) {
          case '0':
            return '删除';
          case '1':
            return '未上架';
          case '2':
            return '已上架';
          case '3':
            return '已下架';
          case '4':
            return '审核不通过';
        }
      },
      getTime(timestamp) {
        return timestampToTime(timestamp)
      },
      loadMore() {
        // console.log('loadmore评论');
        this.loading = true
        this.current_page++
        // console.log(this.article_id);
        if(this.total_page > 1 && this.current_page <= this.total_page) {
          let curl = this.basePath + 'quan.commentList';
          let param = {
            'seacher': this.article_id,
            'article_id_test': this.article_id,
            'page': this.current_page,
            'type': 2
          }
          this.axios.post(curl,param)
            .then(res => {
              let last = res.data.response.comment_list;
              for(let i = 0; i < last.length; i ++) {
                this.article_comment_list.push(last[i])
              }
              this.loading = false;
            })
        }
      },
      isUp(article_id,comment_id, status,index) {
        let curl = this.basePath + `quan.commentManage&article_id=${article_id}&comment_id=${comment_id}&status=${status}`;
        this.axios.get(curl).then(res => {
					let data = res.data.response;
					if(data.status == 200){
						if(status == '1'){
							this.article_comment_list[index].status = '2';
						}else if(status == '2'){
							this.article_comment_list[index].status = '3';
						}else if(status == '3'){
              this.article_comment_list[index].status = '2';
            }
						Toast({
		          message: '操作成功',
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
      isFavorited() {
      	let method = '';
      	if(this.isFavorite){
      		method = 'quan.uncollect';
      	}else{
      		method = 'quan.collect';
      	}
				let str = '&article_id=' + this.article_id;
				const fUri = this.basePath + method + str + this.token;
				this.axios.get(fUri)
				.then(res => {
					let data = res.data.response;
					if(data.status == 200){
						Toast({
		          message: data.msg,
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
      	this.isFavorite = !this.isFavorite;
     },
     loadBottom() {
//   	console.log(11111)
     }
    },
    mounted () {
      let article_id = this.GetQueryString('aid');
    	this.article_id = article_id;
    	// console.log(article_id)
      // let curl = this.basePath + 'quan.commentList' + `&article_id=${article_id}&page=${ this.current_page }&type=2` + this.token;
      let curl = this.basePath + 'quan.commentList'

      let param = {
        'seacher': article_id,
        'article_id_test': article_id,
        'page': this.current_page,
        'type': 2
      }
    	this.axios.post(curl,param)
        .then(res => {
          this.article_comment_list = res.data.response.comment_list
          this.is_show = res.data.response.is_show
          this.isFavorite = res.data.response.is_collect
          this.isShare = res.data.response.is_share;
          this.comment_sum = res.data.response.comment_sum;
          this.total_page = Math.ceil(res.data.response.comment_sum / 10)
       // console.log(this.total_page)
          if(this.total_page <= 1){
            this.hadMore = true;
          }else{
            this.isCH = true;
          }

        }
      )
    }
  }
</script>

<style scoped>
  .comment-content {
    background-color: #fff;
  }
  h3 {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAA;
    padding: 10px 15px;
    background-color: #F7F7F7;
  }
  .comment-list-container {
    /*height: 530px;*/
    overflow: scroll;
  }
  .commentHeight{
    height: 530px;
  }
  .comment {
    color: #3A3A3A;
    padding: 15px 15px 0;
    font-size: 17px;
  }

  .comment label, .comment span {
    vertical-align: bottom;
    word-break: break-all;
    line-height: 24px;
  }
  .comment .contents{
  	color: #AAAAAA;
  }
   .comment a {
     color: #000;
     font-family: PingFangSC-Light;
		font-size: 17px;
		color: #3A3A3A;
		letter-spacing: -0.46px;
		line-height: 24px;
   }
  .comment-bar {
    margin-top: 1.5vh;
    font-size: 14px;
  }
   .comment-bar .bar-0 {
     color: #AAA;
     display: inline-block;
     width: 20%;
   }
   .comment-bar .bar-1 {
     margin-left: 50%;
     color: #AAAAAA;
   }
   .comment-bar .bar-2 {
     float: right;
     color: #000;
   }
  .comment-bottom {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAA;
    text-align: center;
    padding-bottom: 4vh;
    box-sizing: border-box;
    margin: 20px 0 50px;
    position: relative;
  }
  /*.comment-bottom:before{*/
    /*content: '';*/
    /*width: 50px;*/
    /*height: 2px;*/
    /*background: #EDEDED;*/
    /*position: absolute;*/
    /*top: 6px;*/
    /*left: 46%;*/
    /*margin-left: -58px;*/
  /*}*/
  /*.comment-bottom:after{*/
    /*content: '';*/
    /*width: 50px;*/
    /*height: 2px;*/
    /*background: #EDEDED;*/
    /*position: absolute;*/
    /*top: 6px;*/
    /*right: 46%;*/
    /*margin-right: -58px;*/
  /*}*/
  .reply-bar {
    padding: 10px 15px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid #EDEDED;
  }
  .reply-bar input {
    background: #F7F7F7;
    border-radius: 2px;
    height: 30px;
    /*line-height: 30px;*/
   line-height: normal;
    width: 70%;
    padding-left: 10px;
  }
  .reply-bar span {
    font-size: 12px;
  }
  .reply-bar img {
    width: 20px;
  }
  .comment-favorite {
    float: right;
  }
  .comment-box-container {
    position: fixed;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
  }
  .comment-box {
    position: inherit;
    bottom: 0;
    width: 100%;
   	height: 210px;
    background-color: #fff;
    padding: 15px 10px;
    box-sizing: border-box;
  }
  .comment-box h2 {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAA;
  }
  .areaDiv{
  	/*margin-right: 60px;*/
  }
  .comment-box textarea {
    font-family: PingFangSC-Light;
    color: #aaa;
    margin-top: 5px;
    font-size: 14px;
    background: #F7F7F7;
    border-radius: 2px;
    width: 100%;
    height: 100px;
    outline:none;
    resize:none;
    border: none;
    padding: 10px 0px 0px 4px;
    text-indent: 10px;
  }
  .publish {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .publish button {
    background: #DDD;
    border-radius: 2px;
    font-size: 14px;
    width: 70px;
    height: 32px;
    color: #AAA;
    line-height: 32px;
    font-size: 17px;
    outline: none;
  }
  .blcakt{
  	color: #000;
  }

  .comment{
  	font-family: PingFangSC-Light;
		font-size: 17px;
		color: #000000;
		letter-spacing: -0.41px;
		line-height: 21px;
  }
  .comment-bar .bar-0{
  	font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
  }
  .comment-bar .bar-2{
  	font-family: PingFangSC-Light;
		font-size: 14px;
		color: #000000;
		letter-spacing: -0.34px;
  }
  input::placeholder{
	  font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		line-height: 17px;
	}
	.reply-bar span{
		font-family: PingFangSC-Light;
		font-size: 10px;
		color: #000000;
		letter-spacing: -0.24px;
		line-height: 17px;
	}
	.comment-box h2{
		font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: 0;
		line-height: 17px;
	}
	.publish span{
		font-family: PingFangSC-Light;
		font-size: 17px;
		color: #000000;
		letter-spacing: -0.34px;
		line-height: 14px;
	}
	.publish button{
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		/*line-height: 14px;*/
		height: 30px;
		width: 60px;
	}
  .active{
    background: #F8E71C!important;
    color: #000!important;
  }
  .reply-bar{
    overflow: hidden;
  }
  .reply-right{
    float: right;
  }
  .reply-bar img{
    margin-top: 5px;
  }
  .reply-left{
    margin-right: 40px;
  }
  .reply-left .inRight{
    float: right;
  }
  .inLeft{
    margin-right: 50px;
  }
  .inLeft input{
    width: 94%;
  }
  textarea::placeholder{
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #AAAAAA;
    letter-spacing: -0.34px;
    line-height: 17px;
  }
</style>
