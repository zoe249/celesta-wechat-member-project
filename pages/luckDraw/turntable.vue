<template>
	<view class="content" :style="{ backgroundImage: 'url(' + imgUrl + '/luckDraw-bg02.png)' }">
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
			<view class="name-list" @click="goPrizeRecord">中奖记录</view>
			
			<!-- 活动标题 -->
			<view class="activity-title">
				<view class="activity-text">{{ luckDraws.name }}</view>
				<view class="activity-time">{{ luckDraws.beginTimeFormat[0] }} — {{ luckDraws.endTimeFormat[0] }}</view>
			</view>
			
			<!-- 抽奖次数 -->
			<view class="lottery-draw">
				<view class="lottery-draw-chance">
					<text>您有 </text>
					<text class="lottery-draw-chance-num">{{ numberOfLuckDraw }}</text>
					<text>次抽奖机会</text>
					<text v-if="luckDraws.drawType == 2">{{ ' ' + luckDraws.usePoint }}积分一次</text>
				</view>
			</view>
			
			<!-- 转盘 -->
			<view class="turntable">
				<image :src="imgUrl + '/turntable-bg.png'" mode=""></image>
				
				<view class="turntable-info">
					<yp-turntable :gridInfo="gridInfo" :winPrizes="winPrizes" :luckDraws="luckDraws" @requestResult="requestResult" @getResult="getResult"></yp-turntable>
				</view>
				
			</view>
			
			<!-- 活动说明 -->
			<view class="activity-explain" v-if="luckDraws.ruleDescription.length >= 1">
				<image :src="imgUrl + '/activity-explain02.png'" mode=""></image>
				<view class="activity-explain-text">
					<image :src="imgUrl + '/activity-explain-title.png'" mode=""></image>
					<view class="activity-explain-title">活动说明</view>
					<view class="activity-explain-info">
						<view class="">{{ luckDraws.ruleDescription }}</view>
					</view>
				</view>
			</view>
			
			<!-- 中奖名单 -->
			<view class="winning-list">
				<image :src="imgUrl + '/winning-list02.png'" mode=""></image>
				<view class="winning-list-text">
					<image :src="imgUrl + '/winning-list-title.png'" mode=""></image>
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
	import ypTurntable from '@/components/ui-components/yp-luck-draw/yp-turntable'
	export default {
		components: { 
			ypTurntable
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
							name: item.name,
							text: item.name.length <= 4 ? item.name : item.name.substring(0, 4) + '...',
							prop: 9,
							colour: item.colour,
							url: item.url.length > 0 ? item.url : ''
						})
					})
					luckDraw.beginTimeFormat = luckDraw.beginTime.split(' ')
					luckDraw.endTimeFormat = luckDraw.endTime.split(' ')
					this.luckDraws = luckDraw
					this.gridInfo = gridInfo
					this.init();
					// 获取中奖名单
					this.getDrawRecord(false)
				})
			},
			init(){
				let tempStart = 0;
				let tempScale = 0;
				this.gridInfo.forEach((item, i)=>{
					item.scale = item.prop*5 - 90; // 所占弧度的度数
					item.scaleText = tempScale + (90 + (item.prop*5 - 90))/2; // 文字的回旋角度
					item.sin = Math.sin(Math.PI*2*item.scaleText/360)*160; // 正弦
					item.cos = Math.cos(Math.PI*2*item.scaleText/360)*160; // 余弦
					tempScale = tempScale + 90 + (item.prop*5 - 90);
					if(i !== 0){
						tempStart = tempStart + this.gridInfo[i - 1].prop*5;
					}
					item["start"] = tempStart;
				});
			},
			// 自动检测高度
			getHeight() {
				let that = this
				uni.getSystemInfo({  
				    success: e => {  
				        let StatusBar = e.statusBarHeight;  
				        let rect = wx.getMenuButtonBoundingClientRect();  
				        if (e.system.toLowerCase().indexOf('ios') > -1) {  
				            //IOS  
				            let customBar = rect.bottom + (rect.top - e.statusBarHeight) * 2;  
							that.statusBarHeight = customBar
				        } else {  
				            //安卓  
				            let headerBar = rect.height + (rect.top - e.statusBarHeight) * 2;  
				            let customBar = headerBar + e.statusBarHeight;
							that.statusBarHeight = customBar
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
						pageSize: 10,
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
						that.drawGridInfo = data
						that.winPrizes = data.location - 1
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
				// 	// content: '恭喜抽到：' + event.text,
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
			},
		}
	}
</script>

<style>
	.content {
		position: fixed;
		width: 100vw;
		height: 100vh;
		background-size: cover;
		background-repeat:no-repeat;
		background-position-x: center;
		/* background-position-y: center; */
	}
	
	.name-list {
		position: fixed;
		top: 200rpx;
		right: 0;
		width: 140rpx;
		height: 54rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 27rpx 0rpx 0rpx 27rpx;
		z-index: 10;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 54rpx;
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
	
	/* 活动标题 start */
	.activity-title {
		width: 710rpx;
		height: 210rpx;
		margin: 150rpx 20rpx 0;
	}
	
	.activity-text {
		text-align: center;
		font-size: 75rpx;
		color: #FFFFFF;
		line-height: 100rpx;
		text-shadow: 0rpx 2px 0rpx #FF2562;
	}
	
	.activity-time {
		text-align: center;
		font-size: 28rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 50rpx;
		letter-spacing: 1px;
	}
	
	/* 活动标题 end */
	
	/* 转盘 start */
	.turntable {
		position: relative;
		width: 660rpx;
		height: 660rpx;
		margin: 0 auto;
	}
	
	.turntable>image {
		position: absolute;
		top: 0;
		right: 0;
		width: 660rpx;
		height: 660rpx;
	}
	
	.turntable-info {
		position: absolute;
		top: 0;
		right: 0;
		width: 660rpx;
		height: 660rpx;
	}
	
	.lottery-draw {
		display: flex;
		justify-content: center;
	}
	
	.lottery-draw-chance {
		height: 70rpx;
		margin: 0 auto 20rpx;
		padding: 0 30rpx;
		background: linear-gradient(90deg, #BA4FFD 0%, #FE82D7 100%);
		border-radius: 35rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 70rpx;
	}
	
	.lottery-draw-chance-num {
		margin: 0 10rpx;
		font-size: 32rpx;
	}
	
	/* 转盘 end */
	
	/* 活动说明 start */
	.activity-explain {
		position: relative;
		width: 694rpx;
		height: 424rpx;
		margin: 70rpx auto 0;
	}
	
	.activity-explain>image {
		width: 100%;
		height: 100%;
	}
	
	.activity-explain-text {
		position: absolute;
		top: 0rpx;
		width: 614rpx;
		margin: 0rpx 40rpx;
	}
	
	.activity-explain-info {
		margin-top: 30rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 40rpx;
	}
	
	.activity-explain-text>image {
		display: block;
		width: 268rpx;
		height: 68rpx;
		margin: 0 auto;
	}
	
	/* 活动说明 end */
	
	/* 中奖名单 start */
	.winning-list {
		position: relative;
		width: 690rpx;
		height: 400rpx;
		margin: 70rpx auto 0;
	}
	
	.winning-list>image {
		width: 100%;
		height: 100%;
	}
	
	.winning-list-text {
		position: absolute;
		top: 0rpx;
		width: 680rpx;
	}
	
	.winning-list-text>image {
		display: block;
		width: 268rpx;
		height: 68rpx;
		margin: 0 auto;
	}
	
	.winning-title, .activity-explain-title {
		position: absolute;
		top: 0rpx;
		width: 100%;
		height: 68rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 68rpx;
	}
	
	.winning-list-info {
		position: relative;
		height: 300rpx;
		margin: 15rpx 40rpx 0;
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
		color: #FFFFFF;
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