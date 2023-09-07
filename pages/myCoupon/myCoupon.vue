<template>
	<view>
		<!-- 优惠券 -->
		<view class="declaration">
			<view class="declaration-tabs">
				<u-tabs :list="tabsList" active-color="#ED6D46" bgColor="#ffffff" inactiveColor="#333333" is-scroll bold :current="current" @change="tabsChange"></u-tabs>
			</view>
			<view class="declaration-infor">
				<swiper class="order-conten" :current="swiperCurrent" @animationfinish="animationfinish" @change="transition">
					<swiper-item v-for="(itemType, indexType) in orders" :key="indexType">
						<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom(indexType)">
							
							<view v-if="itemType.orderList.length >= 1">
								<view v-for="(item, index) in itemType.orderList" :key="index" class="coupon-item">
									<view class="coupon-info">
										<view class="coupon-info-left">
											<view class="coupon-info-img">
												<image :src="styleConfig[item.colorType].couponImg" mode=""></image>
											</view>
											<view class="coupon-info-num" :style="{ color: styleConfig[item.colorType].couponColor }">
												<view class="coupon-item-num">
													<text>{{ item.facevalue }}</text>
													<text v-if="item.type == '01' || item.type == '03'">￥</text>
													<text v-if="item.type == '02'">次</text>
													<text v-if="item.type == '04'">折</text>
												</view>
												<view class="threshold">{{ item.fullAmount == 0 ? '无使用门槛' : '每满' + item.fullAmount + '元可用' }}</view>
											</view>
										</view>
										<view class="coupon-info-right">
											<view class="coupon-info-title" :style="{ color: styleConfig[item.colorType].couponTitleColor }">{{ item.couponTemplateName }}</view>
											<view class="coupon-item-term">
												<view class="coupon-item-term-left">
													<view class="">每单限使用{{ item.limitedNumber }}张</view>
													<view class="">有效期：{{ item.beginTime }} - </view>
													<view class=""> {{ item.endTime }}</view>
												</view>
												<view class="coupon-item-term-right" @click="goCouponInfo(item)" :style="{ backgroundColor: styleConfig[item.colorType].couponColor }">查看详情</view>
											</view>
										</view>
									</view>
									<view class="coupon-rule">
										<view class="coupon-rule-top">
											<view>
												<u-icon name="info-circle" color="#999999" size="22"> </u-icon>
												<text>使用规则</text>
											</view>
											<view @click="setIsRule(indexType, index)">
												<u-icon :name=" item.isRule ? 'arrow-up' : 'arrow-down' " color="#999999" size="22"></u-icon>
											</view>
										</view>
										<view v-show="item.isRule" class="coupon-rule-bottom">{{ item.ruleExplain }}</view>
									</view>
								</view>
								
								<!-- 没有更多了 -->
								<view class="load-more" v-if="itemType.isBottom && itemType.orderList.length >= 1">- 没有更多了 -</view>
							</view>
							
							<!-- 无数据 -->
							<view class="coupon-empty" v-if="itemType.totalPage == 0">
								<image src="../../static/coupon/coupon-img.png" mode=""></image>
								<view>空空如也，你没考虑过券的感受~</view>
								<view @click="goSeckill">去领券</view>
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
				current: 0, // 指定哪个tab为激活状态
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				memberInfo: uni.getStorageSync('memberInfo'),
				tabsList: [
					{
						name: '未使用'
					}, {
						name: '已使用'
					}, {
						name: '已转赠'
					}, {
						name: '已退券'
					}, {
						name: '已过期'
					}, 
				],
				orders: [{
					orderList: [], // 优惠券数据
					totalPage: 1, // 优惠券条数
					pageIndex: 1, // 请求页数
					state: 1, // 状态
					isBottom: false, // 是否置底
				}, {
					orderList: [], // 优惠券数据
					totalPage: 1, // 优惠券条数
					pageIndex: 1, // 请求页数
					state: 2, // 状态
					isBottom: false, // 是否置底
				}, {
					orderList: [], // 优惠券数据
					totalPage: 0, // 优惠券条数
					pageIndex: 1, // 请求页数
					state: '', // 状态
					isBottom: false, // 是否置底
				}, {
					orderList: [], // 优惠券数据
					totalPage: 0, // 优惠券条数
					pageIndex: 1, // 请求页数
					state: '', // 状态
					isBottom: false, // 是否置底
				}, {
					orderList: [], // 优惠券数据
					totalPage: 1, // 优惠券条数
					pageIndex: 1, // 请求页数
					state: 3, // 状态
					isBottom: false, // 是否置底
				}],
				styleConfig: [ // 颜色配置
					{
						type: 1,
						couponImg: '../../static/coupon/coupon-orange.png',
						couponColor: '#ED6D46',
						couponTitleColor: '#333333'
					}, {
						type: 2,
						couponImg: '../../static/coupon/coupon-green.png',
						couponColor: '#80C269',
						couponTitleColor: '#333333'
					}, {
						type: 3,
						couponImg: '../../static/coupon/coupon-blue.png',
						couponColor: '#88ABDA',
						couponTitleColor: '#333333'
					}, {
						type: 4,
						couponImg: '../../static/coupon/coupon-grey.png',
						couponColor: '#999999',
						couponTitleColor: '#999999'
					}
				]
			}
		},
		onLoad() {
			// 获取券订单列表
			this.getCouponList(0)
			this.getCouponList(1)
			this.getCouponList(4)
		},
		/* 下拉刷新停止 */
		onPullDownRefresh() {
			console.log('11111');
			
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
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
			getCouponList(index) {
				if(index == 2 || index == 3) return
				let that = this
				that.request({
					url: that.config.getCouponList,
					data: {
						pageIndex: that.orders[index].pageIndex,
						pageSize: '20',
						couponStatus: that.orders[index].state,
						cardNumber: that.memberInfo.cardNumber
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) return
					let data = res.data
					data.data.forEach(item => {
						item.isRule = false
						if((item.type == '01' && item.couponStatus == 1) || (item.type == '03' && item.couponStatus == 1)) {
							item.colorType = 0
						} else if(item.type == '02' && item.couponStatus == 1) {
							item.colorType = 1
						} else if(item.type == '04' && item.couponStatus == 1) {
							item.colorType = 2
						} else {
							item.colorType = 3
						}
						
						// 修改券面值格式
						if(item.type == '02') {
							// 计次券修改整数
							item.facevalue = Number(item.facevalue).toFixed(0)
						} else if(item.type == '04') {
							// 折扣券修改面值格式
							item.facevalue = item.facevalue / 10
						}
					})
					that.orders[index].orderList = [...that.orders[index].orderList, ...data.data]
					that.orders[index].totalPage = data.total
					if(that.orders[index].totalPage <= that.orders[index].orderList.length) {
						that.orders[index].isBottom = true
					}
				})
			},
			// 触底加载
			onreachBottom(index) {
				if(this.orders[index].isBottom) return
				this.orders[index].pageIndex++
				// 获取券订单列表
				this.getCouponList(index)
			},
			// 展开 / 关闭 规格
			setIsRule(indexType, index) {
				this.orders[indexType].orderList[index].isRule = !this.orders[indexType].orderList[index].isRule
			},
			// 查看优惠券详情
			goCouponInfo(event) {
				uni.navigateTo({
					url: '../myCouponInfo/myCouponInfo?id=' + event.id
				})
			},
			// 去领券
			goSeckill() {
				uni.redirectTo({
					url: '../seckill/seckill'
				})
			},
			// 返回上一页
			goBack() {
				uni.navigateBack()
			},
		}
	}
</script>

<style>
	/* 优惠券 start */
	.order-conten {
		position: fixed;
		top: 100rpx;
		width: 750rpx;
		height: calc(100vh - 100rpx);
		overflow: hidden;
	}
	
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
	
	.coupon-item {
		margin: 0 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		overflow: hidden;
	}
	
	.load-more {
		height: 80rpx;
		text-align: center;
		font-size: 22rpx;
		line-height: 60rpx;
		color: #999999;
	}
	
	/* 优惠券 end */
	
	/* 优惠券 item  start */
	.coupon-info {
		display: flex;
		border-radius: 10rpx;
		background-color: #FFFFFF;
		overflow: hidden;
	}
	
	.coupon-info-left {
		display: flex;
		height: 188rpx;
	}
	
	.coupon-info-img>image {
		width: 20rpx;
		height: 100%;
	}
	
	.coupon-info-num {
		width: 180rpx;
		height: 100%;
		border-right: 2rpx dashed #999999;
	}
	
	.coupon-item-num {
		height: 60%;
		text-align: center;
	}
	
	.coupon-item-num>text:nth-child(1) {
		font-size: 40rpx;
		font-weight: 600;
		line-height: 150rpx;
	}
	
	.coupon-item-num>text:nth-child(2) {
		font-size: 14px;
		font-weight: 600;
		line-height: 150rpx;
	}
	
	.threshold {
		height: 40%;
		margin: 0 20rpx;
		text-align: center;
		font-size: 22rpx;
		line-height: 30rpx;
	}
	
	.coupon-info-right {
		height: 188rpx;
		margin: 0 20rpx;
	}
	
	.coupon-info-title {
		width: 100%;
		height: 70rpx;
		margin-top: 20rpx;
		font-size: 28rpx;
		font-weight: 600;
		line-height: 35rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		word-break: break-all;
	}
	
	.coupon-item-term {
		display: flex;
	}
	
	.coupon-item-term-left {
		width: 340rpx;
		margin: 14rpx 0;
	}
	
	.coupon-item-term-left view {
		font-size: 20rpx;
		color: #878787;
		line-height: 30rpx;
	}
	
	.coupon-item-term-right {
		width: 135rpx;
		height: 56rpx;
		margin: 21rpx 0;
		border-radius: 10rpx;
		text-align: center;
		font-size: 26rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 56rpx;
	}
	
	.coupon-rule {
		background-color: #FFFFFF;
	}
	
	.coupon-rule-top {
		display: flex;
		justify-content: space-between;
		height: 60rpx;
		margin: 0 30rpx;
	}
	
	.coupon-rule-top>view>text {
		margin-left: 5rpx;
		font-size: 22rpx;
		color: #999999;
		line-height: 60rpx;
	}
	
	.coupon-rule-bottom {
		margin: 0 30rpx;
		padding: 0 0 20rpx;
		font-size: 19rpx;
		font-weight: 500;
		color: #999999;
		line-height: 25rpx;
	}
	
	.coupon-empty {
		height: 300rpx;
		padding-top: calc(60% - 150rpx);
	}
	
	.coupon-empty>image {
		display: block;
		width: 155rpx;
		height: 75rpx;
		margin: 0 auto;
	}
	
	.coupon-empty>view:nth-child(2) {
		margin: 0 auto;
		text-align: center;
		font-size: 22rpx;
		font-weight: 500;
		color: #333333;
		line-height: 70rpx;
	}
	
	.coupon-empty>view:nth-child(3) {
		width: 140rpx;
		height: 60rpx;
		margin: 20rpx auto 0;
		background: #ED6D46;
		border-radius: 10rpx;
		text-align: center;
		font-size: 26rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 60rpx;
	}
	
	/* 优惠券 item  end */

</style>
