// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import { Navbar, TabItem } from 'mint-ui';
// import Vue from 'vue'
import MetaInfo from 'vue-meta-info'
import axios from 'axios'
import { Loadmore } from 'mint-ui';

Vue.component(Loadmore.name, Loadmore);

Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.use(MintUI);
Vue.use(MetaInfo);


Vue.config.productionTip = false;
Vue.prototype.axios = axios;

// 跨域处理
axios.defaults.withCredentials = true;

//请求接口路径
// Vue.prototype.basePath = process.env.API_ROOT;
Vue.prototype.basePath = 'http://quan-dev.xiaoheiban.cn/api/?method=';
// Vue.prototype.basePath = 'https://quan.xiaoheiban.cn/api/?method=';
//app跳转路径
// Vue.prototype.jsPath = process.env.BASE_ROOT;
Vue.prototype.jsPath = 'http://quan-dev.xiaoheiban.cn/h5/index.html#/';
// Vue.prototype.jsPath = 'http://img-cdn.xiaoheiban.cn/quan/v1.0.0/h5/index.html#/';

//设定本地token
// Vue.prototype.token = '&token=599ba c0a2794e805094793a9';
// Vue.prototype.token = '&token=5ab86003fcfa4b7d5f9acbc0';
Vue.prototype.token = '&token=5aaf16fcfcfa4b2b0ddb59f4';
// Vue.prototype.token = '';

//本地为0路由跳转，线上不为0调用jsaction
Vue.prototype.useragent = 0;
// Vue.prototype.useragent = 1;

//监听路由
Vue.prototype.returnIndex = false;

router.beforeEach((to, from, next) => {
  // alert(to.meta.title)
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
});

//ios标题处理
router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    document.title = route.meta.title;
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement('iframe');
      hackIframe.style.display = 'none';
      hackIframe.src = '/static/html/fixIosTitle.html?r=' + Math.random();
      document.body.appendChild(hackIframe);
      setTimeout(_ => {
        document.body.removeChild(hackIframe)
      }, 300)
    }
  }
});

//获取连接参数
Vue.prototype.GetQueryString = function (param) { //param为要获取的参数名 注:获取不到是为null
  var currentUrl = window.location.hash; //获取当前链接
  var arr = currentUrl.split("?");//分割域名和参数界限
  if (arr.length > 1) {
    arr = arr[1].split("&");//分割参数
    for (var i = 0; i < arr.length; i++) {
      var tem = arr[i].split("="); //分割参数名和参数内容
      if (tem[0] == param) {
        return tem[1];
      }
    }
    return null;
  }
  else {
    return null;
  }
}

//判断手机类型
Vue.prototype.getAgent = function () {
  var ua = navigator.userAgent.toLowerCase();
  if(/android/.test(ua)){
    // console.log('android');
    return 'isAND'
  }
  if(/iphone|ipad|ipod/.test(ua)){
    // console.log('ios');
    return 'isIOS'
  }
}

//获取屏幕高度
Vue.prototype.getCHeight = function () {
  let cheight = window.innerHeight;
  console.log(cheight);
  return cheight;
}

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
