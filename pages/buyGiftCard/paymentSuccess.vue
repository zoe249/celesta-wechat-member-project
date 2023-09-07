<template>
	<view>
		<view class="not-activity">
			<image :src="imgUrl + '/paymentSuccess.png'" mode=""></image>
			<view class="order-success">支付成功</view>
			<view class="order-fee">订单金额：¥{{ orderFee }}</view>
			<view class="navigate">
				<view class="go-order-info" @click="goOrderInfo">查看订单</view>
				<view @click="goHome">回首页</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				orderFee: '',
				orderId: '',
			}
		},
		onLoad(option) {
			this.orderFee = option.fee
			this.orderId = option.id
		},
		methods: {
			// 查看订单
			goOrderInfo() {
				uni.redirectTo({
					url: '../myOrdersInfo/myOrdersInfo?id=' + this.orderId
				})
			},
			// 回首页
			goHome() {
				uni.reLaunch({
					url: '../home/index'
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
	
	.not-activity {
		/* width: 350rpx; */
		margin: 30% auto 0;
	}
	
	.not-activity>image {
		display: block;
		width: 112rpx;
		height: 112rpx;
		margin: 0 auto 40rpx;
	}
	
	.order-success {
		text-align: center;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		line-height: 60rpx;
	}
	
	.order-fee {
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		line-height: 60rpx;
	}
	
	.navigate {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 40rpx;
	}
	
	.navigate>view {
		width: 250rpx;
		height: 75rpx;
		margin: 25rpx 30rpx;
		background-color: #FFFFFF;
		border: 2rpx solid #C83C23;
		border-radius: 10rpx;
		text-align: center;
		font-size: 28rpx;
		color: #C83C23;
		line-height: 75rpx;
	}
	
	.navigate>view:nth-child(2) {
		color: #FFFFFF;
		background-color: #C83C23;
	}

</style>
