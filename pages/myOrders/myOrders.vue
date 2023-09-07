<template>
	<view>
		<!-- 我的订单 -->
		<view class="declaration">
			<view class="declaration-tabs">
				<u-tabs :list="tabsList" active-color="#ED6D46" bgColor="#ffffff" inactiveColor="#333333" :is-scroll="false" bold :current="current" @change="tabsChange"></u-tabs>
				<!-- <u-tabs :list="tabsList" active-color="#ED6D46" bgColor="#ffffff" inactiveColor="#333333" is-scroll bold :current="current" @change="tabsChange"></u-tabs> -->
			</view>
			<view class="declaration-infor">
				<swiper class="order-conten" :current="swiperCurrent" @animationfinish="animationfinish" @change="transition">
					<swiper-item v-for="(itemType, indexType) in orders" :key="indexType">
						<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom(indexType)">
							
							<view v-for="(item, index) in itemType.orderList" :key="index">
								<!-- 礼品卡 -->
								<view class="otder-item" v-if="item.type == '02'">
									<view class="otder-item-title">
										<view class="">{{ item.productName }}</view>
										<view class="item-title-status" v-if="item.orderStatus == 'Completed'">已完成</view>
										<view class="item-title-status" v-if="item.orderStatus == 'Refunded'">退款</view>
										<view class="item-title-status" v-if="item.orderStatus == 'WillPayment'">待付款</view>
										<view class="item-title-status" v-if="item.orderStatus == 'Cancelled'">已取消</view>
									</view>
									<view class="otder-item-info" @click="goOrderInfo(item)">
										<view class="otder-item-left">
											<image :src="item.logo" mode=""></image>
										</view>
										<view class="otder-item-right">
											<view class="">¥ {{ item.salePrice * item.quantity }}</view>
											<view class="">共{{ item.quantity }}张卡</view>
										</view>
									</view>
									<view class="order-operation" v-if="item.orderStatus == 'WillPayment'">
										<view class="cancel" @click="cancelOrder(item)">取消订单</view>
										<view class="payment" @click="getPayment(item)">立即付款</view>
									</view>
								</view>
								
								<!-- 优惠券 -->
								<view class="otder-item" v-if="item.type == '01'">
									<view class="otder-item-title">
										<view class="">{{ item.productName }}</view>
										<view class="item-title-status" v-if="item.orderStatus == 'Completed'">已完成</view>
										<view class="item-title-status" v-if="item.orderStatus == 'Refunded'">退款</view>
										<view class="item-title-status" v-if="item.orderStatus == 'WillPayment'">待付款</view>
										<view class="item-title-status" v-if="item.orderStatus == 'Cancelled'">已取消</view>
									</view>
									<view class="otder-item-info"">
										<view class="otder-item-left">
											<image src="../../static/coupon/coupon02-img.png" mode="heightFix"></image>
											<image v-if="item.quantity >= 2" src="../../static/coupon/coupon02-img.png" mode="heightFix"></image>
										</view>
										<view class="otder-item-right">
											<view class="">¥ {{ item.salePrice * item.quantity }}</view>
											<view class="">共{{ item.quantity }}张券</view>
										</view>
									</view>
									<!-- <view class="order-operation">
										<view class="cancel" v-if="item.orderStatus == 'WillPayment'" @click="cancelOrder(item)">取消订单</view>
										<view class="payment" v-if="item.orderStatus == 'WillPayment'" @click="getPayment(item)">立即付款</view>
									</view> -->
								</view>
							</view>
							
							<!-- 无数据 -->
							<view class="empty" v-if="itemType.totalPage == 0">
								<image :src="imgUrl + '/giftCard.png'" mode="widthFix"></image>
								<view class="tips-text">空空如也～</view>
							</view>
							
							<!-- 隔离层 -->
							<view style="height: 50rpx;"></view>
						</scroll-view>
					</swiper-item>
				</swiper>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				current: 0, // 指定哪个tab为激活状态
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				memberInfo: uni.getStorageSync('memberInfo'),
				payments: {}, // 支付参数
				tabsList: [
					{
						name: '全部'
					}, {
						name: '待付款'
					}, {
						name: '已完成'
					}, {
						name: '已取消'
					}
				],
				orders: [{
					orderList: [], // 订单数据
					totalPage: 1, // 订单条数
					pageIndex: 1, // 请求页数
					status: '', // 状态
					isBottom: false, // 是否置底
				}, {
					orderList: [], // 订单数据
					totalPage: 1, // 订单条数
					pageIndex: 1, // 请求页数
					status: 'WillPayment', // 状态
					isBottom: false, // 是否置底
				}, {
					orderList: [], // 订单数据
					totalPage: 1, // 订单条数
					pageIndex: 1, // 请求页数
					status: 'Completed', // 状态
					isBottom: false, // 是否置底
				}, {
					orderList: [], // 订单数据
					totalPage: 1, // 订单条数
					pageIndex: 1, // 请求页数
					status: 'Cancelled', // 状态
					isBottom: false, // 是否置底
				}],
			}
		},
		onLoad() {
			// 获订单列表
			this.getOrderList(0)
			this.getOrderList(1)
			this.getOrderList(2)
			this.getOrderList(3)
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.swiperCurrent = current;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let current = e.detail.current;
				this.current = current;
			},
			// 获取券订单列表
			getOrderList(index) {
				let that = this
				that.request({
					url: that.config.getOrderList,
					data: {
						pageIndex: that.orders[index].pageIndex,
						pageSize: '20',
						orderStatus: that.orders[index].status,
						memberCode: that.memberInfo.cardNumber
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) return
					let data = res.data
					that.orders[index].orderList = [...that.orders[index].orderList, ...data.data]
					that.orders[index].totalPage = data.total
					if(that.orders[index].totalPage <= that.orders[index].orderList.length) {
						that.orders[index].isBottom = true
					}
				})
			},
			// 取消订单
			cancelOrder(event) {
				let that = this
				uni.showModal({
					title: '提示',
				    content: '取消订单不可恢复呦',
				    success: function (res) {
						if (res.confirm) {
							that.request({
								url: that.config.getCardCancelOrder + event.id,
								method: 'PUT'
							}).then(res => {
								console.log(res);
								if(res.statusCode != 200) {
									return uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
								that.orders = [{
									orderList: [], // 订单数据
									totalPage: 1, // 订单条数
									pageIndex: 1, // 请求页数
									status: '', // 状态
									isBottom: false, // 是否置底
								}, {
									orderList: [], // 订单数据
									totalPage: 1, // 订单条数
									pageIndex: 1, // 请求页数
									status: 'WillPayment', // 状态
									isBottom: false, // 是否置底
								}, {
									orderList: [], // 订单数据
									totalPage: 1, // 订单条数
									pageIndex: 1, // 请求页数
									status: 'Completed', // 状态
									isBottom: false, // 是否置底
								}, {
									orderList: [], // 订单数据
									totalPage: 1, // 订单条数
									pageIndex: 1, // 请求页数
									status: 'Cancelled', // 状态
									isBottom: false, // 是否置底
								}]
								// 获订单列表
								that.getOrderList(0)
								that.getOrderList(1)
								that.getOrderList(2)
								that.getOrderList(3)
							})
						}
					}
				});
			},
			// 重新支付
			getPayment(event) {
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
							url: that.config.getWechatPay + '?code=' + res.code + '&giftCardSchemeOrderId=' + event.id + '&detail=' + '购买礼品卡' + '&attach=' + attach +
								'&body=购买礼品卡&price=' + event.salePrice * event.quantity + '&quantity=1' + '&type=' + '02',
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
						setTimeout(() => {
							that.orders = [{
								orderList: [], // 订单数据
								totalPage: 1, // 订单条数
								pageIndex: 1, // 请求页数
								status: '', // 状态
								isBottom: false, // 是否置底
							}, {
								orderList: [], // 订单数据
								totalPage: 1, // 订单条数
								pageIndex: 1, // 请求页数
								status: 'WillPayment', // 状态
								isBottom: false, // 是否置底
							}, {
								orderList: [], // 订单数据
								totalPage: 1, // 订单条数
								pageIndex: 1, // 请求页数
								status: 'Completed', // 状态
								isBottom: false, // 是否置底
							}, {
								orderList: [], // 订单数据
								totalPage: 1, // 订单条数
								pageIndex: 1, // 请求页数
								status: 'Cancelled', // 状态
								isBottom: false, // 是否置底
							}]
							// 获订单列表
							that.getOrderList(0)
							that.getOrderList(1)
							that.getOrderList(2)
							that.getOrderList(3)
						}, 1500)
					},
					fail(err) {
						uni.hideLoading() // 取消加载中
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						})
						console.log('支付失败', err);
					}
				})
			},
			// 触底加载
			onreachBottom(index) {
				if(this.orders[index].isBottom) return
				this.orders[index].pageIndex++
				// 获取券订单列表
				this.getOrderList(index)
			},
			// 去订单详情
			goOrderInfo(event) {
				uni.navigateTo({
					url: '../myOrdersInfo/myOrdersInfo?id=' + event.id
				})
			},
			// 查看优惠券详情
			goCouponInfo(event) {
				uni.navigateTo({
					url: '../myCouponInfo/myCouponInfo?id=' + event.saleCouponActivityId
				})
			},
		}
	}
</script>

<style>
	
	/* 订单 start */
	.declaration {
		padding: 0 0 50rpx;
		border-radius: 10rpx 10rpx 0 0;
	}
	
	.declaration-tabs {
		position: fixed;
		top: 0;
		width: 750rpx;
		height: 100rpx;
		background-color: #EEEEEE;
	}
	
	.order-conten {
		position: fixed;
		top: 100rpx;
		width: 750rpx;
		height: calc(100vh - 100rpx);
		overflow: hidden;
	}
	
	/* 订单 end */

	/* 订单列表 start */
	.otder-item {
		margin: 0 20rpx 20rpx;
		padding: 20rpx 20rpx;
		border-radius: 10rpx;
		background-color: #FFFFFF;
	}
	
	.otder-item-title {
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #333333;
	}
	
	.otder-item-title .item-title-status {
		font-weight: 600;
	}
	
	.otder-item-info {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 100%;
	}
	
	.otder-item-left {
		width: 490rpx;
		height: 150rpx;
	}
	
	.otder-item-left>image {
		width: 100rpx;
		height: 100rpx;
		margin: 25rpx 10rpx 25rpx 0;
	}
	
	.otder-item-right {
		width: 200rpx;
		height: 100rpx;
		margin: 25rpx 0;
		text-align: right;
		font-size: 26rpx;
		line-height: 50rpx;
		color: #333333;
	}
	
	.otder-item-right>view:nth-child(1) {
		font-size: 30rpx;
		font-weight: 600;
	}
	
	.order-operation {
		display: flex;
		justify-content: flex-end;
		width: 100%;
		height: 80rpx;
		border-top: 2rpx solid #EEEEEE;
	}
	
	.cancel {
		width: 160rpx;
		height: 50rpx;
		margin: 15rpx 0 15rpx 20rpx;
		border: 2rpx solid #999999;
		border-radius: 25rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		line-height: 50rpx;
		color: #999999;
	}
	
	.payment {
		width: 160rpx;
		height: 50rpx;
		margin: 15rpx 0 15rpx 20rpx;
		background-color: #C83C23;
		border-radius: 25rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		line-height: 50rpx;
		color: #FFFFFF;
	}
	
	/* 订单列表 end */
	
	/* 列表为空 start */
	.empty {
		margin: 0 200rpx;
	}
	
	.empty>image {
		display: block;
		width: 150rpx;
		margin: 150rpx auto 20rpx;
	}
	
	.tips-text {
		text-align: center;
		font-size: 30rpx;
		color: #333333;
		line-height: 50rpx;
	}
	
	/* 列表为空 end */

</style>
