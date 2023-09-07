<template>
	<view class="">
		<!-- 当前主卡信息 -->
		<view class="top-text">
			<text>当前主卡信息</text>
		</view>
		<view class="content">
			<u-form :model="form" ref="uForm">
				<view class="content-text">
					<view class="text-name">
						会员卡号
					</view>
					<view class="text-contene">
						<u-input v-model="memberInfo.cardNumber" height="90" :disabled="true" />
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						昵称
					</view>
					<view class="text-contene">
						<u-form-item prop="realName" label-position="top">
							<u-input v-model="memberInfo.nickname" height="60" :disabled="true" placeholder='请输入昵称' />
						</u-form-item>
					</view>
					<view class="text-gender">
						<view class="choice" v-if="memberInfo.gender == 1">
							先生
						</view>
						<view class="choice" v-if="memberInfo.gender == 2">
							女士
						</view>
						<view class="choice" v-if="memberInfo.gender == 0">
							未知
						</view>
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						手机号
					</view>
					<view class="text-contene">
						<u-input v-model="memberInfo.phone" height="90" :disabled="true" />
					</view>
				</view>
				<u-line color="#EEEEEE" />
				<view class="content-text">
					<view class="text-name">
						当前积分
					</view>
					<view class="text-contene">
						<u-input v-model="integral" height="90" :disabled="true" />
					</view>
				</view>
			</u-form>
		</view>
		
		<!-- 其他会员卡信息 -->
		<view class="top-text text-other">
			<text>其他会员卡信息</text>
		</view>
		<view class="content-other">
			<!-- 其他会员卡列表 -->
			<view v-if="cards.length >= 1">
				<view v-for="(item, index) in cards" :key="index">
					<view :class=" cardIndes == (index + 1) ? 'card-item card-action' : 'card-item' " @click="setCardChoice(item, index)">
						<view class="card-name">
							<view>{{ item.realName }} {{ item.gender == 0 ? '未知' : '' }}{{ item.gender == 1 ? '先生' : '' }}{{ item.gender == 2 ? '女士' : '' }}</view>
							<view @click.stop="viewDetails(item)">查看详情 ></view>
						</view>
						<view class="card-number">
							<view>{{ item.cardNumber }}</view>
						</view>
						<view class="card-integral">
							<view>手机号：{{ item.phone }}</view>
							<view>当前积分：{{ item.point }}</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 暂无其他会员卡 -->
			<view class="empty-card" v-else>
				<u-empty text="暂无其他会员卡" mode="list"></u-empty>
			</view>
		</view>
		
		<!-- 隔离层 -->
		<view style="height: 210rpx;"></view>
		
		<!-- 操作 -->
		<view class="bottom-button">
			<view class="bottom-determine" @click="requestWeChat">确认合并</view>
			<view class="bottom-cancel" @click="cancelBinding">取消合并</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberInfo: uni.getStorageSync('memberInfo'), // 会员信息
				cards: [], // 其他卡
				cardChoice: {}, // 选中的卡
				cardIndes: 0, // 选中的卡位置，默认 0
				cardId: '', // 当前会员卡 ID
				integral: '0', // 积分
			}
		},
		onLoad() {
			// 获取用户会员卡列表 / 积分
			this.getMemberList()
		},
		onReady() {
			
		},
		methods: {
			// 获取用户会员卡列表 / 积分
			getMemberList() {
				let that = this
				// 积分
				that.request({
					url: that.config.pointTypes,
					data: {
						memberId: that.memberInfo.id,
						type: '01'
					}
				}).then(res => {
					let data = res.data
					if (res.statusCode == 200) {
						data.forEach((item) => {
							if(item.type == '01') {
								that.integral = item.balance
							}
						})
					}
				})
				// 获取用户会员卡列表
				that.request({
					url: that.config.memberList,
				}).then(res => {
					if (res.statusCode === 200) {
						that.cards = res.data
					}
				})
			},
			// 选择会员卡
			setCardChoice(event, index) {
				if (this.cardIndes == index + 1) {
					this.cardIndes = 0
					this.cardChoice = {}
				} else {
					this.cardChoice = event
					this.cardIndes = index + 1
				}
			},
			// 查看详情
			viewDetails(event) {
				uni.navigateTo({
					url: '../personalData/personalData?cardId=' + event.id
				})
			},
			// 确认合并
			requestWeChat() {
				let that = this
				if (JSON.stringify(that.cardChoice) != "{}") {
					uni.showModal({
					    title: '提示',
					    content: '确定要合并此会员卡吗？',
					    success: function (res) {
					        if (res.confirm) {
					            that.request({
					            	url: that.config.memberMerged,
					            	method: 'PUT',
					            	header: {
					            		'Content-Type': 'application/json'
					            	},
					            	data: {
					            		masterMemberId: that.memberInfo.id,
					            		mergedMemberId: that.cardChoice.id,
					            	}
					            }).then(res => {
					            	if (res.statusCode === 200) {
					            		uni.showToast({
					            			title: res.data.message,
					            			icon: 'success'
					            		})
					            		// 获取会员信息
					            		that.memberUser()
					            	} else {
					            		uni.showToast({
					            			title: res.data.message,
					            			icon: 'none'
					            		})
					            	}
					            })
					        }
					    }
					});
				} else {
					uni.showToast({
						title: '请选择合并会员卡',
						icon: 'none'
					})
				}
			},
			// 获取会员信息
			memberUser() {
				let that = this
				that.request({
					url: that.config.memberUser
				}).then(res => {
					if (res.statusCode != 200) return
					let data = res.data
					// 缓存用户信息
					uni.setStorageSync('memberInfo', data)
					// 更新会员主卡信息
					that.memberInfo = data
					// 获取用户会员卡列表 / 积分
					that.getMemberList()
				})
			},
			// 取消合并
			cancelBinding() {
				// 返回上一页
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

	.top-text {
		font-weight: 600;
		padding: 0 20rpx;
		// background-color: #FDF0EC;
		height: 70rpx;
		line-height: 70rpx;
	}
	
	.text-other {
		margin-top: 30rpx;
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
		height: 90rpx;
		line-height: 90rpx;
	}

	.text-contene {
		width: 550rpx;
	}
	
	.text-gender {
		display: flex;
	}
	
	.choice {
		margin: 20rpx auto;
		width: 100rpx;
		height: 50rpx;
		border-radius: 10rpx;
		color: #333;
		font-weight: 500;
		text-align: center;
		line-height: 50rpx;
	}

	.text-Code {
		width: 150rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.text-input {
		width: 340rpx;
		height: 90rpx;
		line-height: 90rpx;
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

	.bottom-button {
		position: fixed;
		bottom: 0;
		display: flex;
		margin: 0 10rpx 0;
		padding: 20rpx 0 60rpx;
		background-color: #FFFFFF;

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

	.u-form-item {
		padding: 0 !important;
	}
	
	// 其他会员卡信息
	.card-item {
		margin: 20rpx 20rpx 0;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}
	
	.card-action {
		border: 1rpx solid rgba(237, 109, 70, .5);
	}
	
	.card-number {
		margin: 0 20rpx;
		padding-bottom: 10rpx;
		line-height: 50rpx;
		font-size: 26rpx;
		color: #999;
	}
	
	.card-name {
		display: flex;
		justify-content: space-between;
		margin: 0 20rpx;
		padding-top: 30rpx;
	}
	
	.card-name view:nth-child(1) {
		font-size: 35rpx;
		color: #333;
		line-height: 50rpx;
		font-weight: 600;
	}
	
	.card-name view:nth-child(2) {
		font-size: 25rpx;
		color: #999;
		line-height: 40rpx;
		font-weight: 600;
	}
	
	.card-integral {
		display: flex;
		margin: 0 20rpx;
		padding-bottom: 20rpx;
		justify-content: space-between;
		height: 50rpx;
		line-height: 50rpx;
		color: #666;
		font-size: 26rpx;
	}
	
	.empty-card {
		margin-top: 60rpx;
	}
	
	
</style>
