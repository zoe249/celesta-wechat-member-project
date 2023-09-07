<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{ height: statusBarHeight + 'px' }">
			<view class="header-view">
				<view class="header-icon" @click="returnBut">
					<u-icon name="arrow-left" color="#ffffff" size="35"></u-icon>
				</view>
				<view class="header-title">我的钱包</view>
			</view>
		</view>
		
		<!-- 余额 -->
		<view class="balance">
			<view class="balance-num">
				<view>{{ balance }}</view>
				<view>总资产(元)</view>
			</view>
			<view class="balance-entrance">
				<view class="balance-entrance-icon" @click="goRecharge">
					<image :src="imgUrl + '/recharge-icon.png'" mode=""></image>
					<view>去充值</view>
				</view>
				<view class="balance-entrance-icon" @click="codePopup">
					<image :src="imgUrl + '/QRcode02-icon.png'" mode=""></image>
					<view>会员码支付</view>
				</view>
				<view class="balance-entrance-icon" @click="goMyCoupon">
					<image :src="imgUrl + '/coupons03-icon.png'" mode=""></image>
					<view>优惠券</view>
				</view>
			</view>
		</view>
		
		<!-- 入口 -->
		<view class="view-entrance">
			<view class="entrance-item" @click="goRechargeRecord">
				<view>交易记录</view>
				<view>
					<u-icon name="arrow-right" color="#686868" size="25"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 用户二维码/条形码 -->
		<u-popup v-model="isUserCode" mode="bottom" :closeable="true" :mask-close-able="true" @close="isUserCode = false, isUserCodes = true">
			<view class="userCode">
				<view class="popup">
					<view class="bar-code" v-if="isUserCode">
						<view class="bar-code-code">
							<canvas class="bar_code" canvas-id="brcode"></canvas>
						</view>
						<view class="bar-code-num">{{ memberInfo.cardNumber }}</view>
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
</template>

<script>
	import Qr from '@/utils/qr-code.js'
	import Tki from "@/utils/tki-barcode.js"
	export default {
		data() {
			return {
				isUserCode: false, // 是否显示会员二维码/条形码
				isUserCodes: true, // 是否显示会员二维码/条形码
				imgUrl: this.config.imgUrl,
				memberInfo: uni.getStorageSync('memberInfo'), // 会员信息
				statusBarHeight: 0, // 自定义标题栏高度
				qrUrl: '', // 会员二维码路径
				balance: '', // 余额
			}
		},
		onShow() {
			// 获取余额
			this.getBalance()
		},
		onLoad() {
			// 自动检测高度
			this.getHeight()
		},
		methods: {
			// 获取余额
			getBalance() {
				let that = this
				that.request({
					url: that.config.pointTypes,
					data: {
						memberId: that.memberInfo.id,
						type: '03'
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200) {
						data.forEach((item) => {
							if(item.type == '03') {
								that.balance = item.balance
							}
						})
					}
				})
			},
			// 触发二维码/条形码弹窗
			codePopup() {
				let that = this
				that.isUserCode = true
				that.$refs.loading.open()
				setTimeout(function() {
					// 获取二维码
					that.getQR()
					// 获取条形码
					that.getTki()
				}, 500)
			},
			// 获取二维码
			getQR() {
				this.qrUrl = Qr.createQrCodeImg(this.memberInfo.cardNumber)
			},
			// 获取条形码
			getTki() {
				let that = this
				let codeWidth = 0
				uni.getSystemInfo({
					success: function(res) {
						codeWidth = 670 * res.screenWidth / 750
						Tki.code128(wx.createCanvasContext('brcode'), that.memberInfo.cardNumber, codeWidth, 100);
						// 蒙板
						setTimeout(function() {
							that.isUserCodes = false
							that.$refs.loading.close()
						}, 1000)
					}
				})
			},
			// 自动检测高度
			getHeight() {
				let that = this
				uni.getSystemInfo({  
				    success: e => {
				        let StatusBar = e.statusBarHeight;  
				        let rect = wx.getMenuButtonBoundingClientRect();  
				        if (e.system.toLowerCase().indexOf('android') > -1) {  
				            // 安卓
				            let headerBar = rect.height + (rect.top - e.statusBarHeight) * 2;  
				            let customBar = headerBar + e.statusBarHeight;
				            that.statusBarHeight = customBar
							console.log('安卓');
				        } else {  
							// IOS、window 等
							let customBar = rect.bottom + (rect.top - e.statusBarHeight) * 2;  
							that.statusBarHeight = customBar
							console.log('IOS');
				        }
				    }  
				});
			},
			// 去充值
			goRecharge() {
				uni.navigateTo({
					url: './walletRecharge/walletRecharge'
				})
			},
			// 充值记录
			goRechargeRecord() {
				uni.navigateTo({
					url: './rechargeRecord/rechargeRecord'
				})
			},
			// 优惠券跳转
			goMyCoupon() {
				uni.navigateTo({
					url: '../myCoupon/myCoupon'
				})
			},
			// 返回按钮
			returnBut() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	/* 自定义头部 start */
	.header {
		position: fixed;
		top: 0;
		z-index: 20;
	}
	
	.header-view {
		display: flex;
		position: absolute;
		bottom: 10rpx;
	}
	
	.header-icon {
		padding: 8rpx 0 0 20rpx;
	}
	
	.header-title {
		width: 630rpx;
		margin-right: 60rpx;
		font-size: 34rpx;
		font-weight: 500;
		line-height: 50rpx;
		text-align: center;
		color: #FFFFFF;
	}
	
	/* 自定义头部 end */
	
	/* 余额 start */
	.balance {
		position: fixed;
		top: 0;
		width: 750rpx;
		height: 380rpx;
		background: linear-gradient(135deg, #00AFFF 0%, #008EFF 100%);
		opacity: 0.7;
	}
	
	.balance-num {
		position: absolute;
		bottom: 75rpx;
		width: 750rpx;
		height: 150rpx;
		text-align: center;
	}
	
	.balance-num>view:nth-child(1) {
		margin-top: 10rpx;
		font-size: 60rpx;
		font-weight: 600;
		color: #FFFFFF;
	}
	
	.balance-num>view:nth-child(2) {
		font-size: 28rpx;
		line-height: 30rpx;
		color: #EEEEEE;
	}
	
	.balance-entrance {
		position: absolute;
		bottom: -75rpx;
		display: flex;
		justify-content: center;
		width: 710rpx;
		height: 150rpx;
		margin: 0 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.balance-entrance-icon {
		width: 150rpx;
		height: 100rpx;
		margin: 25rpx 50rpx;
	}
	
	.balance-entrance-icon>image {
		display: block;
		width: 50rpx;
		height: 50rpx;
		margin: 10rpx auto;
	}
	
	.balance-entrance-icon>view {
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		line-height: 30rpx;
		color: #666666;
	}
	
	/* 余额 end */
	
	/* 跳转入口 start */
	.view-entrance {
		margin: 475rpx 20rpx 0;
	}
	
	.entrance-item {
		display: flex;
		justify-content: space-between;
		height: 86rpx;
		padding: 0 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 86rpx;
		color: #333333;
	}
	
	/* 跳转入口 end */
	
	/* 用户二维码/条形码 start */
	.userCode {
		position: relative;
		height: 60vh;
	}
	
	.popup {
		height: 60vh;
		z-index: 40;
	}
	
	.bar-code {
		padding: 100rpx 0 20rpx;
		margin: 0 20rpx;
		border-bottom: 2rpx solid #EEEEEE;
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
		height: 60vh;
		background-color: #FFFFFF;
		z-index: 50;
	}
	
	/* 用户二维码/条形码 end */

</style>
