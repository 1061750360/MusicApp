import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import VueLazyLoad from 'vue-lazyload'
import axios from 'axios'

import '../src/api/qqMusicSign'

// 导入字体图标文件
import './assets/fonts/iconfont.css'
//导入base.less样式表
import './assets/less/base.less'
import './assets/less/variables.less'

Vue.prototype.$axios = axios
Vue.use(VueLazyLoad, {
  loading: require("./assets/image/uploading.gif")
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
