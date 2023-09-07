<template>
	<view class="content">
		<!-- 头像 -->
		<view class="header">
			<image :src="companyLogo" mode="widthFix"></image>
		</view>

		<!-- 登录按钮 -->
		<view class="login">
			<!-- 微信登录 -->
			<button class="login-wechat logn-button" hover-class="none" @tap="onGotUserInfo">
				<view class="wechat">
					<u-icon class="wechat-icon" name="weixin-fill" color="#FFFFFF" size="50"></u-icon>
					<text>微信登录</text>
				</view>
			</button>

			<!-- 暂时不支持 -->
			<!-- <button class="login-phone logn-button" open-type="getPhoneNumber">
				<view class="wechat">
					<image class="wechat-icon" :src="imgUrl + '/phone-logo.png'" mode="widthFix"></image>
					<text>手机号登录</text>
				</view>
			</button> -->
			
			<!-- 会员注册 -->
			<!-- <button class="register logn-button" hover-class="none" @tap="memberRegister">
				<view class="wechat">
					<text>会员注册</text>
				</view>
			</button> -->
			
			<!-- 微信绑定 -->
			<!-- <button class="login-wechat logn-button" @click="wechatBinding">
				<view class="wechat">
					<u-icon class="wechat-icon" name="weixin-fill" color="#FFFFFF" size="50"></u-icon>
					<text>微信绑定</text>
				</view>
			</button> -->
		</view>
		
		<!-- 弹出层登录 -->
		<u-popup v-model="isLogin" mode="bottom" :closeable="true">
			<yp-login v-if="isLogin" @isToken="isToken" @resData="resData"></yp-login>
		</u-popup>
		
		<!-- 无网络提示 -->
		<u-no-network></u-no-network>
		
	</view>
</template>

<script>
	import ypLogin from '@/components/ui-components/yp-login/yp-login.vue'
	export default {
		components: {
			ypLogin
		},
		data() {
			return {
				isLogin: false, // 登录弹窗
				imgUrl: this.config.imgUrl,
				companyLogo: this.config.companyLogo
			}
		},
		onLoad() {
			
		},
		methods: {
			// 登录后关闭登录弹出框
			isToken(res) {
				if (res) {
					// 已注册已绑定 完成
					this.isLogin = false
					// 去掉手动退出状态
					uni.setStorageSync('isManualExit', false)
				}
			},
			resData(res) {
				// 已注册未绑定 跳转绑定页面
				this.isLogin = false
				let data = JSON.stringify(res)
				uni.redirectTo({
					url: './bindWeChat/bindWeChat?resData=' + data
				}) 
			},
			// 点击获取用户信息
			onGotUserInfo(e) {
				let that = this
				wx.getUserProfile({
					desc:'正在获取', //不写不弹提示框
					success: res => {
						let data = res
						let infoRes = {
							iv: data.iv,
							encryptedData: data.encryptedData
						}
						uni.setStorageSync('infoRes', infoRes)
						uni.setStorageSync('userInfo', res.userInfo)
						that.isLogin = true
					}
				})
			},
			// 会员注册
			memberRegister(e) {
				let that = this
				wx.getUserProfile({
					desc:'正在获取', //不写不弹提示框
					success: res => {
						let data = res
						let infoRes = {
							iv: data.iv,
							encryptedData: data.encryptedData
						}
						uni.setStorageSync('infoRes', infoRes)
						uni.setStorageSync('userInfo', res.userInfo)
						uni.navigateTo({
							url: '../registration/phoneRegistration'
						})
					}
				})
			},
			// 微信绑定
			wechatBinding() {
				uni.navigateTo({
					url: './bindWeChat/bindWeChat'
				})
			},
		}
	}
</script>

<style>
	page {
		font-size: 28rpx;
		background-color: #EFF5F8;
	}

	/* 头像 start */
	.header {
		display: flex;
		align-items: center;
		height: 40vh;
	}

	.header image {
		width: 200rpx;
		margin: 0 auto;
		align-items: center;
	}

	/* 头像 end */


	/* 登录按钮 start */
	.login {
		position: fixed;
		top: 48%;
		margin: 0 auto;
		padding: 0 20rpx;
	}

	.logn-button {
		outline: none;
		width: 710rpx;
		border-radius: 50rpx;
	}

	.login-wechat {
		color: #FFFFFF;
		margin-top: 50rpx;
		background-color: #85a82b;
	}

	.wechat {
		height: 80rpx;
		line-height: 80rpx;
	}

	.wechat-icon {
		margin: 0 10rpx;
		width: 33rpx;
		vertical-align: middle;
	}

	.login-phone {
		background-color: #ed6d46;
		margin-top: 40rpx;
		color: #FFFFFF;
	}

	.register {
		border: 0;
		margin-top: 50rpx;
		color: #ED6D46;
		background-color: #EFE7E6;
	}

	/* 登录按钮 end */
</style>
