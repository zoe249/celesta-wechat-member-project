<template>
	<view>
		<u-count-down v-show="false"  ref="uCountDown" :timestamp="timestamp" :show-days="true" separator="zh" bg-color="#333333"
		 :font-size="26" color="#ffffff" @end="frontEndTime" @change="changeTime"></u-count-down>
		 <view class="count-down">
				<view class="day">
					<text>{{ time.day || '00' }}</text>
					<text>天</text>
				</view>
				<view class="hour">
					<text>{{ time.hour || '00' }}</text>
					<text>时</text>
				</view>
				<view class="min">
					<text>{{ time.min || '00'}}</text>
					<text>分</text>
				</view>
				<view class="seconds">
					<text>{{ time.second || '00' }}</text>
					<text>秒</text>
				</view>
		 </view>
	</view>
</template>

<script>
	export default {
		props:{
			timestamp:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				time:{},
			}
		},
		methods:{
			changeTime(e){
				this.time = this.formatSeconds(e)
			},
			/**
			 * 格式化秒
			 */
			formatSeconds(seconds){
				let time = parseInt(seconds)
				let formatTime = {
					second: 0,
					min: 0,
					hour: 0,
					day: 0,
				}
				if(time > 60){
					formatTime.min = parseInt(time / 60)
					formatTime.second = parseInt(time % 60)
					if(formatTime.min > 60){
						formatTime.hour = parseInt(formatTime.min / 60)
						formatTime.min = parseInt(formatTime.min % 60)
						if(formatTime.hour > 24){
							formatTime.day = parseInt(formatTime.hour / 24)
							formatTime.hour = parseInt(formatTime.hour % 24)
						}
					}
				}
				
				// 拼接修改后的字符串
				let result = ''
				let obj = {}
				// 格式化秒
				if(formatTime.second >= 10){
					 result = ""+parseInt(formatTime.second)+"";
					 obj.second = ""+parseInt(formatTime.second)+""
				}else if(formatTime.second < 10){
					result = "0"+parseInt(formatTime.second)+"";
					obj.second = "0"+parseInt(formatTime.second)+""
				}
				// 格式化分
				if(formatTime.min >= 10){
					result = ""+parseInt(formatTime.min)+":" + result;
					obj.min = ""+parseInt(formatTime.min)+""
				}else if(formatTime.min < 10){
					result = "0"+parseInt(formatTime.min)+":" + result;
					obj.min = "0"+parseInt(formatTime.min)+""
				}
				// 格式化时
				if(formatTime.hour >= 10){
					result = ""+parseInt(formatTime.hour)+":" + result;
					obj.hour = ""+parseInt(formatTime.hour)+""
				}else if(formatTime.hour < 10){
					result = "0"+parseInt(formatTime.hour)+":" + result;
					obj.hour = "0"+parseInt(formatTime.hour)+""
				}
				// 格式化天
				if(formatTime.day >= 10){
					result = ""+parseInt(formatTime.day)+"天" + result;
					obj.day = ""+parseInt(formatTime.day)+""
				}else if(formatTime.day < 10){
					result = "0"+parseInt(formatTime.day)+"天" + result;
					obj.day = "0"+parseInt(formatTime.day)+""
				}
				// return result
				return obj
			},
		}
	}
</script>

<style lang="scss" scoped>
	.count-down{
		display: flex;
		font-size: 30rpx;
		view{
			display: flex;
			align-items: center;
			text{
				display: block;
				&:nth-child(1){
					font-size: 26rpx;
					background-color: #333333;
					color:#fff;
					height: 40rpx;
					width: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 10rpx;
					// padding: 1rpx 10rpx;
					margin: 0 3rpx;
				}
			}
		}
		
		.seconds{
			text{
				&:nth-child(1){
					background: linear-gradient(-45deg, #FF7162 0%, #FF9662 100%) !important
				}
			}
		}
	}
</style>