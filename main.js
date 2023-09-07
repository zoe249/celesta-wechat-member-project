import Vue from 'vue'
import App from './App'
import request from './utils/request.js' // 请求接口组件（联调/生产）
import config from './config.js'
import uiColor from './uiColor.js'
import { goodsType } from './utils/funciton.js'

Vue.config.productionTip = false

Vue.prototype.request = request // 请求接口组件（联调/生产）
Vue.prototype.config = config
Vue.prototype.uiColor = uiColor
Vue.prototype.goodsType = goodsType

App.mpType = 'app'

import uView from "uview-ui";
Vue.use(uView);

const app = new Vue({
    ...App
})
app.$mount()
