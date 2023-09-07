<template>
	<view class="content">
		<!-- 商品 banner -->
		<view class="goods-banner">
			<!-- 固定款高 -->
			<swiper class="swiper" id="swiper" :indicator-dots="true" :autoplay="true" :interval="interval" :duration="duration"
			 circular>
				<swiper-item v-for="(item, index) in goods.productImgList" :key="index">
					<image :src="item.url" @click="previewImg(index)" mode="aspectFit"></image>
				</swiper-item>
			</swiper>
			<!-- 商品标题 -->
			<yp-presalegoods :goodsInfo="goods" @change="isShareShow = true"></yp-presalegoods>
		</view>
	
		<!-- 图文详情 -->
		<view class="goods-image" v-if="fullDescription != ''">
			<view class="image-title">
				商品详情
			</view>
			<view class="image-text">
				<u-parse :html="fullDescription"></u-parse>
			</view>
		</view>
	
		<!-- 底部附加 -->
		<view class="bottom"></view>
		
		<!-- 底部操作栏 -->
		<view class="navigation">
			<view v-if="goods.stockQuantity >= 1" class="navigation-but" @click="isShow = true">立即抢购</view>
			<view v-else class="navigation-but navigation-but01">已售罄</view>
			<!-- <view class="navigation-but navigation-but01">未开始</view> -->
		</view>
		
		<!-- 弹出层 -->
		<!-- 商品规格 -->
		<u-popup v-model="isShow" mode="bottom" :closeable="true">
			<yp-specs :goodsInfo="goods" @offLogin="offLogin" :headerImg="goodsMainImg" @change="setIsShow"></yp-specs>
		</u-popup>
		
		<!-- 分享 -->
		<u-popup v-model="isShareShow" mode="bottom" :mask="false">
			<view class="share-popup">
				<view class="share-cont">
					<view class="share-poster">
						<button class="send-friend" open-type="share">
							<image src="../../static/goods/send.png" mode=""></image>
							<view class="share">发送给朋友</view>
						</button>
					</view>
					<view class="share-poster" @tap="createCanvasImageEvn">
						<image src="../../static/goods/poster.png" mode=""></image>
						<view class="share">生成海报</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 海报分享 -->
		<qrcode-poster ref="poster" :isActivity="1" :goodsInfo="goods" :headerImg="goodsMainImg"></qrcode-poster>
		
	</view>
</template>

<script>
	import ypPresalegoods from '../../components/ui-components/yp-presalegoods/yp-presalegoods.vue'
	import ypNavigation from '../../components/ui-components/yp-navigation/yp-navigation.vue'
	import ypSpecs from '../../components/ui-components/yp-specs/yp-specs.vue'
	import qrcodePoster from '../../common/qrcode-poster/qrcode-poster.vue'
	import request from '../../utils/request'
	export default {
		data() {
			return {
				isShow: false, // 是否显示规格弹窗
				isShareShow: false, // 是否显示分享弹窗
				interval: 5000,
				duration: 500,
				goods: {}, // 商品信息
				goodsMainImg: '', // 商品主图
				fullDescription: '', // 商品图文详情
			}
		},
		components: {
			ypNavigation,
			ypSpecs,
			qrcodePoster,
			ypPresalegoods
		},
		onLoad(options) {
			// 登录校验
			if(!uni.getStorageSync('token')) {
				return uni.redirectTo({
					url: '../startUp/startUp?isEntrance=02'
				})
			}
			console.log(options);
			setTimeout(()=> {
				this.isShow = options.isShow == 2 ? true : false
			}, 1000)
			// 获取商品详情
			if(options.id) {
				this.getGoodsInfo(options.id)
			}
			// 接受海报分享
			if(options.scene) {
				this.getGoodsInfo(options.scene)
			}
		},
		methods: {
			// 获取券活动详情
			getGoodsInfo(id) {
				let that = this
				that.request({
					url: that.config.getActivityInfo + id,
				}).then(res => {
					console.log(res);
					if(res.statusCode != 200) {
						return uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
					}
					let data = res.data.data
					that.goods = data
					data.productImgList.forEach(item => {
						if(item.mainPicture) {
							that.goodsMainImg = item.url
						}
					})
					that.fullDescription = data.fullDescription.replace(/iframe/g, "img") // 替换iframe标签
				})
			},
			// 预览
			previewImg(index) {
				let current = this.goods.productImgList
				let url = []
				for (let i in current) {
					url.push(current[i].url)
				}
				uni.previewImage({
					current: index,
					urls: url
				})
			},
			// 关闭规格弹窗
			setIsShow() {
				this.isShow = false
			},
			// 分享给朋友
			onShareAppMessage(res) {
				console.log(this.goods)
				this.isShareShow = false
				let title = this.goods.name
				if (title.length > 7) {
					let titles = title.substring(0, 7)
					title = titles + '...'
				}
				const goods = this.goods
				let obj = {
					title: title + '    ' + '￥' + this.goods.salePrice,
					path: 'pages/goodsDetails/goodsDetails?id=' + this.goods.id
				}
				if(goods.usePoint === 0 && goods.salePrice > 0){
					// 用余额支付
					obj.title = title + '    ' + '￥' + this.goods.salePrice
				}else if(goods.usePoint > 0 && goods.salePrice > 0){
					// 用积分 + 余额支付
					obj.title = title + '    ' + goods.usePoint + '积分+' + '￥' + this.goods.salePrice  
				}else if(goods.usePoint > 0 && goods.salePrice === 0){
					// 用积分兑换
					obj.title = title + '    ' + goods.usePoint + '积分'
				}
				return obj
			},
			// 海报分享
			async createCanvasImageEvn() {
				this.isShareShow = false
				let that = this
				// 生成32位随机码
				// let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				// let maxPos = chars.length
				// let pwd = ''
				// for (let i = 0; i < 32; i++) {
				// 	pwd += chars.charAt(Math.floor(Math.random() * maxPos))
				// }

				// console.log(that.goods.id)
				
				uni.showLoading({
					title: '海报生成中',
					mask: true
				})
				const {data} = await that.request({
					url:that.config.getQrCodeById,
					method:'POST',
					data:{
						page:'pages/goodsDetails/goodsDetails',
						scene:that.goods.id,
						env_version:that.config.env_version,
						check_path:true,
					}
				})
				// return
				const imgUrl = data.data
				// 接口返回图片是base64编码格式,需要转ArrayBuffer后暂存到本地，getImageInfo 才能获取到图片信息
				const arrBuffer = uni.base64ToArrayBuffer(imgUrl)	// base64转ArrayBuffer
				const fsm = wx.getFileSystemManager()
				const filePath = `${wx.env.USER_DATA_PATH}/share_base64src.jpg`;
				fsm.writeFile({	
					filePath,
					data:arrBuffer,
					success:res=>{
						// 生成海报
						that.$refs.poster.showCanvas(filePath)
					},
					fail:err=>{
						return uni.showToast({
							title: '海报生成失败',
							icon: 'none'
						})
					},
					complete:()=>{
						uni.hideLoading()
					}
				})
				
				return 
				
				// 云函数 弃用
				wx.cloud.init()
				wx.cloud.callFunction({
					name: that.config.cloudName,
					data: {
						page: 'pages/goodsDetails/goodsDetails',
						scene: scene,
						// id: that.goods.id
					},
					success: res => {
						
						let result = res.result
						console.log('result:', res.result);
						if(!result.fileID) {
							return uni.showToast({
								title: '海报生成失败',
								icon: 'none'
							})
						}
						that.$refs.poster.showCanvas(result.fileID)
					},
					fail: err => {
						console.log('失败', err)
						uni.showToast({
							title: '海报生成失败',
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style>
	.content {
		height: 100vh;
	}
	
	swiper {
		z-index: 23;
	}
	
	.swiper {
		height: 600rpx;
	}
	
	.swiper image {
		width: 100%;
		height: 600rpx;
		/* height: auto; */
	}
	
	.wrap {
		height: calc(100vh - 50px);
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.bottom {
		width: 750rpx;
		height: 150rpx;
	}
	
	.goods-banner {
		position: relative;
	}
	
	/* 商品图片 start */
	.goods-image {
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}
	
	.image-title {
		padding: 0 20rpx;
		color: #333333;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 100rpx;
	}
	
	.image-text {
		width: 750rpx;
	}
	
	/* 商品图片 end */
	
	/* 底部操作栏 start */
	.navigation {
		position: fixed;
		bottom: 0;
		width: 750rpx;
		height: 100rpx;
		padding: 30rpx 0;
		background-color: #FFFFFF;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.navigation-but {
		width: 710rpx;
		height: 80rpx;
		margin: 0 20rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 80rpx;
		background: linear-gradient(270deg, #FF4B2B 0%, #FF8F67 100%);
		border-radius: 40px;
	}
	
	.navigation-but01 {
		background: #CCCCCC;
	}
	
	/* 底部操作栏 end */
	
	/* 分享弹出框 start */
	.share-popup{
		height: 275rpx;
		position: relative;
		z-index: 2;
	}
	
	.share-cont {
		padding: 50rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	
	.share-cont image {
		width: 37rpx;
		height: 50rpx;
	}
	
	.send-friend {
		margin: 0;
		padding: 0;
		height: 100rpx;
		line-height: 1.1;
		background-color: #FFFFFF;
	}
	
	.send-friend::after {
		border: none;
	}
	
	.share-poster {
		margin-top: 30rpx;
		text-align: center;
	}
	
	.share {
		font-size: 24rpx;
		line-height: 50rpx;
		color: #333333;
	}
	
	.cancle-share {
		text-align: center;
		margin: 0 20rpx;
		border: 1px solid;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		font-size: 32rpx;
	}
	
	/* 分享弹出框 end */
	
	/* 分享海报 start */
	/* .share {
		position: fixed;
		color: #FFFFFF;
		right: 0;
		bottom: 190rpx;
		background: linear-gradient(to bottom right, #FE726B, #FE956B);
		padding: 10rpx 10rpx 10rpx 20rpx;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		box-shadow: 0 0 20upx rgba(0, 0, 0, .09);
	}
	
	.cancel {
		width: 100vw;
		padding: 30rpx;
		text-align: center;
		background: #FFFFFF;
		color: red;
		font-weight: bold;
		font-size: 30rpx;
	}
	
	.md-content {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 50rpx 0;
	}
	
	.md-content-item {
		margin: 0 70rpx;
		position: relative;
	}
	
	.md-content-item image {
		width: 100rpx;
		height: 100rpx;
	}
	
	.md-content-item view {
		margin-top: 15rpx;
		font-size: 28rpx;
	}
	
	.sharebtn {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	} */
	
	/* 分享海报 end */

</style>
