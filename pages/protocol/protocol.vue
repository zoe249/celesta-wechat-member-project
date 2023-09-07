<template>
	<view class="wrap">
		<!-- 头部 -->
		<u-navbar title="用户协议" :is-back="true" :background="background" title-color="#000000" title-size="35"></u-navbar>
		<view class="title">{{ detail.name }}</view>
		<view class="content" v-if="detail">
			{{ detail.details }}
		</view>
		<view class="content" v-else>
			<view>1、充值金额可购买门店线上线下商品</view>
			<view>2、充值金额不计利息，不可提现，退款和转赠</view>
			<view>3、单笔冲值上限1000元，充值成功后，您的充值金额将会实时充值您的包账户</view>
			<view>4、使用钱包余额购买的订单，退换货订单产生的退款将返回钱包余额</view>
			<view>5、余额有效期：永久有效</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#fff'
				},
				detail:{}
			}
		},
		onLoad() {
			this.getProtocol()
		},
		methods: {
			getProtocol(){
				this.request({
					url:this.config.getProtocolByName + '?name=付费会员协议',
				}).then(res=>{
					
					this.detail = res.data.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		padding: 20rpx;
		.content{
			margin-top: 20rpx;
			font-size: 22rpx;
			color:#333333;
			line-height: 44rpx;
		}
	}
</style>
