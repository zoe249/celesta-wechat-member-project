<template>
	<view>
		<!-- 卡面值 -->
		<view class="gift-card" :style="{ 'background': selectCard.coverColor }">
			<view class="gift-card-title">
				<image :src="selectCard.logo" mode=""></image>
				<view>{{ selectCard.productName }}</view>
			</view>
			<view class="gift-card-num">
				<view>面值</view>
				<view>￥{{ selectCard.faceValue }}</view>
			</view>
		</view>
		
		<!-- 卡方案 -->
		<view class="electronic-card">
			<view class="electronic-card-title">请选择电子卡面值</view>
			<view class="face-value">
				<view :class=" choiceIndex == index + 1 ? 'gift choice' : 'gift'" v-for="(item, index) in faceValues" :key="index" @click="choiceGiftCard(item, index)">¥{{ item.faceValue }}</view>
			</view>
			<!-- 暂时不做 -->
			<!-- <view class="other-face-value">
				<view>其他面值</view>
				<view>
					¥
					<input class="other-input" v-model="moneyNum" type="number" maxlength="4" placeholder="输入0-1000的整数" @focus="paymentMoney = moneyNum" @input="setInput" />
				</view>
			</view> -->
		</view>
		
		<!-- 底部操作栏 -->
		<view class="navigation">
			<view class="card-money">
				<view>¥ {{ paymentMoney }}</view>
				<view>
					<u-number-box v-model="numValue" :step="1" :min="1" :max="100" :disabled-input="true" @change="valChange"></u-number-box>
				</view>
			</view>
			<view class="navigation-but" @click="goConfirmOrder">确定</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				memberInfo: uni.getStorageSync('memberInfo'),
				choiceIndex: 1, // 选择面值第几个
				moneyNum: '', // 其他金额
				paymentMoney: 0, // 需要支付的金额
				numValue: 1, // 购买张数计步器
				faceValues: [], // 卡方案列表
				selectCard: {
					productName: '',
					faceValue: 0,
					coverColor: 'linear-gradient(0deg, #6EA7F5 0%, #638CEC 100%)',
					logo: this.config.companyLogoBg
				}, // 选中的卡方案
			}
		},
		onLoad() {
			// 获取礼品卡方案
			this.getGiftCards()
		},
		methods: {
			// 获取礼品卡方案
			getGiftCards() {
				let that = this
				that.request({
					url: that.config.getGiftCardSchemes,
					data: {
						pageIndex: 1,
						pageSize: 6,
						status: '02',
						published: true
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) return
					let data = res.data.data
					that.faceValues = data
					that.selectCard = data[0]
					that.paymentMoney = data[0].faceValue * that.numValue
				})
			},
			// 其他金额输入
			setInput(event) {
				this.moneyNum = event.detail.value
				this.paymentMoney = Number(event.detail.value) * this.numValue
			},
			// 购买张数计步器
			valChange(e) {
				console.log(this.numValue);
				this.paymentMoney = this.selectCard.faceValue * this.numValue
			},
			// 选择礼品卡
			choiceGiftCard(event, index) {
				this.paymentMoney = Number(event.faceValue) * this.numValue
				this.choiceIndex = index + 1
				this.selectCard = event
			},
			// 去购买
			goConfirmOrder() {
				let companyCode = this.config.companyCode
				let orderInfo = {
					quantity: this.numValue,
					salePrice: this.selectCard.faceValue,
					totalPrice: this.paymentMoney,
					giftCardSchemeId: this.selectCard.id,
					phone: this.memberInfo.phone,
					organizationCode: companyCode.organizationCode,
					channelsCode: companyCode.channelCode,
					terminalsCode: companyCode.terminalCode,
				}
				uni.navigateTo({
					url: './confirmOrder?orderInfo=' + JSON.stringify(orderInfo) + '&selectCard=' + JSON.stringify(this.selectCard)
				})
			},
		}
	}
</script>

<style>
	/* 卡面值 start */
	.gift-card {
		height: 200rpx;
		margin: 20rpx 20rpx 0;
		/* background: linear-gradient(0deg, #6EA7F5 0%, #638CEC 100%); */
		border-radius: 10rpx 10rpx 0 0;
	}
	
	.gift-card-title {
		display: flex;
		height: 100rpx;
	}
	
	.gift-card-title>image {
		width: 50rpx;
		height: 50rpx;
		margin: 20rpx 10rpx 20rpx 20rpx;
		border-radius: 50%;
	}
	
	.gift-card-title>view {
		font-size: 28rpx;
		font-weight: 500;
		line-height: 90rpx;
		color: #FFFFFF;
	}
	
	.gift-card-num {
		display: flex;
		justify-content: center;
	}
	
	.gift-card-num>view:nth-child(1) {
		font-size: 22rpx;
		line-height: 60rpx;
		color: #FFFFFF;
	}
	
	.gift-card-num>view:nth-child(2) {
		margin: 0 10rpx;
		font-size: 40rpx;
		font-weight: 600;
		line-height: 60rpx;
		color: #FFFFFF;
	}
	
	/* 卡面值 end */
	
	/* 卡方案 start */
	.electronic-card {
		width: 100%;
		padding: 20rpx 0;
		background-color: #FFFFFF;
	}
	
	.electronic-card-title {
		margin: 0 20rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #333333;
	}
	
	.face-value {
		display: flex;
		/* justify-content: space-around; */
		flex-wrap: wrap;
		width: 710rpx;
		margin: 0 20rpx;
	}
	
	.face-value>view {
		width: calc(33.3% - 15rpx);
		height: 100rpx;
		margin: 7rpx 5rpx;
		text-align: center;
		font-size: 28rpx;
		line-height: 100rpx;
		color: #666666;
		background: #EEEEEE;
		border: 2rpx solid #DDDDDD;
		border-radius: 10rpx;
	}
	
	.gift.choice {
		color: #ED6D46;
		background: rgba(255, 103, 68, 0.1);
		border: 2rpx solid #FF6744;
	}
	
	.other-face-value {
		display: flex;
		justify-content: space-between;
		margin: 0 20rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #333333;
	}
	
	.other-face-value>view:nth-child(2) {
		display: flex;
		width: 280rpx;
		font-size: 40rpx;
		font-weight: 600;
	}
	
	.other-face-value>view:nth-child(2) .other-input {
		height: 100rpx;
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #333333;
		font-weight: 400;
		line-height: 100rpx;
	}
	
	/* 卡方案 end */
	
	/* 底部操作栏 start */
	.navigation {
		position: fixed;
		bottom: 0;
		width: 750rpx;
		height: 210rpx;
		padding: 30rpx 0;
		background-color: #FFFFFF;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.card-money {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		margin-top: ;
		margin: 0 20rpx;
	}
	
	.card-money>view {
		font-size: 32rpx;
		font-weight: 600;
		line-height: 100rpx;
		color: #333333;
	}
	
	.navigation-but {
		width: 710rpx;
		height: 80rpx;
		margin: 0 20rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 80rpx;
		background: #ED6D46;
		border-radius: 40rpx;
	}
	
	/* 底部操作栏 end */

</style>
