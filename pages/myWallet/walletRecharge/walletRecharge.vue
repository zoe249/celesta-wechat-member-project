<template>
	<view>
		<!-- 充值 -->
		<view class="recharge">
			<!-- 余额 -->
			<view class="balance">
				<view>钱包余额</view>
				<view>¥ {{ balance }}</view>
			</view>
			<!-- 充值方案 -->
			<view class="electronic-card">
				<view class="electronic-card-title">请选择充值金额</view>
				<view class="face-value">
					<view :class=" choiceIndex == index + 1 ? 'gift choice' : 'gift'" v-for="(item, index) in faceValues" :key="index" @click="choiceGiftCard(item, index)">¥{{ item.fee }}</view>
				</view>
				<view class="other-face-value">
					<view>其他面值</view>
					<view>
						¥
						<input class="other-input" v-model="moneyNum" type="number" maxlength="4" placeholder="输入1-1000的整数" @focus="getInput" @input="setInput" />
					</view>
				</view>
			</view>
		</view>
		
		<!-- 充值活动规则 -->
		<view class="recharge-rule" v-if="activity.id">
			<view class="rule-title">{{ activity.name }}</view>
			<view class="rule-text" v-for="(item, index) in activity.ruleDescriptionArray">{{ item }}</view>
		</view>
		
		<!-- 充值规则 -->
		<view class="recharge-rule" v-else>
			<view class="rule-title">钱包充值规则</view>
			<view class="rule-text">1. 充值金额可购买门店线上线下商品；</view>
			<view class="rule-text">2. 充值金额不计利息，不可提现，退款和转赠；</view>
			<view class="rule-text">3. 单笔充值上限1000元，充值成功后，您的充值金额将会实时充值您的包账户；</view>
			<view class="rule-text">4. 使用钱包余额购买的订单，退换货订单产生的退款将返回钱包余额；</view>
			<view class="rule-text">5. 余额有效期：永久有效；</view>
		</view>
		
		<!-- 隔离层 -->
		<view class="quarantine"></view>
		
		<!-- 赠送规则 -->
		<view class="give" v-if="activity.id">
			<view class="gift-rules">
				<image src="../../../static/goods/gift-rules-icon.png" mode=""></image>
				<view v-if="activity.savingsActivityPrize[0].prizeType == 1">充{{ activity.savingsActivityPrize[0].savingsAmount }}元送{{ activity.savingsActivityPrize[0].givenAmount }}元</view>
				<view v-else>充{{ activity.savingsActivityPrize[0].savingsAmount }}元送{{ activity.savingsActivityPrize[0].couponTemplateName }}</view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="navigation">
			<view class="recharge-money">
				<view>充值金额</view>
				<view>￥{{ paymentMoney }}</view>
			</view>
			<view class="navigation-but" @click="goRecharge">立即充值</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberInfo: uni.getStorageSync('memberInfo'),
				choiceIndex: 1, // 选择面值第几个
				paymentMoney: 0, // 需要支付的金额
				moneyNum: '', // 其他金额
				payments: {}, // 支付参数
				faceValues: [
					{
						fee: 100,
					}, {
						fee: 200,
					}, {
						fee: 300,
					}, {
						fee: 500,
					}, {
						fee: 800,
					}, {
						fee: 1000,
					}
				],
				balance: '', // 余额
				activity: {}, // 满足充值的活动
			}
		},
		onLoad() {
			// 小程序查询充值金额
			this.getFaveValues()
			// 获取余额
			this.getBalance()
			
			// 查询满足充值的活动
			this.getSatisfy()
		},
		methods: {
			// 小程序查询充值金额
			getFaveValues(){
				let that = this 
				that.request({
					url: that.config.getFaveValues,
				}).then(res => {
					if(res.data.data.length && res.data.data.length > 0){
						that.faceValues = res.data.data.map(item => ({fee: item}))
						// 需要支付的金额
						that.paymentMoney = that.faceValues[0].fee
						that.getSatisfy()
					}else {
						that.faceValues = []
					}
				})
			},
			// 获取余额
			getBalance() {
				let that = this
				that.request({
					url: that.config.pointTypes,
					data: {
						memberId: that.memberInfo.id,
						type: '03'
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200) {
						data.forEach((item) => {
							if(item.type == '03') {
								that.balance = item.balance
							}
						})
					}
				})
			},
			// 选择礼品卡
			choiceGiftCard(event, index) {
				this.paymentMoney = Number(event.fee)
				this.faceValue = Number(event.fee)
				this.choiceIndex = index + 1
				// 查询满足充值的活动
				this.getSatisfy()
			},
			// 其他金额输入
			setInput(event) {
				let value = event.detail.value
				if(value.length <= 0) {
					this.paymentMoney = 0
					return 
				} else {
					this.moneyNum = event.detail.value
					this.paymentMoney = Number(event.detail.value)
					// 查询满足充值的活动
					this.getSatisfy()
				}
			},
			// 查询满足充值的活动 
			getSatisfy() {
				let that = this
				that.request({
					url: that.config.getSatisfy,
					data: {
						savingsAmount: that.paymentMoney
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) return
					let data = res.data
					if(data.id != null) {
						data.ruleDescriptionArray = data.ruleDescription.split('\n')
						that.activity = data
					} else {
						that.activity = {}
					}
				})
			},
			getInput() {
				console.log(this.moneyNum);
				this.paymentMoney = Number(this.moneyNum)
				// 查询满足充值的活动
				this.getSatisfy()
				this.choiceIndex = 0
			},
			// // 校验充值上限
			// goRecharge() {
			// 	let that = this
			// 	that.request({
			// 		url: that.config.getRechargeLimit,
			// 	}).then(res => {
			// 		console.log(res);
			// 		if(res.statusCode == 200) {
			// 			let data = res.data
			// 			if(data.singleAmount != null && ( Number(that.paymentMoney) > Number(data.singleAmount) )) {
			// 				return uni.showToast({
			// 					title: '充值金额上限' + data.singleAmount + '元',
			// 					icon: 'none'
			// 				})
			// 			} else {
			// 				// 充值
			// 				that.getRecharge()
			// 			}
			// 		} else {
			// 			uni.showToast({
			// 				title: res.data.detail,
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// },
			// 充值
			goRecharge() {
				// if(this.paymentMoney <= 0 ) {
				// 	return uni.showToast({
				// 		title: '充值金额必须大于0元',
				// 		icon: 'none'
				// 	})
				// }
				if(this.paymentMoney < 1 || this.paymentMoney > 1000 ) {
					return uni.showToast({
						title: '充值金额仅限1 ~ 1000元',
						icon: 'none'
					})
				}
				const regNumber = /^[0-9]*$/
				if(!regNumber.test(Number(this.paymentMoney))){
					return uni.showToast({
						title: '请输入1-1000的整数',
						icon: 'none'
					})
				}
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
							url: that.config.getWechatPay + '?code=' + res.code + '&detail=' + '钱包充值' + '&attach=' + attach +
								'&body=钱包充值&price=' + that.paymentMoney + '&quantity=1' + '&type=' + '03',
													// that.paymentMoney
							method: 'POST'
						}).then(res => {
							console.log(res);
							if(res.statusCode == 200) {
								that.payments = res.data
								// 调用微信支付
								that.startWeixinPay()
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
			startWeixinPay() {
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
						// 获取余额
						that.getBalance()
					},
					fail(err) {
						console.log(err);
						uni.hideLoading() // 取消加载中
						// 支付失败调用取消订单
						that.cancelOrder()
					}
				})
			},
			// 支付失败调用取消订单
			cancelOrder() {
				let that = this
				that.request({
					url: that.config.cancelOrder + that.payments.orderId,
					method: 'DELETE'
				}).then(res => {
					// 取消订单
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				})
			},
		}
	}
</script>

<style>
	/* 充值 start */
	.recharge {
		width: 100%;
		/* height: 500rpx; */
		padding-top: 20rpx;
		background-color: #FFFFFF;
	}
	
	.balance {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		margin: 0 20rpx;
		padding: 0 30rpx;
		background-color: #333333;
		border-radius: 20rpx 20rpx 0 0;
	}
	
	.balance>view:nth-child(1) {
		font-size: 28rpx;
		line-height: 100rpx;
		color: #E6B991;
	}
	
	.balance>view:nth-child(2) {
		font-size: 40rpx;
		font-weight: 600;
		line-height: 100rpx;
		color: #DDB28C;
	}
	
	/* 充值 end */
	
	/* 充值方案 start */
	.electronic-card {
		width: 100%;
		background-color: #FFFFFF;
	}
	
	.electronic-card-title {
		margin: 0 20rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}
	
	.face-value {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		width: 710rpx;
		margin: 0 20rpx;
	}
	
	.face-value>view {
		width: calc(33.3% - 15rpx);
		height: 100rpx;
		margin: 7rpx 5rpx;
		text-align: center;
		font-size: 28rpx;
		line-height: 100rpx;
		color: #666666;
		background: #EEEEEE;
		border: 2rpx solid #DDDDDD;
		border-radius: 10rpx;
	}
	
	.gift.choice {
		color: #ED6D46;
		background: rgba(255, 103, 68, 0.1);
		border: 2rpx solid #FF6744;
	}
	
	.other-face-value {
		display: flex;
		justify-content: space-between;
		margin: 0 20rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #333333;
	}
	
	.other-face-value>view:nth-child(2) {
		display: flex;
		width: 280rpx;
		font-size: 40rpx;
		font-weight: 600;
	}
	
	.other-face-value>view:nth-child(2) .other-input {
		height: 100rpx;
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #333333;
		font-weight: 400;
		line-height: 100rpx;
	}
	
	/* 充值方案 end */
	
	/* 充值规则 start */
	.recharge-rule {
		margin: 20rpx 20rpx 0;
		height: 300rpx;
	}
	
	.rule-title {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		color: #333333;
	}
	
	.rule-text {
		font-size: 22rpx;
		color: #333333;
		line-height: 40rpx;
	}
	
	.quarantine {
		height: 220rpx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	/* 充值规则 end */
	
	/* 赠送规则 start */
	.give {
		position: fixed;
		bottom: 120rpx;
		width: 100%;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.gift-rules {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 60rpx;
		background-color: #FDF0EC;
	}
	
	.gift-rules>image {
		width: 24rpx;
		height: 26rpx;
		margin: 17rpx 20rpx;
	}
	
	.gift-rules>view {
		font-size: 26rpx;
		font-weight: 400;
		line-height: 60rpx;
		color: #ED6D46;
	}
	
	/* 赠送规则 end */
	
	/* 底部操作栏 start */
	.navigation {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		width: 710rpx;
		height: 120rpx;
		padding: 0 20rpx;
		background-color: #FFFFFF;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.recharge-money {
		display: flex;
		font-size: 20rpx;
		line-height: 120rpx;
		color: #333333;
	}
	
	.recharge-money>view:nth-child(2) {
		margin-left: 15rpx;
		font-size: 32rpx;
		font-weight: 600;
		line-height: 120rpx;
	}
	
	.navigation-but {
		width: 240rpx;
		height: 60rpx;
		margin: 30rpx 0;
		text-align: center;
		font-size: 30rpx;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 60rpx;
		background: #ED6D46;
		border-radius: 30rpx;
	}
	
	/* 底部操作栏 end */

</style>
