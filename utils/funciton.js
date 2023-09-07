// 购买类型
const goodsType = (goods) => {
	if(goods.usePoint == 0 || goods.usePoint == '' ){
		return 1	// 仅支付现金
	}else if(goods.usePoint !== 0 && goods.salePrice === 0){
		return 2	// 仅消耗积分
	}else if(goods.usePoint !== 0 && goods.salePrice !== 0){
		return 3	// 消耗积分 && 支付现金
	}
}

export { goodsType }