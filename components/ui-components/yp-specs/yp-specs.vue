<!-- 
	商品规格/购买弹出内容
	
	入参：
		goodsInfo: Object
		商品信息
		headerImg: String
		商品图片
		
	返回：
		this.$emit("addShop", true)
		商品购买成功
 
 -->


<template>
	<view class="content11">
		<view class="goods-choice-title">
			<image :src="headerImg"></image>
			<view class="goods-choice-title-text">
				<view class="goods-choice-title-name">{{ goodsInfo.name }}</view>
				<!-- 支付现金 -->
				<view class="goods-choice-title-par" v-if="goodsType(goodsInfo) === 1">
					<text>￥{{ goodsInfo.salePrice }}</text>
					<!-- <text>/{{ goodsInfo.spec }}</text> -->
				</view>
				<!-- 兑换积分 -->
				<view class="goods-choice-title-par" v-if="goodsType(goodsInfo) === 2">
					<text>{{ goodsInfo.usePoint }}积分</text>
					<!-- <text>/{{ goodsInfo.spec }}</text> -->
				</view>
				<!-- 兑换积分 + 支付现金 -->
				<view class="goods-choice-title-par" v-if="goodsType(goodsInfo) === 3">
					<text>
						<text>{{ goodsInfo.usePoint }}积分 + ￥{{ goodsInfo.salePrice }}</text>
					</text>
					<!-- <text>/{{ goodsInfo.spec }}</text> -->
				</view>
				<view class="goods-choice-title-choice">
					<text>参考价：</text>
					<text>{{ goodsInfo.marketPrice }}</text>
				</view>
			</view>
		</view>
		<view class="goodschoice-num">
			<view class="goodschoice-content">
				<view class="goodschoice-num-text">
					购买数量：
				</view>
				<!-- 普通商品 -->
				<u-number-box :min="1" :max="goodsInfo.limitCount" :value="goodsNum" @change="valChange"></u-number-box>
			</view>
			
			<view class="goodschoice-price">
				<view class="goodschoice-price-text payload-info">
					<span class="left">合计金额</span>
					<span class="right">￥{{ totalPrice }}</span>
				</view>
			</view>
			<view class="goodschoice-point">
				<view class="goodschoice-point-text payload-info">
					<span class="left">消耗积分</span>
					<span class="right">{{ totalPoint }}积分</span>
				</view>
			</view>
		</view>
		<view class="goodschoice-num-purchase">
			<view class="goodschoice-num-addRush" @tap="$u.throttle(directPurchase, 1000)">立即抢购</view>
			<!-- <view class="goodschoice-num-addRush goodschoice-num-addRush01">已售罄</view> -->
			<!-- <view class="goodschoice-num-addRush goodschoice-num-addRush01">未开始</view> -->
		</view>

		<!-- 隔离层 -->
		<view style="height: 50rpx;"></view>

	</view>
</template>

<script>
	import Vue from 'vue'
	export default {
		data() {
			return {
				isStock: true, // 是否有库存
				goodsNum: 1, // 选中商品的数量
				payments: {}, // 支付参数
				balance: 0, // 用户剩余积分
			}
		},
		props: {
			goodsInfo: Object,
			headerImg: String, // 商品主图
		},
		computed: {
			totalPrice(){
				const { goodsInfo } = this
				if(goodsInfo.salePrice){
					return (goodsInfo.salePrice * this.goodsNum).toFixed(2)
				}else{
					return 0.00
				}
			},
			totalPoint(){
				const { goodsInfo } = this
				if(goodsInfo.usePoint){
					return goodsInfo.usePoint * this.goodsNum
				}else{
					return 0
				}
			}
		},
		methods: {
			// 购买数量
			valChange(e) {
				this.goodsNum = e.value
			},
			// 直接购买
			async directPurchase() {
				// 获取用户剩余积分
				let balance = await this.getUserPoint()
				// 登录校验
				if(!uni.getStorageSync('token')) {
					uni.showToast({
						title: '当前未登录',
						icon: 'none'
					})
				}
				this.$emit('change', false)
				uni.showLoading({
					title: '订单生成中',
				})
				// 价格
				let companyCode = this.config.companyCode
				let attach = uni.getStorageSync('memberInfo').id + ',' + companyCode.organizationCode + ',' + companyCode.channelCode + ',' + companyCode.terminalCode 
				let that = this
				if(that.goodsInfo.salePrice === 0 && that.goodsInfo.usePoint !== 0){
					if(balance < this.totalPoint){	// 判断积分余额是否不足
						uni.showToast({
							title:'积分不足',
							icon:'none',
							duration:1500
						})
						return
					}
					that.startUsePoint()
				}else{
					if(balance < this.totalPoint){	// 判断积分余额是否不足
						uni.showToast({
							title:'积分不足',
							icon:'none',
							duration:1500
						})
						return
					}
					// 获取支付参数
					uni.login({
						success: res => {
							that.code = res.code
							that.request({
								// 原售券活动saleCouponActivityId改为活动ID V3.0.6
								url: that.config.getWechatPay + '?code=' + res.code + '&detail=' + '秒杀券活动商品' + '&attach=' + attach +
									'&body=秒杀券活动商品&price=' + that.goodsInfo.salePrice + '&quantity=' + that.goodsNum +
									'&activityId=' + that.goodsInfo.id + '&type=' + '01',
								method: 'POST'
							}).then(res => {
								if(res.statusCode == 200) {
									that.payments = res.data
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
				}
			},
			// 消耗积分
			startUsePoint(){
				let that = this
				let payment = that.payments
				const phone = uni.getStorageSync('memberInfo').phone
				uni.hideLoading()
				uni.showModal({
					title:'确定消耗积分兑换商品吗?',
					success:(modalRes)=>{
						if(modalRes.cancel) return // 用户点击取消
						that.request({
							url:that.config.getCouponByPoint ,
							method:'POST',
							header:{
								'Content-Type':'application/json'
							},
							data:{
								quantity: that.goodsNum,
								saleCouponActivityId: that.goodsInfo.id,
								phone: uni.getStorageSync('memberInfo').phone,
								organizationCode: that.config.companyCode.organizationCode,
								channelsCode: that.config.companyCode.channelCode,
								terminalsCode: that.config.companyCode.terminalCode
							}
						}).then(res=>{
							if(res.data.code === '200000'){
								uni.showToast({
									title:'支付成功',
								})
								setTimeout(()=>{
									uni.redirectTo({
										url: '../myCoupon/myCoupon'
									})
								},500)
							}else{
								setTimeout(()=>{
									uni.showToast({
										title:res.data.detail,
										icon:'none'
									})
								},500)
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
						setTimeout(() => {
							uni.redirectTo({
								url: '../myCoupon/myCoupon'
							})
						}, 2000)
					},
					fail(err) {
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
			// 精确乘法结果
			accMul(arg1, arg2) {
				if (JSON.stringify(this.goodsInfo) !== '{}') {
					let m = 0,
						s1 = arg1.toString(),
						s2 = arg2.toString();
					try {
						m += s1.split(".")[1].length
					} catch (e) {}
					try {
						m += s2.split(".")[1].length
					} catch (e) {}
					return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
				}
			},
			// 查询用户剩余积分
			getUserPoint(){
				return new Promise((resolve,reject)=>{
					let that = this
					const memberInfo = uni.getStorageSync('memberInfo')
					// console.log(memberInfo)
					that.request({
						url:that.config.pointTypes,
						data:{
							memberId:memberInfo.id,
							type:'01',
						}
					}).then(res=>{
						if(res.statusCode === 200){
							resolve(res.data[0].balance)
						}
					})
				})
			}
		},
	}
</script>

<style scoped>
	/* 选择商品弹出层 start */
	.goods-choice-title {
		display: flex;
		width: 710rpx;
		margin: 10rpx 20rpx;
		border-bottom: 2rpx solid #EEEEEE;
	}

	.goods-choice-title>image {
		width: 150rpx;
		height: 150rpx;
		margin: 25rpx 20rpx 25rpx 0;
	}

	.goods-choice-title-text {
		width: 440rpx;
		margin: 25rpx 0;
	}

	.goods-choice-title-name {
		width: 400rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods-choice-title-par {
		width: 400rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.goods-choice-title-par text:nth-child(1) {
		color: #C83C23;
		font-size: 30rpx;
		font-weight: 600;
	}

	.goods-choice-title-par text:nth-child(2) {
		color: #999999;
		font-size: 20rpx;
		margin-left: 5rpx;
	}

	.goods-choice-title-choice {
		width: 400rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 20rpx;
		font-weight: 500;
		color: #999999;
	}
	
	.goods-choice-title-choice text:nth-child(2) {
		text-decoration: line-through;
	}

	.goodschoice-num {
		width: 710rpx;
		height: 200rpx;
		margin: 10rpx 20rpx;
	}

	.goodschoice-content {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.goodschoice-num-text {
		font-size: 28rpx;
		color: #999999;
		line-height: 50rpx;
	}

	.goodschoice-num-purchase {
		display: flex;
		justify-content: space-around;
		width: 750rpx;
		height: 90rpx;
		margin: 0 0 20rpx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.goodschoice-num-purchase>view {
		flex: 5;
		height: 70rpx;
		line-height: 70rpx;
		margin: 10rpx 20rpx;
		text-align: center;
		border-radius: 30rpx;
	}

	.goodschoice-num-addCar {
		color: #FFFFFF;
		font-size: 30rpx;
	}

	.goodschoice-num-addRush {
		color: #FFFFFF;
		font-size: 30rpx;
		background: linear-gradient(270deg, #FF4B2B 0%, #FF8F67 100%);
	}

	.goodschoice-num-addRush01 {
		background: #CCCCCC;
	}
	
	.goodschoice-price{
		padding-left: 10rpx;
	}
	
	.goodschoice-price-text{
		font-size: 28rpx;
		color: #999999;
		line-height: 50rpx;
	}
	
	.goodschoice-point{
		padding-left: 10rpx;
	}
	
	.goodschoice-point-text{
		font-size: 28rpx;
		color: #999999;
		line-height: 50rpx;
	}
	
	.payload-info{
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.payload-info .right{
		font-family: PingFang SC;
		font-weight: 800;
		color: #333333;
	}
		
	/* 选择商品弹出层 end */
	
</style>
