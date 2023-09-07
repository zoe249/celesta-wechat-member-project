<template>
	<view class="zong">
		<view class="vip-card-fix">
			<view class="vip-card">
				<view class="">
					卡号
				</view>
				<view class="">
					<text>{{cardNumber}}</text>
					<text class="copy-button" @click="sharurl(cardNumber)">复制</text>
				</view>
			</view>
		</view>
		<view class="content" v-if="record">
			<view class="top-text">
				<text>消费记录</text>
			</view>
			<view class="content-box" v-for="item in giftCardData" :key='item.id'>
				<view class="ordernum">
					<view class="">
						<text>订单号：{{item.billNum}}</text>
						<text class="copy-button" @click="sharurl(item.billNum)">复制</text>
					</view>
					<view class="">
						<text class="spending">{{item.expenditure}}</text>
					</view>
				</view>
				<view class="ordernum">
					<view class="">
						<text>{{$u.timeFormat(new Date(item.createTime), 'yyyy-mm-dd hh:MM:ss')}}</text>
					</view>
					<view class="">
						<text>余额：{{item.balance}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="norecord" v-if="!record">
			<view class="norecord-img">
				<image :src="imgUrl + '/noRecord.png'" mode="widthFix"></image>
			</view>
			<view class="norecord-text">
				<text>您当前没有消费记录</text>
			</view>
		</view>
		<!-- 上拉加载 -->
		<view class="load-more">
			<u-loadmore v-if="record && status != 'loadmore'" :status="status" :load-text="loadText" bg-color="#eff5f8"
			 margin-top="50" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				record: true, //数据是否为空
				imgUrl: this.config.imgUrl,
				giftCardId: '', //礼品卡id
				giftCardData: [], //礼品卡数据
				cardNumber: '', //礼品卡卡号
				billNum: '', //订单号
				expenditure: '', //消费额
				balance: '', //余额
				pageIndex: '',
				pageSize: '30',
				status: 'loadmore', // 上拉加载
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '已经到底啦'
				},
				isBottom: false
			}
		},
		onLoad(options) {
			let option = JSON.parse(options.cardData)
			this.giftCardId = option.id
			this.cardNumber = option.cardNumber
			this.giftCardPayment()
		},
		methods: {
			//复制
			sharurl(e) {
				uni.setClipboardData({
					data: e,
					success: function() {}
				});
			},
			giftCardPayment() {
				var that = this
				that.pageIndex = 1
				that.status = "loadmore"
				that.request({
						url: that.config.giftCardPayment,
						data: {
							giftCardId: that.giftCardId, //礼品卡Id
							pageIndex: that.pageIndex,
							pageSize: that.pageSize
						}
					})
					.then(res => {
						const data = res.data.data
						this.giftCardData = data
						if (data.length == 0) {
							that.record = false
						}
					})
			},
			/* 上拉加载 */
			onReachBottom() {
				let that = this
				if (!that.isBottom) {
					that.pageIndex += 1
					that.status = "loading"
					that.request({
							url: that.config.giftCardPayment,
							data: {
								giftCardId: that.giftCardId, //礼品卡Id
								pageIndex: that.pageIndex,
								pageSize: that.pageSize
							}
						})
						.then(res => {
							const data = res.data.data
							this.giftCardData.push(...data)

							if (data.length == 0) {
								that.isBottom = true
								that.status = "nomore"
							}
						})
				}
			}

		},
	}
</script>

<style lang="less">
	page {
		font-size: 28rpx;
		background-color: #EFF5F8;
	}

	.zong {
		margin-bottom: 20rpx;
	}

	.vip-card-fix {
		position: fixed;
		top: 0;
		display: flex;
		background-color: #EFF5F8;
	}

	.vip-card {
		width: 710rpx;
		display: flex;
		justify-content: space-between;
		font-weight: 600;
		padding: 0 20rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.copy-button {
		margin: 0 10rpx;
		padding: 2rpx 20rpx;
		font-size: 22rpx;
		text-align: center;
		border-radius: 22rpx;
		background-color: #FDF0EC;
		border: 1rpx solid #ED6D46;
		color: #ED6D46;
	}

	.top-text {
		position: fixed;
		top: 78rpx;
		font-weight: 600;
		padding: 0 20rpx;
		width: 710rpx;
		background-color: #FDF0EC;
		height: 70rpx;
		line-height: 70rpx;
	}

	.content {
		margin-top: 150rpx;
	}

	.content-box {
		font-size: 24rpx;
		margin-bottom: 2rpx;
		background-color: #FFFFFF;
		padding: 15rpx 20rpx;
	}

	.ordernum {
		display: flex;
		justify-content: space-between;
		height: 50rpx;
		line-height: 50rpx;
	}

	.spending {
		font-size: 28rpx;
		color: #84A729;
	}

	.norecord {
		margin-top: 50%;

		.norecord-img {
			width: 200rpx;
			margin: 0 auto;

			image {
				width: 200rpx;
			}
		}

		.norecord-text {
			margin-top: 20rpx;
			text-align: center;
		}
	}
	
	/* 点击加载更多 start */
	.load-more {
		padding: 0 0 30rpx;
	}
	
	/* 点击加载更多 end */
	
	
</style>
