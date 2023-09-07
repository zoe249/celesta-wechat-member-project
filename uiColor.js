import Vue from 'vue'
import App from './App'
import config from './config.js'
import request from './utils/request.js'

/**
 * ui颜色、背景配置文件
 * 	1. 主色调
 * 	2. 副色调
 *  3. icon 颜色
 *  4. 按钮颜色
 *  5. 背景色
 *  6. 背景图片
 * */


export default (params) => {

	/** ---------- 主题模版 start --------- */
	let themeTemplate = [{
		// 主色调
		mainTone: '#C077FA ',
		// 副色调
		deputyTone: '#515151 ',
		// 定位/电话图标/选择位置按钮颜色
		location: '#c83c23 ',
		// 按钮
		button: '#c83c23 ',
		// icon
		iconColor: '#c83c23 ',
		// 主题渐变色
		startGradients: '#faad92',
		endGradients: '#fa7e69',
	}]

	/** ---------- 主题模版 end --------- */


	/** ---------- 选取模版 start --------- */
	let selectTheme = themeTemplate[0]

	// this.request({
	// 	url: '',
	// 	data: {}
	// }).then(res => {
	// 	if() {

	// 	}
	// 	let index = res.data.
	// 	selectTheme = themeTemplate[index]
	// })

	/** ---------- 选取模版 end --------- */


	return new Promise((resoLve) => {
		resoLve(selectTheme)
		// 程序配置
		getApp().globalData.appStyle = selectTheme
	})

}
