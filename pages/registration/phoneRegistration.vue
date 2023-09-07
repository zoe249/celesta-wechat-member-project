<template>
	<view class="">
		<!-- 上传头像 -->
		<!-- <view class="top-img" @tap="chooseAvatar"> -->
		<view class="top-img">
			<view class="uploadImg">
				<image :src="avatar" mode="widthFix"></image>
			</view>
			<view class="upload-text">
				点击上传头像
			</view>
		</view>
		
		<view class="content">
			<view class="text-contene">
				<view class="text-input-code">
					<u-input v-model="realName" placeholder='昵称' :clearable="false" height="90" />
				</view>
				<view class="text-gender">
					<!-- <view class="bottom-Code" @click="saveMassage">
						获取验证码
					</view> -->
					<view :class=" genderChoice ? 'choice-0 choice-action' : 'choice-0' " @click="genderChoiceImp(0)">
						先生
					</view>
					<view :class=" genderChoice ? 'choice-1' : 'choice-1 choice-action' " @click="genderChoiceImp(1)">
						女士
					</view>
				</view>
			</view>
			<u-line color="#EEEEEE" />
			<view class="text-contene">
				<u-input v-model="myPhone" placeholder='请输入手机号' height="90" :disabled="false" />
			</view>
			<u-line color="#EEEEEE" />
			<view class="content-text">
				<view class="text-input-code">
					<u-input v-model="SMSCode" placeholder='请输入短信验证码' :clearable="false" height="90" />
				</view>
				<view class="">
					<view class="bottom-Code" @click="saveMassage">
						获取验证码
					</view>
				</view>
			</view>
			<u-line color="#EEEEEE" />
			<!-- <view class="text-contene">
				<u-input v-model="password" placeholder='登录密码' :clearable="false" height="90" />
			</view>
			<u-line color="#EEEEEE" />
			<view class="text-contene">
				<u-input v-model="confirmPassword" placeholder='确认登录密码' :clearable="false" height="90" />
			</view>
			<u-line color="#EEEEEE" /> -->
			
			<!-- <u-line color="#EEEEEE" /> -->
			<!-- <view class="text-contene">
				<view class="text-input">
					<u-action-sheet :list="list" v-model="show" :cancel-btn="false" @click="selectGender" border-radius="20"
					 :safe-area-inset-bottom="true"></u-action-sheet>
					<u-input v-model="gender" placeholder='请选择性别' :clearable="false" :disabled="true" height="90" />
				</view>
				<view class="text-icon" @click="show = true">
					<u-icon name="arrow-right" size="35" height="90"></u-icon>
				</view>
			</view> -->
			<!-- <u-line color="#EEEEEE" /> -->
			<!-- <view class="text-contene">
				<view class="text-input">
					<u-picker mode="time" v-model="showBirthday" :params="params" @confirm="selectBirthday" cancel-color='#FF7162'
					 title='请选择生日' confirm-color='#FF7162'></u-picker>
					<u-input v-model="birthday" placeholder='请选择生日' :clearable="false" :disabled="true" height="90" />
				</view>
				<view class="text-icon" @click="showBirthday = true">
					<u-icon name="arrow-right" size="35" height="90"></u-icon>
				</view>
			</view> -->
		</view>
		<!-- <view class="agreement">
			<u-checkbox-group active-color="#FF7162">
				<u-checkbox v-model="checked" shape="circle" :icon-size="28" :label-size="25">
					我已阅读并同意以下协议，接收免除或限制责任，诉讼管辖约定等条款，同意同步账户
				</u-checkbox>
			</u-checkbox-group>
		</view> -->
		<view class="bottom-button" @click="saveMassage">
			提交
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'), // 获取微信用户信息
				avatar: '', //头像
				myPhone: '', //手机号
				SMSCode: '', //短信验证码
				password: '', //登录密码
				confirmPassword: '', //确认登录密码
				realName: '', //会员真实姓名
				show: false, //展开选择性别
				gender: '0', //性别
				genderChoice: '', //性别选择
				birthday: '', //生日
				showBirthday: false, //展开选择生日
				checked: false, //协议选择按钮
				list: [{
					text: '男',
					color: '#FF7162'
				}, {
					text: '女',
					color: '#FF7162'
				}],
				params: {
					year: true,
					month: true,
					day: true,
				},
			}
		},
		onLoad() {
			// 
			this.avatar = this.userInfo.avatarUrl
			this.gender = this.userInfo.gender
			/* 选择性别 */
			this.selectGender(this.gender)
		},
		methods: {
			/* 选择性别 */
			selectGender(e) {
				if (e == 0) {
					this.genderChoice = true
				} else {
					this.genderChoice = false
				}
			},
			genderChoiceImp(e) {
				if (e == 0) {
					this.gender = 0
					this.genderChoice = true
				} else {
					this.gender = 1
					this.genderChoice = false
				}
			},
			/* 选择生日 */
			selectBirthday(e) {
				this.birthday = e.year + '-' + e.month + '-' + e.day
			},
		},
	}
</script>

<style lang="less">
	page {
		font-size: 28rpx;
		background-color: #EFF5F8;
	}
	
	.top-img {
		margin: 60rpx 300rpx;
	}
	
	.uploadImg {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		margin: 0 auto;
		overflow: hidden;
	}
	
	.uploadImg image {
		width: 150rpx;
	}
	
	.upload-text {
		text-align: center;
		margin-top: 20rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #555352;
	}

	.content {
		background-color: #FFFFFF;
		padding: 0 20rpx;
	}

	.content-text {
		display: flex;
	}

	.text-contene {
		display: flex;
		width: 710rpx;

		input {}
	}

	.text-input-code {
		width: 520rpx;
	}
	
	.text-gender {
		display: flex;
		// flex-direction: row-reverse;
		// justify-content: center;
	}
	
	.choice-0, .choice-1 {
		margin: 20rpx auto;
		width: 100rpx;
		height: 50rpx;
		background-color: #a8a8a0;
		border-radius: 10rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
	}
	
	.choice-0 {
		margin-right: 10rpx;
	}
	
	.choice-action {
		background-color: #ED6D46;
	}

	.bottom-Code {
		margin: 20rpx auto;
		width: 170rpx;
		height: 50rpx;
		background-color: #ED6D46;
		border-radius: 10rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 50rpx;
	}

	.text-input {
		width: 640rpx;
	}

	.text-icon {
		text-align: center;
		width: 50rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.agreement {
		margin: 20rpx;
		width: 710rpx;
	}

	.bottom-button {
		// position: fixed;
		// bottom: 0;
		margin: 100rpx 20rpx 0;
		width: 710rpx;
		height: 90rpx;
		background-color: #ED6D46;
		border-radius: 90rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 90rpx;
	}
</style>
