<script>
  import { InfiniteScroll } from 'mint-ui';
  import articleImage from '../assets/img/all.png';
  import { API } from '../service/api'
  export default {
    components: {},
    data: () => ({
      articleList:[],
      loading: false,
      loadingNumber:0,
      totalPage:1,
      isAll:'加载中...'
    }),
    props:[ 'teacherId' ],
    methods: {
      loadMore() {
        this.loading = true;
        this.loadingNumber++;
        if(this.loadingNumber >= this.totalPage) {
          this.isAll = '到底啦!'
        }
        if(this.totalPage >1 && this.loadingNumber <= this.totalPage) {
          const teacherDetail = 'quan.teacherDetail';
          const uid = this.teacherId;
          const url = `http://quan-dev.xiaoheiban.cn/api/?method=${teacherDetail}&uid=${uid}&page=${this.loadingNumber}&token=59a4e43d0179b04b5056178b`;
          API.get(url).then((res)=>{
            setTimeout(() => {
              let last = res.response.article_list;
              for(let i = 0; i < last.length; i ++) {
                this.teacherMessages.push(last[i])
              }
              this.loading = false;
            }, 2000)
          },(err)=>{});
        }
      },
      getArticlesData(){
        const teacherDetail = 'quan.teacherDetail';
        const uid = this.teacherId;
        const page = 1;
        const url = `http://quan-dev.xiaoheiban.cn/api/?method=${teacherDetail}&uid=${uid}&page=${page}&token=59a4e43d0179b04b5056178b`;
        API.get(url).then((res)=>{
          this.totalPage = Math.ceil(res.response.article_sum/10);
          this.articleList = res.response.article_list
        },(err)=>{})
      },
      goArticleDetail(type,id){
        switch (type){
          case 1:
            const arurl = `http://quan-test.xiaoheiban.cn/#/article?${id}`;
            JSAction.openUrl(arurl);
            break;
          case 2:
            const auurl = `http://quan-test.xiaoheiban.cn/#/audio?${id}`;
            JSAction.openUrl(auurl);
            break;
          default:
            const viurl = `http://quan-test.xiaoheiban.cn/#/video?${id}`;
            JSAction.openUrl(viurl);
        }
      }
    },
    mounted(){
        this.getArticlesData()
    }
  }
</script>

<template>
  <div class="products">
    <ul v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
      <li v-for="item in articleList" class="product" @click="goArticleDetail(item.type,item.article_id)">
          <div class="product-content">
            <p>{{item.title}}</p>
            <div class="product-bar">
              <span>{{item.comments}}评论</span>
              <span v-if="item.integration != 'ok'">{{item.points}}积分</span>
              <span class="isHave" v-if="item.integration === 'ok'"><img src="../assets/img/ic_buy.png"><a>已购</a></span>
              <span>{{item.time}}</span>
            </div>
          </div>
          <img :src="item.cover">
      </li>
    </ul>
    <div style="text-align: center" class="loadings">{{isAll}}</div>
  </div>
</template>

<style scoped>
  .products {
    margin-top: 2vh;
  }
  .product {
    display: flex;
    justify-content: space-between;
    padding: 2.5vh;
    background-color: #fff;
    margin-bottom: 1vh;
  }
  .product-content {
    width: 70%;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }
  .product-content p {
    margin-bottom: 2vh;
    font-size: 17px;
  }
  .product img {
    width: 22.3vw;
    height: 12.5vh;
  }
  .product-bar {
    font-size: 14px;
    color: #AAA;
    width: 100%;
  }
  .product-bar span {
    width: 20%;
  }
  .product-bar span:first-of-type {
    margin-right: 5%;
  }
  .product-bar span:last-of-type {
    margin-left: 35%;
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
    0%   { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
</style>
