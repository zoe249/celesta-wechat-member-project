<template>
	<view>
		<!-- 说明 -->
		<view class="explain-rule">
			<view class="rule-title">说明：</view>
			<view class="rule-text">1. 点击“全部绑定到当前账号”可以将礼品卡一次性绑定到当前账户；</view>
			<view class="rule-text">2. 点击“绑定到当前账号”，可以只绑定当前的礼品卡；</view>
			<view class="rule-text">3. 也可以复制“秘钥”，将秘钥转送给好友，好友可以通过绑定礼品卡功能，绑定到自己账号；</view>
		</view>
		
		<!-- 全部绑定 -->
		<view class="binding">
			<view class="binding-but" @click="bindingAll">全部绑定到当前账号</view>
		</view>
		
		<!-- 礼品卡列表 -->
		<view class="gift-card">
			<view class="gift-card-item" v-for="(item, index) in cardList" :key="index">
				<view class="card-info">
					<view>卡号：</view>
					<view>{{ item.cardNumber }}</view>
				</view>
				<view class="card-info">
					<view>卡秘钥：</view>
					<view>
						<view>{{ item.password }}</view>
					</view>
					<view class="copy-key"@click="copyCode(item)">复制</view>
				</view>
				<view class="card-info">
					<view>有效期：</view>
					<view>{{ item.beginTime }} - {{ item.endTime }}</view>
				</view>
				<view class="binding-key">
					<view class="binding-key-but" v-if="item.status == '1'" @click="bindingOne(item)">绑定到当前账号</view>
					<view class="binding-key-but-dark" v-if="item.status == '2'">已绑定</view>
					<view class="binding-key-but-dark" v-if="item.status == '3'">已失效</view>
				</view>
			</view>
		</view>
		
		<!-- 隔离层 -->
		<view style="height: 100rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageIndex: 1,
				code: '',
				orderNum: '',
				cardList: [], // 卡列表
			}
		},
		onLoad(option) {
			console.log(option);
			this.code = option.code
			this.orderNum = option.orderNum
			this.orderId = option.orderId
			// 获取卡密钥列表
			this.getCardKeyList()
		},
		methods: {
			// 获取卡密钥列表
			getCardKeyList() {
				let that = this
				that.request({
					url: that.config.getCardKeyList,
					data: {
						pageIndex: this.pageIndex,
						pageSize: '20',
						orderNumber: this.orderNum,
						code: this.code,
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode == 200) {
						let data = res.data.data
						that.cardList = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 全部绑定
			bindingAll() {
				let that = this
				that.request({
					url: that.config.getBindingAll + that.orderId,
					method: 'PUT',
				}).then(res => {
					console.log(res);
					if(res.statusCode == 200) {
						uni.showToast({
							title: '绑卡成功',
							icon: 'success'
						})
						setTimeout(() => {
							that.pageIndex = 1
							that.cardList = []
							that.getCardKeyList()
						}, 1500)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 绑定某一个
			bindingOne(event) {
				let that = this
				that.request({
					url: that.config.getBindingOne,
					header: {
						'Content-Type': 'application/json'
					},
					method: 'POST',
					data: {
						password: event.password
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode == 200) {
						uni.showToast({
							title: '绑卡成功',
							icon: 'success'
						})
						setTimeout(() => {
							that.pageIndex = 1
							that.cardList = []
							that.getCardKeyList()
						}, 1500)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 复制
			copyCode(event) {
				let that = this
				uni.setClipboardData({
				    data: event.password,
				    success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						})
				    }
				});
			},
		}
	}
</script>

<style>
	/* 说明 start */
	.explain-rule {
		padding: 20rpx 30rpx 0;
		background-color: #FFFFFF;
	}
	
	.rule-title {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		color: #333333;
	}
	
	.rule-text {
		font-size: 22rpx;
		color: #333333;
		line-height: 40rpx;
	}
	
	/* 说明 end */
	
	/* 绑定 start */
	.binding {
		display: flex;
		justify-content: flex-end;
		height: 80rpx;
		padding: 0 20rpx;
		background-color: #FFFFFF;
	}
	
	.binding-but {
		width: 280rpx;
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
	
	/* 绑定 end */
	
	/* 礼品卡列表 start */
	.gift-card {
		margin: 0 20rpx;
	}
	
	.gift-card-item {
		margin: 20rpx 0 0;
		padding: 20rpx 20rpx 10rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.card-info {
		display: flex;
		/* height: 60rpx; */
	}
	
	.card-info>view {
		font-size: 26rpx;
		line-height: 60rpx;
		color: #333333;
	}
	
	.card-info>view:nth-child(1) {
		width: 120rpx;
	}
	
	.card-info>view:nth-child(2) {
		max-width: 450rpx;
	}
	
	.card-info>view:nth-child(2) view {
		margin-top: 15rpx;
		line-height: 35rpx;
	}
	
	.card-info>view.copy-key {
		width: 70rpx;
		height: 36rpx;
		margin: 10rpx 0 10rpx 20rpx;
		border: 2rpx solid #CCCCCC;
		border-radius: 20rpx;
		text-align: center;
		font-size: 17rpx;
		color: #333333;
		line-height: 34rpx;
	}
	
	.binding-key {
		display: flex;
		justify-content: flex-end;
		height: 80rpx;
	}
	
	.binding-key-but {
		width: 235rpx;
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
	
	.binding-key-but-dark {
		width: 140rpx;
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
	
	/* 礼品卡列表 end */

</style>
