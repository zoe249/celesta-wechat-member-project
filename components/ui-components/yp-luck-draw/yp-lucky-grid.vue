<template>
	<view>
		<view class="prizes">
			<view class="prize-item" v-for="(item, index) in gridInfo" :key="index">
				<!-- 按钮 -->
				<view class="" v-if="index == 4" @tap="$u.throttle(checkLuckDraw, 1000)">
					<image :src="imgUrl + '/luck-draw-start-but.png'" mode=""></image>
				</view>
				<!-- 奖品 -->
				<view v-else>
					<image v-show="position != index" :src="imgUrl + '/prize-bg.png'" mode=""></image>
					<image v-show="position == index" :src="imgUrl + '/prize-bg-in.png'" mode=""></image>
					<view class="prize-item-info">
						<image :src="item.logo" mode=""></image>
						<view class="">{{ item.text }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isClickBut: true, // 是否可以点击抽奖按钮
				imgUrl: this.config.imgUrl,
				speed: 100, // 转动速度
				position: 0, // 选中位置，抽奖转动更换背景使用 0-3 5-9
				runPosition: 0, // 跑圈位置，抽奖转动使用 0-8
			}
		},
		props: {
			gridInfo: Array,
			winPrizes: Number,
			luckDraws: Object
		},
		mounted() {
			
		},
		methods: {
			// 开始抽奖
			checkLuckDraw() {
				if(!this.isClickBut) return
				this.isClickBut = false
				uni.showLoading({
					mask: true
				})
				// 校验是否支持抽奖
				this.request({
					url: this.config.luckyDrawJudgment + this.luckDraws.id + '/luckyDrawJudgment',
				}).then(res => {
					console.log(res);
					uni.hideLoading()
					if (res.statusCode == 200 && res.data.code == "200000") {
						// 开始抽奖
						this.startLuckDraw()
					} else {
						this.isClickBut = true
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 抽奖开始
			startLuckDraw() {
				let that = this
				// 获取结果
				setTimeout(() => {
					this.$emit('requestResult', true)
				}, 1500)
				this.isClickBut = false
				// 开启动作
				let start = setInterval(() => {
					this.start()
				}, this.speed)
				// 拉取中奖结果
				let getPrize = setInterval(() => {
					if(this.winPrizes != 9999) {
						clearInterval(start)
						clearInterval(getPrize)
						// 寻找停止距离
						let endDistance = 8*3 - this.runPosition + this.winPrizes
						let addStart = setInterval(() => {
							this.start()
						}, 200)
						setTimeout(() => {
							clearInterval(addStart)
							this.speed = 100
							this.$emit('getResult', this.gridInfo[this.position])
							uni.showModal({
							    content: '恭喜抽到：' + that.gridInfo[that.position].text,
								showCancel: false,
								confirmText: '知道了',
							    success: function (res) {
									if (res.confirm) {
										that.isClickBut = true
									}
								}
							});
							this.winPrizes == 9999
						}, endDistance * 200)
					}
				}, 1000)
				// 加速效果
				setTimeout(() => {
					let speed = setInterval(() => {
						this.speed = this.speed - 30
					}, 300)
					setTimeout(() => {
						clearInterval(speed)
					}, 2000)
				}, 1000)
			},
			// 抽奖动作
			start() {
				this.runPosition++
				switch(this.runPosition) {
					case 0:
						this.position = 0
						break;
					case 1:
						this.position = 1
						break;
					case 2:
						this.position = 2
						break;
					case 3:
						this.position = 5
						break;
					case 4:
						this.position = 8
						break;
					case 5:
						this.position = 7
						break;
					case 6:
						this.position = 6
						break;
					case 7:
						this.position = 3
						break;
					case 8:
						this.runPosition = 0
						this.position = 0
						break;
				} 
			}
		}
	}
</script>

<style>
	.prizes {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	
	.prize-item {
		position: relative;
		width: 170rpx;
		height: 170rpx;
		margin: 5rpx;
	}
	
	.prize-item>view>image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.prize-item-info {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.prize-item-info>image {
		display: block;
		width: 70rpx;
		height: 70rpx;
		margin: 30rpx auto 0;
	}
	
	.prize-item-info>view {
		width: 130rpx;
		margin: 0 20rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #F69BAC;
		line-height: 60rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	
	
	
	.item-0 {
		
	}

</style>
