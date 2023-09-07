<template>
	<view class="">
		<!-- <u-navbar back-text="" title="微信绑定" @custom-back="customBack"></u-navbar> -->
		
		<view class="header" :style="{ height: statusBarHeight + 'px' }">
			<view class="header-view">
				<view class="header-icon" @click="returnHome">
					<u-icon name="arrow-left" size="50"></u-icon>
				</view>
				<view class="header-title">微信绑定</view>
			</view>
		</view>
		
		<!-- 加载 -->
		<yp-loading ref="loading" :type="2"></yp-loading>
		
		<view class="top-text">
			<text>该手机号已注册会员，是否绑定微信账号</text>
		</view>
		<view class="content">
			<u-form :model="form" ref="uForm">
				<view class="content-text">
					<view class="text-name">
						会员卡号
					</view>
					<view class="text-contene">
						<u-input v-model="memberInfo.cardNumber" height="90" :disabled="true" />
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						手机号
					</view>
					<view class="text-contene">
						<u-input v-model="memberInfo.phone" height="90" :disabled="true" />
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						真实姓名
					</view>
					<view class="text-contene">
						<u-form-item prop="realName" label-position="top">
							<u-input v-model="memberInfo.realName" height="60" :disabled="true" placeholder='真实姓名' />
						</u-form-item>
					</view>
					<view class="choice choice-action" v-if="memberInfo.gender == 1">
						先生
					</view>
					<view class="choice choice-action" v-if="memberInfo.gender == 2">
						女士
					</view>
					<view class="choice choice-action" v-if="memberInfo.gender == 0">
						未知
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						当前积分
					</view>
					<view class="text-contene">
						<u-input v-model="memberInfo.point" height="90" :disabled="true" />
					</view>
				</view>
			</u-form>
		</view>
		<view class="bottom-button">
			<!-- <view class="bottom-determine" @click="requestWeChat">绑定微信</view> -->
			<button class="bottom-determine" hover-class="none" @tap="onGotUserInfo">绑定微信</button>
			<view class="bottom-cancel" @click="cancelBinding">注册新会员</view>
		</view>
		
		
		
		
		<!-- 获取验证码 -->
		<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange"></u-verification-code>
		<!--打开获取验证码模态框  -->
		<u-modal v-model="show" :content="content" title="验证码" :show-cancel-button="true"></u-modal>

	</view>
</template>

<script>
	import ypLoading from '@/components/yp-loading/yp-loading.vue'
	export default {
		components: {
			ypLoading
		},
		data() {
			return {
				VipCardNumber: '', //会员卡号或手机号
				verificationCode: '', // 手机验证码
				memberInfo: {}, // 会员信息
				integral: '0', // 积分
				form: {
					SMSCode: '', //短信验证码
					realName: '', //会员真实姓名
				},
				rules: {
					SMSCode: [{
						required: true,
						message: '请输入短信验证码',
						trigger: 'blur',
					}],
					realName: [{
						required: true,
						message: '请输入真实姓名',
						trigger: 'blur',
					}],
				},
				tips: '',
				seconds: 60,
				show: false, //打开模拟框
				content: ``,
				statusBarHeight: 0,
			}
		},
		onShow() {
			// 自动检测高度
			this.getHeight()
		},
		onLoad(options) {
			let option = JSON.parse(options.resData)
			this.memberInfo = option
			// 获取 code
			this.getCode()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 自动检测高度
			getHeight() {
				let that = this
				uni.getSystemInfo({  
				    success: e => {  
				        let StatusBar = e.statusBarHeight;  
				        let rect = wx.getMenuButtonBoundingClientRect();  
				        if (e.system.toLowerCase().indexOf('ios') > -1) {  
				            //IOS  
				            let customBar = rect.bottom + (rect.top - e.statusBarHeight) * 2;  
							that.statusBarHeight = customBar
				        } else {  
				            //安卓  
				            let headerBar = rect.height + (rect.top - e.statusBarHeight) * 2;  
				            let customBar = headerBar + e.statusBarHeight;
							that.statusBarHeight = customBar
				        }  
				    }  
				});
			},
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
			// 点击获取用户信息
			onGotUserInfo(e) {
				let that = this
				let userInfo = uni.getStorageSync('userInfo') 
				if(userInfo.nickName) {
					// 绑定微信
					this.requestWeChat()
				} else {
					wx.getUserProfile({
						desc:'正在获取', //不写不弹提示框
						success: res => {
							uni.setStorageSync('userInfo', res.userInfo)
							console.log(res.userInfo);
							// 绑定微信
							this.requestWeChat()
						}
					})
				}
			},
			// 绑定微信
			requestWeChat() {
				let that = this
				let memberInfo = that.memberInfo
				uni.showModal({
				    title: '提示',
				    content: '确定要绑定此微信吗？',
				    success: function (res) {
				        if (res.confirm) {
				            that.$refs.loading.open()
							let userInfo = uni.getStorageSync('userInfo')
				            that.request({
				            	url: that.config.memberBinding + memberInfo.memberId + '/unionId',
				            	method: 'PUT',
				            	header: {
				            		'Content-Type': 'application/json; charset=utf-8'
				            	},
				            	data: {
				            		unionId: that.memberInfo.unionId,
				            		openId: that.memberInfo.openId,
				            		appCode: '00',
									avatarUrl: userInfo.avatarUrl,
									country: userInfo.country,
									province: userInfo.province,
									city: userInfo.city
				            	}
				            }).then(res => {
				            	let data = res.data
				            	that.$refs.loading.close()
				            	if (res.statusCode == 200 && data.message == '请求成功') {
				            		// 重新调用自动登录
				            		that.onLogin()
				            	} else {
				            		uni.showToast({
				            			title: data.detail,
				            			icon: 'none'
				            		})
				            	}
				            })
				        }
				    }
				});
			},
			// 登录
			onLogin() {
				let that = this
				uni.removeStorageSync('token')
				that.$refs.loading.open()
				that.request({
					url: that.config.getLogin + '?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
						that.code + '&appCode=00',
					method: 'POST',
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
				}).then(res => {
					// 用户存在
					let data = res.data
					that.$refs.loading.close()
					// 已注册已绑定 缓存 Token
					if (res.statusCode == 200 && data.access_token) {
						// 保存 token 到全局
						uni.setStorageSync('token', data.access_token)
						// 获取会员用户
						that.memberUser()
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
						// 重新获取 code
						that.getCode()
					}
				})
			},
			/* 获取验证码 */
			codeChange(text) {
				this.tips = text;
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
						that.$refs.loading.close()
						if (res.data.detail == 1) { // 存在已领取
							// 已注册已领取 完成
							uni.redirectTo({
								url: '../../home/index'
							})
						} else if (res.data.detail == 0) {
							// 跳转领取会员卡
							uni.redirectTo({
								url: '../../receiveCard/receiveCard'
							})
						} else { // 未关注公众号
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
							setTimeout(() => {
								// 进入首页
								uni.redirectTo({
									url: '../../home/index'
								})
							}, 2000)
						}
					}
				})
			},
			// 注册新会员
			cancelBinding() {
				let that = this
				uni.showModal({
				    title: '提示',
				    content: '确定要注册新会员吗？',
				    success: function (res) {
				        if (res.confirm) {
				            uni.removeStorageSync('token')
				            that.$refs.loading.open()
							let companyCode = that.config.companyCode
				            that.request({
				            	url: that.config.newMember,
				            	method: 'POST',
				            	header: {
				            		'Content-Type': 'application/json; charset=utf-8'
				            	},
				            	data: {
									registrationOrganizationCode: companyCode.organizationCode, // 组织
									registrationChannelCode: companyCode.channelCode, // 渠道
									registrationTerminalCode: companyCode.terminalCode, // 终端
									phone: that.memberInfo.phone, // 手机号
									unionId: that.memberInfo.unionId,
									openId: that.memberInfo.openId,
									avatar: that.memberInfo.avatarUrl, // 头像
									gender: that.memberInfo.gender, // 性别
									realName: that.memberInfo.realName, // 真实姓名
									memberAddressList: [], // 地址
									country: that.memberInfo.country,
									province: that.memberInfo.province,
									city: that.memberInfo.city,
									status: true,
									cardLevel: '01'
				            	}
				            }).then(res => {
				            	// 用户注册成功
				            	let data = res.data
				            	that.$refs.loading.close()
				            	if (res.statusCode == 200 && data.message == '请求成功') {
				            		// 先获取 code 再重新调用登录
				            		that.getCode('onLogin')
				            		// that.onLogin()
				            	} else {
				            		uni.showToast({
				            			title: data.detail,
				            			icon: 'none'
				            		})
				            	}
				            })
				        }
				    }
				});
			},
			// 触发返回
			returnHome() {
				uni.redirectTo({
					url: '../../home/index-unauthorized'
				})
			}
		},
	}
</script>

<style lang="less">
	page {
		font-size: 28rpx;
		background-color: #EFF5F8;
	}
	
	/* 自定义头部 start */
	.header {
		position: relative;
		background-color: #FFFFFF;
	}
	
	.header-view {
		display: flex;
		position: absolute;
		bottom: 20rpx;
	}
	
	.header-icon {
		margin-left: 10rpx;
	}
	
	.header-title {
		width: 630rpx;
		margin-right: 60rpx;
		font-size: 30rpx;
		line-height: 50rpx;
		text-align: center;
	}
	
	/* 自定义头部 end */

	.top-text {
		font-weight: 600;
		padding: 0 20rpx;
		width: 750rpx;
		background-color: #FDF0EC;
		height: 70rpx;
		line-height: 70rpx;
	}

	.content {
		background-color: #FFFFFF;
		padding: 0 20rpx;
	}

	.content-text {
		display: flex;
	}

	.text-name {
		width: 150rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.text-contene {
		width: 550rpx;
	}
	
	.text-gender {
		display: flex;
		// flex-direction: row-reverse;
		// justify-content: center;
	}
	
	.choice {
		margin: 20rpx auto;
		width: 100rpx;
		height: 50rpx;
		background-color: #a8a8a0;
		border-radius: 10rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
	}
	
	.choice-action {
		background-color: #ED6D46;
	}

	.text-Code {
		width: 150rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.text-input {
		width: 340rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.bottom-Code {
		margin: 20rpx auto;
		width: 200rpx;
		height: 50rpx;
		background-color: #ED6D46;
		border-radius: 10rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
	}

	.bottom-button {
		position: fixed;
		bottom: 0;
		display: flex;
		margin: 20rpx 0 100rpx;

		view {
			margin: 0 20rpx;
			width: 335rpx;
			height: 90rpx;
			font-size: 30rpx;
			line-height: 90rpx;
			text-align: center;
			border-radius: 90rpx;
		}
	}

	.bottom-cancel {
		background-color: #EFE7E6;
		border: 1rpx solid #ED6D46;
		color: #ED6D46;
	}

	.u-form-item {
		padding: 0 !important;
	}
	
	.bottom-determine {
		width: 335rpx;
		margin: 0 20rpx;
		color: #FFFFFF;
		outline: none;
		border-radius: 50rpx;
		background-color: #ED6D46;
		line-height: 90rpx;
		font-size: 30rpx;
		text-align: center;
		border-radius: 90rpx;
	}
	
</style>
