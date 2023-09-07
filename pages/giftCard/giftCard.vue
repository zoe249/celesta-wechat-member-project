<template>
  <view class="content">
    <!-- 头部 -->
    <view class="header">
      <view class="balance">
        <view class="card-balance">
          <span>礼品卡余额</span>
          <span
            >¥{{
              giftCards01.giftCardBalance == null
                ? '0.00'
                : giftCards01.giftCardBalance
            }}</span
          >
        </view>
      </view>
      <view class="card-list">
        <view class="card-normal" @click="available('0')">
          <view :class="isAvailable ? 'action' : ''"
            >可用卡({{ giftCards01.total ? giftCards01.total : '0' }})</view
          >
        </view>
        <view class="card-not" @click="available('1')">
          <view :class="isAvailable ? '' : 'action'" class=""
            >不可用({{ giftCards02.total ? giftCards02.total : '0' }})</view
          >
        </view>
      </view>
    </view>

    <!-- 礼品卡 -->
    <view class="gift-card">
      <!-- 可用卡 -->
      <yp-gift-card
        v-show="isAvailable"
        :giftCardsSet="giftCards01"
        :giftCards="availableCard"
        :isEmpty="isAvailableCard"
        @change="setExpend"
      ></yp-gift-card>
      <!-- 不可用 -->
      <yp-gift-card
        v-show="!isAvailable"
        :giftCardsSet="giftCards02"
        :giftCards="notAvailableCard"
        :isAvailable="false"
        :isEmpty="isNotAvailableCard"
        @change="setNotExpend"
      ></yp-gift-card>
    </view>

    <view style="height: 160rpx"></view>
    <!-- 操作 -->
    <view class="bottom-button">
      <view class="bottom-determine" @click="purchaseCard">购买礼品卡</view>
      <view class="bottom-cancel" @click="bindingCard">绑定礼品卡</view>
    </view>
  </view>
</template>

<script>
import ypGiftCard from '@/components/ui-components/yp-gift-card/yp-gift-card.vue'
export default {
  components: {
    ypGiftCard,
  },
  data() {
    return {
      isAvailable: true, // 是否可用卡
      isAvailableCard: true, // 是否有可用卡
      isNotAvailableCard: true, // 是否有不可用卡
      giftCards01: {
        // 可用卡列表「对象」
        pageIndex: 1,
      },
      availableCard: [],
      giftCards02: {
        // 不可用卡列表「对象」
        pageIndex: 1,
      },
      notAvailableCard: [],
      pageSize: 10, // 一页请求条数
    }
  },
  onShow() {
    // 用户下页操作返回后刷新
    let isRefresh = uni.getStorageSync('isRefresh')

    if (!isRefresh) return
    let that = this
    // 策略类
    let refreshStrategy = {
      // 绑定成功
      1: function () {
        uni.setStorageSync('isRefresh', false)
        // 重置
        that.isAvailable = true // 是否可用卡
        that.isAvailableCard = true // 是否有可用卡
        that.isNotAvailableCard = true // 是否有不可用卡
        that.giftCards01 = {
          // 可用卡列表「对象」
          pageIndex: 1,
        }
        that.availableCard = []
        that.giftCards02 = {
          // 不可用卡列表「对象」
          pageIndex: 1,
        }
        that.notAvailableCard = []

        that.getMyGiftCards()
        that.getNotMyGiftCards()
      },
      // 转赠成功
      2: function () {
        uni.showToast({
          title: '转赠成功',
          icon: 'success',
        })
        uni.setStorageSync('isRefresh', false)
        // 重置
        that.isAvailable = true // 是否可用卡
        that.isAvailableCard = true // 是否有可用卡
        that.isNotAvailableCard = true // 是否有不可用卡
        that.giftCards01 = {
          // 可用卡列表「对象」
          pageIndex: 1,
        }
        that.availableCard = []
        that.giftCards02 = {
          // 不可用卡列表「对象」
          pageIndex: 1,
        }
        that.notAvailableCard = []

        that.getMyGiftCards()
        that.getNotMyGiftCards()
      },
    }
    // 环境类
    let refreshEnvironment = function (grade) {
      return refreshStrategy[grade]()
    }
    refreshEnvironment(isRefresh)
  },
  onLoad() {
    // 获取我的会员卡
    this.getMyGiftCards()
    this.getNotMyGiftCards()
  },
  /* 下拉刷新停止 */
  onPullDownRefresh() {
    // 重置
    this.isAvailable = true // 是否可用卡
    this.isAvailableCard = true // 是否有可用卡
    this.isNotAvailableCard = true // 是否有不可用卡
    this.giftCards01 = {
      // 可用卡列表「对象」
      pageIndex: 1,
    }
    this.availableCard = []
    this.giftCards02 = {
      // 不可用卡列表「对象」
      pageIndex: 1,
    }
    this.notAvailableCard = []

    this.getMyGiftCards()
    this.getNotMyGiftCards()

    setTimeout(function () {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  // 上拉动作
  onReachBottom() {
    if (this.isAvailable) {
      if (!this.giftCards01.ismoreData) return
      this.giftCards01.pageIndex++
      this.getMyGiftCards()
    } else {
      if (!this.giftCards02.ismoreData) return
      this.giftCards02.pageIndex++
      this.getNotMyGiftCards()
    }
  },
  methods: {
    // 查询我的会员卡  可用卡
    getMyGiftCards() {
      let that = this
      that
        .request({
          url: that.config.myGiftCards,
          data: {
            pageIndex: that.giftCards01.pageIndex,
            pageSize: that.pageSize,
            valid: true,
          },
        })
        .then((res) => {
          let data = res.data
          if (res.statusCode == 200 && data.data.length >= 1) {
            data.data.forEach((value, index) => {
              value.beginTimeFormat = that.$u.timeFormat(
                new Date(value.beginTime),
                'yyyy年mm月dd日'
              )
              value.endTimeFormat = that.$u.timeFormat(
                new Date(value.endTime),
                'yyyy年mm月dd日'
              )
              value.isExpand = false
              that.availableCard.push(value)
            })
            data.pageIndex = data.pageIndex
            data.status = 'loadmore'
            data.ismoreData = true
            that.giftCards01 = data
          }
          // 无更多数据
          if (
            that.availableCard.length >= 1 &&
            that.availableCard.length >= data.total
          ) {
            that.giftCards01.status = 'nomore'
            that.giftCards01.ismoreData = false
          }
          // 卡为空
          if (that.availableCard.length == 0) {
            that.isAvailableCard = false
          }
        })
    },
    // 查询我的会员卡  不可用
    getNotMyGiftCards() {
      let that = this
      that
        .request({
          url: that.config.myGiftCards,
          data: {
            pageIndex: that.giftCards02.pageIndex,
            pageSize: that.pageSize,
            valid: false,
          },
        })
        .then((res) => {
          let data = res.data
          if (res.statusCode == 200 && data.data.length >= 1) {
            data.data.forEach((value, index) => {
              value.beginTimeFormat = that.$u.timeFormat(
                new Date(value.beginTime),
                'yyyy.mm.dd'
              )
              value.endTimeFormat = that.$u.timeFormat(
                new Date(value.endTime),
                'yyyy.mm.dd'
              )
              that.notAvailableCard.push(value)
            })
            data.pageIndex = data.pageIndex
            data.status = 'loadmore'
            data.ismoreData = true
            that.giftCards02 = data
          }
          // 无更多数据
          if (
            that.notAvailableCard.length >= 1 &&
            that.notAvailableCard.length >= data.total
          ) {
            that.giftCards02.status = 'nomore'
            that.giftCards02.ismoreData = false
          }
          // 卡为空
          if (that.notAvailableCard.length == 0) {
            that.isNotAvailableCard = false
          }
        })
    },
    // 是否可用卡
    available(value) {
      let that = this
      // 策略类
      let cardStrategy = {
        // 可用卡
        0: function () {
          that.isAvailable = true
        },
        // 不可用
        1: function () {
          that.isAvailable = false
        },
      }
      // 环境类
      let cardEnvironment = function (grade) {
        return cardStrategy[grade]()
      }
      cardEnvironment(value)
    },
    // 卡说明拓展
    setExpend(index) {
      this.availableCard[index].isExpand = this.availableCard[index].isExpand
        ? false
        : true
    },
    setNotExpend(index) {
      this.notAvailableCard[index].isExpand = this.notAvailableCard[index]
        .isExpand
        ? false
        : true
    },
    // 购买礼品卡
    purchaseCard() {
      uni.navigateTo({
        url: '../buyGiftCard/buyGiftCard',
      })
    },
    // 绑定礼品卡
    bindingCard() {
      uni.navigateTo({
        url: '../myGiftCard/boundGiftCard/boundGiftCard',
      })
    },
  },
}
</script>

<style scoped>
/* 头部 start */
.header {
  position: fixed;
  top: 0;
  width: 750rpx;
  background-color: #ffffff;
  z-index: 50;
}

.balance {
  position: relative;
  height: 100rpx;
}

.card-balance {
  position: absolute;
  border: 0;
  display: flex;
  justify-content: space-between;
  width: 670rpx;
  height: 90rpx;
  padding: 0 20rpx;
  margin: 10rpx 20rpx 0;
  background-color: #333333;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}

.card-balance span {
  font-size: 28rpx;
  color: #e6b991;
  line-height: 90rpx;
}

.card-balance span:nth-child(2) {
  font-size: 35rpx;
  color: #ddb28c;
  letter-spacing: 5rpx;
  font-weight: 600;
  line-height: 90rpx;
}

.card-list {
  display: flex;
  height: 70rpx;
}

.card-normal,
.card-not {
  flex: 1;
  display: flex;
  justify-content: space-around;
}

.card-normal view,
.card-not view {
  height: 65rpx;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 70rpx;
  color: #333333;
}

.card-list view.action {
  color: #ed6d46;
  border-bottom: 6rpx solid #ed6d46;
}

/* 头部 end */

/* 礼品卡 start */
.gift-card {
  margin-top: 190rpx;
  /* background-color: pink; */
}

/* 礼品卡 end */

/* 操作 start */
.bottom-button {
  position: fixed;
  justify-content: space-around;
  bottom: 0;
  display: flex;
  width: 750rpx;
  padding: 20rpx 0 50rpx;
  background-color: #ffffff;
  z-index: 50;
}

.bottom-button view {
  width: 345rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  border-radius: 90rpx;
}

.bottom-determine {
  background-color: #ed6d46;
  color: #ffffff;
}

.bottom-cancel {
  background-color: #efe7e6;
  border: 1rpx solid #ed6d46;
  color: #ed6d46;
}

/* 操作 end */
</style>
