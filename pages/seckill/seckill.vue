<template>
	<view>
		
		<yp-seckill-commodity :commoditys="commoditys" @change="goDetails"></yp-seckill-commodity>
		
		<view class="moreGoods" v-if="toEnd && commoditys.length >= 1">- 更多好物，敬请期待 -</view>
		
		<!-- 无秒杀活动 -->
		<view class="not-activity" v-if="total == 0">
			<image :src="imgUrl + '/notLuckDraw-icon.png'" mode=""></image>
			<view>请持续关注下期秒杀活动</view>
		</view>
		
	</view>
</template>

<script>
	import ypSeckillCommodity from '@/components/ui-components/yp-seckill-commodity/yp-seckill-commodity.vue'
	export default {
		data() {
			return {
				toEnd: false, // 是否到底
				imgUrl: this.config.imgUrl,
				commoditys: [], // 秒杀商品
				total: 1, // 条数
				pageIndex: 1, // 页数
			}
		},
		components: {
			ypSeckillCommodity
		},
		onLoad() {
			// 获取秒杀商品
			this.getCommoditys()
		},
		// 上拉动作
		onReachBottom() {
			if(!this.toEnd) {
				this.pageIndex++
				this.getCommoditys()
			}
		},
		methods: {
			// 获取秒杀商品
			getCommoditys() {
				let that = this
				that.request({
					url: that.config.getSecKill,
					data: {
						pageIndex: that.pageIndex,
						pageSize: '20'
					}
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) return
					let data = res.data
					that.total = data.total
					that.commoditys = [...that.commoditys, ...data.data]
					// 列表到底
					if(that.total <= that.commoditys.length) {
						this.toEnd = true
					}
				})
			},
			// 去详情
			goDetails(event) {
				uni.navigateTo({
					url: '../goodsDetails/goodsDetails?id=' + event.id + '&isShow=' + event.isShow
				})
			}
		}
	}
</script>

<style>
	
	.moreGoods {
		height: 100rpx;
		text-align: center;
		font-size: 20rpx;
		font-weight: 500;
		color: #999999;
		line-height: 60rpx;
	}
	
	.not-activity {
		width: 350rpx;
		margin: 40% auto 0;
	}
	
	.not-activity>image {
		display: block;
		width: 176rpx;
		height: 180rpx;
		margin: 0 auto 0;
	}
	
	.not-activity>view {
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		line-height: 40rpx;
	}

</style>
