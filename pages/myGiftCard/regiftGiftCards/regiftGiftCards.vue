<template>
	<view class="">
		<view class="content">
			<u-form :model="form" ref="uForm">
				<view class="text-contene">
					<u-input v-model="myPhone" height="90" :disabled="true" />
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-input">
						<u-form-item prop="SMSCode" label-position="top">
							<u-input v-model="form.SMSCode" type="number" placeholder='请输入短信验证码' :clearable="false" maxlength='6' height="60" />
						</u-form-item>
					</view>
					<view class="">
						<view class="bottom-Code" @tap="getCode">
							{{tips}}
						</view>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="text-contene">
					<u-form-item prop="VipCardNumber" label-position="top">
						<u-input v-model="form.VipCardNumber" placeholder='输入转赠会员卡号或手机号' height="60" />
					</u-form-item>
				</view>
				<u-line color="#EEEEEE" />
				<view class="text-contene">
					<u-form-item prop="realName" label-position="top">
						<u-input v-model="form.realName" placeholder='输入会员真实姓名' maxlength='20' height="60" />
					</u-form-item>
				</view>
			</u-form>
		</view>
		<view class="annotation">
			<u-icon name="error-circle" color="#ED6D46" size="25"></u-icon>
			<text>注：转赠会员账号或手机号必须与真实姓名相匹配 </text>
		</view>
		<view class="bottom-button">
			<view class="bottom-determine" @tap="$u.throttle(saveMassage, 1000)">确定</view>
			<view class="bottom-cancel" @click="cancelTransfer">取消</view>
		</view>
		<!-- 获取验证码 -->
		<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange"></u-verification-code>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				myPhone: '', //手机号
				giftCardId: '', //礼品卡id
				form: {
					SMSCode: '', //短信验证码
					VipCardNumber: '', //会员卡号或手机号
					realName: '', //会员真实姓名
				},
				rules: {
					SMSCode: [{
						required: true,
						message: '请输入短信验证码',
						trigger: ['change', 'blur'],
					}],
					realName: [{
						required: true,
						message: '请输入真实姓名',
						trigger: 'blur',
					}, ],
					VipCardNumber: [{
						required: true,
						message: '输入转赠会员卡号或手机号',
						trigger: 'blur',
					}],
				},
				tips: '',
				// refCode: null,
				seconds: 60,
				show: false, //打开模拟框

			}
		},
		onLoad(options) {
			let option = JSON.parse(options.cardData)
			this.giftCardId = option.id
			let memberInfo = uni.getStorageSync('memberInfo')
			this.myPhone = memberInfo.phone
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			/* 获取验证码 */
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})

					let that = this
					that.request({
						url: that.config.verificationCodes + this.myPhone
					}).then(res => {
						let data = res.data
						if (res.statusCode == 200 && data.message != '系统错误') {
							uni.showModal({
							    content: '您的验证码为：' + data,
								showCancel: false,
								confirmText: '知道了',
							    success: function (res) {}
							});
							this.show = !this.show
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						} else {
							uni.showToast({
								title: data.detail,
								icon: 'none'
							})
						}
					})
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},

			/* 转赠礼品卡 */
			saveMassage() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.turnAddCar()
					} else {
						return
					}
				});
			},
			turnAddCar() {
				let that = this
				that.request({
					url: that.config.turnAddCar,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: {
						giftCardId: that.giftCardId, //礼品卡Id
						phone: that.myPhone, //当前会员绑定的手机号
						verificationCode: that.form.SMSCode, //短信验证码
						receiverInfo: that.form.VipCardNumber, //转赠接收人的会员卡号或者手机号
						receiverRealName: that.form.realName //转赠接收人的真实姓名
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200) {
						uni.showToast({
							title: '转赠成功',
							icon: 'success'
						})
						// 重置
						that.form = {
							SMSCode: '', //短信验证码
							VipCardNumber: '', //会员卡号或手机号
							realName: '', //会员真实姓名
						}
						// 刷新上一页我的礼品卡页
						uni.setStorageSync('isRefresh', '2')
						uni.navigateBack()
					} else {
						uni.showToast({
							title: data.detail,
							icon: 'none'
						})
					}
				})
			},
			// 取消转赠  返回上一页
			cancelTransfer() {
				uni.navigateBack()
			},
		},
	}
</script>

<style lang="less">
	page {
		font-size: 28rpx;
		background-color: #EFF5F8;
	}

	.content {
		background-color: #FFFFFF;
		padding: 0 20rpx;
	}

	.content-text {
		display: flex;
	}

	.text-input {
		width: 490rpx;

	}

	.bottom-Code {
		margin: 20rpx auto;
		width: 200rpx;
		height: 50rpx;
		background-color: #ED6D46;
		border-radius: 10rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
	}

	.annotation {
		color: #ED6D46;
		font-size: 22rpx;
		margin: 20rpx;
		width: 710rpx;

		text {
			margin-left: 10rpx;
		}
	}

	.bottom-button {
		position: fixed;
		bottom: 0;
		display: flex;
		margin: 20rpx 10rpx 100rpx;

		view {
			margin: 0 10rpx;
			width: 345rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			border-radius: 90rpx;
		}
	}

	.bottom-determine {
		background-color: #ED6D46;
		color: #FFFFFF;
	}

	.bottom-cancel {
		background-color: #EFE7E6;
		border: 1rpx solid #ED6D46;
		color: #ED6D46;
	}
</style>
