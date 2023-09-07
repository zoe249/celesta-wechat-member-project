<template>
	<view>
		<!-- 标题 -->
		<u-navbar title="会员成长值" :background="background" back-icon-color="#ffffff" title-color="#ffffff" title-size="35"></u-navbar>

		<!-- 正文 -->
		<view class="content">
			<view class="available">当前成长值</view>
			<view class="integral">{{ integral.growthBalanceFormat }}</view>
			<view class="soon">
				<span class="soon-time" v-if="integral.cardLevelEndTime != null">截止到{{ integral.cardLevelEndTime }}, 过期扣减{{ integral.growthDeduct }}成长值</span>
			</view>
		</view>

		<!-- 筛选 -->
		<view class="screen">
			<view class="whole" @click="isTypeShow = true">
				<span>{{ selectType.type }}</span>
				<u-icon name="arrow-down" color="#5B5B5B" size="28"></u-icon>
			</view>
			<view class="month" @click="isTimeShow = true">
				<span>{{ selectTimg.time }}</span>
				<u-icon name="arrow-down" color="#5B5B5B" size="28"></u-icon>
			</view>
		</view>

		<!-- 成长值 -->
		<view class="points-details">
			<yp-growth-value :integral="item" :integralList="integralList" @loadMore="loadMore(index)"></yp-growth-value>
		</view>
		
		<!-- 整体页面中显示情况 -->
		<view class="not-detailed" v-if="isMonthList == false">
			<image :src="imgUrl + '/growthValue.png'" mode="widthFix"></image>
			<view class="tips-text">您当前没有成长值记录</view>
		</view>

		<!-- 隔离层 -->
		<view style="height: 80rpx;"></view>


		<!-- 弹出层 -->
		<!-- 成长值类型 -->
		<u-picker mode="selector" v-model="isTypeShow" :range="typeList" range-key="type" @confirm="getTypeList"></u-picker>

		<!-- 筛选时间 -->
		<u-picker mode="selector" v-model="isTimeShow" :range="timeList" range-key="time" @confirm="getTimeList"></u-picker>

	</view>
</template>

<script>
	import ypGrowthValue from '@/components/ui-components/yp-growth-value/yp-growth-value.vue'
	export default {
		components: {
			ypGrowthValue
		},
		data() {
			return {
				isTypeShow: false, // 成长值类型弹出层
				isTimeShow: false, // 筛选时间弹出层
				imgUrl: this.config.imgUrl,
				memberInfo: uni.getStorageSync('memberInfo'), // 会员信息
				background: {
					backgroundImage: 'linear-gradient(to right, #FFA38A, #FF7361)'
				},
				integral: {}, // 成长值信息
				selectType: { // 选中成长值类型
					type: '全部',
					application: ''
				},
				selectTimg: { // 选中筛选时间
					time: '本月',
					dateTime: 'thisMonth'
				},
				typeList: [{ // 成长值类型
					type: '全部',
					application: '0'
				}, {
					type: '获取',
					application: '1'
				}, {
					type: '扣减',
					application: '2'
				}],
				timeList: [{ // 筛选时间
					time: '本月',
					dateTime: 'thisMonth'
				}, {
					time: '近三个月',
					dateTime: 'threeMonth'
				}, {
					time: '近六个月',
					dateTime: 'sixMonth'
				}, {
					time: '整年',
					dateTime: 'yearly'
				}],
				pageIndex: 1, // 请求第几页
				pageSize: 40, // 请求一个多少条
				isMonthList: true, // 是否有月份信息
				monthList: [], // 月份信息
				integralList: [], // 明细列表
			}
		},
		onShow() {

		},
		onLoad(options) {
			// 获取会员成长值明细
			this.getPointList()
			// 查询会员成长值
			this.pointTypes()
		},
		/* 下拉刷新停止 */
		onPullDownRefresh() {
			let that = this
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			// 查询会员成长值
			pointTypes() {
				let that = this
				// 
				// that.request({
				// 	url: that.config.pointTypes + that.memberInfo.id + '/memberAccount',
				// 	data: {
				// 		type: '02'
				// 	}
				// }).then(res => {
				// 	let data = res.data
				// 	if (res.statusCode == 200) {
				// 		data.forEach((item) => {
				// 			if(item.type == '02') {
				// 				that.integral.integral = item.balance
				// 			}
				// 		})
				// 	}
				// })
				that.request({
					url: that.config.currentInfor + that.memberInfo.id
				}).then(res => {
					console.log('2222', res);
					if (res.statusCode != 200) return
					let data = res.data
					data.growthBalanceFormat = parseInt(data.growthBalance)
					that.integral = data
				})
			},
			// 选择成长值类型
			getTypeList(index) {
				this.selectType = this.typeList[index]
				// 获取会员成长值明细
				this.monthList = [], // 月份信息
				this.integralList = [], // 明细列表
				this.getPointList()
			},
			// 选择筛选时间
			getTimeList(index) {
				this.selectTimg = this.timeList[index]
				// 获取会员成长值明细
				this.monthList = [], // 月份信息
				this.integralList = [], // 明细列表
				this.getPointList()
			},
			// 获取会员成长值明细
			getPointList() {
				let that = this
				that.request({
					url: that.config.growthValue,
					data: {
						direction: that.selectType.application,
						month: that.selectTimg.dateTime,
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
					}
				}).then(res => {
					let data = res.data.data
					console.log(data);
					if (res.statusCode == 200 && data.length != 0) {
						// 循环遍历
						data.forEach((value, index) => {
							value.status = 'loadmore'
							value.createAtFormat = that.timeDay(Number(value.createTime))
							that.integralList.push(value)
						})
						that.isMonthList = true
						
						// 无更多数据
						if(that.integralList.length >= 1 && that.integralList.length >= data.total) {
							that.integralList[that.integralList.length-1].status = 'nomore'
						}
						
						
						// data.forEach((value, index) => {
						// 	value.status = 'loadmore'
						// 	value.createAtFormat = that.timeDay(Number(value.createTime))
						// })
						// that.integralList = data
						// that.isMonthList = true
					}else {
						that.isMonthList = false
					}
				})
				
				// that.request({
				// 	url: that.config.pointMonthList,
				// 	data: {
				// 		month: that.selectTimg.dateTime
				// 	}
				// }).then(res => {
				// 	let data = res.data
				// 	if (res.statusCode == 200 && data.length != 0) {
				// 		data.forEach((value, index) => {
				// 			value.state = false
				// 			value.pageIndex = 1
				// 			value.status = 'loadmore'
				// 		})
				// 		data[0].state = true
				// 		that.monthList = data
				// 		that.isMonthList = true
				// 		// 再根据成长值类型 (默认显示第0个)
				// 		that.pointList('0')
				// 	} else {
				// 		that.isMonthList = false
				// 	}
				// })
			},
			// 获取会员成长值明细  再根据成长值类型
			pointList() {
				let that = this
				that.request({
					url: that.config.pointList,
					data: {
						pageIndex: that.monthList[index].pageIndex,
						pageSize: that.pageSize,
						application: that.selectType.application,
						dateTime: that.monthList[index].createMonth
					}
				}).then(res => {
					let data = res.data.data
					// 循环遍历
					if (res.statusCode == 200 && data.length != 0) {
						data.forEach((value, index) => {
							value.createTimeFormat = that.$u.timeFormat(value.createTime, 'yyyy-mm-dd hh:MM:ss');
							that.integralList.push(value)
						})
						that.monthList[index].status = 'loadmore'
					}
					// 无更多数据
					if(that.integralList.length >= 1 && that.integralList.length >= res.data.total) {
						that.monthList[index].status = 'nomore'
					}
				})
			},
			// 加载更多
			loadMore() {
				// 再根据成长值类型
				this.monthList[index].status = 'loading'
				this.pageIndex++
				this.getPointList()
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
				return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
			},
		}
	}
</script>

<style scoped>
	/* 成长值展示 start */
	.content {
		padding-bottom: 30rpx;
		background: linear-gradient(to right, #FFA38A, #FF7361);
	}

	.available {
		padding-top: 10rpx;
		font-size: 28rpx;
		text-align: center;
		line-height: 60rpx;
		color: #EEEEEE;
	}

	.integral {
		font-size: 60rpx;
		font-weight: 500;
		text-align: center;
		line-height: 60rpx;
		color: #FFFFFF;
	}

	.soon {
		display: flex;
		justify-content: center;
	}

	.soon-time {
		margin-top: 20rpx;
		padding: 7rpx 20rpx;
		font-size: 20rpx;
		border-radius: 20rpx;
		color: #FFFFFF;
		background-color: rgba(0, 0, 0, .2);
	}

	/* 成长值展示 end */


	/* 筛选 start */
	.screen {
		display: flex;
		height: 70rpx;
		background-color: #FFFFFF;
	}

	.whole,
	.month {
		display: flex;
		justify-content: center;
		width: 50%;
		line-height: 70rpx;
	}

	.whole span,
	.month span {
		font-size: 28rpx;
		color: #333333;
	}

	/* 筛选 end */
	
	
	/* 暂无成长值明细 start */
	.not-detailed {
		padding: 100rpx 0 0;
	}
	
	.not-detailed>image {
		width: 200rpx;
		margin: 0 275rpx;
	}
	
	.tips-text {
		text-align: center;
		font-size: 30rpx;
		color: #333333;
		line-height: 70rpx;
	} 
	
	/* 暂无成长值明细 end */
	
</style>
