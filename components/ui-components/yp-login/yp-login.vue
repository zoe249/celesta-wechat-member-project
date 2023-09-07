<template>
	<view class="wray">
		<!-- 项目名称 -->
		<view class="applet-name">{{ appletName }}</view>

		<!-- 获取用户基础信息 -->
		<view v-if="userShow" class="describe">{{ describeUser }}</view>
		<button v-if="userShow" class="button-login" hover-class="none" @tap="onGotUserInfo">授权用户信息</button>

		<!-- 用户注册、获取手机号 -->
		<view v-if="!userShow" class="describe">{{ describe }}</view>
		<button v-if="!userShow" class="button-login" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信一键授权登录</button>

		<!-- 隔离层 -->
		<view style="height: 100rpx;"></view>

	</view>
</template>

<script>
	import Vue from 'vue';
	export default {
		data() {
			return {
				appletName: this.config.appletName, // 小程序名称
				userShow: true,
				describeUser: this.config.describeUser, // 小程序名称
				describe: this.config.describe ,// 小程序名称
				code: '', // code
			}
		},
		mounted() {
			// 判断是否授权用户信息
			let userInfo = uni.getStorageSync('userInfo')
			if (userInfo.nickName == '' || userInfo.nickName == undefined) {
				this.userShow = true
			} else {
				this.userShow = false
			}
			
			// 获取 code
			this.getCode()
			// 先执行自动登录
			// this.onLogin()
		},
		methods: {
			// 获取 code
			getCode(event) {
				let that = this
				uni.login({
					success: res => {
						that.code = res.code
						if (event != undefined) {
							// 执行登录
							that.onLogin()
						}
					}
				})
			},
			// 登录
			onLogin() {
				let that = this
				uni.removeStorageSync('token')
				that.request({
					url: that.config.getLogin + '?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' + that.code + '&appCode=00',
					method: 'POST',
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
				}).then(res => {
					// 用户存在
					let data = res.data
					// 已注册已绑定 缓存 Token
					if (res.statusCode == 200 && data.access_token) {
						// 保存 token 到全局
						uni.setStorageSync('token', data.access_token)
						debugger
						// 获取会员用户
						that.memberUser()
					} else {
						// 重新获取 code
						that.getCode()
					}
				})
			},
			// 微信一键授权登录
			getPhoneNumber(e) {
				let that = this
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					let infoRes = uni.getStorageSync('infoRes')
					let companyCode = that.config.companyCode
					uni.removeStorageSync('token')
					that.request({
						url: that.config.registerPhone,
						method: 'POST',
						header: {
							'Content-Type': 'application/json; charset=utf-8'
						},
						data: {
							"companyCode": companyCode.companyCode,
							"organizationCode": companyCode.organizationCode,
							"channelCode": companyCode.channelCode,
							"terminalCode": companyCode.terminalCode,
							"appCode": companyCode.appCode,
							code: that.code,
							userInfoIv: infoRes.iv,
							userInfoEncryptedData: infoRes.encryptedData,
							phoneIv: e.detail.iv,
							phoneEncryptedData: e.detail.encryptedData
						}
					}).then(res => {
						// 用户注册成功
						let data = res.data
						if (res.statusCode == 200 && data.registerStatus == true) {
							// 先获取 code 再重新调用登录
							that.getCode('onLogin')
							// that.onLogin()
						} else if (res.statusCode == 200 && data.registerStatus == false) {
							// 已注册未绑定 跳转绑定页面
							that.$emit('resData', data)
						} else {
							// 数据 / 系统错误
							uni.showToast({
								title: data.detail,
								icon: 'none'
							})
							that.$emit('isToken', true)
							setTimeout(() => {
								uni.redirectTo({
									url: '../home/index-unauthorized'
								})
							}, 2000)
						}
					})
				}
			},
			// 点击获取用户信息
			onGotUserInfo(e) {
				let that = this
				wx.getUserProfile({
					desc: '正在获取', //不写不弹提示框
					success: res => {
						let data = res
						let infoRes = {
							iv: data.iv,
							encryptedData: data.encryptedData
						}
						uni.setStorageSync('infoRes', res)
						uni.setStorageSync('userInfo', res.userInfo)
						that.userShow = false
					}
				})
			},
			// 获取会员信息
			memberUser() {
				let that = this
				that.request({
					url: that.config.memberUser
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					// 缓存用户信息
					uni.setStorageSync('memberInfo', data)
					// 会员卡是否领取
					// yc 20220728
					that.getCardInfo(data.unionId)
				})
			},
			// 会员卡是否领取
			getCardInfo(unionId) {
				let that = this
				uni.request({
					url: that.config.protocol +that.config.host + that.config.getCardStatusByUser,
					method: 'GET',
					data: {
						unionId: unionId
					},
					success: (res) => {
						if (res.data.detail == 1) { // 存在已领取
							// 已注册已领取 完成
							that.$emit('isToken', true)
							// 进入首页
							uni.redirectTo({
								url: '../home/index'
							})
						} else if (res.data.detail == 0) {
							// 跳转领取会员卡
							uni.redirectTo({
								url: '@/pages/receiveCard/receiveCard'
							})
						} else { // 未关注公众号
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
							that.$emit('isToken', true)
							setTimeout(() => {
								// 进入首页
								uni.redirectTo({
									url: '../home/index'
								})
							}, 2000)
						}
					}
				})
			},
		}
	}
</script>

<style scoped>
	.applet-name {
		width: 500rpx;
		margin: 70rpx auto 0;
		text-align: center;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 80rpx;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.describe {
		width: 650rpx;
		margin: 50rpx auto 0;
		font-size: 28rpx;
		color: #666666;
		text-align: center;
		line-height: 40rpx;
	}

	.button-login {
		width: 300rpx;
		height: 70rpx;
		margin: 50rpx auto 70rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 70rpx;
		background-color: #C73C23;
	}
</style>
