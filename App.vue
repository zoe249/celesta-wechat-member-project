<script>
	import config from './config.js'
	import request from './utils/request.js'
	export default {
		// 用户信息加到全局
		globalData: {
			isLogin: 0, // 是否注册  0:默认未请求  1:未注册  2:已注册
			isLoading: false,
			appStyleTemplate: {}, // 小程序样式模版
			appStyle: {}, // 小程序样式颜色
		},
		onLaunch: function(options) {
			console.log('App Launch');
			// 版本更新
			this.versionUpdate()
		},
		onShow: function() {
			console.log('App Show');
			// 获取版本号
			let accountInfo = uni.getAccountInfoSync();
			let edition = accountInfo.miniProgram.version

			if (edition != uni.getStorageSync('edition')) {
				// 版本更新
				// this.versionUpdate()
				uni.showModal({
					title: '更新提示',
					content: '发现新版本，是否重启应用?',
					cancelColor: '#eeeeee',
					confirmColor: '#FF0000',
					success(res2) {
						if (res2.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
				uni.setStorageSync('edition', edition)
			}
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			// 版本更新
			versionUpdate() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log('是否有更新:', res.hasUpdate)
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res2) {
							uni.showModal({
								title: '更新提示',
								content: '发现新版本，是否重启应用?',
								cancelColor: '#eeeeee',
								confirmColor: '#FF0000',
								success(res2) {
									if (res2.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									}
								}
							});
						});
					}
				});
				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
					uni.showModal({
						title: '提示',
						content: '检查到有新版本，但下载失败，请检查网络设置',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>

<style>
	/* 引入图标库 */
	/* @import "/static/css/iconfont.css"; */
	/* 清除小程序自带样式 */
	/* @import "/static/css/reset.css"; */

	page {
		background-color: #EEEEEE;
	}

	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */
</style>
