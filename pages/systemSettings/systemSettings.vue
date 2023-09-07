<template>
	<view class="content">
		<view class="srtting-list" @click="mergeCard">
			<view class="">会员合并</view>
			<u-icon name="arrow-right" size="35" height="90"></u-icon>
		</view>
		<view class="logo">
			<image :src="companyLogoBg"></image>
		</view>
		<view class="bottom-button" @click="signOut">退出登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				companyLogoBg: this.config.companyLogoBg,
			}
		},
		methods: {
			// 退出登录
			signOut() {
				uni.showModal({
				    title: '提示',
				    content: '确定要退出登录吗？',
				    success: function (res) {
				        if (res.confirm) {
				            // 清除 Token 缓存手动退出状态
				            uni.removeStorageSync('token')
				            uni.removeStorageSync('infoRes')
				            uni.removeStorageSync('userInfo')
				            uni.removeStorageSync('phoneIv')
				            uni.removeStorageSync('memberInfo')
				            uni.setStorageSync('isManualExit', true)
				            // 退出登录 保住已注册状态
				            getApp().globalData.isLogin = 2
				            uni.reLaunch({
				            	url: '../home/index-unauthorized'
				            })
				        }
				    }
				});
			},
			// 会员合并
			mergeCard() {
				uni.navigateTo({
					url: '../mergeCard/mergeCard'
				})
			}
		}
	}
</script>

<style scoped>
	
	/* logo start */
	.logo {
		margin: calc(50vh - 150px) 225rpx;
	}
	
	.logo image {
		width: 300rpx;
		height: 300rpx;
		margin: 0 auto;
	}
	
	/* logo end */
	
	/* 退出登录 start */
	.bottom-button {
		position: fixed;
		bottom: 0;
		margin: 20rpx 20rpx 100rpx;
		width: 710rpx;
		height: 90rpx;
		background-color: #ED6D46;
		border-radius: 90rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 90rpx;
	}

	/* 退出登录 end */
	
	/* 设置列表 start */
	.srtting-list {
		display: flex;
		justify-content: space-between;
		margin: 20rpx 20rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		padding: 0 20rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
	}
	
	
	/* 设置列表 end */
	
</style>
