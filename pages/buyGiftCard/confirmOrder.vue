<template>
	<view>
		<!-- 手机号 / 验证码 -->
		<view class="verification-code">
			<view class="phone">
				<view>手机号</view>
				<view>
					<input class="other-input" v-model="phone" type="number" maxlength="11" placeholder="手机号" @input="setInput" />
				</view>
			</view>
			<view class="phone">
				<view>验证码</view>
				<view>
					<input class="other-input" v-model="phoneCode" type="number" maxlength="6" placeholder="请输入验证码" @input="setPhoneCode" />
				</view>
				<!-- <view>获取验证码</view> -->
				<view class="get-code" v-if="isGetCode" @tap="$u.throttle(getCode, 2000)">获取验证码</view>
				<view v-else> {{ countDown + 's' }} </view>
			</view>
			<view class="phone-tips">
				<u-icon name="error-circle-fill" color="#aeaeb0" size="35"></u-icon>
				<view class="">该手机号码用于订单支付成功后获取礼品卡激活秘钥</view>
			</view>
		</view>
		
		<!-- 礼品卡 -->
		<view class="gift-card">
			<view class="card-item">
				<view class="card-item-info">
					<image :src="selectCard.logo" mode=""></image>
					<view class="card-item-goods">
						<view>{{ selectCard.productName }}</view>
						<view>面值：{{ selectCard.faceValue }}</view>
						<view>¥ {{ selectCard.faceValue * orderInfo.quantity }}</view>
					</view>
				</view>
				<view class="card-item-num">x{{ orderInfo.quantity }}</view>
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="order-info-item">
				<view>支付方式</view>
				<view>微信支付</view>
			</view>
			<view class="order-info-item">
				<view>商品金额</view>
				<view>¥ {{ selectCard.faceValue * orderInfo.quantity }}</view>
			</view>
			<view class="order-info-item" @click="drawABill">
				<view>发票信息</view>
				<view>
					<view class="">不开发票</view>
					<u-icon name="arrow-right" color="#686868" size="25"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="navigation">
			<view class="total-fee">
				<view>合计：</view>
				<view>¥{{ totalFee }}</view>
			</view>
			<view class="navigation-but" @click="placeOrder">提交订单（{{ giftNum }}）</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberInfo: uni.getStorageSync('memberInfo'),
				isGetCode: true, // 是否可以获取验证码
				phone: '', // 手机号
				phoneCode: '', // 手机验证码
				receivedPhoneCode: '', // 收到的手机验证码
				countDown: 59, // 验证码倒计时
				totalFee: '', // 合集金额
				giftNum: 1, // 礼品卡方案数量
				orderInfo: {}, // 确认订单信息
				selectCard: {}, // 选择的礼品卡信息
				payments: {}, // 支付参数
			}
		},
		onLoad(options) {
			let option = JSON.parse(options.orderInfo)
			let selectCard = JSON.parse(options.selectCard)
			console.log(option);
			console.log(selectCard);
			
			this.orderInfo = option
			this.selectCard = selectCard
			this.totalFee = option.totalPrice
			this.phone = option.phone
		},
		methods: {
			// 输入手机号
			setInput(event) {
				this.phone = event.detail.value
			},
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
			// 提交订单
			placeOrder() {
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
						title: '请正确输入验证码',
						icon: 'none'
					})
				}
				let that = this
				let orderInfo = this.orderInfo
				that.request({
					url: that.config.getGiftCardOrder,
					method: 'POST',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						quantity: orderInfo.quantity,
						salePrice: orderInfo.salePrice,
						giftCardSchemeId: orderInfo.giftCardSchemeId,
						phone: that.phone,
						organizationCode: orderInfo.organizationCode,
						channelsCode: orderInfo.channelsCode,
						terminalsCode: orderInfo.terminalsCode,
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode == 200) {
						let data = res.data.data
						console.log(data);
						// 获取支付参数
						that.getPaymentData(data)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 获取支付参数
			getPaymentData(orderId) {
				// 价格
				let companyCode = this.config.companyCode
				let attach = uni.getStorageSync('memberInfo').id + ',' + companyCode.organizationCode + ',' + companyCode.channelCode + ',' + companyCode.terminalCode 
				let that = this
				uni.showLoading({
					title: '加载中',
				})
				// 获取支付参数
				uni.login({
					success: res => {
						that.code = res.code
						that.request({
							url: that.config.getWechatPay + '?code=' + res.code + '&giftCardSchemeOrderId=' + orderId + '&detail=' + '购买礼品卡' + '&attach=' + attach +
								'&body=购买礼品卡&price=' + that.totalFee + '&quantity=1' + '&type=' + '02',
													// that.totalFee
							method: 'POST'
						}).then(res => {
							console.log(res);
							if(res.statusCode == 200) {
								that.payments = res.data
								// 调用微信支付
								that.startWeixinPay(orderId)
							} else {
								uni.hideLoading() // 取消加载中
								uni.showToast({
									title: res.data.detail,
									icon: 'none'
								})
							}
						})
					}
				})
			},
			// 调用微信支付
			startWeixinPay(orderId) {
				let that = this
				let payment = that.payments
				uni.requestPayment({
					timeStamp: payment.timeStamp,
					nonceStr: payment.nonceStr,
					package: payment.package,
					signType: payment.signType,
					paySign: payment.paySign,
					success(res) {
						uni.hideLoading() // 取消加载中
						uni.showToast({
							title: '支付成功',
							icon: 'success'
						})
						console.log('支付成功', res);
						setTimeout(() => {
							uni.redirectTo({
								url: './paymentSuccess?fee=' + that.totalFee + '&id=' + orderId
							})
						}, 1500)
					},
					fail(err) {
						uni.hideLoading() // 取消加载中
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						})
						console.log('支付失败', err);
						setTimeout(() => {
							uni.redirectTo({
								url: '../myOrdersInfo/myOrdersInfo?id=' + orderId
							})
						}, 1500)
					}
				})
			},
			// 开发票
			drawABill() {
				uni.showToast({
					title: '暂不支持',
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
	/* 验证码 start */
	.verification-code {
		margin: 20rpx 20rpx 0;
		padding: 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.phone {
		display: flex;
		height: 80rpx;
	}
	
	.phone>view:nth-child(1) {
		width: 130rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}
	
	.phone>view:nth-child(2) {
		width: 230rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}
	
	.phone>view:nth-child(3) {
		width: 140rpx;
		height: 40rpx;
		margin: 20rpx 20rpx;
		font-size: 22rpx;
		text-align: center;
		line-height: 40rpx;
		color: #999999;
		border-radius: 20rpx;
	}
	
	.phone>view:nth-child(3).get-code {
		font-size: 20rpx;
		border: 2rpx solid #999999;
	}
	
	.other-input {
		height: 80rpx;
		color: #333333;
		line-height: 80rpx;
	} 
	
	.phone-tips {
		display: flex;
		height: 60rpx;
		line-height: 65rpx;
	}
	
	.phone-tips>view {
		margin-left: 5rpx;
		font-size: 24rpx;
		line-height: 60rpx;
		color: #aeaeb0;
	}
	
	/* 验证码 end */
	
	/* 礼品卡 start */
	.gift-card {
		margin: 20rpx 20rpx 0;
		padding: 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.card-item {
		display: flex;
		justify-content: space-between;
	}
	
	.card-item-info {
		display: flex;
		width: 520rpx;
		height: 150rpx;
	}
	
	.card-item-info>image {
		width: 100rpx;
		height: 100rpx;
		margin: 25rpx 30rpx 25rpx 0;
	}
	
	.card-item-goods {
		width: 400rpx;
		height: 100rpx;
		margin: 25rpx 0;
		font-size: 24rpx;
		line-height: 33rpx;
		color: #999999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.card-item-goods>view:nth-child(3) {
		font-size: 26rpx;
		line-height: 33rpx;
		color: #C83C23;
	}
	
	.card-item-num {
		width: 150rpx;
		height: 150rpx;
		text-align: right;
		line-height: 150rpx;
		font-size: 30rpx;
		font-weight: 600;
	}
	
	/* 礼品卡 end */
	
	/* 订单信息 start */
	.order-info {
		/* height: 300rpx; */
		margin: 20rpx 20rpx 0;
		padding: 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.order-info-item {
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		padding: 0 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 80rpx;
		color: #999999;
	}
	
	.order-info-item>view:nth-child(2) {
		display: flex;
		color: #333333;
	}
	
	/* 订单信息 end */
	
	/* 底部操作栏 start */
	.navigation {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		width: 750rpx;
		height: 100rpx;
		padding: 30rpx 0;
		background-color: #FFFFFF;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.total-fee {
		display: flex;
		width: 200rpx;
		margin-left: 20rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 80rpx;
	}
	
	.total-fee view:nth-child(2) {
		font-size: 30rpx;
		color: #EA0125;
		font-weight: 600;
	}
	
	.navigation-but {
		width: 500rpx;
		height: 80rpx;
		margin: 0 20rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 80rpx;
		background: linear-gradient(270deg, #FF4B2B 0%, #FF8F67 100%);
		border-radius: 40px;
	}
	
	/* 底部操作栏 end */

</style>
