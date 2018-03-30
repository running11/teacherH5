<template>
	<section style="background-color: #F7F7F7;" v-bind:style="{minHeight: cheight + 'px'}">
    <div class="noFollow" v-if="follow_sum == ''">
      <img src="../../assets/img/ic_blank_favorite@2x.png" alt="">
      <p>你还未收藏文章</p>
    </div>

		<div v-else class="favorite-container" style="background-color: #F7F7F7;">
			<ul v-infinite-scroll="loadMore"
	          infinite-scroll-disabled = "false"
	          infinite-scroll-distance="10"
	          infinite-scroll-immediate-check = true>
          		<li v-for="(fm, index) in collect_list" @touchstart="getIndex(fm.article_id, index)" @click="getDetails(fm.type,fm.article_id)">
          			<mt-cell-swipe
		              :right="[{
				          content: '删除收藏',
				          style: { background: '#FF3B30', color: '#fff','padding-top':'54px',fontFamily: 'PingFangSC-Regular',fontWeight:'normal'},
				          handler: () => cancelFa(fm.article_id,index),
		       		}]">
			       		<div class="favorites">
			       			<div class="favorite-header">
			       				<img :src="fm.img" :onerror="defaultHead">
					            <span>{{fm.user_name}}</span>
					            <span>{{fm.update_time}}</span>
			       			</div>
			       			<div class="favorite-content">
					            <div class="favorite-image" >
					              <img :src="fm.cover" />
                        <img src="../../assets/img/ic_video_play_video@2x.png" class="video-button" v-show="fm.type == 3">
                        <img src="../../assets/img/ic_music_play_music@2x.png" class="video-button" v-show="fm.type == 2">
					            </div>
			       				<div class="favorite-title">
					              <p>{{fm.title}}</p>
					              <div class="favorite-comments">
					                <span>{{fm.comments}}评论</span>
					                <!--<span v-show="fm.integration!='ok'">{{fm.is_charge != 0 ? `${fm.points}积分`:'免费'}}</span>
					                <span class="have" v-show="fm.integration==='ok'"><img src="../../assets/img/ic_buy.png">  已购</span>-->
					              </div>
					            </div>
			       			</div>
			       		</div>
		       		</mt-cell-swipe>
              </li>
			</ul>
			<div style="text-align: center" v-show="hadMore" class="loadings">{{isAll}}</div>
      		<Prompt :messages="myMessage" v-on:ensure="isDel"></Prompt>
		</div>
	</section>
</template>

<script>
  import Prompt from '../../components/prompt.vue'
  import { API } from '../../service/api'
  import { InfiniteScroll } from 'mint-ui'
  import { timestampToTime } from '../../service/timestamp'
  import { MessageBox } from 'mint-ui'
  import defaultHeader from '../../assets/img/face_200.png'
  import { Toast } from 'mint-ui'
  export default {
    name: "favorite",
    components:{
      Prompt
    },
    data() {
      return{
        title: '收藏',
        collect_list: [],
        isAll: '',
        myMessage: {
          isShow: false,
          tips: '要从收藏中删除这篇文章吗?',
          title: '删除收藏',
        },
        loading_number: 1,
        total_page: '',
        realDeleteId: '',
        fakeDeleteId: '',
        hadMore: false,
        follow_sum: 1,
        defaultHead: 'this.src="' + defaultHeader + '"',
        cheight: ''
      }
    },
    methods: {
      cancel() {
         this.myMessage.isShow = true
      },
      getTimestamp(timestamp) {
        return timestampToTime(timestamp)
      },
      getIndex(article_id, index) {
         this.realDeleteId = article_id
        this.fakeDeleteId = index
      },
      isDel(data) {
        if(data) {
          API.get(`api/?method=quan.uncollect&article_id=${this.realDeleteId}`).then(res => {
//          console.log(res)
            this.collect_list.splice(this.fakeDeleteId, 1)
          })
          //console.log(this.teacherMessages)
        }
      },
      loadMore() {
        this.loading = true;
        this.loading_number++;
        if(this.loading_number >= this.total_page) {
          this.isAll = '到底啦!'
        }
        if(this.total_page > 1 && this.loading_number <= this.total_page) {
        	let furl = this.basePath + 'quan.collectClick' + `&page=${this.loading_number}` + this.token;
        	this.axios.get(furl).then( res => {
        		setTimeout(() => {
                let last = res.data.response.collect_list
                for(let i = 0; i < last.length; i ++) {
                  this.collect_list.push(last[i])
                }
                this.loading = false
              }, 500);
        	})
        }
      },
      getDetails(type,id){
        type = parseInt(type)
			  let arurl = '';
			// if(this.useragent == 0){
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
			  // }
	  	},
	  	cancelFa(id,index) {
	  		MessageBox.confirm('要从收藏中删除这篇文章吗？','删除收藏').then(action => {
	  			let method = 'quan.uncollect';
          let str = '&article_id=' + id;
          const fUri = this.basePath + method + str + this.token;
          this.axios.get(fUri)
          .then(res => {
            let data = res.data.response;
            if(data.status == 200){
              Toast({
                message: '取消收藏成功',
                position: 'middle',
                duration: 1000
                // duration: -1
              });
              this.collect_list.splice(index,1);
              let flen = this.collect_list.length;
              console.log(flen);
              // this.set(this.$data, 'follow_sum', '')
              if(flen == 0){
                this.follow_sum = '';
              }
            }else{
              MessageBox({
                title: '提示',
                message: data.msg,
                showCancelButton: false
              });
            }
          })
	  		})
	  	}
    },
    mounted() {
      this.cheight = this.getCHeight();
      //判断网络状况
      if(navigator.onLine) {
        let aUrl = this.basePath + `quan.collectClick&page=${this.loading_number}` + this.token;
        this.axios.get(aUrl).then(res => {
          res = res.data.response;
          this.collect_list = res.collect_list;
          this.total_page = Math.ceil(res.collect_sum / 10);
          if (this.total_page > 1) {
            this.hadMore = true;
          }
          this.follow_sum = res.collect_sum;
          this.total_page <= 1 ? this.isAll = '' : this.isAll = '加载中...'
        })
      }else{
        this.$router.push({path: this.offPath});
      }
    },
    metaInfo: {
      title: "我的收藏",
      meta: [{
        name: 'xiaoheiban_disable_share',
        content: 'true'
      }]
    }
  }
</script>

<style lang="less" type="text/less">
	.mint-cell-wrapper {
    padding: 0;
  }
  .mint-cell-value {
    width: 100%;
    padding: 15px;
    background-color: #fff;
  }
  .mint-cell-swipe-button {
    width: 80px;
    box-sizing: border-box;
    line-height: 22px;
    font-size: 20px;
    padding: 55px 18px;
  }
	.favorite-container{
		.favorites{
			width: 100%;
		}
		li{
			margin-bottom: 5px;
		}
		.favorite-header{
			width:100%;

			img{
				width: 28px;
				height: 28px;
				border-radius: 50%;
			}

			span:last-child{
				float: right;
				line-height: 28px;
				display: inline-block;
			}
		}
		.favorite-content{
	    margin-top: 10px;
			img{
				width: 86px;
				height: 86px;
			}

			.favorite-title{
			    margin-right: 101px;
				line-height: 21px;
				height: 86px;
				position: relative;

				p{
					font-size: 17px;
					color: #000000;
					height: 63px;
					overflow: hidden;
				}
				.favorite-comments{
					position: absolute;
					bottom: 0;
				}
			}
			.favorite-image{
				float: right;
			}
		}
	}
	.mint-cell-swipe-button{
		font-family: PingFangSC-Regular;
	}
	.favorite-container .favorite-header span{
		font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		line-height: 14px;
	}
	.favorite-container .favorite-content .favorite-title p{
		font-family: PingFangSC-Light;
		font-size: 17px;
		color: #000000;
		letter-spacing: -0.41px;
		line-height: 21px;
	}
	.favorite-container .favorite-content .favorite-title .favorite-comments{
		font-family: PingFangSC-Light;
		font-size: 14px;
		color: #AAAAAA;
		letter-spacing: -0.34px;
		line-height: 14px;
	}
  .favorite-container .favorite-content .favorite-image{
    position: relative;
  }
  .favorite-container .favorite-content .video-button{
    width: 40px;
    height: 40px;
    position: absolute;
    right: 23px;
    top: 23px;
  }
</style>
