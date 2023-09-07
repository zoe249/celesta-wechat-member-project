<template>
	<view class="content">
		<!-- 头部 -->
		<u-navbar title="会员中心" :is-back="false" :background="background" title-color="#ffffff" title-size="35"></u-navbar>

		<!-- 下拉加载窗 -->
		<view class="loading-icon-text">
			<image class="loadingImg" src="../../static/home/cloue.png"></image>
		</view>

		<view class="header">
			<!-- 会员角色信息 -->
			<view class="role-info">
				<yp-role-info :role="memberInfo" @change="personalData" @codePopup="codePopup"></yp-role-info>
			</view>
		</view>

		<!-- 会员卡 -->
		<view class="member">
			<yp-member-card :cardList="cardGradeList" :memberCard="memberCards" @change="cardSwitch" @growthValue="growthValue"></yp-member-card>
		</view>

		<!-- 隔离层 -->
		<!-- <view style="height: 190rpx;"></view> -->

		<!-- 积分、余额、礼品卡、优惠券 -->
		<view class="integral">
			<!-- 左 -->
			<view class="left">
				<view class="integral-item" @click="goIntegral">
					<view class="integral-top">{{ integral.integral }}</view>
					<view class="integral-botton">积分</view>
				</view>
				<view class="integral-item" @click="goMyWallet">
					<view class="integral-top">¥ {{ integral.balance }}</view>
					<view class="integral-botton">余额</view>
				</view>
			</view>
			<!-- 显示会员码 -->
			<view class="center">
				<view class="integral-center-icon" @click="codePopup">
					<u-icon :name="imgUrl + '/shoV8H.png'" color="#ffffff" size="50"></u-icon>
				</view>
			</view>
			<!-- 右 -->
			<view class="right">
				<view class="integral-item" @click="goGiftCard">
					<view class="integral-top">{{ integral.giftCard }}</view>
					<view class="integral-botton">礼品卡</view>
				</view>
				<view class="integral-item" @click="goMyCoupon">
					<view class="integral-top">{{ integral.coupon }}</view>
					<view class="integral-botton">优惠券</view>
				</view>
			</view>
		</view>

		<!-- 会员权益 -->
		<view class="service" v-if="services.length != 0">
			<yp-rights-interests :services="services" :serviceStyle="serviceStyle"></yp-rights-interests>
		</view>

		<!-- 广告banner -->
		<view class="swiper-box" v-if="swiperList.length != 0">
			<u-swiper class="swiper-image" :list="swiperList" height="350" mode="round" indicator-pos="bottomLeft" @click="bannerJump"></u-swiper>
		</view>

		<!-- 跳转入口 -->
		<view class="setup-tool" v-if="toolServices.length != 0">
			<yp-tool-services :services="toolServices" :serviceStyle="toolStyle" @change="goJump"></yp-tool-services>
		</view>

		<!-- 弹出层 -->
		<!-- 广告 -->
		<u-mask :show="isAdvertisement" :mask-click-able="false">
			<view class="couponPop">
				<view class="couponPopView">
					<image @click="goGoodsPage(popupList[0])" :src="popupList[0].pictureUrl" mode="widthFix"></image>
				</view>
				<view class="dvertisement-close">
					<u-icon name="close-circle" color="#c2c2c2" size="60" @click="isAdvertisement = false"></u-icon>
				</view>
			</view>
		</u-mask>

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

		<!-- 版权 -->
		<yp-copyright :edition="edition"></yp-copyright>

		<!-- 无网络提示 -->
		<u-no-network></u-no-network>

	</view>
</template>

<script>
	import ypLoading from '@/components/yp-loading/yp-loading.vue'
	import ypRoleInfo from '@/components/ui-components/yp-role-info/yp-role-info.vue'
	import ypMemberCard from '@/components/ui-components/yp-member-card/yp-member-card.vue'
	import ypRightsInterests from '@/components/ui-components/yp-rights-interests/yp-rights-interests.vue'
	import ypToolServices from '@/components/ui-components/yp-tool-services/yp-tool-services.vue'
	import ypCopyright from '@/components/ui-components/yp-copyright/yp-copyright.vue'
	import Qr from '@/utils/qr-code.js'
	import Tki from "@/utils/tki-barcode.js"
	export default {
		components: {
			ypLoading,
			ypRoleInfo,
			ypMemberCard,
			ypRightsInterests,
			ypToolServices,
			ypCopyright,
		},
		data() {
			return {
				isUserCode: false, // 是否显示会员二维码/条形码
				isUserCodes: true, // 是否显示会员二维码/条形码
				isAdvertisement: false, // 是否显示弹出层广告
				background: {
					backgroundImage: 'linear-gradient(to right, #EBAE93, #E6907A)'
				},
				memberInfo: {}, // 会员信息
				qrUrl: '', // 会员二维码路径
				cardGradeList: [], // 会员卡等级列表
				memberCards: {}, // 用户会员信息
				integral: { // 积分信息
					integral: '0',
					balance: '0.00',
					giftCard: '0',
					coupon: '0'
				},
				services: [], // 权益列表
				servicesList: [], // 等级支持权益列表
				serviceStyle: {}, // 权益样式
				swiperList: [], // 广告banner
				popupList: [], // 弹出层广告
				toolServices: [], // 设置列表
				toolStyle: {}, // 跳转入口样式
				edition: '', // 版本
				
				imgUrl: this.config.imgUrl,
			}
		},
		onLoad() {
			// 获取广告
			this.getSlideshows()
			this.getPopupAdvertisement()
			// 获取会员权益
			this.getServicesStyle()
			// 获取跳转设置
			this.getToolStyle()
		},
		onShow() {
			// 查询会员积分/礼品卡
			this.pointTypes()
			// 获取数据字典 (会员卡)
			this.cardLevelDataDics()
			// 更新本地缓存中的会员信息
			this.memberUser()
		},
		/* 下拉刷新停止 */
		onPullDownRefresh() {
			// 重置
			this.cardGradeList = [] // 会员卡等级列表
			this.services = [] // 权益列表
			this.serviceStyle = {} // 权益样式
			this.swiperList = [] // 广告banner
			this.popupList = [] // 弹出层广告
			this.toolServices = [] // 设置列表
			this.toolStyle = {} // 跳转入口样式
			this.integral = { // 积分信息
				integral: '0',
				balance: '0.00',
				giftCard: '0',
				coupon: '0'
			}
			this.memberCards = {}, // 用户会员信息

			// 获取广告
			this.getSlideshows()
			// 获取会员权益
			this.getServicesStyle()
			// 获取跳转设置
			this.getToolStyle()
			// 获取数据字典
			this.cardLevelDataDics()
			// 查询会员积分/礼品卡
			this.pointTypes()

			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			// 获取用户会员信息
			memberUser() {
			  let that = this;
			  that.$refs.loading.open();
			  that
			    .request({
			      url: that.config.memberUser,
			    })
			    .then((res) => {
			      that.$refs.loading.close();
			      if (res.statusCode != 200) return;
			      // 缓存用户信息
			      // console.log("获取用户的会员信息", res.data);
			      uni.setStorageSync("memberInfo", res.data);
						this.memberInfo = res.data
			    });
			},
			// 会员权益
			getServicesStyle() {
				let that = this
				// 获取会员权益样式
				that.request({
					url: that.config.pictureNavigations,
					data: {
						status: true,
						site: '01'
					}
				}).then(res => {
				
					if (res.statusCode != 200) return
					 console.log('--------------',res.data)
					let data = res.data
					that.serviceStyle = data[0]
					console.log('获取会员权益')
					// 获取会员权益列表
					this.getPictureList(that.memberInfo.cardLevelCode)
				})
			},
			// 获取会员权益列表
			getPictureList(cardLevelCode) {
				let that = this
				that.request({
					url: that.config.pictureList,
					data: {
						cardlevel: cardLevelCode, // 01  02  03
						site: '01'
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					that.services = data
				})
			},
			// 成长值
			growthValue() {
				uni.navigateTo({
					url: '../growthValue/growthValue'
				})
			},
			// 跳转设置
			getToolStyle() {
				let that = this
				// 获取跳转设样式
				that.request({
					url: that.config.pictureNavigations,
					data: {
						status: true,
						site: '02'
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					that.toolStyle = data[0]
				})
				// 获取跳转列表
				that.request({
					url: that.config.pictureList,
					data: {
						cardlevel: '01', // 01  02  03
						site: '02'
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					that.toolServices = data
				})
			},
			// 获取广告 首页轮播
			getSlideshows() {
				let that = this
				that.request({
					url: that.config.slideshows,
					data: {
						displayed: true,
						site: '2'
					}
				}).then(res => {
					let data = res.data.data
					if (res.statusCode == 200 && data.length != 0) {
						for (let i in data) {
							data[i].image = data[i].pictureUrl
						}
						that.swiperList = data
					}
				})
			},
			// 弹出层 广告
			getPopupAdvertisement() {
				let that = this
				that.request({
					url: that.config.slideshows,
					data: {
						displayed: true,
						site: '1'
					}
				}).then(res => {
					let data = res.data.data
					if (res.statusCode == 200 && data.length != 0) {
						that.popupList = data
						if (data[0].pictureUrl) {
							that.isAdvertisement = true
						}
					}
				})
			},
			// 查询会员积分/礼品卡
			pointTypes() {
				let that = this
				// 积分
				that.request({
					url: that.config.pointTypes,
					data: {
						memberId: that.memberInfo.id,
						type: '01'
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200) {
						data.forEach((item) => {
							if(item.type == '01') {
								that.integral.integral = item.balance
							}
						})
					}
				})
				// 余额
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
								that.integral.balance = item.balance
							}
						})
					}
				})
				// 礼品卡
				that.request({
					url: that.config.myGiftCards,
					data: {
						valid: true
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200) {
						that.integral.giftCard = data.total
					}
				})
				// 优惠券
				that.request({
					url: that.config.couponNum,
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200) {
						that.integral.coupon = data
					}
				})
			},
			// 获取会员卡等级列表数据字典
			cardLevelDataDics() {
				let that = this
				that.request({
					url: that.config.memberLevels,
					data: {
						status: true,
						pageSize: '200',
						pageIndex: 1
					}
				}).then(res => {
					let data = res.data.data
					if (res.statusCode == 200 && data.length >= 1) {
						// 会员等级排序
						// let cardGradeList = []
						// cardGradeList[0] = data[0]
						// data.forEach((value, index) => {
						// 	if (!data[index + 1]) return
						// 	if (cardGradeList[index].code < data[index + 1].code) {
						// 		cardGradeList.push(data[index + 1])
						// 	} else {
						// 		cardGradeList.splice(index, 0, data[index + 1])
						// 	}
						// })
						that.cardGradeList = data
						// 会员等级显示
						memberGrade()
					}
				})
				function memberGrade() {
					that.request({
						url: that.config.memberCurrent
					}).then(res => {
						if (res.statusCode != 200) return
						let data = res.data
						that.getGrowthValue(data)
					})
				}
			},
			// 获取成长值明细
			getGrowthValue(memberCurrent) {
				let that = this
				that.request({
					url: that.config.pointTypes,
					data: {
						memberId: that.memberInfo.id,
						type: '02'
					}
				}).then(res => {
					let data = res.data
					data.forEach((item) => {
						if(item.type == '02') {
							that.memberCards = {
								memberCardInfor: item,
								memberCurrent: memberCurrent
							}
						}
					})
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
			// 手动切换会员卡
			cardSwitch(index) {
				let cardLevel = index + 1
				if (index < 10) {
					cardLevel = '0' + cardLevel
				}
				// 获取会员权益列表
				this.getPictureList(cardLevel)
			},
			// 广告banner 跳转
			bannerJump(index) {
				let that = this
				let banner = that.swiperList[index]
				if (banner.publicityType == 1) { // 商品类
					
				} else if (banner.publicityType == 2) { // 活动类
					
				} else if (banner.publicityType == 3) { // 其他
					
				}
			},
			// 弹出层广告 跳转
			goGoodsPage(value) {
				if (value.publicityType == 1) { // 商品类
					
				} else if (value.publicityType == 2) { // 活动类
					
				} else if (value.publicityType == 3) { // 其他
					
				}
			},
			// 跳转入口
			goJump(value) {
				/**
				 * 跳转入口
				 * 根据跳转类型区分跳转方式：页面、H5、小程序
				 * 
				 * */
				
				let that = this
				// 策略类
				let refreshStrategy = {
					// O2O 跳转小程序
					'O2O小程序': function(grade, pageUrl) {
						uni.navigateToMiniProgram({
							appId: 'wxb10fb3edeebbf938', // 需要跳转到指定的小程序appid
							path: 'pages/startUp/startUp' // 打开的页面
						})
					},
					// 公众号
					'成为团长': function(grade, pageUrl) {
						uni.navigateTo({
							url: '../embedH5/copyright?embedSrc=' + pageUrl + '&title=' + grade
						})
					},
					// 系统设置
					'设置': function(grade, pageUrl) {
						uni.navigateTo({
							url: '../systemSettings/systemSettings'
						})
					},
					// 秒杀商品
					'秒杀商品': function(grade, pageUrl) {
						uni.navigateTo({
							url: '../seckill/seckill'
						})
					},
					// 扫码核销
					'扫码核销': function(grade, pageUrl) {
						uni.navigateTo({
							url: '../writtenOffCoupons/writtenOffCoupons'
						})
					},
					// 每日签到
					'每日签到': function(grade, pageUrl) {
						// 校验每日签到是否开启
						that.isSignInOpen()
					},
					// 幸运抽奖
					'幸运抽奖': function(grade, pageUrl) {
						// 校验幸运抽奖是否开启
						that.isLuckDrawOpen()
					},
					// 我的订单
					'我的订单': function(grade, pageUrl) {
						uni.navigateTo({
							url: '../myOrders/myOrders'
						})
					},
				}
				// 环境类
				let refreshEnvironment = function(grade) {
					return refreshStrategy[grade](grade, value.pageUrl)
				}
				refreshEnvironment(value.description)
			},
			// 校验每日签到是否开启
			isSignInOpen() {
				let that = this
				uni.showLoading({
					mask: true
				})
				that.request({
					url: that.config.getSignInDetail,
				}).then(res => {
					console.log(res);
					uni.hideLoading()
					if (res.statusCode != 200) return
					let data = res.data.data
					if( data != null && data.status ) {
						uni.navigateTo({
							url: '../luckDraw/signIn'
						})
					} else {
						uni.navigateTo({
							url: '../luckDraw/notDtarted?type=1'
						})
					}
				})
			},
			// 校验幸运抽奖是否开启
			isLuckDrawOpen() {
				let that = this
				uni.showLoading({
					mask: true
				})
				that.request({
					url: that.config.getOpenActivity,
				}).then(res => {
					console.log(res);
					uni.hideLoading()
					if (res.statusCode != 200) return
					let data = res.data.data
					let luckDraw = JSON.stringify(data)
					if( data.drawStyle && data.drawStyle == 1 ) {
						uni.navigateTo({
							url: '../luckDraw/luckDraw'
						})
					} else if( data.drawStyle && data.drawStyle == 2 ) {
						uni.navigateTo({
							url: '../luckDraw/turntable'
						})
					} else {
						uni.navigateTo({
							url: '../luckDraw/notDtarted?type=2'
						})
					}
				})
			},
			// 点击头像跳转个人设置
			personalData() {
				uni.navigateTo({
					url: '../personalData/personalData'
				})
			},
			// 积分跳转
			goIntegral() {
				uni.navigateTo({
					url: '../membershipPoints/membershipPoints?memberId=' + this.memberInfo.id
				})
			},
			// 我的钱包
			goMyWallet() {
				uni.navigateTo({
					url: '../myWallet/myWallet'
				})
			},
			// 礼品卡跳转
			goGiftCard() {
				uni.navigateTo({
					url: '../giftCard/giftCard'
				})
			},
			// 优惠券跳转
			goMyCoupon() {
				uni.navigateTo({
					url: '../myCoupon/myCoupon'
				})
			},
			// 修改时间戳
			timeDay(timestamp) {
				const dt = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
				const y = dt.getFullYear()
				const m = (dt.getMonth() + 1 + '').padStart(2, '0')
				const d = (dt.getDate() + '').padStart(2, '0')
				const hh = (dt.getHours() + '').padStart(2, '0')
				const mm = (dt.getMinutes() + '').padStart(2, '0')
				const ss = (dt.getSeconds() + '').padStart(2, '0')
				// return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
				return y + "-" + m + "-" + d
			},
		}
	}
</script>

<style scoped lang="scss">
	/* 标题  */
	.header {
		/* height: 450rpx; */
		background: linear-gradient(to right, #EBAE93, #E6907A);
	}

	/* 下拉加载 start */
	.loading-icon-text {
		display: flex;
		justify-content: center;
		height: 90rpx;
		margin-top: -90rpx;
	}

	.loading-icon-text image {
		width: 60rpx;
		height: 60rpx;
		margin: 15rpx 0;
	}

	@keyframes loadingImg {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.loadingImg {
		animation: loadingImg .8s linear infinite;
	}

	/* 下拉加载 end */

	/* 会员卡 start */
	.member {
		/* height: 350rpx; */
		/* margin: -270rpx 20rpx; */
		/* width: 710rpx; */
		padding: 30rpx 20rpx 0;
		/* border-radius: 20rpx; */
		background: linear-gradient(to right, #EBAE93, #E6907A);
	}

	/* 会员卡 end */

	/* 积分 start */
	.integral {
		display: flex;
		justify-content: space-between;
		position: relative;
		height: 110rpx;
		margin-top: -60rpx;
		z-index: 30;
		width: 100vw;
		&::after{
			content: "";
			position: absolute;
			z-index: -1;
			height: calc(110rpx - 40rpx);
			background-color: #FFFFFF;
			width: 100%;
			top: 40rpx;
		}
		.left{
			display: flex;
			width: calc((100% - 80rpx) / 2);
			border-radius: 0 40rpx 0 0;
			background-color: #FFFFFF;
		}
		.center{
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background-color: #ED6D46;
			display: flex;
			justify-content: center;
			align-items: center;
			.integral-center-icon{
				transform: scale(0.65);
			}
		}
		.right{
			display: flex;
			width: calc((100% - 80rpx) / 2);
			border-radius: 40rpx 0 0 0;
			background-color: #FFFFFF;
		}
	}

	.integral-item {
		flex: 1;
		height: 110rpx;
		margin: 20rpx 0;
	}

	.integral-top {
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
		line-height: 45rpx;
		max-width: 180rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #333333;
	}

	.integral-botton {
		font-size: 24rpx;
		text-align: center;
		line-height: 45rpx;
		color: #999999;
	}

	/* 积分 end */


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


	/* 会员权益 start */
	.service {}

	/* 会员权益 end */


	/* 广告轮播 start */
	.swiper-box {
		margin: 20rpx 20rpx 0;
	}

	.swiper-image {
		width: 710rpx;
	}

	/* 广告轮播 end */


	/* 弹出式广告 start */
	.couponPop {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.couponPop .couponPopView {
		width: 500rpx;
		margin: 0 auto;
	}

	.couponPopView>image {
		width: 500rpx;
	}

	.dvertisement-close {
		height: 80rpx;
		margin-top: 50rpx;
		text-align: center;
		line-height: 80rpx;
	}

	/* 弹出式广告 end */


	/* 跳转入口 start */
	.setup-tool {
		margin-top: 20rpx;
		/* padding-top: 30rpx; */
		background-color: #FFFFFF;
	}

	/* 跳转入口 end */
</style>
