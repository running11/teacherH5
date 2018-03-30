import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home'
import TeacherCircle from '../views/TeacherCircle/index';
import Favorite from '../views/TeacherCircle/favorite';
import Follow from '../views/TeacherCircle/follow';
import Search from '../views/TeacherCircle/search';
import Article from '../views/TeacherCircle/Details/articleDetail.vue';
import TDetail from '../views/TeacherCircle/Details/teacherDetail.vue';
import Blank from '../views/blank';
import VDetail from '../views/TeacherCircle/Details/videoDetail';
import Audio from '../views/TeacherCircle/Details/audioDetail';
import Outline from '../components/outline';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/teacherCircle',
      name: 'Home',
      component: TeacherCircle,
    },
    {
      path: '/favorite',
      name: 'Favorite',
      component: Favorite,
      meta: {
        title:"收藏",
        name: 'xiaoheiban_disable_share',
        content: 'true'
      }
    },
    {
      path: '/follow',
      name: 'Follow',
      component: Follow,
      meta: {
        title:"关注",
        name: 'xiaoheiban_disable_share',
        content: 'true'
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        title:"搜索",
        name: 'xiaoheiban_disable_share',
        content: 'true'
      }
    },
    {
      path: '/teachers',
      name: 'TDetail',
      component: TDetail,
      meta: {
        title:"教师详情",
        name: 'xiaoheiban_disable_share',
        content: ''
      }
    },
    {
      path: '/article',
      name: 'Article',
      component: Article,
      meta: {
        title: "文章详情",
        name: 'xiaoheiban_disable_share',
        content: ''
      }
    },
    {
      path: '/video',
      name: 'VDetail',
      component: VDetail,
      meta: {
        title: "视频详情",
        name: 'xiaoheiban_disable_share',
        content: ''
      }
    },
    {
      path: '/audio',
      name: 'Audio',
      component: Audio,
      meta: {
        title: "音频详情",
        name: 'xiaoheiban_disable_share',
        content: ''
      }
    },
    {
      path: '/blank',
      name: 'Blank',
      component: Blank,
    },
    {
      path: '/outline',
      name: 'Outline',
      component: Outline,
      meta: {
        title: "网络错误",
        name: 'xiaoheiban_disable_share',
        content: 'true'
      }
    }
  ]
})



