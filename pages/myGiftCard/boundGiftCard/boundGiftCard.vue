<template>
	<view class="content">
		<view class="content-text">
			<view class="text-name">请输入礼品卡秘钥</view>
			<view class="text-contene">
				<u-input v-model="password" placeholder='卡秘钥不区分大小写' height="90" />
			</view>
		</view>
		<view class="bottom-button" @tap="$u.throttle(saveMassage, 1000)">绑定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password: '' // 卡秘钥
			}
		},
		onLoad() {
			
		},
		methods: {
			// 绑定礼品卡
			saveMassage(){
				let that = this
				if(that.password==''){
					uni.showToast({
						title: '卡秘钥不能为空',
						icon: 'none'
					})
					return
				}
				that.request({
					url: that.config.memberGiftCardMapping,
					method: 'POST',
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: {
						password: that.password
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200 && data.message == '请求成功') {
						that.password = ''
						uni.showToast({
							title: '绑卡成功',
							icon: 'success'
						})
						// 刷新上一页我的礼品卡页
						uni.setStorageSync('isRefresh', '1')
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			}
		},
	}
</script>

<style lang="less">
	.content-text {
		display: flex;
		height: 90rpx;
		margin-top: 50rpx;
		padding: 0 20rpx;
		background-color: #FFFFFF;
	}

	.text-name {
		width: 250rpx;
		height: 90rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 90rpx;
	}

	.text-contene {
		width: 460rpx;
	}

	.u-input__right-icon {
		margin-top: 20rpx;
	}

	.bottom-button {
		position: fixed;
		bottom: 0;
		margin: 50rpx 20rpx 100rpx;
		width: 710rpx;
		height: 90rpx;
		background-color: #ED6D46;
		border-radius: 90rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 90rpx;
	}

	.u-input__right-icon {
		margin-top: 28rpx;
	}
</style>
