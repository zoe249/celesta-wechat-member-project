<template>
	<view class="">
		<!-- <view class="top-img" @tap="chooseAvatar"> -->
		<view class="top-img">
			<view class="uploadImg">
				<image :src="avatar" mode="widthFix"></image>
			</view>
			<!-- <view class="upload-text">
				点击上传头像
			</view> -->
		</view>
		<view class="content">
			<u-form :model="form" ref="uForm">
				<view class="content-text">
					<view class="text-name">
						手机号
					</view>
					<view class="text-contene">
						<u-input v-model="phone" height="90" :disabled="true" :custom-style="{'color':'#999999'}" />
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						真实姓名
					</view>
					<view class="text-contene">
						<u-form-item prop="name" label-position="top">
							<u-input v-model="form.name" height="70" maxlength='20' placeholder='请输入真实姓名' :custom-style="{'color':'#999999'}" />
						</u-form-item>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						性别
					</view>
					<view class="text-contene">
						<u-action-sheet :list="genderList" v-model="showGender" :cancel-btn="false" @click="selectGender" border-radius="20"></u-action-sheet>
						<u-form-item prop="gender" label-position="top">
							<u-input v-model="form.gender" height="70" :clearable="false" placeholder='请选择性别' :disabled="true" :custom-style="{'color':'#999999'}" />
						</u-form-item>
					</view>
					<view class="text-icon" @click="showGender = true">
						<u-icon name="arrow-right" size="35" height="90"></u-icon>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						生日
					</view>
					<view class="text-contene">
						<u-picker mode="time" v-model="showBirthday" :params="params" @confirm="selectBirthday" cancel-color='#FF7162'
						 title='请选择生日' confirm-color='#FF7162'></u-picker>
						<u-form-item prop="birthday" label-position="top">
							<u-input v-model="form.birthday" height="70" :clearable="false" placeholder='请选择生日' :disabled="true"
							 :custom-style="{'color':'#999999'}" />
						</u-form-item>
					</view>
					<view class="text-icon" @click="showBirthday = true">
						<u-icon name="arrow-right" size="35" height="90"></u-icon>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						职业
					</view>
					<view class="text-contene">
						<u-select v-model="showProfessional" :list="professionalList" @confirm="selectProfessional" :default-value='[professionalCode]'
						 confirm-color='#FF7162'></u-select>
						<u-form-item prop="professional" label-position="top">
							<u-input v-model="form.professional" height="70" :clearable="false" placeholder='请选择职业' :disabled="true"
							 :custom-style="{'color':'#999999'}" />
						</u-form-item>
					</view>
					<view class="text-icon" @click="showProfessional = true">
						<u-icon name="arrow-right" size="35" height="90"></u-icon>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						家庭状况
					</view>
					<view class="text-contene">
						<u-select v-model="showFamily" :list="familySituationList" @confirm="selectFamily" :default-value='[familySituationCode]'
						 confirm-color='#FF7162'></u-select>

						<u-form-item prop="familySituation" label-position="top">
							<u-input v-model="form.familySituation" height="70" :clearable="false" placeholder='请选择家庭状况' :disabled="true"
							 :custom-style="{'color':'#999999'}" />
						</u-form-item>
					</view>
					<view class="text-icon" @click="showFamily = true">
						<u-icon name="arrow-right" size="35" height="90"></u-icon>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						家庭住址
					</view>
					<view class="text-contene address">
						<view class="address-select">
							<u-select v-model="showProvince" mode="single-column" :list="provinceList" @confirm="confirmProvince"
							 confirm-color='#FF7162'></u-select>
							<u-select v-model="showcity" mode="single-column" :list="cityList" @confirm="confirmCity" confirm-color='#FF7162'></u-select>
							<u-select v-model="showarea" mode="single-column" :list="areaList" @confirm="confirmArea" confirm-color='#FF7162'></u-select>
						</view>
						<u-input v-model="province" height="60" :clearable="false" placeholder='请选择省' :disabled="true" :custom-style="{'color':'#999999'}" />
						<u-input v-model="city" height="60" :clearable="false" placeholder='请选择市' :disabled="true" :custom-style="{'color':'#999999'}" />
						<u-form-item prop="area" label-position="top">
							<u-input v-model="form.area" height="60" :clearable="false" placeholder='请选择区' :disabled="true" :custom-style="{'color':'#999999'}" />
						</u-form-item>
					</view>
					<view class="text-icon-address">
						<view class="" @click="showProvince = true">
							<u-icon name="arrow-right" size="35" height="90"></u-icon>
						</view>
						<view class="" v-if="addressSelectId == 1||addressSelectId == 2" @click="showcity = true">
							<u-icon name="arrow-right" size="35" height="90"></u-icon>
						</view>
						<view class="" v-if="addressSelectId == 2" @click="showarea = true">
							<u-icon name="arrow-right" size="35" height="90"></u-icon>
						</view>
					</view>
				</view>
				<view class="content-text">
					<view class="text-name">
						详细地址
					</view>
					<view class="text-contene">
						<u-form-item prop="detailedAddress" label-position="top">
							<u-input v-model="form.detailedAddress" height="90" maxlength='30' placeholder='请输入详细地址' :custom-style="{'color':'#999999'}" />
						</u-form-item>
					</view>
				</view>
			</u-form>
		</view>
		<view class="bottom-button" @tap="$u.throttle(saveMassage, 1000)">
			保存信息
		</view>
		<!-- 消息提示框 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import timgData from '@/components/js-components/timeDate.js'
	export default {
		data() {
			return {
				memberInfo: [], //用户信息
				phone: '', //手机号
				showGender: false, //展开选择性别
				showBirthday: false, //展开选择生日
				showProfessional: false, //展开选择职业
				showFamily: false, //展开选择家庭状况
				showProvince: false, //选择省
				showcity: false, //选择市
				showarea: false, //选择区
				province: '', //省
				provinceCode: '', //省Code
				city: '', //市
				cityCode: '', //市Code
				genderList: [], //数据字典姓名
				professionalList: [], //数据字典职业
				familySituationList: [], //数据字典家庭状况
				params: {
					year: true,
					month: true,
					day: true,
					timestamp: true
				},
				action: 'https://imgchr.com/upload', //上传地址
				avatar: '', //头像
				addressId: '', //会员地址区域id
				getAddressId: '', //获取会员地址id
				addressSelectId: '', //地址下拉框id 0:省, 1:市, 2:区
				provinceList: [], //省下拉数据
				cityList: [], //市下拉数据
				areaList: [], //区下拉数据
				birthdayTamp: '', //生日时间戳
				genderCode: '', //性别Code
				professionalCode: '', //职业Code
				familySituationCode: '', //家庭状况Code
				areaCode: '', //选择区Code
				form: {
					name: '', //姓名
					gender: '', //性别
					birthday: '', //生日
					professional: '', //职业
					familySituation: '', //家庭状况
					area: '', //选择区
					detailedAddress: '', //详细地址
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur',
					}],
					gender: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur',
					}],
					birthday: [{
						required: true,
						message: '请选择生日',
						trigger: 'blur',
					}],
					professional: [{
						required: true,
						message: '请选择职业',
						trigger: 'blur',
					}],
					familySituation: [{
						required: true,
						message: '请选择家庭状况',
						trigger: 'blur',
					}],
					area: [{
						required: true,
						message: '请选择省市区',
						trigger: 'blur',
					}],
					detailedAddress: [{
						required: true,
						message: '请选择详细地址',
						trigger: 'blur',
					}],
				}
			}
		},
		onLoad(options) {
			if(options && options.cardId) { // 其他会员卡详情进入
				// 获取某个会员卡信息
				this.memberCardInfor(options.cardId)
				this.addressId = 0
				this.addressSelectId = 0
				this.getProvince() //获取会员地址下拉
			} else { // 点击首页头像进入
				this.getMembers() //获取会员信息
				// this.memberAddress() //获取当前会员地址信息
				this.addressId = 0
				this.addressSelectId = 0
				this.getProvince() //获取会员地址下拉
			}
		},
		onShow() {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				// 可以在此上传到服务端
			})
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			/* 选择性别 */
			selectGender(e) {
				this.form.gender = this.genderList[e].text
				this.genderCode = this.genderList[e].code
			},
			/* 选择职业 */
			selectProfessional(e) {
				this.form.professional = e[0].label
				this.professionalCode = e[0].value
			},
			/* 选择家庭状况 */
			selectFamily(e) {
				this.form.familySituation = e[0].label
				this.familySituationCode = e[0].value
			},
			/* 选择生日 */
			selectBirthday(e) {
				this.birthdayTamp = e.timestamp * 1000
				this.form.birthday = this.$u.timeFormat(this.birthdayTamp, 'yyyy-mm-dd')
			},
			/* 选择地区 */
			selectAddress(e) {

			},
			/* 上传图片 */
			chooseAvatar() {
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			/* 获取当前用户信息 */
			getMembers() {
				let that = this
				that.request({
					url: that.config.memberUser,
				}).then(res => {
					let data = res.data
					that.memberInfo = data
					that.phone = data.phone //电话
					that.avatar = data.avatar //头像
					that.form.name = data.realName //姓名
					that.genderCode = data.gender //性别Code
					that.form.birthday = timgData.parseTime(data.birthday, "{y}-{m}-{d}")
					that.birthdayTamp = data.birthday
					that.professionalCode = data.professional //职业Code
					that.familySituationCode = data.familyStatus //家庭状况Code
					that.memberAddress() //获取当前会员地址信息
					that.dataDics() //获取下拉列表信息
				})
			},
			/* 获取某个会员卡信息 */
			memberCardInfor(id) {
				let that = this
				that.request({
					url: that.config.memberCardInfor + id,
				}).then(res => {
					let data = res.data
					that.memberInfo = data
					that.phone = data.phone //电话
					that.avatar = data.avatar //头像
					that.form.name = data.realName //姓名
					that.genderCode = data.gender //性别Code
					that.form.birthday = timgData.parseTime(data.birthday, "{y}-{m}-{d}")
					that.birthdayTamp = data.birthday
					that.professionalCode = data.professional //职业Code
					that.familySituationCode = data.familyStatus //家庭状况Code
					that.memberCardAddress(id) // 获取某个会员卡地址
					that.dataDics() // 获取下拉列表信息
				})
			},
			/* 获取某个会员卡地址 */
			memberCardAddress(id) {
				let that = this
				that.request({
					url: that.config.memberAddress + id + '/memberAddress',
				}).then(res => {
					let data = res.data[0]
					if (res.data.length != 0) {
						that.provinceCode = data.state //省Code
						that.cityCode = data.city //市Code
						that.areaCode = data.district //选择区Code
						that.form.detailedAddress = data.address //详细地址
						that.getAddressId = data.id //获取会员地址id
						that.backShowAddress(0, 0)
					}
				})
			},
			/* 获取当前会员地址 */
			memberAddress() {
				let that = this
				that.request({
					url: that.config.memberAddress + that.memberInfo.id + '/memberAddress',
				}).then(res => {
					let data = res.data[0]
					if (res.data.length != 0) {
						that.provinceCode = data.state //省Code
						that.cityCode = data.city //市Code
						that.areaCode = data.district //选择区Code
						that.form.detailedAddress = data.address //详细地址
						that.getAddressId = data.id //获取会员地址id
						that.backShowAddress(0, 0)
					}
				})
			},
			/* 回显会员地址 */
			backShowAddress(e, index) {
				let that = this
				that.request({
					url: that.config.address + e + '/children',
				}).then(res => {
					let data = res.data
					if (index == 0) {
						that.backShowProvince(data)
					}
					if (index == 1) {
						that.backShowCity(data)
					}
					if (index == 2) {
						that.backShowArea(data)
					}
				})
			},
			/* 回显省 */
			backShowProvince(data) {
				let that = this
				let backShowdata = data.filter((value, index) => value.id == that.provinceCode)
				that.province = backShowdata[0].name
				that.backShowAddress(backShowdata[0].id, 1)
			},
			/* 回显市 */
			backShowCity(data) {
				let that = this
				let backShowdata = data.filter((value, index) => value.id == that.cityCode)
				that.city = backShowdata[0].name
				that.backShowAddress(backShowdata[0].id, 2)
			},
			/* 回显区 */
			backShowArea(data) {
				let that = this
				let backShowdata = data.filter((value, index) => value.id == that.areaCode)
				that.form.area = backShowdata[0].name
			},
			/* 获取会员地址下拉 */
			getProvince() {
				let that = this
				that.request({
					url: that.config.address + that.addressId + '/children',
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					let requestAddress = []
					data.forEach((value) => {
						requestAddress.push({
							value: value.id,
							label: value.name
						})
					})
					if (that.addressSelectId == 0) {
						that.provinceList = requestAddress
					}
					if (that.addressSelectId == 1) {
						that.cityList = requestAddress
					}
					if (that.addressSelectId == 2) {
						that.areaList = requestAddress
					}
				})
			},
			// confirmProvince
			// confirmCity
			// confirmArea
			/* 下拉选择省 */
			confirmProvince(e) {
				this.province = e[0].label //选择省
				this.addressId = e[0].value
				this.provinceCode = e[0].value //省code
				this.addressSelectId = 1
				this.city = '' //清空市
				this.form.area = '' //清空区
				this.getProvince() //获取会员地址下拉
			},
			/* 下拉选择市 */
			confirmCity(e) {
				this.city = e[0].label //选择市
				this.addressId = e[0].value
				this.cityCode = e[0].value //市code
				this.addressSelectId = 2
				this.form.area = '' //清空区
				this.getProvince() //获取会员地址下拉
			},
			/* 下拉选择区 */
			confirmArea(e) {
				this.form.area = e[0].label //选择区
				this.addressId = e[0].value
				this.areaCode = e[0].value //区code
			},
			/* 获取下拉列表信息 */
			dataDics() {
				var that = this
				// 获取性别
				that.request({
					url: that.config.dataDics,
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: {
						ddCode: '10003',
						status: true,
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					data.forEach((value) => {
						that.genderList.push({
							text: value.name,
							color: '#FF7162',
							code: value.code
						})
					})
					if (that.genderCode != null) {
						let gender = data.filter((value, index) => value.code == that.genderCode)
						that.form.gender = gender[0].name
					}
				})
				// 获取职业
				that.request({
					url: that.config.dataDics,
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: {
						ddCode: '10006',
						status: true
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					data.forEach((value) => {
						that.professionalList.push({
							label: value.name,
							value: value.code
						})
					})
					if (that.professionalCode != null) {
						let professional = data.filter((value, index) => value.code == that.professionalCode)
						that.form.professional = professional[0].name
					}

				})
				// 获取家庭状况
				that.request({
					url: that.config.dataDics,
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: {
						ddCode: '10012',
						status: true
					}
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					data.forEach((value) => {
						that.familySituationList.push({
							label: value.name,
							value: value.code
						})
					})
					if (that.familySituationCode != null) {
						let familySituation = data.filter((value, index) => value.code == that.familySituationCode)
						that.form.familySituation = familySituation[0].name
					}
				})
			},
			/* 修改会员信息 */
			modifyUser() {
				let that = this
				let memberAddressList = [{
					type: '01',
					country: '0',
					state: that.provinceCode,
					city: that.cityCode,
					district: that.areaCode,
					address: that.form.detailedAddress,
					id: that.getAddressId
				}]
				that.request({
					url: that.config.modifyUser + this.memberInfo.id,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: {
						phone: that.phone,
						realName: that.form.name,
						gender: that.genderCode,
						birthday: that.birthdayTamp,
						professional: that.professionalCode,
						familyStatus: that.familySituationCode,
						memberAddressList: memberAddressList
					}
				}).then(res => {
					if (res.statusCode == 200) {
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						})
					}
					if (res.statusCode == 500) {
						this.$refs.uToast.show({
							title: '修改失败' + res.data.detail,
							type: 'error'
						})
					}
				})
			},
			saveMassage() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.modifyUser()
					} else {
						return
					}
				});
			}

		},
	}
</script>

<style lang="less">
	page {
		font-size: 28rpx;
		background-color: #EFF5F8;
	}

	.top-img {
		margin: 20rpx 300rpx;
	}

	.uploadImg {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin: 0 auto;
		overflow: hidden;

		image {
			width: 120rpx;
		}
	}

	.upload-text {
		margin-top: 10rpx;
		font-size: 24rpx;
	}

	.content {
		background-color: #FFFFFF;
		padding: 0 20rpx;
	}

	.content-text {
		display: flex;
	}

	.text-name {
		width: 150rpx;
		line-height: 90rpx;
	}

	.text-contene {
		width: 500rpx;
		margin-bottom: 10rpx;
	}

	.text-icon {
		text-align: center;
		width: 50rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.text-icon-address {
		margin-top: 20rpx;
		text-align: center;
		width: 50rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.bottom-button {
		margin: 40rpx 20rpx;
		width: 710rpx;
		height: 90rpx;
		background-color: #ED6D46;
		border-radius: 90rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 90rpx;
	}

	.address {
		padding-top: 20rpx;
	}

	.u-form-item {
		padding: 0 !important;
	}
</style>
