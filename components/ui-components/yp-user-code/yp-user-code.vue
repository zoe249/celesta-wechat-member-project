<template>
	<view class="window">
		<view class="bar-code">
			<view class="bar-code-code">
				<canvas class="bar_code" canvas-id="brcode"></canvas>
			</view>
			<view class="bar-code-num">YP20201231001</view>
		</view>

		<view class="qr-code">
			<image :src="qrUrl"></image>
		</view>
	</view>
</template>

<script>
	import Qr from '@/utils/qr-code.js'
	import Tki from "@/utils/tki-barcode.js"
	export default {
		data() {
			return {
				qrUrl: ''
			}
		},
		props: {
			user: Object,
		},
		mounted() {
			// 获取二维码
			this.getQR()
			// 获取条形码
			this.getTki()
		},
		methods: {
			// 获取二维码
			getQR() {
				this.qrUrl = Qr.createQrCodeImg(this.user.cardNumber)
			},
			// 获取条形码
			getTki() {
				Tki.code128(wx.createCanvasContext('brcode'), this.user.cardNumber, 300, 100);
			}
		}
	}
</script>

<style scoped>
	.window {
		height: 60vh;
	}

	.bar-code {
		margin: 100rpx 20rpx 20rpx;
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
	
</style>
