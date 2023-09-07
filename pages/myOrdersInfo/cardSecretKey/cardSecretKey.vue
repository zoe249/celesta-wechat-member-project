<template>
	<view>
		<view class="content">
			<view class="verification-code">
				<view class="phone">
					<view>已验证手机号</view>
					<view>{{ phone }}</view>
					<view>点击“获取验证码”，并输入收到的验证码，即可获取卡秘钥</view>
				</view>
				<view class="code-input">
					<view>
						<input class="other-input" v-model="phoneCode" type="number" maxlength="6" placeholder="请输入验证码" @input="setPhoneCode" />
					</view>
					<view class="get-code" v-if="isGetCode" @tap="$u.throttle(getCode, 2000)">获取验证码</view>
					<view v-else> {{ countDown + 's' }} </view>
				</view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="navigation">
			<view class="navigation-but" @click="getSecretKey">获取卡密钥</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isGetCode: true, // 是否可以获取验证码
				phoneCode: '', // 验证码
				receivedPhoneCode: '', // 发送的验证码
				countDown: 59, // 验证码倒计时
				phone: '', // 手机号
				orderNum: '', // 订单编号
				orderId: '', // 订单 Id
			}
		},
		onLoad(option) {
			console.log(option);
			this.phone = option.phone
			this.orderNum = option.orderNum
			this.orderId = option.orderId
		},
		methods: {
			// 输入手机验证码
			setPhoneCode(event) {
				this.phoneCode = event.detail.value
			},
			// 获取验证码
			getCode() {
				if(!this.isGetCode) return
				uni.showLoading({
					title: '发送中',
				})
				let that = this
				that.request({
					url: that.config.verificationCodes + that.phone,
				}).then(res => {
					console.log(res);
					uni.hideLoading() // 取消发送中
					if(res.statusCode == 200) {
						that.isGetCode = false
						let data = res.data
						console.log(data);
						that.receivedPhoneCode = data
						uni.showModal({
						    content: '您的验证码为：' + data,
							showCancel: false,
							confirmText: '知道了',
						    success: function (res) {}
						});
						let countDown = setInterval(() => {
							this.countDown--
							if(this.countDown <= -1) {
								this.isGetCode = true
								this.countDown = 59
								clearInterval(countDown);
							}
						}, 1000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 获取卡密钥
			getSecretKey() {
				// 校验是否输入验证码
				if(this.phoneCode.length <= 0) {
					return uni.showToast({
						title: '请先输入验证码',
						icon: 'none'
					})
				}
				// 校验验证码
				if(this.phoneCode != this.receivedPhoneCode) {
					return uni.showToast({
						title: '验证码输入错误',
						icon: 'none'
					})
				}
				uni.redirectTo({
					url: '../cardSecretKeyList/cardSecretKeyList?code=' + this.phoneCode + '&orderNum=' + this.orderNum + '&orderId=' + this.orderId
				})
			}
		}
	}
</script>

<style>
	page {
		width: 100vw;
		height: 100vh;
		background-color: #FFFFFF;
	}
	
	/* 验证码 start */
	.content {
		position: fixed;
		top: 0;
		width: 100%;
	}
	
	.verification-code {
		margin-top: calc(50vh - 350rpx);
		padding: 20rpx 50rpx;
	}
	
	.phone {
		text-align: center;
		line-height: 60rpx;
		font-size: 24rpx;
		color: #999999;
	}
	
	.phone>view:nth-child(2) {
		font-size: 30rpx;
		font-weight: 600;
		color: #333333;
	}
	
	.code-input {
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		margin-top: 40rpx;
		border-bottom: 2rpx solid #999999;
	}
	
	.code-input>view:nth-child(1) {
		width: 450rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}
	
	.code-input>view:nth-child(2) {
		width: 140rpx;
		height: 40rpx;
		margin: 20rpx 20rpx;
		font-size: 22rpx;
		text-align: center;
		line-height: 40rpx;
		color: #999999;
		border-radius: 20rpx;
	}
	
	.code-input>view.get-code {
		font-size: 20rpx;
		border: 2rpx solid #999999;
	}
	
	.code-input>view.get-code-num {
		width: 140rpx;
		height: 40rpx;
		margin: 20rpx 20rpx;
		font-size: 22rpx;
		text-align: center;
		line-height: 40rpx;
		color: #999999;
		border-radius: 20rpx;
	}
	
	.other-input {
		height: 80rpx;
		color: #333333;
		line-height: 80rpx;
	} 
	
	
	/* 验证码 end */
	
	/* 底部操作栏 start */
	.navigation {
		position: fixed;
		bottom: 0;
		width: 750rpx;
		height: 100rpx;
		padding: 20rpx 0;
		background-color: #FFFFFF;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.navigation-but {
		width: 710rpx;
		height: 80rpx;
		margin: 0 20rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 80rpx;
		background: #ED6D46;
		border-radius: 40rpx;
	}
	
	/* 底部操作栏 end */

</style>
