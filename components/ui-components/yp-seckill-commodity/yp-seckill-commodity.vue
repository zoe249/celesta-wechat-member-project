<template>
	<view>
		<view class="commoditys">
			<view class="commodity-item" v-for="(item, index) in commoditys" :key="index">
				<image :src="item.productImg" mode=""></image>
				<view class="commodity-infor" @click="goDetails(item)">
					<view class="item-title">{{ item.name }}</view>
					<view class="item-time">
						<view class="item-time-num">
							<view class="item-time-num-left">
								<text>距结束</text>
								<u-count-down ref="uCountDown" :timestamp="item.distanceEndTime" :show-days="true" separator="zh" separator-size="20" bg-color="#CCCCCC"
								 :font-size="23" color="#ffffff" @end="frontEndTime"></u-count-down>
							</view>
							<view class="item-time-num-right">剩余：{{ item.stockQuantity }}份</view>
						</view>
						<view class="item-time-process">
							<view :style="{ width: (item.initialStockQuantity + item.changeQuantity - item.stockQuantity) / (item.initialStockQuantity + item.changeQuantity) * 100 + '%' }"></view>
						</view>
					</view>
										
					<view class="item-price" >
						<view class="item-price-left">
							<view class="item-price-reference">
								<text>参考价</text>
								<text>￥{{ item.marketPrice }}</text>
							</view>
							
							<!-- 抢购：现金支付 -->
							<view class="item-price-purchase" v-if="goodsType(item) === 1">
								<text>抢购价</text>
								<text>￥{{ item.salePrice }}</text>
							</view>
							
							<!-- 抢购：积分支付 -->
							<view class="item-price-purchase" v-if="goodsType(item) === 2">
								<text>抢购价</text>
								<text>{{ item.usePoint }}积分</text>
							</view>
							
							<!-- 抢购：积分 + 现金 -->
							<view class="item-price-purchase" v-if="goodsType(item) === 3">
								<text>抢购价</text>
								<text>
									<text>{{ item.usePoint }}积分</text>
									<text> + </text>
									<text>￥{{ item.salePrice }}</text>
								</text>
							</view>
						</view>
						<view class="item-price-right" @click.stop="goPurchase(item)">立即购买</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				process: 50,
				// commoditys: [0, 0, 0, 0, 0, 0]
			}
		},
		props: {
			commoditys: Array
		},
		computed:{
			
		},
		methods: {
			// 倒计时结束
			frontEndTime() {
				
			},
			// 去详情
			goDetails(event) {
				console.log(event);
				let data = {
					id: event.id,
					isShow: 1 // 是否打开规格弹窗 1：否， 2：打开
				}
				this.$emit('change', data)
			},
			// 去购买
			goPurchase(event) {
				let data = {
					id: event.id,
					isShow: 2 // 是否打开规格弹窗 1：否， 2：打开
				}
				this.$emit('change', data)
			}
		}
	}
</script>

<style>
	.commoditys {
		margin: 0 20rpx;
	}
	
	.commodity-item {
		display: flex;
		margin: 20rpx 0;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.commodity-item>image {
		width: 210rpx;
		height: 210rpx;
		margin: 20rpx;
	}
	
	.commodity-infor {
		margin: 20rpx 20rpx 20rpx 0;
	}
	
	.item-title {
		width: 440rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #333333;
		line-height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.item-time {
		height: 85rpx;
	}
	
	.item-time-num {
		display: flex;
		justify-content: space-between;
	}
	
	.item-time-num-left>text, .item-time-num-right {
		font-size: 20rpx;
		font-weight: 500;
		color: #999999;
		line-height: 50rpx;
	}
	
	.item-time-num-left>u-count-down {
		margin-left: 10rpx;
	}
	
	.item-time-process {
		height: 24rpx;
		border: 2rpx solid #ED6D46;
		border-radius: 12rpx;
		overflow: hidden;
	}
	
	.item-time-process>view {
		/* width: 70%; */
		height: 24rpx;
		margin-left: -2rpx;
		padding-right: 2rpx;
		background: linear-gradient(90deg, #ED6D46 0%, #F69573 100%);
		border-radius: 12rpx;
	}
	
	.item-price {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		height: 85rpx;
	}
	
	.item-price-reference>text, .item-price-purchase>text:nth-child(1) {
		font-size: 20rpx;
		font-weight: 500;
		color: #999999;
		/* color: #FF7302; */
		line-height: 32rpx;
	}
	
	.item-price-purchase>text:nth-child(1){
		color: #FF7302;
	}
	
	.item-price-reference>text:nth-child(2) {
		margin-left: 10rpx;
		text-decoration: line-through;
	}
	
	.item-price-purchase>text:nth-child(2) {
		margin-left: 10rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FF7302;
		line-height: 42rpx;
	}
	
	.item-price-right {
		width: 140rpx;
		height: 44rpx;
		text-align: center;
		background: #ED6D46;
		border-radius: 10rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 44rpx;
	}


</style>
