<!-- 
	底部菜单
	商品详情页底部菜单栏
	
	入参：
		goodsInfo: Object
		商品信息
		carNum: String
		购物车数量
		
	返回：
		this.$emit("changes", true)
		打开商品规格弹窗
 
 -->


<template>
	<view class="navigation">
		<view class="left">
			<view class="item" @click="onHome">
				<u-icon :name="imgUrl + '/wCeFCn.png'" :size="40" :color="$u.color['contentColor']"></u-icon>
				<view class="text u-line-1">首页</view>
			</view>
			<view class="item car" @click="onShopCar">
				<u-badge class="car-num" :count="carNum" type="error" :offset="[-3, -6]"></u-badge>
				<u-icon :name="imgUrl + '/wCeAg0.png'" :size="40" :color="$u.color['contentColor']"></u-icon>
				<view class="text u-line-1">购物车</view>
			</view>
		</view>
		<view class="right">
			<view class="cart btn u-line-1" :style="addStyle" v-if="isStock" @click="specifications">加入购物车</view>
			<view class="buy btn u-line-1" :style="finishStyle" v-if="!isStock">已售罄</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				isStock: true, // 是否有库存
				// style 颜色样式
				addStyle: 'background-color:' + getApp().globalData.appStyle.addCarStyleBut,
				finishStyle: 'background-color:' + getApp().globalData.appStyle.finishStyleBut
			}
		},
		props: {
			goodsInfo: Object,
			carNum: String
		},
		mounted() {
			// 对特价商品商品校对库存为 0
			if (this.goodsInfo.type == '20') {
				if(this.goodsInfo.stockQuantity == 0){
					this.isStock = false
				}
				if(this.goodsInfo.promotionStockNow==0&&this.goodsInfo.stockQuantity>0){
					this.isStock = false
				}
			}
			// 普通商品校对库存为 0
			if (this.goodsInfo.promotionStockNow == null && this.goodsInfo.stockQuantity == 0) {
				this.isStock = false
			}
			
			// 活动商品校对限量为 0
			if (this.goodsInfo.promotionStockNow != null && this.goodsInfo.promotionStockNow == 0) {
				this.isStock = false
			}
		},
		methods: {
			specifications() {
				this.$emit("changes", true)
			},
			// 跳转首页
			onHome() {
				uni.switchTab({
					url: '../home/index'
				})
			},
			// 跳转购物车
			onShopCar() {
				uni.switchTab({
					url: '../shoppCart/shoppCart'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 提交订单栏 start */
	.goods-operation {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		width: 710rpx;
		/* height: 100rpx; */
		padding: 0 20rpx;
		background-color: #FFFFFF;
		z-index: 99;
	}

	.goods-operation>view {
		display: flex;
	}

	.navigation {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 750rpx;
		margin-top: 100rpx;
		border: solid 2rpx #f2f2f2;
		background-color: #ffffff;
		padding: 16rpx 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.left {
			display: flex;
			font-size: 20rpx;

			.item {
				margin: 0 30rpx;

				&.car {
					text-align: center;
					position: relative;

					.car-num {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}
				}
			}
		}

		.right {
			display: flex;
			font-size: 28rpx;
			align-items: center;

			.btn {
				line-height: 66rpx;
				padding: 0 30rpx;
				border-radius: 36rpx;
				color: #ffffff;
			}

			.cart, .buy {
				width: 440rpx;
				text-align: center;
				margin-right: 30rpx;
			}
		}
	}
</style>
