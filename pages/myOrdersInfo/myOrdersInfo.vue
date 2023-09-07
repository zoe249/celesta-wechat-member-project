<template>
	<view>
		<!-- 状态 -->
		<view class="order-state" v-if="orderInfo.orderStatus == 'Completed'">已完成</view>
		<view class="order-state" v-if="orderInfo.orderStatus == 'Refunded'">退款</view>
		<view class="order-state" v-if="orderInfo.orderStatus == 'WillPayment'">待付款</view>
		<view class="order-state" v-if="orderInfo.orderStatus == 'Cancelled'">已取消</view>
		
		<!-- 手机号 -->
		<view class="verification-code">
			<view class="phone">
				<view>订单编号</view>
				<view>{{ orderInfo.orderNum }}</view>
				<view @click="copyCode">复制</view>
			</view>
			<view class="phone">
				<view>下单时间</view>
				<view>{{ orderInfo.createAt }}</view>
			</view>
			<view class="phone">
				<view>手机号</view>
				<view>{{ orderInfo.phone }}</view>
			</view>
		</view>
		
		<!-- 礼品卡 -->
		<view v-if="orderInfo.type == '02'" class="gift-card">
			<view class="card-item">
				<view class="card-item-info">
					<image :src="orderInfo.giftCardScheme.logo" mode=""></image>
					<view class="card-item-goods">
						<view>{{ orderInfo.giftCardScheme.productName }}</view>
						<view>面值：{{ orderInfo.giftCardScheme.faceValue }}</view>
						<view>¥ {{ orderInfo.giftCardScheme.faceValue * orderInfo.quantity }}</view>
					</view>
				</view>
				<view class="card-item-num">x{{ orderInfo.quantity }}</view>
			</view>
		</view>
		
		<!-- 优惠券 -->
		<view v-if="orderInfo.type == '01'" class="gift-card">
			<view class="card-item">
				<view class="card-item-info">
					<image src="../../static/coupon/coupon02-img.png" mode="heightFix"></image>
					<view class="card-item-goods">
						<view>{{ orderInfo.giftCardScheme.productName }}</view>
						<view>面值：{{ orderInfo.salePrice }}</view>
						<view>¥ {{ orderInfo.salePrice * orderInfo.quantity }}</view>
					</view>
				</view>
				<view class="card-item-num">x{{ orderInfo.quantity }}</view>
			</view>
		</view>
		
		<!-- 获取卡密钥 -->
		<view class="order-info" v-if="orderInfo.orderStatus == 'Completed' && orderInfo.type == '02'">
			<view class="order-info-item">
				<view>获取卡密钥</view>
				<view @click="getSecretKey">
					<view>凭短信验证码获取</view>
					<u-icon name="arrow-right" color="#686868" size="25"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="order-info-item">
				<view>支付方式</view>
				<view>微信支付</view>
			</view>
			<view class="order-info-item">
				<view>实付金额</view>
				<view>¥ {{ orderInfo.customerTotalAmount == null ? '0' : orderInfo.customerTotalAmount }}</view>
			</view>
			<view class="order-info-item">
				<view>商品金额</view>
				<view>¥ {{ orderInfo.type == '02' ? orderInfo.giftCardScheme.faceValue * orderInfo.quantity : orderInfo.salePrice * orderInfo.quantity }}</view>
			</view>
			<view class="order-info-item" @click="drawABill">
				<view>发票信息</view>
				<view>
					<view>不开发票</view>
					<u-icon name="arrow-right" color="#686868" size="25"></u-icon>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberInfo: uni.getStorageSync('memberInfo'),
				phone: '13245678910', // 手机号
				phoneCode: '', // 手机验证码
				orderInfo: {}, // 订单详情
			}
		},
		onLoad(option) {
			console.log(option);
			this.getOrderInfo(option.id)
		},
		methods: {
			// 获取订单详情
			getOrderInfo(id) {
				let that = this
				that.request({
					url: that.config.getOrderInfo + id,
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) {
						return uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					let data = res.data 
					that.orderInfo = data
				})
			},
			// 去获取卡密钥
			getSecretKey() {
				uni.navigateTo({
					url: './cardSecretKey/cardSecretKey?orderNum=' + this.orderInfo.orderNum + '&phone=' + this.orderInfo.phone + '&orderId=' + this.orderInfo.id
				})
			},
			// 复制
			copyCode() {
				uni.setClipboardData({
				    data: this.orderInfo.orderNum,
				    success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						})
				    }
				});
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
	/* 订单状态 start */
	.order-state {
		height: 80rpx;
		margin: 20rpx 20rpx 0;
		padding: 0 20rpx;
		border-radius: 10rpx;
		font-size: 35rpx;
		line-height: 80rpx;
		font-weight: 600;
		color: #333333;
	}
	
	/* 订单状态 end */
	
	/* 手机号 start */
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
		/* width: 230rpx; */
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}
	
	.phone>view:nth-child(3) {
		width: 100rpx;
		height: 40rpx;
		margin: 19rpx 20rpx;
		font-size: 20rpx;
		text-align: center;
		line-height: 40rpx;
		color: #999999;
		border: 2rpx solid #999999;
		border-radius: 20rpx;
	}
	
	/* 手机号 end */
	
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
	

</style>
