<template>
	<view class="content">
		<!-- 已授权用户信息 -->
		<view class="empower">
			<!-- 头像 -->
			<image :src="role.avatar" @click="personalData"></image>
			<!-- 会员姓名、手机号 -->
			<view class="role-info">
				<view class="role-name">
					<view class="icon" v-if="role.paidMember">
						<image src="../../../static/home/member-icon.png"></image>
					</view>
					<view class="name">{{ role.realName }}</view>
				</view>
				<view class="role-phone">{{ role.phone }}</view>
			</view>
			
			<view class="member-wrap">
				<view v-if="isLogin" class="to-member" @click="toMember">
					<text v-if="role.paidMember">续费付费会员</text>
					<text v-else>成为付费会员</text>
				</view>
				<view class="expire-time" v-if="role.paidMember">
					<text>{{ role.paidMemberEndTime || '2020-12-12' }}</text>
					<text>到期</text>
				</view>
			</view>
		</view>
		
		<!-- 会员码 -->
		<!-- 		<view class="integral-center">
			<view class="integral-center-icon" @click="codePopup">
				<u-icon :name="imgUrl + '/shoV8H.png'" color="#ffffff" size="50"></u-icon>
			</view>
		</view> -->
		
		<!-- 未授权用户信息 -->
		<!-- <view class="empower" v-else>
			<button class="login-btn" hover-class="none" @tap="onGotUserInfo">
				<image :src="companyLogo"></image>
				<view class="role-info">
					<view class="role-tips">点击头像获取会员信息</view>
				</view>
			</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				companyLogo: this.config.companyLogo,
				imgUrl: this.config.imgUrl,
				isLogin:uni.getStorageSync('token')
			}
		},
		props: {
			role: Object, 
		},
		methods: {
			// 点击获取用户信息
			onGotUserInfo(e) {
				let that = this
				// return 
				wx.getUserProfile({
					desc:'正在获取', //不写不弹提示框
					success: res => {
						let data = res
						let infoRes = {
							iv: data.iv,
							encryptedData: data.encryptedData
						}
						uni.setStorageSync('infoRes', infoRes)
						uni.setStorageSync('userInfo', res.userInfo)
					}
				})
			},
			// 跳转个人资料
			personalData() {
				this.$emit('change', true)
			},
			// 点击跳转到付费会员页面
			toMember(){
				uni.navigateTo({
					url:'/pages/buyMember/buyMember'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.content {
		display: flex;
		justify-content: space-between;
		height: 160rpx;
		padding-top: 20rpx;
	}
	
	.empower {
		display: flex;
	}
	
	.empower image {
		width: 120rpx;
		height: 120rpx;
		margin: 10rpx 40rpx 20rpx 20rpx;
		box-shadow: 2px 2px 8px #999999;
		border-radius: 50%;
	}
	
	.role-info {
		height: 100rpx;
		margin: 20rpx 0;
	}
	
	.role-name {
		display: flex;
		align-items: center;
		.icon{
			margin-right: 10rpx;
			image{
				padding: 0;
				margin: 0;
				height: 25rpx;
				width: 36rpx;
				box-shadow:none;
				border-radius: 0;
			}
		}
		.name{
			font-size: 36rpx;
			color: #fff;
			line-height: 50rpx;
			max-width: 280rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	
	.role-phone {
		font-size: 24rpx;
		color: #fff;
		line-height: 50rpx;
	}
	
	.role-tips {
		font-size: 32rpx;
		color: #fff;
		line-height: 100rpx;
	}
	.member-wrap{
		margin-top: 20rpx;
		margin-left: 20rpx;
		.to-member{
			width: 200rpx;
			height: 50rpx;
			background-image: linear-gradient(155deg, #f5E0A3 0%,  #DFC780 100%);
			border-radius: 25rpx;
			color: #93710E;
			font-size: 28rpx;
			text-align: center;
			line-height: 50rpx;
			
		}
		.expire-time{
			font-size: 24rpx;
			color: #fff;
			line-height: 50rpx;
			text-align: center;
		}
	}
</style>
