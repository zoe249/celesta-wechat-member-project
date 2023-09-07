/* 时间戳转换成日期格式 */

function parseTime(dateTimestamp, cFormat) {
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let timeDate
	if (dateTimestamp !== null) {
		timeDate = new Date(parseInt(dateTimestamp))
		const formatObj = {
			y: timeDate.getFullYear(),
			m: timeDate.getMonth() + 1,
			d: timeDate.getDate(),
			h: timeDate.getHours(),
			i: timeDate.getMinutes(),
			s: timeDate.getSeconds(),
			a: timeDate.getDay()
		}
		const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
			const value = formatObj[key]
			return value.toString().padStart(2, '0')
		})
		return time_str
	}
}

module.exports = {
	parseTime
}
