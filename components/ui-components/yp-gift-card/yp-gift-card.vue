<template>
	<view class="content" v-if="isEmpty">
		<view class="cards" v-for="(item, index) in giftCards" :key="index" :style="{ 'background-color': item.coverColor, 'background-image': 'url(' +  item.coverPicture + ')' }">
			<!-- 蒙板 -->
			<view :class="isAvailable ? 'mask-default' : 'mask'">
				<!-- 卡内容 -->
				<view class="card-header">
					<view class="header-name">
						<image :src="item.logo"></image>
						<view>{{ item.productName }}</view>
					</view>
					<view class="face-value">面值：{{ item.faceValue }}</view>
				</view>
				<view class="balance">
					<view class="balance-value">
						<span>余额</span>
						<span> ¥{{ item.balance }} </span>
					</view>
					<view class="balance-term">
						<span class="balance-time">有效期：{{ item.beginTimeFormat }} - {{ item.endTimeFormat }}</span>
					</view>
				</view>
				<view class="operation control-card">
					<view>
						<view class="transfer" v-if=" isAvailable && (item.faceValue == item.balance) " @click="goTransfer(item)">转赠此卡</view>
						<view class="record" @click="goRecord(item)">消费记录</view>
					</view>
					<view @click="codePopup(item)">
						<u-icon :name="imgUrl + '/shoV8H.png'" color="#ffffff" size="50"></u-icon>
					</view>
				</view>
				<view :class="item.isExpand ? 'explain' : 'explain action'">
					<u-icon name="info-circle" color="#EEEEEE" size="28"></u-icon>
					<view class="explain-text">{{ item.description }}</view>
					<u-icon class="arrow-down" :name="item.isExpand ? 'arrow-up' : 'arrow-down'" color="#EEEEEE" size="28" @click="setExpend(index)"></u-icon>
				</view>
			</view>
		</view>
		<!-- 点击加载更多 -->
		<view class="load-more">
			<u-loadmore :status="giftCardsSet.status" :icon-type="iconType" :load-text="loadText" @loadmore="loadMore" />
		</view>
		
		<!-- 用户二维码/条形码 -->
		<u-popup v-model="isUserCode" mode="bottom" :closeable="true" :mask-close-able="true" @close="isUserCode = false, isUserCodes = true">
			
			<view class="userCode">
				<view class="popup">
					<view class="bar-code" v-if="isUserCode">
						<div class="code-title">核销码</div>
						<view class="bar-code-code">
							<canvas class="bar_code" canvas-id="brcode"></canvas>
						</view>
						<view class="bar-code-num">{{ nowCardNumber }}</view>
					</view>
					<view class="qr-code" v-if="isUserCode">
						<image :src="qrUrl"></image>
					</view>
				</view>
				<!-- 加载 -->
				<view v-if="isUserCodes" class="userCodeMask">
					<yp-loading ref="loading" :type="2"></yp-loading>
				</view>
			</view>
		</u-popup>
	</view>
	<view class="empty" v-else>
		<image :src="imgUrl + '/giftCard.png'" mode="widthFix"></image>
		<view class="tips-text"> {{ isAvailable ? '您当前没有可用礼品卡' : '您当前没有不可用礼品卡' }}</view>
	</view>
	
</template>

<script>
	import Qr from '@/utils/qr-code.js'
	import Tki from "@/utils/tki-barcode.js"
	export default {
		data() {
			return {
				isUserCode: false, // 是否显示会员二维码/条形码
				isUserCodes: true, // 是否显示会员二维码/条形码
				isAdvertisement: false, // 是否显示弹出层广告
				nowCardNumber: '',
				qrUrl:'', // 生成二维码链接
				imgUrl: this.config.imgUrl,
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '已经到底啦'
				}
			}
		},
		props: {
			giftCardsSet: Object,
			giftCards: Array,
			isAvailable: { // 卡是否可用
				type: Boolean,
				default: true
			},
			isEmpty: Boolean, // 是否为空
		},
		mounted() {
			
		},
		methods: {
			// 卡说明拓展
			setExpend(index) {
				this.$emit('change', index)
			},
			// 转赠此卡
			goTransfer(value) {
				let cardData = JSON.stringify(value)
				uni.navigateTo({
					url: '../myGiftCard/regiftGiftCards/regiftGiftCards?cardData=' + cardData
				})
			},
			// 消费记录
			goRecord(value) {
				let cardData = JSON.stringify(value)
				uni.navigateTo({
					url: '../myGiftCard/consumptionRecord/consumptionRecord?cardData=' + cardData
				})
			},
			// 生成核销二维码
			codePopup(item){
				console.log(item.cardNumber)
				let that = this
				that.nowCardNumber = item.cardNumber
				that.isUserCode = true
				that.$refs.loading.open()
				setTimeout(function() {
					// 获取二维码
					that.getQR(item.cardNumber)
					// 获取条形码
					that.getTki(item.cardNumber)
				}, 500)
			},
			// 获取二维码
			getQR(cardNumber) {
				this.qrUrl = Qr.createQrCodeImg(cardNumber)
			},
			// 获取条形码
			getTki(cardNumber) {
				console.log(cardNumber)
				let that = this
				let codeWidth = 0
				uni.getSystemInfo({
					success: function(res) {
						console.log('获取系统信息',res)
						codeWidth = 670 * res.screenWidth / 750
						/* 在自定义组件中创建canvas实例，需要传入this */
						// 加个空格就好使； 
						Tki.code128(wx.createCanvasContext('brcode', that), cardNumber + ' ', codeWidth, 100);
						// 蒙板
						setTimeout(function() {
							that.isUserCodes = false
							that.$refs.loading.close()
						}, 1500)
					}
				})
			},		
		}
	}
</script>

<style lang="less" scoped>
	/* 卡头部 start */
	.content {
		margin: 0 20rpx;
	}

	.cards {
		position: relative;
		margin: 20rpx 0;
		border-radius: 20rpx;
		overflow: hidden;
	}
	
	.cards .mask {
		padding: 20rpx 0;
		// background-color: rgba(255, 255, 255, .3);
		background-color: rgba(0, 0, 0, .7);
		z-index: 40;
	}
	
	.cards .mask-default {
		padding: 20rpx 0;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		margin: 0 20rpx;
	}

	.header-name {
		display: flex;
	}

	.header-name image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 10rpx 20rpx 10rpx 0;
	}

	.header-name view {
		font-size: 30rpx;
		color: #FFFFFF;
		line-height: 100rpx;
	}

	.face-value {
		font-size: 26rpx;
		color: #FFFFFF;
		line-height: 110rpx;
	}

	/* 卡头部 end */


	/* 卡余额 start */
	.balance {
		height: 110rpx;
		margin: 0 20rpx;
	}

	.balance-value {
		height: 60rpx;
		text-align: center;
	}

	.balance-value span:nth-child(1) {
		font-size: 24rpx;
		line-height: 55rpx;
		color: #FFFFFF;
	}

	.balance-value span:nth-child(2) {
		margin-left: 20rpx;
		font-size: 40rpx;
		font-weight: 600;
		letter-spacing: 5rpx;
		line-height: 55rpx;
		color: #FFFFFF;
	}

	.balance-term {
		display: flex;
		justify-content: center;
	}

	.balance-time {
		margin-top: 5rpx;
		padding: 7rpx 20rpx;
		font-size: 20rpx;
		border-radius: 20rpx;
		color: #FFFFFF;
		background-color: rgba(0, 0, 0, .2);
	}

	/* 卡余额 end */


	/* 卡操作 start */
	.operation {
		height: 80rpx;
		background-color: rgba(0, 0, 0, .4);
		// width: calc(100% - 40rpx);
		padding: 0 20rpx;
		padding-right: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.operation>view {
		// position: absolute;
		// top: 0;
		// right: 20rpx;
		display: flex;
	}

	.transfer {
		width: 100rpx;
		height: 50rpx;
		margin: 12rpx;
		padding: 0 15rpx;
		font-size: 22rpx;
		text-align: center;
		color: #FFFFFF;
		line-height: 50rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 15rpx;
		background-color: rgba(0, 0, 0, .3);
	}

	.record {
		width: 100rpx;
		height: 50rpx;
		margin: 15rpx;
		padding: 0 15rpx;
		font-size: 22rpx;
		text-align: center;
		color: #FFFFFF;
		line-height: 50rpx;
		border-radius: 15rpx;
		background-color: #ED6D46;
	}

	/* 卡操作 end */


	/* 卡说明 start */
	.explain {
		display: flex;
		justify-content: space-between;
		margin: 0 20rpx;
	}
	
	.explain-text {
		width: 635rpx;
		margin: 8rpx 10rpx 0;
		font-size: 20rpx;
		color: #FFFFFF;
		line-height: 30rpx;
		/* display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical; */
	}
	
	.arrow-down {
		margin-top: 30rpx;
	}
	
	.action {
		display: flex;
		justify-content: space-between;
		margin: 0 20rpx;
		height: 60rpx;
		.explain-text { 
			width: 635rpx;
			/* height: 60rpx; */
			margin: 8rpx 10rpx 0;
			font-size: 20rpx;
			color: #FFFFFF;
			line-height: 30rpx;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}

	/* 卡说明 end */
	
	
	/* 列表为空 start */
	.empty {
		margin: 0 200rpx;
	}
	
	.empty>image {
		width: 200rpx;
		margin: 100rpx 75rpx 20rpx;
	}
	
	.tips-text {
		text-align: center;
		font-size: 30rpx;
		color: #333333;
		line-height: 50rpx;
	}
	
	/* 列表为空 end */
	
	
	/* 点击加载更多 start */
	.load-more {
		padding: 30rpx 0;
	}

	/* 用户二维码/条形码 start */
	.userCode {
		position: relative;
		height: 70vh;
	}
	
	.popup {
		height: 70vh;
		z-index: 40;
	}
	
	.bar-code {
		padding: 100rpx 0 20rpx;
		margin: 0 20rpx;
		border-bottom: 2rpx solid #EEEEEE;
	}
	
	.code-title{
		display: flex;
		justify-content: center;
		padding-bottom: 20rpx;
		font-weight: bold;
	}
	
	.bar-code-code {
		height: 200rpx;
	}
	
	.bar_code {
		width: 670rpx;
		height: 200rpx;
		margin: 0 20rpx;
	}
	
	.bar-code-num {
		height: 80rpx;
		font-size: 30rpx;
		text-align: center;
		color: #333333;
		line-height: 60rpx;
	}
	
	.qr-code>image {
		width: 300rpx;
		height: 300rpx;
		margin: 30rpx 225rpx;
	}
	
	.userCodeMask {
		position: absolute;
		top: 0;
		width: 750rpx;
		height: 70vh;
		background-color: #FFFFFF;
		z-index: 50;
	}
	
	/* 用户二维码/条形码 end */
	
	
</style>
