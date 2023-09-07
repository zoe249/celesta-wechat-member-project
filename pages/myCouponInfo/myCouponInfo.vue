<template>
	<view>
		<!-- 加载 -->
		<yp-loading ref="loading" :type="2"></yp-loading>
		
		<!-- 券 -->
		<view class="coupon">
			<view class="coupon-info-left">
				<view class="coupon-info-img">
					<image :src="styleConfig[indexType].couponImg" mode=""></image>
				</view>
				<view class="coupon-info-num" :style="{ color: styleConfig[indexType].couponColor }">
					<text>{{ coupons.facevalue }}</text>
					<text v-if="coupons.type == 01 || coupons.type == 03">￥</text>
					<text v-if="coupons.type == 02">次</text>
					<text v-if="coupons.type == 04">折</text>
				</view>
			</view>
			<view class="coupon-info-right">
				<view class="coupon-info-title" v-if="coupons.type == 01" :style="{ color: styleConfig[indexType].couponColor }">金额券</view>
				<view class="coupon-info-title" v-if="coupons.type == 02" :style="{ color: styleConfig[indexType].couponColor }">计次券</view>
				<view class="coupon-info-title" v-if="coupons.type == 03" :style="{ color: styleConfig[indexType].couponColor }">满减券</view>
				<view class="coupon-info-title" v-if="coupons.type == 04" :style="{ color: styleConfig[indexType].couponColor }">折扣券</view>
				<view class="coupon-item-term" :style="{ color: styleConfig[indexType].couponTitleColor }">{{ coupons.couponTemplateName }}</view>
			</view>
		</view>
		
		<!-- 码 -->
		<view class="code">
			<view class="bar-code">
				<view class="bar-code-code">
					<canvas class="bar_code" canvas-id="brcode"></canvas>
				</view>
			</view>
			<view class="qr-code">
				<image :src="qrUrl"></image>
			</view>
			<view class="bar-code-text">优惠券码</view>
			<view class="bar-code-num">
				<view></view>
				<view>{{ coupons.couponNo }}</view>
				<view @click="copyCode">
					<view>复制</view>
				</view>
			</view>
			<view class="code-mask" v-if="coupons.couponStatus == 2 || coupons.couponStatus == 3">
				<image v-if="coupons.couponStatus == 2" src="../../static/coupon/used-icon.png" mode=""></image>
				<image v-if="coupons.couponStatus == 3" src="../../static/coupon/expired-icon.png" mode=""></image>
			</view>
		</view>
		
		<!-- 规则 -->
		<view class="rule">
			<view class="rule-title">使用规则</view>
			<view class="rule-info">
				<view class="rule-info-left">有效期</view>
				<view class="rule-info-right">{{ coupons.beginTime}} 至 {{ coupons.endTime }}</view>
			</view>
			<view class="rule-info">
				<view class="rule-info-left">使用时段</view>
				<!-- <view class="rule-info-right">{{ coupons.availableDaysformat }}</view> -->
				<view class="rule-info-right">{{ coupons.availableDays }} {{ ' ' + coupons.availableWeeks }}</view>
			</view>
			<view class="rule-info">
				<view class="rule-info-left">使用时间</view>
				<view class="rule-info-right">{{ coupons.availablePeriod }}</view>
			</view>
			<view class="rule-info">
				<view class="rule-info-left">使用须知</view>
				<view class="rule-info-right">{{ coupons.ruleExplain }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Qr from '@/utils/qr-code.js'
	import Tki from "@/utils/tki-barcode.js"
	import ypLoading from '@/components/yp-loading/yp-loading.vue'
	export default {
		components: {
			ypLoading
		},
		data() {
			return {
				// id: '', // 券 id
				qrUrl: '', // 会员二维码路径
				indexType: 0, // 券类型
				coupons: {}, // 券模版信息
				styleConfig: [ // 颜色配置
					{
						type: 1,
						couponImg: '../../static/coupon/coupon-orange.png',
						couponColor: '#ED6D46',
						couponTitleColor: '#333333'
					}, {
						type: 2,
						couponImg: '../../static/coupon/coupon-green.png',
						couponColor: '#80C269',
						couponTitleColor: '#333333'
					}, {
						type: 3,
						couponImg: '../../static/coupon/coupon-blue.png',
						couponColor: '#88ABDA',
						couponTitleColor: '#333333'
					}, {
						type: 4,
						couponImg: '../../static/coupon/coupon-grey.png',
						couponColor: '#999999',
						couponTitleColor: '#999999'
					}
				]
			}
		},
		onLoad(options) {
			// this.id = options.id
			console.log(options);
			// 获取券模版详情
			this.getCouponInfo(options.id)
		},
		methods: {
			// 获取券模版详情
			getCouponInfo(id) {
				let that = this
				that.request({
					url: that.config.getCouponInfo + id,
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) {
						return uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					let data = res.data 
					let indexType = 0
					if((data.type == '01' && data.couponStatus == 1) || (data.type == '03' && data.couponStatus == 1)) {
						indexType = 0
					} else if(data.type == '02' && data.couponStatus == 1) {
						indexType = 1
						data.facevalue = Number(data.facevalue).toFixed(0)
					} else if(data.type == '04' && data.couponStatus == 1) {
						indexType = 2
						data.facevalue = data.facevalue / 10
					} else {
						indexType = 3
					}
					
					// 修改券面值格式
					if(data.type == '02') {
						// 计次券修改整数
						data.facevalue = Number(data.facevalue).toFixed(0)
					} else if(data.type == '04') {
						// 折扣券修改面值格式
						data.facevalue = data.facevalue / 10
					}
					
					// 处理日期格式
					// let availableDaysformat = ''
					// let availableDays = data.availableDays.split(",")
					// if(data.availableDayType == 1) { // 全部日期
					// 	availableDaysformat = data.availableDays
					// } else { // 指定日期
					// 	availableDays.forEach(item => {
					// 		if(item == '') return
					// 		item = item + '号'
					// 		if(availableDaysformat == '') {
					// 			availableDaysformat = item
					// 		} else {
					// 			availableDaysformat = availableDaysformat + ',' + item
					// 		}
					// 	})
					// 	let availableWeeks = data.availableWeeks.split(",")
					// 	availableWeeks.forEach(item => {
					// 		if(item == '') return
					// 		item = '周' + item
					// 		if(availableDaysformat == '') {
					// 			availableDaysformat = item
					// 		} else {
					// 			availableDaysformat = availableDaysformat + ',' + item
					// 		}
					// 	})
					// }
					// data.availableDaysformat = availableDaysformat
					
					that.coupons = data
					that.indexType = indexType
					
					// 触发二维码/条形码弹窗
					that.codePopup()
				})
			},
			// 触发二维码/条形码弹窗
			codePopup() {
				this.$refs.loading.open()
				// 二维码
				this.qrUrl = Qr.createQrCodeImg(this.coupons.couponNo)
				let that = this
				let codeWidth = 0
				// 条形码
				uni.getSystemInfo({
					success: function(res) {
						codeWidth = 670 * res.screenWidth / 710
						Tki.code128(wx.createCanvasContext('brcode'), that.coupons.couponNo, codeWidth, 100);
						// 蒙板
						setTimeout(function() {
							that.$refs.loading.close()
						}, 1000)
					}
				})
			},
			// 复制
			copyCode() {
				let that = this
				uni.setClipboardData({
				    data: that.coupons.couponNo,
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
	/* 券 start */
	.coupon {
		display: flex;
		border-radius: 10rpx;
		background-color: #FFFFFF;
		overflow: hidden;
		margin: 20rpx 20rpx 0;
	}
	
	.coupon-info-left {
		display: flex;
		height: 188rpx;
	}
	
	.coupon-info-img>image {
		width: 20rpx;
		height: 100%;
	}
	
	.coupon-info-num {
		min-width: 180rpx;
		height: 100%;
		padding: 0 10rpx;
		text-align: center;
		border-right: 2rpx dashed #999999;
	}
	
	.coupon-info-num>text:nth-child(1) {
		font-size: 50rpx;
		font-weight: 600;
		line-height: 180rpx;
	}
	
	.coupon-info-num>text:nth-child(2) {
		font-size: 14px;
		font-weight: 600;
		line-height: 180rpx;
	}
	
	.coupon-info-right {
		height: 148rpx;
		margin: 20rpx;
	}
	
	.coupon-info-title {
		font-size: 22rpx;
		font-weight: 500;
		line-height: 48rpx;
	}
	
	.coupon-item-term {
		width: 470rpx;
		margin: 10rpx 0;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		word-break: break-all;
	}
	
	/* 券 end */
	
	/* 码 start */
	.code {
		position: relative;
		margin: 20rpx 20rpx;
		padding-bottom: 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.bar-code {
		padding: 20rpx 0;
		margin: 0 20rpx 0 12rpx;
		border-bottom: 2rpx solid #EEEEEE;
	}
	
	.bar-code-code {
		height: 200rpx;
	}
	
	.bar_code {
		width: 670rpx;
		height: 200rpx;
	}
	
	.bar-code-text {
		font-size: 30rpx;
		text-align: center;
		color: #333333;
		line-height: 50rpx;
	}
	
	.bar-code-num {
		display: flex;
		justify-content: space-between;
	}
	
	.bar-code-num>view {
		flex: 0.333;
	}
	
	.bar-code-num>view:nth-child(2) {
		font-size: 30rpx;
		text-align: center;
		color: #333333;
		line-height: 50rpx;
	}
	
	.bar-code-num>view:nth-child(3) view {
		width: 70rpx;
		height: 34rpx;
		margin: 7rpx 0 7rpx 20rpx;
		border: 2rpx solid #CCCCCC;
		border-radius: 19rpx;
		text-align: center;
		font-size: 17rpx;
		color: #333333;
		line-height: 34rpx;
	}
	
	.qr-code>image {
		display: block;
		width: 300rpx;
		height: 300rpx;
		margin: 30rpx auto;
	}
	
	.userCodeMask {
		width: 750rpx;
		height: 60vh;
		background-color: #FFFFFF;
	}
	
	.code-mask {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, .6);
	}
	
	.code-mask>image {
		position: absolute;
		bottom: 200rpx;
		right: 150rpx;
		width: 140rpx;
		height: 131rpx;
	}
	
	/* 码 end */
	
	/* 规则 start */
	.rule {
		margin: 20rpx;
		padding: 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.rule-title {
		height: 60rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 60rpx;
		color: #333333;
	}
	
	.rule-info {
		display: flex;
		justify-content: space-between;
	}
	
	.rule-info-left {
		width: 120rpx;
		font-size: 26rpx;
		font-weight: 400;
		line-height: 60rpx;
		color: #999999;
	}
	
	.rule-info-right {
		max-width: 550rpx;
		margin: 10rpx 0;
		font-size: 25rpx;
		font-weight: 500;
		line-height: 40rpx;
		color: #333333;
	}
	
	/* 规则 end */

</style>
