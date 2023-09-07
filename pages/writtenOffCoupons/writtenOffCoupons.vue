<template>
	<view>
		<!-- 订单编号 / 订单金额 -->
		<view class="text-input">
			<view class="">订单编号: </view>
			<input type="text" v-model="orderId" :disabled="isInput" placeholder="请输入订单编号" />
		</view>
		<view class="text-input">
			<view class="">订单金额: </view>
			<input type="text" v-model="orderMoney" maxlength="20" :disabled="isInput" placeholder="请输入订单金额" @input="setMoney" />
		</view>
		
		<view class="coupon-list">
			<view class="coupon-item" v-for="(item, index) in couponCodeInfoList">
				<view class="coupon-code">
					<text>{{ item.facevalue }}</text>
					<text v-if="item.type == '01' || item.type == '03'">元</text>
					<text v-if="item.type == '02'">次</text>
					<text v-if="item.type == '04'">折</text>
					<text class="coupon-name">{{ item.couponTemplateName }}</text>
				</view>
				<view class="coupon-code">{{ item.couponNo }}</view>
			</view>
		</view>
		
		<view class="add-coupon-but" @click="addCoupons">添加优惠券</view>
		
		<view style="height: 150rpx;"></view>
		<view class="write-off-but">
			<view @click="couponsWriteOff">{{ money.length >= 1 ? '核销金额：' + money + '元 ' : '立即核销' }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isInput: false, // 是否禁用输入框，添加优惠券后禁用
				couponCodeList: [], // 券编码集合
				couponCodeInfoList: [], // 券集合
				orderMoney: '', // 订单金额
				money: '', // 金额
				orderId: '', // 订单编号
			}
		},
		methods: {
			// setMoney
			setMoney(event) {
				this.money = event.detail.value
			},
			// 添加优惠券
			addCoupons() {
				let that = this
				if(that.orderId.length <=0) {
					return uni.showToast({
						title: '请输入订单编号',
						icon: 'none'
					})
				}
				if(that.money.length <=0) {
					return uni.showToast({
						title: '请输入订单金额',
						icon: 'none'
					})
				}
				uni.showLoading({
					title: '添加中',
					mask: true
				})
				uni.scanCode({
					success(res) {
						let data = res.result
						// 校验券是否可用
						that.checkCoupon(data)
						
						uni.hideLoading()
					},
					fail() {
						uni.hideLoading()
					}
				})
			},
			// 校验券是否可用
			checkCoupon(event) {
				let that = this
				that.request({
					url: that.config.checkCoupon,
					data: {
						couponNo: event,
						money: that.money
					}
				}).then(res => {
					if(res.statusCode == 200 && res.data.isuse) {
						let data = res.data
						// 校验是否有重复券
						for (let i in that.couponCodeInfoList) {
							if(that.couponCodeInfoList[i].couponNo == data.couponInfo.couponNo) {
								return uni.showToast({
									title: '使用重复券',
									icon: 'none'
								})
								break;
							}
						}
						if(data.couponInfo.type == '02') {
							// 计次券修改整数
							data.couponInfo.facevalue = Number(data.couponInfo.facevalue).toFixed(0)
						} else if(data.couponInfo.type == '04') {
							// 折扣券修改面值格式
							data.couponInfo.facevalue = data.couponInfo.facevalue / 10
						}
						// 添加券
						that.couponCodeList.push(event)
						that.couponCodeInfoList.push(data.couponInfo)
						// 修改金额
						that.money = data.amount
						// 禁用输入框
						if(!that.isInput) {
							that.isInput = true
						}
					} else {
						uni.showToast({
							title: res.data.reason,
							icon: 'none'
						})
					}
				})
			},
			// 删除优惠券
			deleteCoupon(index) {
				let that = this
				uni.showModal({
				    title: '提示',
				    content: '确认删除此优惠券？',
				    success: function (res) {
				        if (res.confirm) {
							let couponCodeList = JSON.stringify(that.couponCodeList)
							couponCodeList = JSON.parse(couponCodeList)
							couponCodeList.splice(index, 1)
							that.couponCodeList = couponCodeList
				        }
				    }
				});
			},
			// 券核销
			couponsWriteOff() {
				let that = this
				if(that.couponCodeList.length <=0) {
					return uni.showToast({
						title: '先添加优惠券',
						icon: 'none'
					})
				}
				if(that.orderId.length <=0) {
					return uni.showToast({
						title: '请输入订单编号',
						icon: 'none'
					})
				}
				if(that.money.length <=0) {
					return uni.showToast({
						title: '请输入订单金额',
						icon: 'none'
					})
				}
				uni.showModal({
				    title: '核销',
				    content: '确认核销此券？',
				    success: function (res) {
				        if (res.confirm) {
							that.request({
								url: that.config.couponsWriteOff,
								method: 'PUT',
								header: {
									'Content-Type': 'application/json'
								},
								data: {
									orderId: that.orderId,
									couponCodeList: that.couponCodeList,
									channel: that.config.companyCode.channelCode,
									terminal: that.config.companyCode.terminalCode
								}
							}).then(res => {
								let data = res.data
								if(res.statusCode == 200 && data.status) {
									that.isInput = false
									that.couponCodeList = [] // 券编码集合
									that.couponCodeInfoList = [] // 券集合
									that.money = '' // 金额
									that.orderMoney = '' // 订单金额
									that.orderId = '' // 订单编号
									uni.showToast({
										title: '核销成功',
										icon: 'success'
									})
								} else {
									uni.showToast({
										title: data.loserReason,
										icon: 'none'
									})
								}
							})
				        }
				    }
				});
			},
		}
	}
</script>

<style>
	.text-input {
		display: flex;
		margin: 30rpx 30rpx;
	}
	
	.text-input view {
		width: 120rpx;
		color: #333333;
		font-size: 26rpx;
		line-height: 50rpx;
	}
	
	.text-input input {
		width: 550rpx;
		height: 50rpx;
		margin-left: 20rpx;
		border-bottom: 2rpx solid #bababb;
		font-size: 26rpx;
		line-height: 50rpx;
	}
	
	.coupon-list {
		margin: 50rpx 30rpx;
	}
	
	.coupon-item {
		/* display: flex; */
		/* justify-content: space-between; */
		/* height: 100rpx; */
		margin: 0 0 20rpx;
		/* border-bottom: 2rpx solid #bababb; */
		padding: 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.coupon-code {
		line-height: 50rpx;
		font-size: 28rpx;
		color: #333333;
	}
	
	.coupon-code .coupon-name {
		margin-left: 30rpx;
	}
	
	.add-coupon-but {
		margin: 30rpx 30rpx;
		height: 80rpx;
		background-color: #EB8F79;
		border-radius: 10rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		text-align: center;
		line-height: 80rpx;
	}
	
	.write-off-but {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 150rpx;
		background-color: #FFFFFF;
	}
	
	.write-off-but>view {
		margin: 20rpx 30rpx 0;
		height: 80rpx;
		background-color: #EB8F79;
		border-radius: 10rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		text-align: center;
		line-height: 80rpx;
	}

</style>
