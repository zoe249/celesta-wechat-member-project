// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	try {
		console.log('event', event)
		const result = await cloud.openapi.wxacode.getUnlimited({
			scene: event.scene,
			page: event.page,
			width: 430
		})
		console.log('result', result)
		const upload = await cloud.uploadFile({
			cloudPath: 'newPeopleQrcode/wxacode' + event.scene + '.png',
			fileContent: result.buffer
		})
		return upload;
	} catch (err) {
		console.log('err', err)
		return err
	}
}