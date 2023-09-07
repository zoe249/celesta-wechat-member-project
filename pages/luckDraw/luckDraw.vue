<template>
	<view class="content" :style="{ backgroundImage: 'url(' + imgUrl + '/luckDraw-bg.png)' }">
		<!-- 自定义头部 -->
		<view class="header" :style="{ height: statusBarHeight + 'px' }">
			<view class="header-view">
				<view class="header-icon" @click="returnBut">
					<u-icon name="arrow-left" color="#ffffff" size="35"></u-icon>
				</view>
				<view class="header-title">幸运抽奖</view>
			</view>
		</view>
		
		<scroll-view :scroll-y="true" style="height: 100vh;">
			
			<!-- 中奖名单 -->
			<view class="name-list" @click="goPrizeRecord">
				<image :src="imgUrl + '/record-name-list.png'" mode=""></image>
			</view>
			
			<!-- 活动标题 -->
			<view class="activity-title">
				<image :src="imgUrl + '/activity-element.png'" mode=""></image>
				<view class="activity-text">{{ luckDraws.name }}</view>
				<view class="activity-title-time">
					<image :src="imgUrl + '/activityTime-bg.png'" mode=""></image>
					<view class="activity-time">{{ luckDraws.beginTimeFormat[0] }} — {{ luckDraws.endTimeFormat[0] }}</view>
				</view>
			</view>
			
			<!-- 抽奖面板 -->
			<view class="lottery-draw">
				<view class="lottery-draw-chance">
					<text>您有</text>
					<text class="lottery-draw-chance-num">{{ numberOfLuckDraw }}</text>
					<text>次抽奖机会</text>
					<text v-if="luckDraws.drawType == 2">{{ ' ' + luckDraws.usePoint }}积分一次</text>
				</view>
				<image :src="imgUrl + '/activity-panel.png'" mode=""></image>
				<view class="lucky-grid">
					<yp-lucky-grid :gridInfo="gridInfo" :winPrizes="winPrizes" :luckDraws="luckDraws" @requestResult="requestResult"  @getResult="getResult"></yp-lucky-grid>
				</view>
			</view>
			
			<!-- 活动说明 -->
			<view class="activity-explain" v-if="luckDraws.ruleDescription.length >= 1">
				<image :src="imgUrl + '/activity-explain.png'" mode=""></image>
				<view class="activity-explain-text">
					<view class="activity-explain-title">活动说明</view>
					<view class="activity-explain-info">
						<view class="">{{ luckDraws.ruleDescription }}</view>
					</view>
				</view>
			</view>
			
			<!-- 中奖名单 -->
			<view class="winning-list" @click="rollNameList">
				<image :src="imgUrl + '/winning-list.png'" mode=""></image>
				<view class="winning-list-text">
					<view class="winning-title">中奖名单</view>
					<view class="winning-list-info">
						<view class="winning-list-roll" :style="{ 'top': rollTop + 'rpx' }">
							<view class="winning-list-item" v-for="(item, index) in showPrizeaNameList">
								<view>{{ item.drawTimeFormat[0] }}</view>
								<view>{{ item.phoneFormat }}</view>
								<view>{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 隔离层 -->
			<view style="height: 150rpx;"></view>
			
		</scroll-view>
		
	</view>
</template>

<script>
	import ypLuckyGrid from '@/components/ui-components/yp-luck-draw/yp-lucky-grid.vue'
	export default {
		components: {
			ypLuckyGrid,
		},
		data() {
			return {
				imgUrl: this.config.imgUrl,
				isIphoneType: true, // 设备类型 true:ios，false:安卓
				statusBarHeight: 0, // 自定义标题栏高度
				numberOfLuckDraw: 0, // 抽奖次数
				pageIndex: 1, // 中奖名单请求页数
				total: 1, // 中奖名单条数
				rollTop: 0, // 滚动 top
				rollInterval: '', // 中奖名单定时器
				luckDraws: {}, // 抽奖活动数据
				gridInfo: [], // 奖品
				drawGridInfo: [], // 抽中奖品
				prizeaNameList: [], // 获奖名单
				showPrizeaNameList: [], // 显示的获奖名单
				winPrizes: 9999, // 获得奖品 0-7
			}
		},
		onLoad(option) {
			// 自动检测高度
			this.getHeight()
			// 获取今天抽奖次数
			this.getNumberOfLuckDraw()
			// 拉取抽奖数据
			this.getLuckDrawInfo()
		},
		onUnload() {
			clearInterval(this.rollInterval)
		},
		methods: {
			// 拉取抽奖数据
			getLuckDrawInfo() {
				uni.showLoading({
					mask: true
				})
				this.request({
					url: this.config.getOpenActivity,
				}).then(res => {
					console.log(res);
					uni.hideLoading()
					if (res.statusCode != 200) return
					let luckDraw = res.data.data
					let gridInfo = []
					luckDraw.luckyDrawPrizeList.forEach(item => {
						gridInfo.push({
							logo: item.url,
							text: item.name
						})
					})
					luckDraw.beginTimeFormat = luckDraw.beginTime.split(' ')
					luckDraw.endTimeFormat = luckDraw.endTime.split(' ')
					this.luckDraws = luckDraw
					// this.gridInfo = gridInfo
					let gridList = []
					gridList[0] = gridInfo[0]
					gridList[1] = gridInfo[1]
					gridList[2] = gridInfo[2]
					gridList[3] = gridInfo[7]
					gridList[4] = {}
					gridList[5] = gridInfo[3]
					gridList[6] = gridInfo[6]
					gridList[7] = gridInfo[5]
					gridList[8] = gridInfo[4]
					this.gridInfo = gridList
					// 获取中奖名单
					this.getDrawRecord(false)
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
							if(e.model != 'windows') { // window 下
								that.isIphoneType = false
								console.log('window');
							} else { // 安卓下
								that.isIphoneType = true
								console.log('安卓');
							}
				        } else {  
							// IOS、window 等
							let customBar = rect.bottom + (rect.top - e.statusBarHeight) * 2;  
							that.statusBarHeight = customBar
							that.isIphoneType = true
							console.log('IOS');
				        }
				    }  
				});
			},
			// 获取今天抽奖次数
			getNumberOfLuckDraw() {
				let that = this
				that.request({
					url: that.config.getNumberOfLuckDraw,
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data.data
					that.numberOfLuckDraw = data
				})
			},
			// 获取中奖名单
			getDrawRecord(isReset) {
				let that = this
				that.request({
					url: that.config.getDrawRecord,
					data: {
						pageIndex: that.pageIndex,
						pageSize: 30,
						number: that.luckDraws.number,
						exclude: 1
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data.data
					data.forEach(item => {
						item.drawTimeFormat = item.drawTime.split(' ')
						item.phoneFormat = item.phone.slice(0,3) + '****' + item.phone.slice(-4)
					})
					if(isReset) {
						that.showPrizeaNameList = that.prizeaNameList = []
					}
					that.showPrizeaNameList = that.prizeaNameList = [...that.prizeaNameList, ...data]
					that.total = res.data.total
					// 中奖名单滚动
					that.rollNameList()
				})
			},
			// 中奖名单滚动
			rollNameList() {
				if(this.prizeaNameList.length <= 5) return
				this.rollInterval = setInterval(() => {
					this.rollTop--
					// 请求下一页
					if(this.prizeaNameList.length * 60 <= Math.abs(this.rollTop - 400) && this.prizeaNameList.length < this.total) {
						this.pageIndex++
						clearInterval(this.rollInterval)
						this.getDrawRecord(false)
						return
					}
					// 显示完成所有数据，重复渲染
					if(this.showPrizeaNameList.length * 60 < Math.abs(this.rollTop - 400) && this.prizeaNameList.length >= this.total) {
						this.showPrizeaNameList = [...this.showPrizeaNameList, ...this.prizeaNameList]
					}
				}, 20)
			},
			// 获取结果
			requestResult() {
				let that = this
				let companyCode = that.config.companyCode
				that.request({
					url: that.config.getLuckyDraw + that.luckDraws.id + '/luckyDraw',
					method: 'POST',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						channelsCode: companyCode.channelCode,
						terminalsCode: companyCode.terminalCode,
						organizationCode: companyCode.organizationCode,
					}
				}).then(res => {
					if (res.statusCode == 200) {
						that.numberOfLuckDraw--
						let data = res.data.data
						if(!that.isIphoneType) { // 安卓
							that.winPrizes = data.location
						} else { // ios
							that.winPrizes = data.location - 1
						}
						that.drawGridInfo = data
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			// 抽奖完成
			getResult(event) {
				this.winPrizes = 9999
				console.log('接口返回:', this.drawGridInfo.name);
				console.log('抽到:', event.text);
				// 获取中奖名单
				this.pageIndex = 1
				this.getDrawRecord(true)
				// uni.showModal({
				//     // content: '恭喜抽到：' + event.text,
				//     content: '恭喜抽到：' + this.drawGridInfo.name,
				// 	showCancel: false,
				// 	confirmText: '知道了',
				//     success: function (res) {}
				// });
			},
			// 去中奖记录
			goPrizeRecord() {
				uni.navigateTo({
					url: './record'
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
	.content {
		position: fixed;
		width: 100vw;
		height: 100vh;
		background-size: cover;
		background-repeat: no-repeat;
		background-position-x: center;
		background-position-y: center;
	}
	
	/* 自定义头部 start */
	.header {
		position: fixed;
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
	
	.luck-draw-bg {
		position: fixed;
	    width: 100vw;
	    height: 100vh;
	}
	
	.luck-draw-bg>image {
	    width: 100%;
	    height: 100%;
	}
	
	.name-list {
		position: fixed;
		top: 200rpx;
		right: 0;
		width: 56rpx;
		height: 248rpx;
		z-index: 10;
	}
	
	.name-list>image {
		width: 100%;
		height: 100%;
	}
	
	/* 活动标题 start */
	.activity-title {
		position: relative;
		display: flex;
		width: 710rpx;
		height: 268rpx;
		margin: 150rpx 20rpx 0;
	}
	
	.activity-title>image {
		width: 318rpx;
		height: 268rpx;
	}
	
	.activity-text {
		position: absolute;
		bottom: 80rpx;
		width: 100%;
		text-align: center;
		font-size: 75rpx;
		color: #FFFFFF;
		line-height: 100rpx;
		text-shadow: 0rpx 2px 0rpx #FF2562;
	}
	
	.activity-title-time {
		position: absolute;
		left: 0;
		bottom: 10rpx;
		width: 554rpx;
		height: 74rpx;
		margin: 0 78rpx;
	}
	
	.activity-title-time>image {
		width: 100%;
		height: 100%;
	}
	
	.activity-title-time>view {
		position: absolute;
		left: 0;
		bottom: -10rpx;
		width: 554rpx;
		height: 74rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: 600;
		color: #FF859D;
		line-height: 40rpx;
		letter-spacing: 1px;
	}
	
	/* 活动标题 end */
	
	/* 活动说明 start */
	.activity-explain {
		position: relative;
		width: 682rpx;
		height: 516rpx;
		margin: 70rpx auto 0;
	}
	
	.activity-explain>image {
		width: 100%;
		height: 100%;
	}
	
	.activity-explain-text {
		position: absolute;
		top: 0rpx;
		width: 600rpx;
		margin: 10rpx 40rpx;
	}
	
	.activity-explain-title {
		width: 100%;
		height: 68rpx;
		text-align: center;
		font-size: 45rpx;
		font-weight: 600;
		color: #3BB9D3;
		line-height: 68rpx;
	}
	
	.activity-explain-info {
		margin-top: 90rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 40rpx;
	}
	
	/* 活动说明 end */
	
	/* 活动面板 start */
	.lottery-draw {
		position: relative;
		width: 648rpx;
		height: 650rpx;
		margin: 70rpx auto 0;
	}
	
	.lottery-draw>image {
		width: 648rpx;
		height: 650rpx;
		margin: 0 auto;
	}
	
	.lottery-draw-chance {
		position: absolute;
		width: 648rpx;
		height: 70rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 70rpx;
		z-index: 1;
	}
	
	.lottery-draw-chance-num {
		margin: 0 10rpx;
		font-size: 32rpx;
	}
	
	.lucky-grid {
		position: absolute;
		top: 85rpx;
		left: 55rpx;
		width: 540rpx;
		height: 540rpx;
	}
	
	/* 活动面板 end */
	
	/* 中奖名单 start */
	.winning-list {
		position: relative;
		width: 680rpx;
		height: 480rpx;
		margin: 70rpx auto 0;
	}
	
	.winning-list>image {
		width: 100%;
		height: 100%;
	}
	
	.winning-list-text {
		position: absolute;
		top: 20rpx;
		width: 680rpx;
	}
	
	.winning-title {
		height: 100rpx;
		text-align: center;
		font-size: 45rpx;
		font-weight: 600;
		color: #F69BAC;
		line-height: 100rpx;
	}
	
	.winning-list-info {
		position: relative;
		height: 300rpx;
		margin: 0 80rpx;
		overflow: hidden;
	}
	
	.winning-list-roll {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}
	
	.winning-list-item {
		display: flex;
		justify-content: space-between;
	}
	
	.winning-list-item>view {
		width: 150rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #F69BAC;
		line-height: 60rpx;
	}
	
	.winning-list-item>view:nth-child(1) {
		width: 150rpx;
	}
	
	.winning-list-item>view:nth-child(2) {
		text-align: center;
	}
	
	.winning-list-item>view:nth-child(3) {
		width: 150rpx;
		text-align: right;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	/* 中奖名单 end */
	
	
</style>
