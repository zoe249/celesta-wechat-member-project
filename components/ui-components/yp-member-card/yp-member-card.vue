<template>
	<view class="content">
		<view class="wrap">
			<swiper class="wrap-swiper" :current="parseInt(memberCard.memberCurrent.cardLevelCode) - 1" @change="cardSwitch">
				<swiper-item v-for="(item,index) in cardList" :key='index'>
					<!-- 会员卡背景 -->
					<view class="swiper-image">
						<!-- <image v-if="item.image!=''" :src="item.image" mode="widthFix"></image> -->
						<view class="bg-color" :style="{'background-color': item.coverColor ? item.coverColor : '#'}"></view>
					</view>
					<!-- 会员卡信息 -->
					<view class="swiper-content">
						<view class="sp-header">
							<view class="sp-header-logo">
								<image :src="cardLogo" mode="widthFix"></image>
								<view class="company-name">{{ cardName }}</view>
							</view>
							<view class="serial-number">{{ memberInfo.cardNumber }}</view>
						</view>
						<view class="sp-member">
							<!-- 当前会员等级 -->
							<view class="member-grade-current" v-if="memberCard.memberCurrent.cardLevelCode == item.code">
								<view class="grade-current" v-if="memberCard.memberCurrent.cardLevelEndTime != null">
									<view class="current-grade current-grade-tran">当前等级</view>
									<view class="grade-current-name">{{ item.name }}</view>
									<view class="current-grade">当前等级</view>
								</view>
								<view class="grade-current" v-else>
									<view class="current-grade current-grade-tran">当前等级</view>
									<view class="grade-current-name grade-current-name-01">{{ item.name }}</view>
									<view class="current-grade current-grade-01">当前等级</view>
								</view>
								<view class="grade-time" v-if="memberCard.memberCurrent.cardLevelEndTime != null">有效期至：{{ memberCard.memberCurrent.cardLevelEndTime }}</view>
							</view>
							<!-- 前后等级 -->
							<view class="member-grade" v-else>{{ item.name }}</view>
						</view>
						<view class="sp-header">
							<view class="growth-value" v-if="memberCard.memberCurrent.cardLevelCode == item.code" @click="growthValue"> <text>当前成长值：{{ memberCard.memberCardInfor.balance }}</text>{{ index < cardList.length - 1 ? ' / ' + cardList[index + 1].growth : '' }}</view>
							<view class="growth-value" v-else-if="parseInt(memberCard.memberCurrent.cardLevelCode) > parseInt(item.code)">会员等级已解锁</view>
							<view v-else></view>
							<view class="growth-value" v-if="index < cardList.length && parseInt(memberCard.memberCurrent.cardLevelCode) < parseInt(item.code)">成长值达到{{ cardList[index].growth }}可升级</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			cardList: Array, // 会员卡等级
			memberCard: Object // 会员等级信息
		},
		data() {
			return {
				memberInfo: uni.getStorageSync('memberInfo'),
				cardLogo: this.config.companyLogoBg,
				cardName: this.config.companyName,
			}
		},
		mounted() {
			
		},
		methods: {
			// 手动切换卡等级
			cardSwitch(event) {
				let current = event.detail.current
				this.$emit('change', current)
			},
			// 成长值
			growthValue() {
				this.$emit('growthValue', true)
			}
		},
	}
</script>

<style lang="scss" scoped>
	/* 轮播组件开始 */
	.wrap {
		width: 710rpx;
		// height: 310rpx;
		// overflow: hidden;
		// border-radius: 20rpx;
	}
	
	.wrap-swiper {
		height: 350rpx;
	}

	.swiper-image {
		text-align: center;

		// image {
		// 	width: 650rpx;
		// 	border-radius: 45rpx;
		// }

		.bg-color {
			width: 710rpx;
			height: 350rpx;
			margin: 0 auto;
			// overflow: hidden;
			border-radius: 20rpx;
		}
	}

	.swiper-content {
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		width: 670rpx;
		color: #FFFFFF;
	}

	.sp-header {
		display: flex;
		justify-content: space-between
	}

	.sp-header-logo {
		display: flex;

		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}

		.company-name {
			margin-left: 20rpx;
			font-size: 28rpx;
			line-height: 80rpx;
		}
	}
	
	.growth-value {
		font-size: 26rpx;
		color: #FFFFFF;
		line-height: 65rpx;
	}
	
	.growth-value>text {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: 600;
		line-height: 65rpx;
	}

	.serial-number {
		font-size: 26rpx;
		color: #FFFFFF;
		line-height: 80rpx;
	}
	
	.sp-member {
		height: 120rpx;
	}
	
	.member-grade-current {
		
		.grade-current {
			display: flex;
			justify-content: center;
		}
		
		.grade-current-name {
			font-size: 40rpx;
			font-weight: 600;
			text-align: center;
			color: #FFFFFF;
			line-height: 70rpx;
		}
		
		.grade-current-name-01 {
			font-size: 45rpx;
			line-height: 100rpx;
		}
		
		.current-grade {
			width: 90rpx;
			height: 30rpx;
			text-align: center;
			margin: 16rpx 10rpx;
			line-height: 30rpx;
			font-size: 18rpx;
			font-weight: normal;
			color: #FFFFFF;
			border: 1rpx solid #FFFFFF;
			border-radius: 50rpx;
		}
		
		.current-grade-01 {
			margin: 35rpx 10rpx;
		}
		
		.current-grade-tran {
			opacity: 0;
		}
		
		.grade-time {
			font-size: 24rpx;
			font-weight: 600;
			text-align: center;
			color: #FFFFFF;
			line-height: 50rpx;
		}
	}
	
	.member-grade {
		font-size: 45rpx;
		font-weight: 600;
		text-align: center;
		color: #FFFFFF;
		line-height: 100rpx;
	}

	
</style>
