// import Vue from 'vue'

/**
 * 项目配置文件
 * 	1. 请求域名
 * 	2. 接口
 *  3. 程序配置
 * */

/***************************************** 黄河超市 *****************************************/

/**     黄河超市     */
// let protocol = 'https://' // 协议
// let host = 'o2o.yuepong.com/api-gateway/hh-com' // 外网域名+接口

// 会员卡域使用 O2O 接口
// let hostO2O = 'https://o2o.yuepong.com/api-gateway/hh' // 外网域名+接口

// let companyCode = { // 组织编号
// 	companyCode: '0001',
// 	organizationCode: '0001',
// 	channelCode: '02',
// 	terminalCode: '03',
// 	appCode: '00'
// }

// let appletName = '黄河超市' // 小程序名称
// let describeUser = '授权用户信息' // 授权用户信息提示
// let describe = '授权获取用户手机号' // 获取用户手机号提示
// let imgUrl = 'https://hhqiniu.yuepong.com' // 静态图片地址
// let companyName = '黄河超市服务' // 项目名称
// let companyLogo = imgUrl + '/gh_868688a9212e_258.jpg' // 公司 logo（无背景版）
// let companyLogoBg = imgUrl + '/gh_868688a9212e_258.jpg' // 公司 logo（背景版）
// let projectLogo = imgUrl + '/member.jpg' // 项目 logo（无背景版）
// let embedSrc = '' // 公司 跳转公众号文章 src
// let cloudName = '' // 云函数名称

/***************************************** 测试环境 *****************************************/

let protocol = 'https://' // 协议
let host = 'www.yuepong.cn/test/com/api-gateway' // 外网域名+接口

// 会员卡域使用 O2O 接口 测试环境
let hostO2O = 'https://www.yuepong.cn/test/o2o/api-gateway' // 外网域名+接口

let companyCode = { // 组织编号
	companyCode: '1001',
	organizationCode: '20002',
	channelCode: '04',
	terminalCode: '06',
	appCode: '00'
}

let appletName = '微会员' // 小程序名称
let describeUser = '授权用户信息' // 授权用户信息提示
let describe = '获取用户手机号提示' // 获取用户手机号提示
let imgUrl = 'https://qiaokun.yuepong.com' // 静态图片地址
let companyName = '悦朋智能科技' // 项目名称
let companyLogo = imgUrl + '/yuepeng.png' // 公司 logo（无背景版）
let companyLogoBg = imgUrl + '/companyLogo.png' // 公司 logo（背景版）
let projectLogo = 'https://qiaokun.yuepong.com/member.jpg' // 项目 logo（无背景版）
let embedSrc = 'https://mp.weixin.qq.com/s/4ERbNczm-HUCAPHLHxOQxw' // 公司 跳转公众号文章 src
let cloudName = 'appletcode' // 云函数名称

// let	env_version = 'develop'	// 要打开的小程序版本。正式版为 "release"，体验版为 "trial"，开发版为 "develop"
// let	env_version = 'trial'
let	env_version = 'release'


/***************************************** 温尔登 *****************************************/

// let protocol = 'https://' // 协议
// // 湖南温尔登 yc 0220715
// let host = 'www.smhwed.cn/com/api-gateway' // 外网域名+接口
// // 会员卡域使用 O2O 接口
// let hostO2O = 'https://www.smhwed.cn/o2o/api-gateway/auth-server' // 外网域名+接口

// let companyCode = { // 组织编号
// 	companyCode: '1001',
// 	organizationCode: '0001',
// 	channelCode: '01',
// 	terminalCode: '01',
// 	appCode: '00'
// }

// let appletName = '温尔会员' // 小程序名称
// let describeUser = '授权用户信息' // 授权用户信息提示
// let describe = '获取用户手机号提示' // 获取用户手机号提示
// let imgUrl = 'https://qiaokun.yuepong.com' // 静态图片地址
// let companyName = '温尔登' // 项目名称
// // let companyLogo = imgUrl + '/yuepeng.png' // 公司 logo（无背景版）
// let companyLogo ='https://qiniu.smhwed.cn/1658112994242' 
// // let companyLogoBg = imgUrl + '/companyLogo.png' // 公司 logo（背景版）
// let companyLogoBg = 'https://qiniu.smhwed.cn/1658113745906' 
// // let projectLogo = 'https://qiaokun.yuepong.com/member.jpg' // 项目 logo（无背景版）
// let projectLogo = 'https://qiniu.smhwed.cn/1658113745906' 
// let embedSrc = 'https://mp.weixin.qq.com/s/4ERbNczm-HUCAPHLHxOQxw' // 公司 跳转公众号文章 src
// let cloudName = 'appletcode' // 云函数名称

// // let	env_version = 'develop'	// 要打开的小程序版本。正式版为 "release"，体验版为 "trial"，开发版为 "develop"
// // let	env_version = 'trial'
// let	env_version = 'release'


/***************************************** 开发环境 *****************************************/

// let protocol = 'https://' // 协议
// let host = 'www.yuepong.cn/dev/com/api-gateway' // 外网域名+接口

// // 会员卡域使用 O2O 接口
// let hostO2O = 'https://www.yuepong.cn/dev/o2o/api-gateway' // 外网域名+接口

// let companyCode = { // 组织编号
// 	companyCode: '1001',
// 	organizationCode: '100101',
// 	channelCode: '01',
// 	terminalCode: '02',
// 	appCode: '00'
// }

// let appletName = '微会员' // 小程序名称
// let describeUser = '授权用户信息' // 授权用户信息提示
// let describe = '获取用户手机号提示' // 获取用户手机号提示
// let imgUrl = 'https://qiaokun.yuepong.com' // 静态图片地址
// let companyName = '悦朋智能科技' // 项目名称
// let companyLogo = imgUrl + '/yuepeng.png' // 公司 logo（无背景版）
// let companyLogoBg = imgUrl + '/companyLogo.png' // 公司 logo（背景版）
// let projectLogo = 'https://qiaokun.yuepong.com/member.jpg' // 项目 logo（无背景版）
// let embedSrc = 'https://mp.weixin.qq.com/s/4ERbNczm-HUCAPHLHxOQxw' // 公司 跳转公众号文章 src
// let cloudName = 'appletcode' // 云函数名称

/*******************************************************************************************/


let config = {

	// 网络请求域名
	protocol,
	host,
	hostO2O,
	companyCode,
	appletName,
	describeUser,
	describe,
	imgUrl,
	companyName,
	companyLogo,
	companyLogoBg,
	projectLogo,
	embedSrc,
	cloudName,
	env_version,

	/**          认证域          **/
	/**  server：/app/auth-server/api/v3.0.2  */
	// 获取验证码 (GET)
	verificationCodes:'/app/auth-server/api/v3.0.2/verificationCodes/captcha/',
	// 登录
	getLogin: '/app/auth-server/api/v3.0.2/oauth/token',




	/**          用户域          **/
	/**  server：/app/user-service/api/v3.0.1  */
	//修改密码 (PUT)
	changePassword: '/app/user-service/api/v3.0.1/users/changePassword',
	//获取当前用户(GET)
	getCurrentUser: '/app/user-service/api/v3.0.1/users/current',




	/**          管理域          **/
	/**  server：/app/management-service/api/v3.0.1  */
	// 图片导航样式 (GET)
	pictureNavigations: '/app/management-service/api/v3.0.1/pictureNavigations',
	// 图片导航列表 (GET)
	pictureList: '/app/management-service/api/v3.0.1/pictureNavigations/pictureList',
	// 获取广告 (GET)
	slideshows: '/app/management-service/api/v3.0.1/slideshows',
	// 获取手机验证码
	verificationCodes: '/app/management-service/api/v3.0.1/verificationCodes/captcha/',
	//获取指定区域的下级区域列表 (GET)
	address:'/app/management-service/api/v3.0.1/areas/',
	//查询指定字典下指定项值或名称的项是否存在 (GET)
	dataDicsExist: '/app/management-service/api/v3.0.1/dataDics/',
	// 数据字典 (GET)
	dataDics: '/app/management-service/api/v3.0.1/dataDics/itemValues',
	// 分页查询协议 (GET)
	protocols: '/app/management-service/api/v3.0.1/protocols',
	// 根据id查看协议详情( GET)
	getProtocolById: '/app/management-service/api/v3.0.1/protocols',
	// 根据协议用途查询协议详情(GET)
	getProtocolByName: '/app/management-service/api/v3.0.1/protocols/name',



	/**          销售域          **/
	/**  server：/app/sale-service/api/v3.0.3  */
	// 我的礼品卡 (GET)
	myGiftCards: '/app/sale-service/api/v3.0.3/giftCards/list',
	// 绑定礼品卡 (POST)
	memberGiftCardMapping: '/app/sale-service/api/v3.0.3/memberGiftCardMapping',
	// 转增礼品卡 (PUT)
	turnAddCar: '/app/sale-service/api/v3.0.3/memberGiftCardMapping',
	// 礼品卡消费记录 (GET)
	giftCardPayment:'/app/sale-service/api/v3.0.3/giftCardPayment',
	// 礼品卡方案 (GET)
	getGiftCardSchemes:'/app/sale-service/api/v3.0.3/giftCardSchemes',
	// 绑定指定礼品卡 (POST)
	getBindingOne:'/app/sale-service/api/v3.0.3/memberGiftCardMapping',
	// 绑定所有礼品卡 (PUT)
	getBindingAll:'/app/sale-service/api/v3.0.3/memberGiftCardMapping/',


	/**          付费会员          **/
	// 分页查询付费会员方案列表 GET
	paidMemberSchemes:'/app/member-service/api/v3.0.3/paidMemberSchemes',
	// 根据ID查付费会员方案详情 GET
	getPaidMemberById:'/app/member-service/api/v3.0.3/paidMemberSchemes',
	
	/**          会员域          **/
	/**  server：/app/member-service/api/v3.0.3  */
	// 获取当前会员信息(GET)
	getMembers: '/app/member-service/api/v3.0.3/members/',
	// 会员注册 (POST)
	registerPhone: '/app/member-service/api/v3.0.3/members/wechat/register',
	// 获取会员用户 (GET)
	memberUser: '/app/member-service/api/v3.0.3/members/current',
	// 会员绑定 (PUT)
	memberBinding: '/app/member-service/api/v3.0.3/members/',
	// 查询会员地址 (GET)
	memberAddress: '/app/member-service/api/v3.0.3/members/',
	// 修改会员信息 (PUT)
	modifyUser: '/app/member-service/api/v3.0.3/members/',
	// 查询会员积分、成长值、余额 （GET）
	pointTypes: '/app/member-service/api/v3.0.3/members/getMemberAccount',
	// 查询单个会员信息 （GET）
	memberCardInfor: '/app/member-service/api/v3.0.3/members/',
	// 会员信息 (GET) 用于首页查询会员等级
	memberCurrent: '/app/member-service/api/v3.0.3/members/current',
	// 取当前手机号下非当前会员的其他会员卡 （GET）
	memberList: '/app/member-service/api/v3.0.3/members/getOthserMemberList',
	// 会员卡合并 （PUT）
	memberMerged: '/app/member-service/api/v3.0.3/members/memberMerged',
	// 新增会员 （POST）
	newMember: '/app/member-service/api/v3.0.3/members',
	// 根据会员ID查询成长值 （GET）
	growthValue: '/app/member-service/api/v3.0.3/growthLists/memberId',
	// 查询成长值明细 （GET）
	growthLists: '/app/member-service/api/v3.0.3/growthLists',
	// 会员等级列表
	memberLevels: '/app/member-service/api/v3.0.3/memberLevels',
	// 根据ID 查询会员等级
	currentInfor: '/app/member-service/api/v3.0.3/members/current/',
	// 查询储值明细
	savingsList: '/app/member-service/api/v3.0.3/savingsList',
	// 查询满足会员充值的活动
	getSatisfy: '/app/member-service/api/v3.0.3/savingsActivity/satisfy',
	// 查询充值活动上限
	// getRechargeLimit: '/app/member-service/api/v3.0.3/savingsActivity/getSavingByObject',
	// 获取后台充值金额
	getFaveValues: '/app/member-service/api/v3.0.3/savingsActivity/savingsAmount',
	


	/**          积分域          **/
	/**  server：/app/point-service/api/v3.0.3  */
	// 获取会员积分明细 (GET) 先查月份
	pointMonthList: '/app/point-service/api/v3.0.3/pointSubAccounts',
	// 获取会员积分明细 (GET) 再根据积分类型
	pointList: '/app/point-service/api/v3.0.3/pointList',




	/**          微信会员卡          **/
	/**  server：/app/wechat-service/api/v3.0.1  */
	// 会员卡是否存在领取 (GET)
	getCardStatusByUser: '/app/wechat-service/api/v3.0.1/cards/getCardStatusByUser',
	// 获取公众号的openId（GET）
	getOpenIdByUnionId: '/app/wechat-service/api/v3.0.1/cards/getOpenIdByUnionId',
	// 获取公众号的会员卡ID(CardId)（GET）
	getCardIdByStatus: '/app/wechat-service/api/v3.0.1/cards/getCardIdByStatus',
	// 激活会员卡（GET）
	activationCard: '/app/wechat-service/api/v3.0.1/cards/activationCard',
	// 获取会员的code（GET）
	getCodeByOpenIdAndCardId: '/app/wechat-service/api/v3.0.1/cards/getCodeByOpenIdAndCardId',
	// 获取JS中addCard方法所有所需参数（GET）
	getJsAddCardAllParam: '/app/wechat-service/api/v3.0.1/cards/getJsAddCardAllParam',
	// 根据商品Id获取小程序二维码
	getQrCodeById: '/app/wechat-service/api/v3.0.1/applets/appletCode',
	
	


	/**          券活动域          **/
	/**  server：/app/coupon-service/api/v3.0.3  */
	// 获取券活动列表
	getSecKill: '/app/coupon-service/api/v3.0.3/couponsActivity/secKill',
	// 获取券活动详情
	getActivityInfo: '/app/coupon-service/api/v3.0.3/couponsActivity/',
	// 获取券列表
	getCouponList: '/app/coupon-service/api/v3.0.3/couponInfo',
	// 获取券详情
	getCouponInfo: '/app/coupon-service/api/v3.0.3/couponInfo/',
	// 券核销
	couponsWriteOff: '/app/coupon-service/api/v3.0.3/couponInfo/couponsWriteOff',
	// 校验券是否可用
	checkCoupon: '/app/coupon-service/api/v3.0.3/couponInfo/isuse',
	// 优惠券数量
	couponNum: '/app/coupon-service/api/v3.0.3/couponInfo/count',
	// 查询七日的奖励规则
	getSevenDaysReward: '/app/coupon-service/api/v3.0.3/dailyAttendance/attendanceRule',
	// 查询签到详情
	getSignInRecord: '/app/coupon-service/api/v3.0.3/dailyAttendance/dailyAttendanceDetails',
	// 查询签到的配置信息
	getSignInDetail: '/app/coupon-service/api/v3.0.3/dailyAttendance/detail',
	// 用户签到
	getSignIn: '/app/coupon-service/api/v3.0.3/dailyAttendance/attendance',
	// 查询用户连续签到天数
	getRunningDays: '/app/coupon-service/api/v3.0.3/dailyAttendance/runningDays',
	// 查询会员签到记录
	getChecks: '/app/coupon-service/api/v3.0.3/dailyAttendance',
	// 获取当前开启的幸运抽奖的活动
	getOpenActivity: '/app/coupon-service/api/v3.0.3/luckyDraws/openActivity',
	// 获取用户今日剩余可用抽奖次数
	getNumberOfLuckDraw: '/app/coupon-service/api/v3.0.3/luckyDraws/numberOfLuckDraw',
	// 查询抽奖记录、获奖名单
	getDrawRecord: '/app/coupon-service/api/v3.0.3/luckyDraws/drawRecord',
	// 查询抽奖结果
	getLuckyDraw: '/app/coupon-service/api/v3.0.3/luckyDraws/',
	// 校验是否支持抽奖
	luckyDrawJudgment: '/app/coupon-service/api/v3.0.3/luckyDraws/',
	// 使用积分兑换商品
	getCouponByPoint: '/app/order-service/api/v3.0.3/order/preservationCouponOrder',
	



	/**          支付域          **/
	/**  server：/app/payment-service/api/v3.0.3  
				类型：01为券；02礼品卡；03储值。V3.0.3；04付费会员。v3.0.6
	*/
	// 获取支付参数
	getWechatPay: '/app/payment-service/api/v3.0.3/wechatPay/createCouponOrder',
	



	/**          订单域          **/
	/**  server：/app/order-service/api/v3.0.3  */
	// 取消订单
	cancelOrder: '/app/order-service/api/v3.0.3/order/advanceOrder/',
	// 创建礼品卡订单
	getGiftCardOrder: '/app/order-service/api/v3.0.3/order/preservationGiftCardOrder',
	// 查询订单列表
	getOrderList: '/app/order-service/api/v3.0.3/order',
	// 查询订单详情
	getOrderInfo: '/app/order-service/api/v3.0.3/order/',
	// 分页查询礼品卡信息-以订单号+手机号为参数
	getCardKeyList: '/app/order-service/api/v3.0.3/order/order',
	// 我的礼品卡订单取消订单
	getCardCancelOrder: '/app/order-service/api/v3.0.3/order/cancelOrder/',
	
}

module.exports = config
