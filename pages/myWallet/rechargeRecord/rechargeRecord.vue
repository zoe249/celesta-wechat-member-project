<template>
	<view class="content">
		<view class="prize-view">
			<view class="prize-item" v-for="(item, index) in prizes" :key="index">
				<view class="prize-time">{{ item.createTime }}</view>
				<view class="prize-name" v-if="item.type == 1"> 充值 {{ '+' + item.amountAll }}</view>
				<view class="prize-name" v-if="item.type == 2"> 消费 {{ '-' + item.amountAll }}</view>
				<view class="prize-name" v-if="item.type == 3"> 退款 {{ '+' + item.amountAll }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberInfo: uni.getStorageSync('memberInfo'), // 会员信息
				prizes: [], // 获取交易记录
				pageIndex: 1,
				total: 0,
			}
		},
		onLoad() {
			// 获取交易记录
			this.getDrawRecord()
		},
		// 上拉动作
		onReachBottom() {
			if(this.prizes.length < this.total) {
				this.pageIndex++
				this.getDrawRecord()
			}
		},
		methods: {
			// 获取交易记录
			getDrawRecord() {
				let that = this
				that.request({
					url: that.config.savingsList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: 30,
						memberId: that.memberInfo.id,
					}
				}).then(res => {
					console.log(res);
					if (res.statusCode != 200) return
					let data = res.data
					data.data.forEach((item) => {
						if(item.givenAmount != null) {
							item.amountAll = Number(item.amount + item.givenAmount).toFixed(2)
						} else {
							item.amountAll = Number(item.amount).toFixed(2)
						}
					})
					that.prizes = [...that.prizes, ...data.data]
					that.total = data.total
				})
			},
		}
	}
</script>

<style>
	
	.content {
		margin: 20rpx 20rpx 0;
		padding: 20rpx;
	}
	
	.prize-view {
		background-color: #FFFFFF;
		border-radius: 16rpx;
	}
	
	.prize-item {
		display: flex;
		justify-content: space-between;
		margin: 10rpx 20rpx;
		border-bottom: 2rpx solid #EEEEEE;
	}
	
	.prize-time {
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}
	
	.prize-name {
		max-width: 330rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #999999;
	}
	
</style>
