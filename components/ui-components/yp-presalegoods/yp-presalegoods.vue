<!-- 
	预售商品信息
	商品详情页预售商品信息展示
	
	入参：
		goodsInfo: Object
		商品信息
		
	返回：
		this.$emit("change", true)
		触发分享
 
 -->


<template>
	<view class="goods-activity">
		<view class="goods-activity-top">
			<image src="../../../static/goods/goods_bg.png"></image>
			<view class="goods-activity-top-title">
				<view class="goods-activity-price">
					<view class="price-text">
						<view>
							<!-- 支付现金 -->
							<text class="price" v-if="goodsType(goodsInfo) === 1">
								￥{{ goodsInfo.salePrice }}
							</text>
							<!-- 兑换积分 -->
							<text class="price" v-if="goodsType(goodsInfo) === 2">
								{{ goodsInfo.usePoint }}积分
							</text>
							<!-- 支付现金 + 兑换积分 -->
							<text class="price long-price" v-if="goodsType(goodsInfo) === 3">
								<text>{{ goodsInfo.usePoint }}积分</text>
								 <text>+</text>
								<text>￥{{ goodsInfo.salePrice }}</text>
							</text>
							
							<!-- 参考价格 -->
							<text class="old-price">￥{{ goodsInfo.marketPrice }}</text>
						</view>
						<view class="stock-quantity" style="white-space: nowrap;">
							<text class="surplus">剩余{{ goodsInfo.stockQuantity }}份</text>
						</view>
					</view>
					<view class="price-process">
						<view :style="{ width: (goodsInfo.initialStockQuantity + goodsInfo.changeQuantity - goodsInfo.stockQuantity) / (goodsInfo.initialStockQuantity + goodsInfo.changeQuantity) * 100 + '%' }"></view>
					</view>
				</view>
				<view class="goods-activity-time">
					<view>
						<text>距结束</text>
						<!-- <u-count-down ref="uCountDown" :timestamp="goodsInfo.distanceEndTime" :show-days="true" separator="zh" bg-color="#333333"
						 :font-size="26" color="#ffffff" @end="frontEndTime"></u-count-down> -->
						 <yp-count-down :timestamp="goodsInfo.distanceEndTime"></yp-count-down>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-activity-bottom">
			<view class="goodsname-title">
				<view class="goodsname-name">{{ goodsInfo.name }}</view>
				<view class="goods-text">
					<text>每人每日限购{{ goodsInfo.limitCount }}个，每人总限购{{ goodsInfo.sumLimitCount }}个</text>
				</view>
				<view class="goods-text">
					<text>活动对象：限{{ goodsInfo.activeObjectDetail == '' ? '所有' : goodsInfo.activeObjectDetail }}会员</text>
				</view>
			</view>
			<!-- 分享浮窗 -->
			<view class="share-but">
				<view class="share-imgbut" @click="shareShow">
					<image src="../../../static/goods/share-icon.png" mode=""></image>
					<text>分享</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ypCountDown from '../yp-count-down/yp-count-down.vue'
	export default {
		data() {
			return {
				process: 60,
				imgUrl: this.config.imgUrl,
			}
		},
		components:{ypCountDown},
		props: {
			goodsInfo: Object,
		},
		mounted() {},
		methods: {
			// 跳转活动列表
			reachActivity(number, type) {
				uni.navigateTo({
					url: "../goods/activity?promotionNum=" + number + "&promotiontype=" + type
				})
			},
			/* 分享内容 */
			shareShow() {
				this.$emit('change', true)
			},
		}
	}
</script>

<style scoped>
	/* 商品信息 end */
	.goods-activity {
		width: 750rpx;
		background-color: #FFFFFF;
	}
	
	.goods-activity-top {
		position: relative;
	}
	
	.goods-activity-top>image {
		position: absolute;
		width: 750rpx;
		height: 110rpx;
	}
	
	.goods-activity-top .goods-activity-top-title {
		display: flex;
		justify-content: space-between;
		height: 110rpx;
	}
	
	.goods-activity-price {
		position: relative;
		width: 400rpx;
		height: 110rpx;
	}

	.price-text {
		width: 100%;
		display: flex;
		justify-content: space-between;
		height: 70rpx;
		margin: 0 0 0 20rpx;
	}
	
	.price-text view .price {
		color: #FFFFFF;
		line-height: 80rpx;
		font-size: 36rpx;
		font-weight: 600;
		width: 100%;
	}
	
	.price-text view .surplus, .price-text view .old-price {
		margin-left: 10rpx;
		color: #dadada;
		line-height: 80rpx;
		font-size: 20rpx;
	}
	
	.long-price{
		font-size: 30rpx !important;
		white-space: nowrap;
	}
	
	.price-text view .old-price {
		text-decoration: line-through;
	}

	.goods-activity-time {
		position: relative;
		/* width: 320rpx; */
		flex: 1;
		height: 110rpx;
		
	}

	.goods-activity-time>view {
		position: absolute;
		top: 0;
		right: 0;
		/* width: 220rpx; */
		padding: 12rpx 0;
		padding-right: 15rpx;
		text-align: right;
		line-height: 45rpx;
	}

	.goods-activity-time>view>text {
		display: block;
		font-size: 26rpx;
		color: #333333;
	}
	
	.goods-activity-bottom {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0 10rpx;
	}
	
	.goodsname-title {
		width: 60%;
		margin: 0 0 0 20rpx;
	}
	
	.goodsname-name {
		width: 600rpx;
		height: 50rpx;
		line-height: 40rpx;
		font-size: 36rpx;
		color: #2E2E2E;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.goods-text {
		width: 580rpx;
		margin: 10rpx 0;
		line-height: 30rpx;
		color: #999999;
		font-size: 24rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.price-process {
		height: 16rpx;
		margin: 0 0 0 20rpx;
		border: 2rpx solid #FFFFFF;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.price-process>view {
		/* width: 70%; */
		height: 16rpx;
		margin-left: -2rpx;
		padding-right: 2rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
	}

	/* 商品信息 end */
	
	/* 分享 start */
	.share-but{
		width: 120rpx;
		height: 120rpx;
		margin-top: -10rpx;
		overflow: hidden;
	}
	
	.share-imgbut {
		display: flex;
		width: 130rpx;
		height: 60rpx;
		background: linear-gradient(270deg, #FF675C 0%, #FF8A5D 100%);
		border-top-left-radius: 30rpx;
		border-bottom-left-radius: 30rpx;
	}
	
	.share-imgbut>image {
		width: 24rpx;
		height: 24rpx;
		margin: 19rpx 7rpx 17rpx 20rpx;
	}
	
	.share-imgbut>text {
		line-height: 60rpx;
		font-size: 24rpx;
		color: #fff;
	}
	
	.share-imgbut::after {
		border: none;
	}
	
	.stock-quantity{
		position: absolute;
		bottom: -10rpx;
		right: 10rpx;
		transform: scale(.8);
		
	}
	.stock-quantity .surplus{
			color: #000 !important;
	}
	/* 分享 end */
	
</style>
