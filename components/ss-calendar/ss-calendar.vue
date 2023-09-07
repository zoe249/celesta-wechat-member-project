<template>
	<view class="calendar">
		<view class="header">
			<view class="btn-group">
				<view class="btn btn-prev" @click="onSwitchPrevMonth()">
					<image src="../../static/luckDraw/prev-icon.png" mode=""></image>
				</view>
			</view>
			<view class="current-date">{{ currentDate }}</view>
			<view class="btn-group">
				<view class="btn btn-next" @click="onSwitchNextMonth()">
					<image src="../../static/luckDraw/next-icon.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="body">
			<view class="weeks">
				<view class="week-item" v-for="week in weeks" :key="week">{{ week }}</view>
			</view>
			<view class="day-list">
				<view :class="{
					'day-item': true,
					today: day.isToday,
					checked: day.checked,
					'current-month-day': day.type === 'current'
				  }" v-for="(day, index) in dayList" :key="index">
					<view :class=" day.day != 0 ? 'date-reward' : '' ">
						<view class="checked-view" v-if="day.checked">
							<image src="../../static/luckDraw/checked-icon.png" mode=""></image>
						</view>
						<text class="text" v-if="day.day != 0">{{ day.day }}</text>
						
						<!-- <text class="text" v-if="day.day != 0 && sevenDaysSignIns[index].week && (sevenDaysSignIns[day.day-index].week >= day.day) ">{{ day.day }}</text> -->
						<!-- <text class="text" v-if="day.day != 0 && !day.checked">{{ '+' + day.reward }}</text> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			checks: {
				type: Array,
				default () {
					return []
				}
			},
			sevenDaysSignIns: {
				type: Array,
				default () {
					return []
				}
			},
		},
		data() {
			return {
				year: null,
				month: null,
				day: null,
				dayList: [],
				weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
			}
		},
		computed: {
			currentDate() {
				const year = this.year
				const month = this.month < 10 ? '0' + this.month : this.month

				return `${year}年${month}月`
			}
		},
		watch: {
			checks() {
				this.initDate()
			}
		},
		created() {
			const {
				year,
				month,
				day
			} = this.getCurrentDate()

			this.initDate(year, month, day)
		},
		methods: {
			initDate(year = this.year, month = this.month, day = this.day) {
				const dayList = this.getDayList(year, month)
				this.year = year
				this.month = month
				this.day = day
				this.dayList = dayList
			},
			// 选择某天
			handleClick(day) {
				const payload = {
					year: this.year,
					month: this.month,
					...day
				}

				switch (day.type) {
					case 'prev':
						this.onSwitchPrevMonth(day)
						break
					case 'next':
						this.onSwitchNextMonth(day)
						break
					default:
						this.$emit('current-month-day', payload)
				}
			},
			onSwitchPrevMonth(day) {
				const {
					prevYear,
					prevMonth
				} = this.getPrevMonthInfo(
					this.year,
					this.month
				)
				
				let dayNums = this.getMonthDayTotal(prevYear,prevMonth);
				
				const payload = {
					year: prevYear,
					month: prevMonth,
					oldYear: this.year,
					oldMonth: this.month,
					dayNums: dayNums,
					...day
				}

				this.initDate(prevYear, prevMonth)
				
				this.$emit('prev-month-day', payload)
			},
			onSwitchNextMonth(day) {
				const {
					nextYear,
					nextMonth
				} = this.getNextMonthInfo(
					this.year,
					this.month
				)
				
				let dayNums = this.getMonthDayTotal(nextYear,nextMonth);
				
				const payload = {
					year: nextYear,
					month: nextMonth,
					oldYear: this.year,
					oldMonth: this.month,
					dayNums: dayNums,
					...day
				}

				this.initDate(nextYear, nextMonth)
				
				this.$emit('next-month-day', payload)
				
			},
			getMonthDayTotal(year,month){ 
				let nextMonth = month; 
				let d = new Date(year, nextMonth, 0); 
				return d.getDate(); 
			},
			getPrevMonthInfo(year, month) {
				let prevYear = year
				let prevMonth = month - 1

				if (prevMonth < 1) {
					prevMonth = 12
					prevYear -= 1
				}

				return {
					prevYear,
					prevMonth
				}
			},
			getNextMonthInfo(year, month) {
				let nextYear = year
				let nextMonth = month + 1

				if (nextMonth > 12) {
					nextMonth = 1
					nextYear += 1
				}

				return {
					nextYear,
					nextMonth
				}
			},
			getDayList(year, month) {
				const prevMonthDays = this.getPrevMonthDays(year, month)
				const currentMonthDays = this.getCurrentMonthDays(year, month)
				// const nextMonthDays = this.getNextMonthDays(year, month)
				
				// return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
				return [...prevMonthDays, ...currentMonthDays]
			},
			getReward(year, month) {
				console.log('year', year);
				console.log('month', month);
			},
			getCurrentDate() {
				const date = new Date()
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				const day = date.getDate()

				return {
					year,
					month,
					day
				}
			},
			getMonthLastDay(year, month) {
				const {
					nextYear,
					nextMonth
				} = this.getNextMonthInfo(year, month)
				const date = new Date(`${nextYear}/${nextMonth}/1`)
				const firstDayTimeStamp = date.getTime()
				const oneDayTimeStamp = 24 * 60 * 60 * 1000
				const prevMonthLastDay = new Date(
					firstDayTimeStamp - oneDayTimeStamp
				).getDate()

				return prevMonthLastDay
			},
			getPrevMonthDays(year, month) {
				const {
					prevYear,
					prevMonth
				} = this.getPrevMonthInfo(year, month)
				const prevMonthLastDay = this.getMonthLastDay(prevYear, prevMonth)
				const date = new Date(`${year}/${month}/1`)
				const week = date.getDay()

				const days = []

				for (let i = 0; i < week; i++) {
					
					// 奖励
					let reward = '1'
					
					days.unshift({
						type: 'prev',
						checked: false,
						// day: prevMonthLastDay - i,
						day: 0,
						reward
					})
				}

				return days
			},
			getCurrentMonthDays(year, month) {
				const currentMonthLastDay = this.getMonthLastDay(year, month)
				const checks = this.checks
				const days = []
				const {
					year: currentYear,
					month: currentMonth,
					day: currentDay
				} = this.getCurrentDate()

				for (let i = 1; i <= currentMonthLastDay; i++) {
					let checked = false
					let isToday =
						currentYear === year && currentMonth === month && currentDay === i

					checks.forEach(date => {
						const dateArr = date.split('-')

						if (year == dateArr[0] && month == dateArr[1] && i == dateArr[2]) {
							checked = true
						}
					})
					
					// 奖励
					let reward = '7'

					days.push({
						type: 'current',
						checked,
						isToday,
						day: i,
						reward
					})
				}
				return days
			},
			getNextMonthDays(year, month) {
				const currentMonthLastDay = this.getMonthLastDay(year, month)
				const date = new Date(`${year}/${month}/${currentMonthLastDay}`)
				const week = date.getDay()
				const days = []

				let day = 0

				for (let i = week + 1; i <= 6; i++) {
					day++
					
					// 奖励
					let reward = '5'

					days.push({
						type: 'next',
						checked: false,
						day,
						reward
					})
				}

				return days
			}
		}
	}
</script>

<style lang="scss" scoped>
	.calendar {
		background-color: #fff;
		color: $uni-text-color;

		.header {
			margin: 0 20upx;
			width: calc(100% - 40upx);
			padding-top: 30upx;
			display: flex;
			justify-content: space-between;

			.current-date {
				text-align: center;
				font-size: 34upx;
				padding: 20upx 0;
				color: #030303;
			}

			.btn-group {
				display: flex;
				align-items: center;

				.btn {
					line-height: 1;
					background: #fff;
					color: #606266;
					text-align: center;
					box-sizing: border-box;
					font-weight: 500;
					padding: 12upx 20upx;
					font-size: 24upx;
					
					image {
						width: 64rpx;
						height: 64rpx;
					}

					&.btn-prev {
						border-radius: 2px 0 0 2px;
						border-right: 0;
					}

					&.btn-next {
						border-radius: 0 2px 2px 0;
					}
				}
			}
		}

		.body {
			.weeks {
				display: flex;
				font-size: 30upx;
				padding: 140upx 0 20upx;

				.week-item {
					flex: 1;
					text-align: center;
				}
			}

			.day-list {
				display: flex;
				flex-wrap: wrap;

				.day-item {
					display: flex;
					justify-content: center;
					flex-direction: column;
					width: 14.285%;
					text-align: center;
					padding: 10upx 0;
					font-size: 36upx;

					&.current-month-day {
						color: #B6B6B6;
					}

					&.checked {
						
						.date-reward {
							position: relative;
							width: 76rpx;
							height: 76rpx;
							line-height: 76rpx;
							background: rgba(255, 37, 98, 0.08);
							border: 2rpx solid #FF2562;
							
							.checked-view {
								position: absolute;
								top: 0;
								right: 0;
								width: 38rpx;
								height: 24rpx;
								background-color: #FF2562;
								border-radius: 0rpx 17rpx 0rpx 12rpx;
								
								image {
									position: absolute;
									top: 2rpx;
									right: 9rpx;
									width: 20rpx;
									height: 20rpx;
								}
							}
							
						}

						.text {
							color: #FF2562;
						}
					}
				}
			}
		}
	}
	
	.day {
		font-size: 24upx;
		color: #bcbcbd;
	}
	
	.date-reward {
		width: 80rpx;
		height: 80rpx;
		margin: 0 auto;
		background-color: #F9F9F9;
		text-align: center;
		font-size: 26rpx;
		border-radius: 20rpx;
		line-height: 80rpx;
	}
	
	
</style>
