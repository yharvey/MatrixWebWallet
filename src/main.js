// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import filters from './assets/js/filters'
import http from './assets/js/http'
import { chainUrl, ipfsUrl, ipfsPort, protocol, ethUrl } from './assets/js/config' // 配置
import VueClipboards from 'vue-clipboards'
import 'element-ui/lib/theme-chalk/index.css'
import { getCookie } from './assets/js/cookie'
// 引入全局css
import './assets/css/global.css'
// import moment from 'moment'

// 富文本
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 富文本

// aiman API
import HttpProvider from '@/assets/js/HttpProvider'
// web3 API
import EthProvider from '@/assets/js/EthProvider'
// ipfs API
import IpfsProvider from '@/assets/js/IpfsProvider'

// aiman API
Vue.prototype.httpProvider = new HttpProvider(chainUrl)
// aiman API
Vue.prototype.ethProvider = new EthProvider(ethUrl)

// ipfs API
Vue.prototype.ipfsProvider = new IpfsProvider(ipfsUrl, ipfsPort, protocol)

Vue.use(VueQuillEditor)
Vue.use(VueI18n)
// axios封装
Vue.use(http)
Vue.use(ElementUI)
Vue.use(VueClipboards)
const i18n = new VueI18n({
  // locale: 'EN', // 语言标识
  // locale: 'CN',
  locale: getCookie('PLAY_LANG', 'EN'), // 语言标识
  messages: {
    'CN': require('./assets/lang/cn'), // 中文语言包
    'EN': require('./assets/lang/en') // 英文语言包
  }
})

// 过滤器统一处理加载
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

window.i18n = i18n
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
