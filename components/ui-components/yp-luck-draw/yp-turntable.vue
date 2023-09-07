<template>
	<view class="turntable">
		<view class="but" @tap="$u.throttle(checkLuckDraw, 3000)">
			<image class="pic" :src="imgUrl + '/luckDrawGo-but.png'"></image>
		</view>
		<view class="rotateBoard" id="rotateBoard" :style="{ transform: `rotate(${transformView}deg)` }">
			<view v-for="(item, i) in gridInfo" :key="i" class="sector"
				:style="{'transform': `rotate(${item.start}deg) skewY(${item.scale}deg)`, 'background': `${item.colour}`}">
			</view>
			<view class="name" v-for="(item, i) in gridInfo" :key="i"
				:style="{'transform': `rotate(${item.scaleText}deg)`}">
				<view class="">{{item.text}}</view>
				<image class="prize-img" :src="item.url" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				transformView: 0,
				imgUrl: this.config.imgUrl,
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
				// let power = Math.floor(Math.random()*100 + 1); //随机获取一个力量值
				let power = 3000; //随机获取一个力量值
				let jiaodu = 0; // 旋转的角度
				let decline = 0.01; // 衰退
				let timer = setInterval(()=>{
					jiaodu += power;
					this.transformView = jiaodu
					power = (power - power * decline) < decline ? 0 : power - power * decline;
				},10)
				let getPrize = setInterval(() => {
					if(this.winPrizes != 9999) {
						clearInterval(timer);
						clearInterval(getPrize)
						let deg = 360 - jiaodu % 360;
						let nums = this.gridInfo.length;
						for(let i = 0; i < nums; i++){
							if(this.gridInfo[i].start <= deg && deg < this.gridInfo[i].start + this.gridInfo[i].prop*5){
								let index = Math.abs(i + 8 - this.winPrizes)
								let jiaoduIndex = jiaodu
								let jiaoduNum = jiaodu + (360 / 8 * index) + (360 * 2)
								let powerIndex = 10
								let timerIndex = setInterval(()=>{
									jiaoduIndex += powerIndex;
									this.transformView = jiaoduIndex
									if(powerIndex >= 2) {
										powerIndex -= 0.1
									}
									if(jiaoduIndex >= jiaoduNum) {
										clearInterval(timerIndex);
										this.$emit('getResult', this.gridInfo[this.winPrizes])
										uni.showModal({
										    content: '恭喜抽到：' + that.gridInfo[that.winPrizes].name,
											showCancel: false,
											confirmText: '知道了',
										    success: function (res) {
												if (res.confirm) {
													that.isClickBut = true
												}
											}
										});
										this.winPrizes == 9999
									}
								},10)
								break;
							}
						}
					}
				}, 1000)
			},
		}
	}
</script>

<style>
	.turntable {
		position: relative;
		width: 555rpx;
		height: 555rpx;
		margin: 53rpx;
		border-radius: 50%;
		overflow: hidden;
		z-index: 999;
	}

	@keyframes turn {
		0% {
			-webkit-transform: rotate(0deg);
		}

		25% {
			-webkit-transform: rotate(-90deg);
		}

		50% {
			-webkit-transform: rotate(-180deg);
		}

		75% {
			-webkit-transform: rotate(-270deg);
		}

		100% {
			-webkit-transform: rotate(-360deg);
		}
	}

	.rotateBoard {
		width: 555rpx;
		height: 555rpx;
		z-index: 1;
		border-radius: 50%;
		overflow: hidden;
		transform: rotate(0deg);
	}

	.sector {
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 50%;
		transform-origin: 0% 100%;
		text-align: center;
		overflow: hidden;
	}

	.name {
		position: absolute;
		width: 470upx;
		height: 470upx;
		text-align: center;
		margin: 43upx;
		box-sizing: border-box;
		color: #E43B71;
	}
	
	.prize-img {
		width: 60rpx;
		height: 60rpx;
		margin: 20rpx 0;
	}

	.but {
		position: absolute;
		top: calc(50% - 83upx);
		left: calc(50% - 64upx);
		width: 128upx;
		height: 166upx;
		z-index: 2;
	}

	.pic {
		width: 128upx;
		height: 166upx;
		margin-top: -24upx;
	}

	.prizes {
		position: relative;
	}

	.prizes-item {
		position: absolute;
		width: 275rpx;
		height: 275rpx;
		transform-origin: bottom right;
		border: 2rpx solid #000000;
		background-color: #007AFF;
	}
</style>
