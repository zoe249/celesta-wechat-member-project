<template>
	<view>
		<view class="page-wrap" v-if="memberList.length && memberList.length > 0">
			<!-- 头部 -->
			<!-- <u-navbar title="我的礼品卡" :is-back="false" :background="background" title-color="#ffffff" title-size="35"></u-navbar> -->
			<view class="member-wrap">
				<view class="title">请选择付费会员</view>
				<scroll-view scroll-x="true" @scrolltolower="scrolltolower">
					<view class="member-list">
						<view 
						class="member-item" 
						v-for="(item,index) in memberList" 
						:key="item.id" 
						:class="{'current-member' : index === currentMember}" 
						@click="selectMember(item,index)"
						:data-index="index"
						:data-id="item.id"
						>
							<view class="member-item-img">
								<image :src="item.icon" />
								<text>{{ item.productName }}</text>
							</view>
							<view class="member-item-price">
								<view class="new-price">
									<text class="small">￥</text>
									<text class="blod">{{ item.salePrice }}</text>
									
									<!-- <text class="small">/月</text> -->
									<text class="small" >
										<text>/</text>
										<text>{{ item.validPeriod | formtMonth }}</text>
										<!-- <text></text> -->
									</text>
								</view>
								<view class="old-price">
									<text class="small">￥</text>
									<text class="blod">{{ item.marketPrice }}</text>
									<text class="small">
										<text>/</text>
										<text>{{ item.validPeriod | formtMonth }}</text>
									</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			
			<!-- 权益说明 -->
			<view class="explain-wrap">
				<view class="title">权益说明</view>
				<!-- <view class="content">
					<view>1、充值金额可购买门店线上线下商品</view>
					<view>2、充值金额不计利息，不可提现，退款和转赠</view>
					<view>3、单笔冲值上限1000元，充值成功后，您的充值金额将会实时充值您的包账户</view>
					<view>4、使用钱包余额购买的订单，退换货订单产生的退款将返回钱包余额</view>
					<view>5、余额有效期：永久有效</view>
				</view> -->
				<view class="content">
					<view>{{ goodsInfo.rightsDescription || "" }}</view>
				</view>
			</view>
		
			<!-- 立即支付 -->
			<view class="pay-btn">
				<view class="checked">
					<checkbox-group @change="checkboxChange">
						<label>
							<checkbox value="cb" style="transform:scale(0.6)"/>
						</label>
					</checkbox-group>
					<view>
						<text>同意</text>
						<text style="color: #468DED;" @click="toProtocol">
							<text>《</text>
							<text style="text-decoration: underline;">付费会员协议</text>
							<text>》</text>
						</text>
					</view>
				</view>
				
				<view class="toPay" @click="toPayHandle">
					<text class="small">立即支付 ￥</text>
					<text class="blod">{{ goodsInfo.salePrice || 99 }}</text>
					<text class="small">
						<text>/</text>
						<text>{{ goodsInfo.validPeriod | formtMonth }}</text>
					</text>
				</view>
			</view>
		</view>
		
		<!-- 空页面 -->
		<view class="not-activity" v-else>
			<image :src="imgUrl + '/notLuckDraw-icon.png'" mode=""></image>
			<view>暂时没有推出付费会员计划</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberList:[],	// 付费会员方案列表
				total:0,	// 付费会员方案总数
				currentMember:0,
				isAgreement:false, // 是否勾选协议
				goodsInfo: {}, // 商品信息
				paymenst: {}, // 支付参数
				imgUrl: this.config.imgUrl,
				pageInfo:{	// 分页查询付费会员
					pageIndex:1,
					pageSize:10
				}
			}
		},
		filters:{
			formtMonth(value){
				let _val = value
				let unit = ''
				let newValue = ''
				if(_val >= 12 && _val % 12 === 0){
					unit = '年'
					newValue = _val / 12
				}else if(_val >= 3 && _val < 12 && _val % 3 === 0){
					unit = '季'
					newValue = _val / 3
				}
				// else if(_val > 1 && _val % 3 !== 0 && _val % 12 !== 0){
				// 	newValue = _val 
				// 	return '月*' +  newValue
				// }
				else{
					unit = '月'
					newValue = _val 
				}
				newValue = newValue == 1 ? '' : newValue 
				return newValue + unit
			}
		},
		onShow() {
			// uni.getSystemInfo({
			// 	success:res=>{
			// 		console.log(res)
			// 		if(res.model.indexOf('iPhone') !== -1){
			// 			console.log('iPhone')
			// 		}
			// 	}
			// })
		},
		onLoad() {
			this.getPaidMemberList()
		},
		methods: {
			getPaidMemberList(){
				uni.showLoading({
					title:'加载中'
				})
				this.request({
					url:this.config.paidMemberSchemes + '?status=' + '02',	// 状态，小程序展示商品时传，（01-未生效/02-已生效/03-已作废）
					data:{
						pageIndex:this.pageInfo.pageIndex,
						pageSize:this.pageInfo.pageSize
					}
				}).then(res=>{
					this.memberList.push(...res.data.data)
					this.total = res.data.total
					
					// 默认选中第一条
					if(this.memberList.length > 0){
						this.selectMember(this.memberList[0], 0)
					}else{
						uni.hideLoading()
					}
				})
			},
			// 选择付费方案
			selectMember(item, index){
				// const { index,id } = e.currentTarget.dataset
				// this.currentMember = index
				this.currentMember = index
				
				this.request({
					url:this.config.getPaidMemberById + '/' + item.id,
				}).then(res=>{
					this.goodsInfo = res.data.data
					uni.hideLoading()
				})
				
			},
			// 协议复选框
			checkboxChange(e){
				if(e.detail.value.length > 0){
					this.isAgreement = true
					uni.showToast({
						title: '勾选代表您同意《付费会员协议》',
						icon: 'none',
						duration: 1500
					})
				}else{
					this.isAgreement = false
				}
			},	
			// 立即支付的回调
			async toPayHandle(){
				if(!this.isAgreement){
					return uni.showToast({
						title:'请先勾选《付费会员协议》',
						icon:'none'
					})
				}else{
					uni.showLoading({
						title:'订单生成中',
					})
					let companyCode = this.config.companyCode
					
					const code = await this.getWxCode()
					const attach = uni.getStorageSync('memberInfo').id + ',' + companyCode.organizationCode + ',' + companyCode.channelCode + ',' + companyCode.terminalCode 
					this.request({
						url:this.config.getWechatPay,
						method:'POST',
						data:{
							type:'04',	// 类型：01为券；02礼品卡；03储值。V3.0.3；04付费会员。v3.0.6
							activityId:this.goodsInfo.id,	// 活动ID
							// giftCardSchemeOrderId:'',	// 礼品卡订单号
							code,	// 微信code
							body:'miaoshu',	// 商品描述
							detail:'付费会员活动',	// 商品详细描述
							attach,		// 会员Id,组织code,渠道code,终端code
							price:this.goodsInfo.salePrice,		// 单价
							quantity: 1	// 数量，付费会员固定设置为1
						},
						header:{
							'Content-type':'application/x-www-form-urlencoded'
						}
					}).then(res=>{
						if(res.statusCode == 200) {
							this.payments = res.data
								this.startWeiXinPay()
						} else {
							uni.hideLoading() // 取消加载中
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					}).catch(err=>{
						uni.hideLoading()
					})
				}
			},
			
			/**
			 * 获取微信code
			 */
			getWxCode(){
				return new Promise((resolve,reject)=>{
					uni.login({
						success(res) {
							resolve(res.code)
						},
						fail(err) {
							reject(err)
						}
					})
				})
			},
			/**
			 * 调用微信支付
			 */
			startWeiXinPay(){
				const payment = this.payments
				let that = this
				uni.requestPayment({
					timeStamp: payment.timeStamp,
					nonceStr: payment.nonceStr,
					package: payment.package,
					signType: payment.signType,
					paySign: payment.paySign,
					
					success() {
						uni.hideLoading() // 取消加载中
						uni.showToast({
							title: '支付成功',
							icon: 'success'
						})
						setTimeout(()=>{
							uni.navigateBack()
						},1500)
					},
					fail() {
						uni.hideLoading()
						that.cancelOrder()
					}
				})
			},
			// 支付失败调用取消订单
			cancelOrder() {
				let that = this
				that.request({
					url: that.config.cancelOrder + that.goodsInfo.id,
					method: 'DELETE'
				}).then(res => {
					// 取消订单
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				})
			},
			// 跳转到协议页面
			toProtocol(){
				uni.navigateTo({
					url:'/pages/protocol/protocol'
				})
			},
			// scroll触底事件
			scrolltolower(event){
				const {pageIndex,pageSize} = this.pageInfo
				// console.log(event)
				if(pageIndex * pageSize >= this.total){
					return
				}
				this.pageInfo.pageIndex++;
				this.getPaidMemberList()
			}
		}
	}
</script>

<style lang="scss" scoped>

.member-wrap{
	padding: 20rpx;
	background: #FFFFFF;
	.title{
		font-size: 32rpx;
		// font-family: PingFang SC;
		font-weight: 800;
		color: #E6B991;
		margin-bottom: 20rpx;
	}
	.member-list{
		display: flex;
		.member-item{
			width: 230rpx;
			margin: 0 10rpx;
			.member-item-img{
				margin: 20rpx 20rpx;
				image{
					width: 168rpx;
					height: 168rpx;
					border-radius: 10rpx;
				}
				text{
					margin-top: 20rpx;
					display: inline-block;
					width: 100%;
					text-align: center;
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: 800;
					color: #333333;
				}
			}
			
			.member-item-price{
				margin-top: 50rpx;
				margin-bottom: 20rpx;
				.new-price{
					color: #DDB28C;
					text-align: center;
				}
				.old-price{
					color: #999999;
					text-decoration: line-through;
					text-align: center;
				}
				.small{
					font-size: 28rpx;
				}
				.blod{
					font-size: 36rpx;
					font-weight: 600;
				}
			}
		}
		
		.current-member{
			border-radius: 10rpx;
			background-color: #FFF2E1;
		}
	}
}

.explain-wrap{
	margin: 20rpx;
	padding: 20rpx;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	.content{
		margin-top: 20rpx;
		font-size: 22rpx;
		color:#333333;
		line-height: 44rpx;
	}
}

.pay-btn{
	// margin-top: 50rpx;
	position: absolute;
	width: 100vw;
	bottom: 50rpx;
	.checked{
		display: flex;
		align-items: center;
		justify-content: center;
		view{
			font-size: 22rpx;
			font-weight: 500;
			color: #999999;
		}
	}
	.toPay{
		margin: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		height: 80rpx;
		background-color: #ED6D46;
		border-radius: 40rpx;
		font-size: 28rpx;
		.blod{
			font-size: 36rpx;
			font-weight: 600;
		}
	}
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
