<template>
	<view>
		<!-- 无签到活动 -->
		<view class="not-activity" v-if="type == 1">
			<image :src="imgUrl + '/notDtarted-icon.png'" mode=""></image>
			<view>签到活动还未开始噢～</view>
		</view>
		<!-- 无抽奖活动 -->
		<view class="not-activity" v-if="type == 2">
			<image :src="imgUrl + '/notLuckDraw-icon.png'" mode=""></image>
			<view>请持续关注下期抽奖活动</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0,
				imgUrl: this.config.imgUrl,
			}
		},
		onLoad(option) {
			this.type = option.type
			if(this.type == 1) {
				uni.setNavigationBarTitle({
					title: '每日签到'
				})
			}
			if(this.type == 2) {
				uni.setNavigationBarTitle({
					title: '幸运抽奖'
				})
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
	
	.not-activity {
		width: 350rpx;
		margin: 40% auto 0;
	}
	
	.not-activity>image {
		display: block;
		width: 176rpx;
		height: 180rpx;
		margin: 0 auto 0;
	}
	
	.not-activity>view {
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		line-height: 40rpx;
	}
	
</style>
