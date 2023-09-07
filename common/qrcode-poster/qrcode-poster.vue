<template>
	<view class="content" v-if="isShow" @click.stop="isShow=false">
		<canvas @click.stop="" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="my-canvas"></canvas>
		<view class="save-btn" @click.stop="saveImage">保存图片</view>
	</view>
</template>

<script>
	export default {
		props: {
			goodsInfo: Object, // 商品信息
			headerImg: String, // 商品主图
		},
		data() {
			return {
				canvasW: 0,
				canvasH: 0,
				ctx: null,
				isShow: false,
				qrcode: '',
			}
		},
		methods: {
			//显示
			showCanvas(qrcode) {
				this.isShow = true
				this.qrcode = qrcode
				// 绘制画布
				this.__init() 
			},
			// 商品初始化画布
			async __init() {
				uni.showLoading({
					title: '海报生成中',
					mask: true
				})
				this.ctx = uni.createCanvasContext('my-canvas', this)
				this.canvasW = uni.upx2px(540);
				this.canvasH = uni.upx2px(850);
				//设置画布背景透明
				this.ctx.setFillStyle('rgba(255, 255, 255, 0)')
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18), '#FFFFFF')
				
				// goods benner
				let bennerImg = await this.getImageInfo(this.headerImg)
				this.drawRoundImg(this.ctx, bennerImg.path, 0, 0, uni.upx2px(540), uni.upx2px(400), uni.upx2px(0))
				
				// 售价背景
				let priceBg = await this.getImageInfo(this.config.imgUrl + '/priceBg.png')
				this.drawRoundImg(this.ctx, priceBg.path, 0, uni.upx2px(400), uni.upx2px(540), uni.upx2px(70), uni.upx2px(0))
				
				let hW = uni.upx2px(500);
				let hH = uni.upx2px(420);
				
				let point = this.goodsInfo.usePoint.toString()
				let price = this.goodsInfo.salePrice
				
				if(this.goodsType(this.goodsInfo) === 1){
					// 绘制售价
					this.ctx.setFontSize(14);
					this.ctx.setFillStyle('#FFFFFF');
					this.ctx.fillText('￥', (uni.upx2px(20)), (uni.upx2px(450)))
					this.ctx.setFontSize(25);
					this.ctx.fillText(price, (uni.upx2px(45)), (uni.upx2px(450)))
					
					// 参考价
					let marketPrice = '￥' + this.goodsInfo.marketPrice
					let priceLength = JSON.stringify(price).length
					this.ctx.setFontSize(14);
					this.ctx.setFillStyle('#DDDDDD');
					this.ctx.fillText(marketPrice, (uni.upx2px(45) + (priceLength * 16)), (uni.upx2px(450)))
					
					// 参考价划线
					this.drawSolidLine(this.ctx, (uni.upx2px(45) + (priceLength * 16) - 1), uni.upx2px(442), (uni.upx2px(45) + (priceLength * 16) + (marketPrice.length * 11)), uni.upx2px(442))
				}else if(this.goodsType(this.goodsInfo) === 2){
					// 绘制积分
					this.ctx.setFillStyle('#FFFFFF');
					this.ctx.setFontSize(25);
					this.ctx.fillText(point, (uni.upx2px(20)), (uni.upx2px(450)))
					this.ctx.fillText('积分',((point.length * 16) + (uni.upx2px(25))), (uni.upx2px(450)))
					
					// 参考价
					let pointLength = JSON.stringify(point).length
					let marketPrice = '￥' + this.goodsInfo.marketPrice
					this.ctx.setFontSize(14);
					this.ctx.setFillStyle('#DDDDDD');
					this.ctx.fillText(marketPrice, (uni.upx2px(75) + (pointLength * 16)), (uni.upx2px(450)))
					
					// 参考价划线
					this.drawSolidLine(this.ctx, (uni.upx2px(75) + (pointLength * 16) - 1), uni.upx2px(442), (uni.upx2px(75) + (pointLength * 16) + (marketPrice.length * 16)), uni.upx2px(442))
					
				}else if(this.goodsType(this.goodsInfo === 3)){
					
					this.ctx.setFillStyle('#FFFFFF')
					this.ctx.setFontSize(16);
					this.ctx.fillText(point, (uni.upx2px(20)), (uni.upx2px(450)))
					this.ctx.fillText('积分',((point.length * 9) + (uni.upx2px(20))), (uni.upx2px(450)))
					
					// 绘制售价
					this.ctx.setFontSize(14);
					// this.ctx.fillText('￥', (uni.upx2px(20)), (uni.upx2px(450)))
					price = '￥' + price
					this.ctx.setFillStyle('#FFFFFF');
					this.ctx.setFontSize(16);
					this.ctx.fillText(price, (uni.upx2px(90) + (point.length * 9)), (uni.upx2px(450)))
					
					// 参考价
					let marketPrice = '￥' + this.goodsInfo.marketPrice
					let priceLength = JSON.stringify(price).length
					let pointLength = JSON.stringify(point).length
					let length = priceLength + pointLength
					this.ctx.setFontSize(13);
					this.ctx.setFillStyle('#DDDDDD');
					this.ctx.fillText(marketPrice, (uni.upx2px(20) + (length * 9.5)), (uni.upx2px(450)))
					
					// 参考价划线
					this.drawSolidLine(this.ctx, (uni.upx2px(20) + (length * 9.5) - 1), uni.upx2px(442), (uni.upx2px(20) + (length * 9.5) + (marketPrice.length * 9.5)), uni.upx2px(442))
				}
				
				// // 绘制售价
				// let price = this.goodsInfo.salePrice
				// this.ctx.setFontSize(14);
				// this.ctx.setFillStyle('#FFFFFF');
				// this.ctx.fillText('￥', (uni.upx2px(20)), (uni.upx2px(450)))
				// this.ctx.setFontSize(25);
				// this.ctx.fillText(price, (uni.upx2px(45)), (uni.upx2px(450)))
				
				// // 参考价
				// let marketPrice = '￥' + this.goodsInfo.marketPrice
				// let priceLength = JSON.stringify(price).length
				// this.ctx.setFontSize(14);
				// this.ctx.setFillStyle('#DDDDDD');
				// this.ctx.fillText(marketPrice, (uni.upx2px(45) + (priceLength * 16)), (uni.upx2px(450)))
				
				// // 参考价划线
				// this.drawSolidLine(this.ctx, (uni.upx2px(45) + (priceLength * 16) - 1), uni.upx2px(442), (uni.upx2px(45) + (priceLength * 16) + (marketPrice.length * 11)), uni.upx2px(442))
				
				// // 库存
				// let surplus = '剩余：' + this.goodsInfo.stockQuantity + '份'
				// this.ctx.setFontSize(14);
				// this.ctx.setFillStyle('#FFFFFF');
				// this.ctx.fillText(surplus, (uni.upx2px(540) - uni.upx2px((surplus.length * 24) + 20)), (uni.upx2px(445)))
				
				// 库存
				let surplus = '剩余：' + this.goodsInfo.stockQuantity + '份'
				// let surplus = '剩余：' + '100' + '份'
				this.ctx.setFontSize(14);
				this.ctx.setFillStyle('#FFFFFF');
				this.ctx.fillText(surplus, (uni.upx2px(540) - uni.upx2px((surplus.length * 24) + 20)), (uni.upx2px(445)))
				
				
				// 商品标题
				let goodsName = this.goodsInfo.name
				if (goodsName.length >= 13) {
					goodsName = goodsName.substring(0, 13) + '...'
				}
				this.ctx.setFontSize(18);
				this.ctx.setFillStyle('#333333');
				this.ctx.fillText(goodsName, (uni.upx2px(20)), (uni.upx2px(525)))
				
				// 限购
				let limit = '每人每日限购' + this.goodsInfo.limitCount + '个，每人总限购' + this.goodsInfo.sumLimitCount + '个'
				this.ctx.setFontSize(12);
				this.ctx.setFillStyle('#999999');
				this.ctx.fillText(limit, (uni.upx2px(20)), (uni.upx2px(570)))
				this.ctx.fillText( '活动结束时间：' + this.goodsInfo.endTime, (uni.upx2px(20)), (uni.upx2px(610)))
				
				//绘制虚线
				this.drawDashLine(this.ctx, uni.upx2px(20), uni.upx2px(650), uni.upx2px(540), uni.upx2px(650), 5)
				
				// 左边实心圆
				this.drawEmptyRound(this.ctx, 0, uni.upx2px(650), uni.upx2px(20))
				
				// 右边实心圆
				this.drawEmptyRound(this.ctx, uni.upx2px(540), uni.upx2px(650), uni.upx2px(20))
				
				// 平台名称
				this.ctx.setFontSize(20);
				this.ctx.setFillStyle('#3C3C3C');
				this.ctx.fillText(this.config.appletName, (uni.upx2px(20)), (uni.upx2px(730)))
				
				// 提示文案
				this.ctx.setFontSize(13);
				this.ctx.setFillStyle('#999999');
				this.ctx.fillText('长按识别小程序二维码 →', (uni.upx2px(20)), (uni.upx2px(780)))
				
				// 小程序码
				let qrcodeImg = await this.getImageInfo(this.qrcode)
				this.ctx.drawImage(qrcodeImg.path, uni.upx2px(355), uni.upx2px(680), uni.upx2px(150), uni.upx2px(150))
				// // 延迟渲染
				setTimeout(() => {
					this.ctx.draw(true, () => {
						uni.hideLoading()
					})
				}, 500)
			},
			// 行文本换行
			drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
				let lineWidth = 0;
				let lastSubStrIndex = 0; //每次开始截取的字符串的索引
				for (let i = 0; i < str.length; i++) {
					lineWidth += ctx.measureText(str[i]).width;
					if (lineWidth > canvasWidth) {
						ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
						initHeight += 22; //22为 文字大小20 + 2
						lineWidth = 0;
						lastSubStrIndex = i;
						titleHeight += 22;
					}
					if (i == str.length - 1) { //绘制剩余部分
						ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
					}
				}
				// 标题border-bottom 线距顶部距离
				titleHeight = titleHeight + 10;
				return titleHeight;
			},
			// 绘制门店背景图
			storeBgColor(ctx, x, y, color, radius) {
				ctx.save();
				ctx.setFillStyle(color);
				ctx.fillRect(x, y, 255, 100);
				ctx.closePath();
			},
			//绘制实心圆
			drawEmptyRound(ctx, x, y, radius) {
				ctx.save()
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
				ctx.setFillStyle('rgba(0, 0, 0, .4)')
				ctx.fill();
				ctx.restore()
				ctx.closePath()
			},
			//绘制虚线
			drawDashLine(ctx, x1, y1, x2, y2, dashLength) {
				ctx.setStrokeStyle("#cccccc") //设置线条的颜色
				ctx.setLineWidth(1) //设置线条宽度
				var dashLen = dashLength,
					xpos = x2 - x1, //得到横向的宽度;
					ypos = y2 - y1, //得到纵向的高度;
					numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
				//利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
				for (var i = 0; i < numDashes; i++) {
					if (i % 2 === 0) {
						ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
						//有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
					} else {
						ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
					}
				}
				ctx.stroke();
			},
			// 绘制实线
			drawSolidLine(ctx, x1, y1, x2, y2) {
				ctx.setStrokeStyle("#cccccc") //设置线条的颜色
				ctx.setLineWidth(1) //设置线条宽度
				ctx.moveTo(x1, y1)
				ctx.lineTo(x2, y2)
				ctx.stroke();
			},
			//带圆角图片
			drawRoundImg(ctx, img, x, y, width, height, radius) {
				ctx.beginPath()
				ctx.save()
				// 左上角
				// ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
				// 右上角
				// ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
				// 右下角
				// ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5)
				// 左下角
				// ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI)
				// ctx.stroke()
				// ctx.clip()
				ctx.drawImage(img, x, y, width, height);
				ctx.restore()
				ctx.closePath()
			},
			//圆角矩形
			drawRoundRect(ctx, x, y, width, height, radius, color) {
				ctx.save();
				ctx.beginPath();
				ctx.setFillStyle(color);
				ctx.setStrokeStyle(color)
				ctx.setLineJoin('round'); //交点设置成圆角
				ctx.setLineWidth(radius);
				ctx.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius);
				ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2);
				ctx.stroke();
				ctx.closePath();
			},
			//获取图片
			getImageInfo(imgSrc) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgSrc,
						success: (image) => {
							resolve(image);
						},
						fail: (err) => {
							reject(err);
							console.log(err)
							uni.hideLoading()
							this.isShow = false
						}
					});
				});
			},
			//保存图片到相册
			saveImage() {
				//判断用户授权
				uni.getSetting({
					success(res) {
						if (Object.keys(res.authSetting).length > 0) {
							//判断是否有相册权限
							if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
								//打开设置权限
								uni.openSetting({
									success(res) {
										console.log('设置权限', res.authSetting)
									}
								})
							} else {
								if (!res.authSetting['scope.writePhotosAlbum']) {
									//打开设置权限
									uni.openSetting({
										success(res) {
											console.log('设置权限', res.authSetting)
										}
									})
								}
							}
						} else {
							return
						}
					}
				})
				var that = this
				uni.canvasToTempFilePath({
					canvasId: 'my-canvas',
					quality: 1,
					complete: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res) {
								uni.showToast({
									title: '已保存到相册',
									icon: 'success',
									duration: 2000
								})
								setTimeout(() => {
									that.isShow = false
								}, 2000)
							}
						})
					}
				}, this);
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .4);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 200;

		.save-btn {
			margin-top: 35rpx;
			color: #FFFFFF;
			background: linear-gradient(to right, #FE726B, #FE956B);
			padding: 15rpx 40rpx;
			border-radius: 50rpx;
		}
	}
</style>
