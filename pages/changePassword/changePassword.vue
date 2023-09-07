<template>
	<view class="page">
		<view class="content">
			<u-form :model="form" ref="uForm">
				<view class="content-text">
					<view class="text-name">
						登录账户
					</view>
					<view class="text-contene">
						<u-input v-model="adminValue" height="90" :disabled="true" />
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						原登录密码
					</view>
					<view class="text-contene">
						<u-form-item prop="originalPwd" label-position="top">
							<u-input v-model="form.originalPwd" placeholder='请输入原登录密码' :clearable="false" height="70" />
						</u-form-item>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						新登录密码
					</view>
					<view class="text-contene">
						<u-form-item prop="newPwd" label-position="top">
							<u-input v-model="form.newPwd" placeholder='请输入新登录密码' :clearable="false" height="70" />
						</u-form-item>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						确认登录密码
					</view>
					<view class="text-contene">
						<u-form-item prop="confirmNewPwd" label-position="top">
							<u-input v-model="form.confirmNewPwd" placeholder='确认原登录密码' :clearable="false" height="70" />
						</u-form-item>
					</view>
				</view>
			</u-form>
		</view>
		<view class="bottom-button" @click="changePassword">
			提交
		</view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adminValue: 12345678910, //登录账号
				form: {
					originalPwd: '', //原登录密码
					newPwd: '', //新密码
					confirmNewPwd: '', //确认新密码
				},
				rules: {
					originalPwd: [{
						required: true,
						message: '请输入原登录密码',
						trigger: 'blur',
					}],
					newPwd: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur',
					}, ],
					confirmNewPwd: [{
						required: true,
						message: '请输入确认新密码',
						trigger: 'blur',
					}, ],
				}
			}
		},
		onLoad() {

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			changePassword() {
				var that = this
				if (that.form.originalPwd == '' || that.form.newPwd == '' || that.form.confirmNewPwd == '') {
					return
				}
				if (that.form.newPwd != that.form.confirmNewPwd) {
					this.$refs.uToast.show({
						title: '两次密码输入不一致',
						type: 'error',
					})
					return
				}
				this.$refs.uForm.validate(valid => {
					if (!valid) return
				});
				that.request({
					url: that.config.changePassword,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: {
						code: '',
						oldPassword: '',
						newPassword: ''
					}
				}).then(res => {
					console.log(res.data)
				})
			}
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
		padding: 0 20rpx 20rpx 20rpx;
	}

	.content-text {
		display: flex;
	}

	.text-name {
		padding: 20rpx 0;
		width: 200rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.text-contene {
		width: 500rpx;
	}

	.bottom-button {
		position: fixed;
		bottom: 0;
		margin: 20rpx 20rpx 100rpx;
		width: 710rpx;
		height: 90rpx;
		background-color: #ED6D46;
		border-radius: 90rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 90rpx;
	}

	.u-form-item {
		padding: 0 !important;
	}
</style>
