<template>
	<view class="content">
		<!-- 月份/年 -->
		<view class="month-title">
			<view>{{ integral.createMonthName }}</view>
			<view class="month-sum">
				<span>获取：{{ integral.pointAdd }}</span>
				<span>使用：{{ integral.pointSubtract }}</span>
				<view class="drop-down" @click="dropDownClick">
					<u-icon :name=" dropDown ? 'arrow-down' : 'arrow-up' " color="#333333" size="40"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 积分明细 -->
		<view class="detailed" v-if="dropDown">
			<view v-if="integralList.length != 0">
				<view class="detailed-item" v-for="(item, index) in integralList" :key="index">
					<view class="detailed-use">
						<view>{{ item.pointSubtract != 0 && item.application != null ? item.application : '' }} {{ item.pointAdd != 0 && item.pointTypeName != null ? item.pointTypeName : '' }} {{ item.description == null ? '' : item.description }}</view>
						<view>{{ item.createTimeFormat }}</view>
					</view>
					<view class="detailed-num" v-if="item.pointAdd != 0">+{{ item.pointAdd }}</view>
					<view class="detailed-num" v-if="item.pointSubtract != 0">{{ item.pointSubtract }}</view>
				</view>
				<!-- 点击加载更多 -->
				<view class="load-more">
					<u-loadmore :status="integral.status" :icon-type="iconType" :load-text="loadText" @loadmore="loadMore" />
				</view>
			</view>
			<!-- 月份中显示情况 -->
			<view class="not-detailed" v-if="dropDown == false">
				<image :src="imgUrl + '/integralIcon.png'" mode="widthFix"></image>
				<view class="tips-text">暂无积分</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				}
			}
		},
		props: {
			integral: Object, // 月份总和
			integralList: Array, // 明细列表
			dropDown: Boolean, // 显示开关
		},
		mounted() {
			
		},
		methods: {
			// 显示开关
			dropDownClick() {
				this.$emit('change', this.dropDown)
			},
			// 加载更多
			loadMore() {
				this.$emit('loadMore', true)
			}
		}
	}
</script>

<style scoped>
	/* 月份/年标题 start */
	.month-title {
		display: flex;
		justify-content: space-between;
		height: 70rpx;
		padding: 0 20rpx;
		line-height: 70rpx;
		background-color: #FDF0EC;
	}
	
	.month-title view {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
	}
	
	.month-sum {
		display: flex;
	}
	
	.month-sum span {
		min-width: 200rpx;
	}
	
	.month-sum span:nth-child(2) {
		margin-left: 10rpx;
	}
	
	.drop-down {
		width: 70rpx;
		height: 70rpx;
		text-align: center;
		line-height: 80rpx;
		margin-left: 20rpx;
	}
	
	/* 月份/年标题 end */
	
	
	/* 明细 start */
	.detailed {
		padding: 0 20rpx;
		background-color: #FFFFFF;
	}
	
	.detailed-item {
		display: flex;
		justify-content: space-between;
		/* height: 120rpx; */
		border-bottom: 1rpx solid #EEEEEE;
	}
	
	.detailed-use {
		margin: 20rpx 0;
	}
	
	.detailed-use view {
		font-size: 24rpx;
		color: #333333;
		line-height: 40rpx;
	}
	
	.detailed-num {
		margin-left: 20rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #ED6D46;
		line-height: 120rpx;
	}
	
	.not-detailed {
		padding: 50rpx 0;
	}
	
	.not-detailed>image {
		width: 200rpx;
		margin: 0 275rpx;
	}
	
	.tips-text {
		text-align: center;
		font-size: 30rpx;
		color: #333333;
		line-height: 50rpx;
	}
	
	/* 明细 end */

	/* 点击加载更多 start */
	.load-more {
		padding: 30rpx 0;
	}
	
	/* 点击加载更多 end */


</style>
