<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardInfo: {}, // 获取会员卡需要数据
				unionId: uni.getStorageSync('memberInfo').unionId,
				addCardInfo: {}, // 调用领取需要组件
			}
		},
		onShow() {
			
		},
		onLoad() {
			// 获取会员卡需要数据
			// 获取会员卡ID（cardId）
			this.getCardId()
		},
		methods: {
			// 获取会员卡ID（cardId）
			getCardId() {
				let that = this
				uni.request({
					url: that.config.protocol +that.config.host + that.config.getCardIdByStatus,
					method: 'GET',
					success: (res) => {
						if (res.statusCode === 200) { // 存在已领取
							that.cardInfo.cardId = res.data.detail
							// 获取公众号 openId
							console.log('获取会员卡Id',res)
							that.getOpenId()
						}
					}
				})
			},
			// 获取公众号 openId
			getOpenId() {
				let that = this
				uni.request({
					url: that.config.protocol +that.config.host + that.config.getOpenIdByUnionId,
					method: 'GET',
					data: {
						unionId: that.unionId,
						type: '02'
					},
					success: (res) => {
						if (res.statusCode === 200) { // 存在已领取
							that.cardInfo.openId = res.data.detail
							// 获取JS中addCard方法所有所需参数
							that.getAddCardInfo()
						}
					}
				})
			},
			// 获取JS中addCard方法所有所需参数
			getAddCardInfo() {
				let that = this
				uni.request({
					url: that.config.protocol +that.config.host + that.config.getJsAddCardAllParam,
					method: 'GET',
					data: {
						openId: that.cardInfo.openId,
						unionId: that.unionId
					},
					
					success: (res) => {
						if (res.statusCode === 200) { // 存在已领取
							let data = res.data.data
							that.addCardInfo = data.cardExt
							// 弹出领取会员卡
							that.getMemberCard()
						}
					}
				})
			},
			// 弹出领取会员卡
			getMemberCard() {
				let that = this
				wx.addCard({
					cardList: [{
						cardId: that.cardInfo.cardId,
						cardExt: that.addCardInfo
					}],
					success(res) {
						// 获取会员卡的 code
						that.getCode()
						uni.showToast({
							title: '领取成功',
							icon: 'success'
						})
					},
					fail(err) {
						uni.showToast({
							title: '领取失败',
							icon: 'none'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '../home/index'
							})
						}, 2000)
					}
				})
			},
			// 获取会员卡的 code
			getCode() {
				let that = this
				uni.request({
					url: that.config.protocol +that.config.host + that.config.getCodeByOpenIdAndCardId,
					method: 'GET',
					data: {
						cardId: that.cardInfo.cardId,
						openId: that.cardInfo.openId
					},
					success: (res) => {
						if (res.statusCode === 200) { // 存在已领取
							that.cardInfo.cardCode = res.data.data
							// 激活会员卡
							that.activationCard()
						}
					}
				})
			},
			// 激活会员卡
			activationCard() {
				let that = this
				uni.request({
					url: that.config.protocol +that.config.host + that.config.activationCard,
					method: 'POST',
					data: {
						code: that.cardInfo.cardCode,
						cardId: that.cardInfo.cardId,
						unionId: that.unionId
					},
					success: (res) => {
						if (res.statusCode != 200) return
						uni.showToast({
							title: '激活成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '../startUp/startUp'
							})
						}, 2000)
					}
				})
			},
		}
	}
</script>

<style>

</style>
