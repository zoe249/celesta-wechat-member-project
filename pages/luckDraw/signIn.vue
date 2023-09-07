<template>
	<view class="content" :style="{ backgroundImage: 'url(' + imgUrl + '/signIn-bg.png)' }">
		<!-- 自定义头部 -->
		<view class="header" :style="{ height: statusBarHeight + 'px' }">
			<view class="header-view">
				<view class="header-icon" @click="returnBut">
					<u-icon name="arrow-left" color="#ffffff" size="35"></u-icon>
				</view>
				<view class="header-title">每日签到</view>
			</view>
		</view>
		
		<!-- 每日签到 -->
		<view class="signin-info">
			<view class="signin-num">
				<image src="@/static/luckDraw/integral-bg.png" mode=""></image>
				<view class="signin-num-text">
					<view class="">{{ signInDetail.IntegralAndGrowth }}</view>
					<view class="">{{ signInDetail.dailyBonusType == 1 ? '积分' : '成长值' }}</view>
				</view>
			</view>
		</view>
		
		<!-- 签到记录 -->
		<view class="whole-sign-in" @click="isWholeShow = true">签到记录</view>
		
		<!-- 连续签到 -->
		<view class="sign-in">
			<view class="sign-in-title">
				<view class="">
					<text>连续签到</text>
					<text>{{ runningDays }}</text>
					<text>天</text>
				</view>
				<view class="remind-sign-in">
					<text>签到提醒</text>
					<view class="">
						<u-switch class="form-switch" slot="right" size="30" active-color="#FF2562" inactive-color="#ffffff" v-model="signInDetail.remind" @change="setShield"></u-switch>
					</view>
				</view>
			</view>
			<view class="sign-in-time">
				<view class="sign-in-time-info">
					<view class="time-item" v-for="(item, index) in signIns" :key="index">
						<view class="item-coupon">
							<image v-if="item.couponTemplateList.length>=1" src="@/static/luckDraw/coupon-bg.png" mode=""></image>
							<view v-if="item.couponTemplateList.length>=1">{{ item.couponTemplateList[0].denomination }}{{ item.couponTemplateList[0].uom }}券</view>
						</view>
						<view :class=" ((toDayInfo.week-1 == index) && isSignIn) || item.status ? 'item-state item-state-action' : 'item-state' ">
							<image src="@/static/luckDraw/goldCoins.png" mode=""></image>
							<view class="item-reward" v-if="item.award">+{{ item.award }}</view>
							<view class="item-reward" v-if="!item.award && !item.status">
								<u-icon name="close" color="#B6B6B6" size="25"></u-icon>
							</view>
							<view class="item-reward" v-if="!item.award && item.status">
								<u-icon name="checkmark" color="#B6B6B6" size="25"></u-icon>
							</view>
						</view>
						<view class="item-date">{{ weeks[index] }}</view>
					</view>
				</view>
			</view>
			<view class="sign-in-but">
				<view v-if="!isSignIn" class="sign-in-but-in" @click="getSignIn">
					<text>签到</text>
				</view>
				<view v-else class="sign-in-but-in">
					<image src="@/static/luckDraw/checked-icon.png" mode=""></image>
					<text>已签到</text>
				</view>
			</view>
		</view>
		
		<!-- 全部签到 弹窗 -->
		<u-popup v-model="isWholeShow" mode="bottom" border-radius="20" length="850rpx">
			<view>
				<ss-calendar :checks="checks" :sevenDaysSignIns="sevenDaysSignIns" @prev-month-day="getMonthDay" @next-month-day="getMonthDay" />
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	import ssCalendar from '@/components/ss-calendar/ss-calendar.vue'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				isSignIn: false, // 是否签到
				isWholeShow: false, // 全部签到是否显示
				memberInfo: uni.getStorageSync('memberInfo'), // 会员信息
				statusBarHeight: 0, // 自定义标题栏高度
				signIns: [], // 七天签到详情
				sevenDaysSignIns: [], // 七天奖励详情，中奖记录用
				toDayInfo: {}, // 今天信息
				signInDetail: {}, // 签到配置信息
				runningDays: 0, // 连续签到天数
				weeks: ['周一', '周二','周三','周四','周五','周六','周日'],
				checks: [], // 签到过的日期集合
			}
		},
		components: {
		    ssCalendar
		},
		onLoad() {
			// 自动检测高度
			this.getHeight()
			// 获取七天奖励
			this.getSevenDaysReward()
			// 获取签到配置信息
			this.getSignInDetail()
			// 获取连续签到天数
			this.getRunningDays()
		},
		methods: {
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
			// 获取七天奖励
			getSevenDaysReward() {
				let that = this
				that.request({
					url: that.config.getSevenDaysReward,
				}).then(res => {
					if (res.statusCode != 200) return
					// 截取本周数据
					let data = res.data
					let num = 8 - data[0].week
					that.signIns = data.slice(0, num)
					that.toDayInfo.week = data[0].week
					that.sevenDaysSignIns = data
					// 获取前段数据
					if(num < 7) {
						let date01 = that.GetDateStr(-1)
						let date02 = that.GetDateStr(1 - data[0].week )
						that.getSignInRecord(date02.date, date01.date)
					}
					// 获取当天数据
					let date03 = that.GetDateStr(0)
					that.getTodayRecord(date03.date, date03.date)
				})
			},
			// 查询会员签到记录
			getSignInRecord(startDate, endDate) {
				let that = this
				that.request({
					url: that.config.getSignInRecord,
					data: {
						attendanceStartTime: startDate,
						attendanceEndTime: endDate,
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					// 截取本周数据
					that.signIns = [...data, ...that.signIns]
					
					console.log('signIns', that.signIns);
				})
			},
			// 查询当天是否签到
			getTodayRecord(startDate, endDate) {
				let that = this
				that.request({
					url: that.config.getSignInRecord,
					data: {
						attendanceStartTime: startDate,
						attendanceEndTime: endDate,
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					if(data[0].status) {
						that.isSignIn = true
						that.toDayInfo.attendanceTime = data[0].attendanceTime
						that.toDayInfo.status = data[0].status
					}
					// 查询会员本月签到记录
					let month = startDate.split("-")
					let startTime = month[0] + '-' + month[1]
					let endTime = month[0] + '-32'
					that.getChecks(startTime, endTime)
				})
			},
			// 获取签到配置信息
			getSignInDetail() {
				let that = this
				that.request({
					url: that.config.getSignInDetail,
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data.data
					that.signInDetail = data
					
					// 垃取积分、成长值
					that.request({
						url: that.config.pointTypes,
						data: {
							memberId: that.memberInfo.id,
							type: '0' + data.dailyBonusType
						}
					}).then(res => {
						if (res.statusCode == 200) {
							let data01 = res.data
							that.signInDetail.IntegralAndGrowth = data01[0].balance
							// data01.forEach((item) => {
							// 	if(item.type == '01' && data.dailyBonusType == '1') {
							// 		that.signInDetail.IntegralAndGrowth = item.balance
							// 	}
							// 	if(item.type == '02' && data.dailyBonusType == '2') {
							// 		that.signInDetail.IntegralAndGrowth = item.balance
							// 	}
							// })
						}
					})
				})
			},
			// 签到提醒
			setShield(event) {
				console.log(event);
				
			},
			// 获取签到
			getSignIn() {
				let that = this
				let companyCode = that.config.companyCode
				that.request({
					url: that.config.getSignIn,
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
						console.log(res);
						
						let data = res.data.data
						let pointPresented = data.pointPresented != 0 ? data.pointPresented + '积分 ' : ''
						let growthPresented = data.growthPresented != 0 ? data.growthPresented + '成长值 ' : ''
						let couponTemplateList = ''
						if(data.couponTemplateList && data.couponTemplateList.length >= 1) {
							data.couponTemplateList.forEach(item => {
								couponTemplateList = couponTemplateList + ' ' + item.denomination + item.uom + '券'
							})
						}
						uni.showModal({
							title: '签到成功',
						    content: '恭喜收到：' + pointPresented + growthPresented + couponTemplateList ,
							showCancel: false,
							confirmText: '知道了',
						    success: function (res) {}
						});
						
						// 获取七天奖励
						that.getSevenDaysReward()
						// 获取签到配置信息
						that.getSignInDetail()
						// 获取连续签到天数
						that.getRunningDays()
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 获取连续签到天数
			getRunningDays() {
				let that = this
				that.request({
					url: that.config.getRunningDays,
				}).then(res => {
					if (res.statusCode != 200) return
					that.runningDays = res.data
				})
			},
			// 查看记录选择月份
			getMonthDay(event) {
				let month = event.month < 10 ? '0' + event.month : event.month
				let startTime = event.year + '-' +  month + '-01'
				let endTime = event.year + '-' + month  + '-' + event.dayNums
				this.getChecks(startTime, endTime)
			},
			// 查询会员签到记录
			getChecks(startTime, endTime) {
				let that = this
				that.request({
					url: that.config.getChecks,
					data: {
						pageIndex: 1,
						pageSize: 30,
						attendanceStartTime: startTime,
						attendanceEndTime: endTime,
						memberId: that.memberInfo.id
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data.data
					let checks = []
					data.forEach(item => {
						let attendanceTime = item.attendanceTime.split(" ")
						checks.push(attendanceTime[0])
					})
					this.checks = checks
				})
			},
			// 获取日期
			GetDateStr(AddDayCount) { 
			    var dd = new Date();
			    dd.setDate(dd.getDate()+AddDayCount); //获取AddDayCount天后的日期
			    var y = dd.getFullYear(); 
			    var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1); //获取当前月份的日期，不足10补0
			    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate(); //获取当前几号，不足10补0
				var days = dd.getDay();
				switch(days) {
					case 1:
						days = '周一';
						break;
					case 2:
						days = '周二';
						break;
					case 3:
						days = '周三';
						break;
					case 4:
						days = '周四';
						break;
					case 5:
						days = '周五';
						break;
					case 6:
						days = '周六';
						break;
					case 0:
						days = '周天';
						break;
				}
				var date = {
					y: y,
					m: m,
					d: d,
					week: days,
					date: y + '-' + m + '-' + d
				}
			    return date; 
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
		z-index: 999;
	}
	
	.header-view {
		display: flex;
		position: absolute;
		bottom: 10rpx;
	}
	
	.header-icon {
		/* margin-left: 20rpx; */
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
	
	/* 背景 start */
	.content {
		position: relative;
	    width: 100vw;
	    height: 100vh;
	    background-size: cover;
	    background-position-x: center;
	    background-position-y: center;
	}
	
	.signin-info {
		position: relative;
		width: 100%;
		height: 60%;
	}
	
	.signin-num {
		position: absolute;
		left: 237rpx;
		bottom: 210rpx;
		width: 276rpx;
		height: 276rpx;
	}
	
	.signin-num>image {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 276rpx;
		height: 276rpx;
		z-index: 1;
	}
	
	.signin-num-text {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 276rpx;
		height: 276rpx;
		z-index: 2;
	}
	
	.signin-num-text view {
		text-align: center;
		color: #FFFFFF;
	}
	
	.signin-num-text view:nth-child(1) {
		margin-top: 85rpx;
		font-size: 68rpx;
		line-height: 80rpx;
		font-weight: 600;
		text-shadow: 0px 2px 0px #FEB62E;
	}
	
	.signin-num-text view:nth-child(2) {
		font-size: 24rpx;
		line-height: 60rpx;
	}
	
	/* 背景 end */
	
	/* 每日签到 start */
	.sign-in {
		position: absolute;
		bottom: 0;
		width: calc(100% - 40rpx);
		height: 500rpx;
		margin: 0 20rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 15rpx;
	}
	
	.sign-in-title {
		display: flex;
		justify-content: space-between;
		height: 90rpx;
	}
	
	.sign-in-title>view:nth-child(1) {
		margin: 0 40rpx;
		line-height: 100rpx;
		font-size: 35rpx;
		font-weight: 600;
		color: #000000;
	}
	
	.sign-in-title>view:nth-child(1) text:nth-child(2) {
		font-size: 44rpx;
		color: #FF2562;
		margin: 0 10rpx;
	}
	
	.remind-sign-in {
		display: flex;
		margin: 0 40rpx;
	}
	
	.remind-sign-in>text {
		font-size: 24rpx;
		line-height: 100rpx;
		color: #B2B2B2;
	}
	
	.remind-sign-in>view {
		line-height: 107rpx;
	}
	
	.form-switch {
		margin: 10rpx 0 10rpx 10rpx;
	}
	
	.sign-in-but {
		height: 130rpx;
		padding-top: 20rpx;
	}
	
	.sign-in-but-in {
		display: flex;
		justify-content: center;
		width: 400rpx;
		height: 80rpx;
		margin: 0 auto;
		background: linear-gradient(40deg, #4948E7 0%, #A97DFA 46%, #8CE5F6 100%);
		border-radius: 40rpx;
		text-align: center;
	}
	
	.sign-in-but-in>image {
		width: 40rpx;
		height: 40rpx;
		margin: 20rpx 10rpx 20rpx 0;
	}
	
	.sign-in-but-in>text {
		font-size: 32rpx;
		font-weight: 500;
		line-height: 40rpx;
		color: #FFFFFF;
		margin: 20rpx 0;
	}
	
	.sign-in-time {
		height: 250rpx;
	}
	
	.sign-in-time-info {
		display: flex;
		margin: 0 20rpx;
	}
	
	.time-item {
		width: 102rpx;
		height: 150rpx;
		padding: 20rpx 0;
	}
	
	.item-coupon {
		position: relative;
		width: 72rpx;
		height: 38rpx;
	}
	
	.item-coupon>image {
		position: absolute;
		top: 0;
		left: calc(50% - 20rpx);
		width: 72rpx;
		height: 38rpx;
		margin-top: -10rpx;
	}
	
	.item-coupon>view {
		position: absolute;
		top: 0;
		left: calc(50% - 20rpx);
		width: 72rpx;
		text-align: center;
		font-size: 18rpx;
		line-height: 15rpx;
		color: #FFFFFF;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.item-date {
		text-align: center;
		font-size: 22rpx;
		font-weight: 600;
		line-height: 60rpx;
		color: #333333;
	}
	
	.item-state {
		margin: 0 10rpx;
		padding: 10rpx 0;
		background-color: #F9F9F9;
		border-radius: 10rpx;
	}
	
	.item-state-action {
		background-color: #FFF1C6;
	}
	
	.item-state>image {
		display: block;
		width: 48rpx;
		height: 48rpx;
		margin: 0 auto;
	}
	
	.item-reward {
		height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #B6B6B6;
	}
	
	.whole-sign-in {
		position: fixed;
		right: 0;
		top: 250rpx;
		width: 144rpx;
		height: 54rpx;
		background: linear-gradient(47deg, #4948E7 0%, #A97DFA 46%, #8CE5F6 100%);
		border-radius: 100rpx 0rpx 0rpx 100rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 54rpx;
	}
	
	/* 每日签到 end */
	
</style>
