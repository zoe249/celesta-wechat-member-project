<template>
	<view class="content">
		<!-- 服务 -->
		<view class="service">
			
			<!-- 
				style: 1-上下型/2-左右型
				iconDisplay: ture-显示/false-隐藏    图标
				descriptionDisplay:ture-显示/false-隐藏  描述
				columns: 1-4列
			 -->
			
			<!-- 一列 -->
			<view v-if="serviceStyle.columns == 1" :class="serviceStyle.style == 1 ? 'text-bottom-1' : 'text-right-1'">
				<view v-for="(item, index) in services" :key="index" :style="{ width: 710/serviceStyle.columns + 'rpx' }">
					<view class="item-img-text" @click="goJump(item)">
						<image v-if="serviceStyle.iconDisplay" :src="item.pictureUrl"></image>
						<view v-if="serviceStyle.descriptionDisplay" class="item-name">{{ item.description }}</view>
					</view>
					<u-icon v-if="serviceStyle.style == 2" class="item-right-icon" name="arrow-right" color="#2D2D2D" size="28"></u-icon>
				</view>
			</view>
			
			<!-- 二列 -->
			<view v-if="serviceStyle.columns == 2" :class="serviceStyle.style == 1 ? 'text-bottom-2' : 'text-right-2'">
				<view v-for="(item, index) in services" :key="index" :style="{ width: 710/serviceStyle.columns + 'rpx' }">
					<view class="item-img-text" @click="goJump(item)">
						<image v-if="serviceStyle.iconDisplay" :src="item.pictureUrl"></image>
						<view v-if="serviceStyle.descriptionDisplay" class="item-name">{{ item.description }}</view>
					</view>
					<u-icon v-if="serviceStyle.style == 2" class="item-right-icon" name="arrow-right" color="#2D2D2D" size="28"></u-icon>
				</view>
			</view>
			
			<!-- 三列 -->
			<view v-if="serviceStyle.columns == 3" :class="serviceStyle.style == 1 ? 'text-bottom-3' : 'text-right-3'">
				<view v-for="(item, index) in services" :key="index" :style="{ width: 710/serviceStyle.columns + 'rpx' }">
					<view class="item-img-text" @click="goJump(item)">
						<image v-if="serviceStyle.iconDisplay" :src="item.pictureUrl"></image>
						<view v-if="serviceStyle.descriptionDisplay" class="item-name">{{ item.description }}</view>
					</view>
					<u-icon v-if="serviceStyle.style == 2 && serviceStyle.columns <= 2" class="item-right-icon" name="arrow-right" color="#2D2D2D" size="28"></u-icon>
				</view>
			</view>
			
			<!-- 四列 -->
			<view v-if="serviceStyle.columns == 4" :class="serviceStyle.style == 1 ? 'text-bottom-4' : 'text-right-4'">
				<view v-for="(item, index) in services" :key="index" :style="{ width: 710/serviceStyle.columns + 'rpx' }">
					<view class="item-img-text" @click="goJump(item)">
						<image v-if="serviceStyle.iconDisplay" :src="item.pictureUrl"></image>
						<view v-if="serviceStyle.descriptionDisplay" class="item-name">{{ item.description }}</view>
					</view>
					<u-icon v-if="serviceStyle.style == 2 && serviceStyle.columns <= 2" class="item-right-icon" name="arrow-right" color="#2D2D2D" size="28"></u-icon>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			services: Array,
			serviceStyle: Object
		},
		methods: {
			// 跳转
			goJump(value) {
				this.$emit('change', value)
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		padding-bottom: 40rpx;
		background-color: #FFFFFF;
	}
	
	/* 权益服务 start */
	/* 一列 start */
	.text-bottom-1 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
	
		>view {
			margin-top: 20rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 600;
			min-width: 125rpx;
		}
	
		.item-img-text>image {
			width: 710rpx;
			height: 177.5rpx;
		}
		
		.item-img-text>view {
			font-size: 28rpx;
			font-weight: 500;
			line-height: 50rpx;
			color: #666666;
		}
	}
	
	.text-right-1 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
			
		>view {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
		}
		
		.item-img-text {
			display: flex;
		}
			
		.item-img-text>image {
			width: 240rpx;
			height: 60rpx;
		}
		
		.item-img-text>view {
			margin-left: 20rpx;
			font-size: 25rpx;
			font-weight: 500;
			line-height: 60rpx;
			color: #666666;
		}
		
		.item-right-icon {
			line-height: 60rpx;
		}
	}
	
	/* 一列 end */
	
	
	/* 二列 start */
	.text-bottom-2 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
	
		>view {
			margin-top: 20rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 600;
			min-width: 125rpx;
		}
	
		.item-img-text>image {
			width: 315rpx;
			height: 79rpx;
		}
		
		.item-img-text>view {
			font-size: 28rpx;
			font-weight: 500;
			line-height: 50rpx;
			color: #666666;
		}
	}
	
	.text-right-2 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
			
		>view {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
		}
		
		.item-img-text {
			display: flex;
		}
			
		.item-img-text>image {
			width: 160rpx;
			height: 40rpx;
		}
		
		.item-img-text>view {
			margin-left: 20rpx;
			font-size: 25rpx;
			font-weight: 500;
			line-height: 40rpx;
			color: #666666;
		}
		
		.item-right-icon {
			line-height: 40rpx;
		}
	}
	
	/* 二列 end */
	
	
	/* 三列 start */
	.text-bottom-3 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
	
		>view {
			margin-top: 20rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 600;
			min-width: 125rpx;
		}
	
		.item-img-text>image {
			width: 220rpx;
			height: 55rpx;
		}
		
		.item-img-text>view {
			font-size: 28rpx;
			font-weight: 500;
			line-height: 50rpx;
			color: #666666;
		}
	}
	
	.text-right-3 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
			
		>view {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
		}
		
		.item-img-text {
			display: flex;
		}
			
		.item-img-text>image {
			width: 60rpx;
			height: 60rpx;
		}
		
		.item-img-text>view {
			margin-left: 20rpx;
			font-size: 23rpx;
			font-weight: 500;
			line-height: 60rpx;
			color: #666666;
		}
		
		.item-right-icon {
			line-height: 60rpx;
		}
	}
	
	/* 三列 end */
	
	
	/* 四列 start */
	.text-bottom-4 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
	
		>view {
			margin-top: 20rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 600;
			min-width: 125rpx;
		}
	
		.item-img-text>image {
			width: 174rpx;
			height: 44rpx;
		}
		
		.item-img-text>view {
			font-size: 26rpx;
			font-weight: 500;
			line-height: 50rpx;
			color: #666666;
		}
	}
	
	.text-right-4 {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
			
		>view {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
		}
		
		.item-img-text {
			margin-top: 20rpx;
			display: flex;
		}
			
		.item-img-text>image {
			width: 40rpx;
			height: 40rpx;
		}
		
		.item-img-text>view {
			margin-left: 10rpx;
			font-size: 20rpx;
			font-weight: 500;
			line-height: 40rpx;
			color: #666666;
		}
		
		.item-right-icon {
			line-height: 40rpx;
		}
	}
	
	/* 四列 end */
	
	/* 权益服务 end */
	
	
</style>
