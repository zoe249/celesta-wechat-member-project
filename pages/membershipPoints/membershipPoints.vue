<template>
	<view>
		<!-- 标题 -->
		<u-navbar title="会员积分" :background="background" back-icon-color="#ffffff" title-color="#ffffff" title-size="35"></u-navbar>

		<!-- 正文 -->
		<view class="content">
			<view class="available">可用积分</view>
			<view class="integral">{{ integral.integral }}</view>
			<view class="consume">
				<view class="btn" @tap="goSeckill">积分兑换</view>
			</view>
			<view class="soon">
				<!-- <span class="soon-time">截止2021.01.25 有30积分即将过期</span> -->
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

		<!-- 积分明细 -->
		<view class="points-details" v-for="(item, index) in monthList" :key="index">
			<yp-points-details :integral="item" :integralList="integralList" :dropDown="item.state" @change="dropDown(index)" @loadMore="loadMore(index)"></yp-points-details>
		</view>
		
		<!-- 整体页面中显示情况 -->
		<view class="not-detailed" v-if="isMonthList == false">
			<image :src="imgUrl + '/integralIcon.png'" mode="widthFix"></image>
			<view class="tips-text">您当前没有会员积分</view>
		</view>

		<!-- 隔离层 -->
		<view style="height: 80rpx;"></view>


		<!-- 弹出层 -->
		<!-- 积分类型 -->
		<u-picker mode="selector" v-model="isTypeShow" :range="typeList" range-key="type" @confirm="getTypeList"></u-picker>

		<!-- 筛选时间 -->
		<u-picker mode="selector" v-model="isTimeShow" :range="timeList" range-key="time" @confirm="getTimeList"></u-picker>

	</view>
</template>

<script>
	import ypPointsDetails from '@/components/ui-components/yp-points-details/yp-points-details.vue'
	export default {
		components: {
			ypPointsDetails
		},
		data() {
			return {
				isTypeShow: false, // 积分类型弹出层
				isTimeShow: false, // 筛选时间弹出层
				imgUrl: this.config.imgUrl,
				background: {
					backgroundImage: 'linear-gradient(to right, #FFA38A, #FF7361)'
				},
				integral: { // 积分信息
					integral: '0'
				},
				selectType: { // 选中积分类型
					type: '全部',
					application: ''
				},
				selectTimg: { // 选中筛选时间
					time: '本月',
					dateTime: 'thisMonth'
				},
				typeList: [{ // 积分类型
					type: '全部',
					application: ''
				}, {
					type: '获取',
					application: 'pointAdd'
				}, {
					type: '使用',
					application: 'pointSubtract'
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
				// pageIndex: 1, // 请求第几页
				pageSize: 20, // 请求一个多少条
				isMonthList: true, // 是否有月份信息
				monthList: [], // 月份信息
				integralList: [], // 明细列表
			}
		},
		onShow() {

		},
		onLoad(options) {
			// 获取会员积分明细
			this.getPointList()
			// 查询会员积分
			this.pointTypes(options.memberId)
		},
		/* 下拉刷新停止 */
		onPullDownRefresh() {
			let that = this
			setTimeout(function() {
				uni.stopPullDownRefresh()
				
			}, 1000)
		},
		methods: {
			// 查询会员积分
			pointTypes(id) {
				let that = this
				that.request({
					url: that.config.pointTypes,
					data: {
						memberId: id,
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
			},
			// 选择积分类型
			getTypeList(index) {
				this.selectType = this.typeList[index]
				// 获取会员积分明细
				this.monthList = [], // 月份信息
				this.integralList = [], // 明细列表
				this.getPointList()
			},
			// 选择筛选时间
			getTimeList(index) {
				this.selectTimg = this.timeList[index]
				// 获取会员积分明细
				this.monthList = [], // 月份信息
				this.integralList = [], // 明细列表
				this.getPointList()
			},
			// 获取会员积分明细  先查月份
			getPointList() {
				let that = this
				that.request({
					url: that.config.pointMonthList,
					data: {
						month: that.selectTimg.dateTime
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200 && data.length != 0) {
						data.forEach((value, index) => {
							value.state = false
							value.pageIndex = 1
							value.status = 'loadmore'
						})
						data[0].state = true
						that.monthList = data
						that.isMonthList = true
						// 再根据积分类型 (默认显示第0个)
						that.pointList('0')
					} else {
						that.isMonthList = false
					}
				})
			},
			// 获取会员积分明细  再根据积分类型
			pointList(index) {
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
			// 显示开关
			dropDown(index) {
				// 如果是开启动作，需关闭其他月份
				let month = this.monthList[index].state
				if (month) {
					for (let i in this.monthList) {
						this.monthList[i].state = false
					}
				} else {
					for (let i in this.monthList) {
						if (i == index) {
							this.monthList[index].state = true
						} else {
							this.monthList[i].state = false
						}
					}
				}
				// 获取会员积分明细
				this.monthList[index].pageIndex = 1
				this.integralList = [], // 明细列表
				this.pointList(index)
			},
			// 加载更多
			loadMore(index) {
				// 再根据积分类型
				this.monthList[index].status = 'loading'
				this.monthList[index].pageIndex++
				this.pointList(index)
			},
			// 跳转的商品秒杀页
			goSeckill(){
				uni.navigateTo({
					url:'/pages/seckill/seckill'
				})
			}
		}
	}
</script>

<style scoped>
	/* 积分展示 start */
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
	
	.consume{
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
	}
	.consume .btn{
		width: 150rpx;
		height: 60rpx;
		background: #FFEFE7;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FA7E68;
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

	/* 积分展示 end */


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
	
	
	/* 暂无积分明细 start */
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
	
	/* 暂无积分明细 end */
	
</style>
