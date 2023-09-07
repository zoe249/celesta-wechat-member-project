<template>
  <view class="content">
    <!-- 头部 -->
    <u-navbar
      title="会员中心"
      :is-back="false"
      :background="background"
      title-color="#ffffff"
      title-size="35"
    ></u-navbar>

    <view class="header">
      <!-- 会员角色信息 -->
      <view class="role-info">
        <yp-role-info
          :role="memberInfo"
          @change="personalData"
          @codePopup="unauthorizedTitle"
        ></yp-role-info>
      </view>
    </view>

    <!-- 会员卡 -->
    <view class="member">
      <swiper class="wrap-swiper" @change="cardSwitch">
        <swiper-item v-for="(item, index) in cardGradeList" :key="index">
          <!-- 会员卡背景 -->
          <view class="swiper-image">
            <view class="bg-color"></view>
          </view>
          <!-- 会员卡信息 -->
          <view class="swiper-content">
            <view class="sp-header">
              <view class="sp-header-logo">
                <image :src="cardLogo" mode="widthFix"></image>
                <view class="company-name">{{ cardName }}</view>
              </view>
            </view>
            <view class="sp-member">
              <view class="member-grade">{{ item.name }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 隔离层 -->
    <!-- <view style="height: 190rpx;"></view> -->

    <!-- 积分、余额、礼品卡、优惠券 -->
    <view class="integral" @click="unauthorizedTitle">
      <view class="integral-item">
        <view class="integral-top">{{ integral.integral }}</view>
        <view class="integral-botton">积分</view>
      </view>
      <view class="integral-item">
        <view class="integral-top">{{ integral.balance }}</view>
        <view class="integral-botton">余额</view>
      </view>
      <view class="integral-item">
        <view class="integral-top">{{ integral.giftCard }}</view>
        <view class="integral-botton">礼品卡</view>
      </view>
      <view class="integral-item">
        <view class="integral-top">{{ integral.coupon }}</view>
        <view class="integral-botton">优惠券</view>
      </view>
    </view>

    <!-- 会员权益 -->
    <view class="service" v-if="services.length != 0">
      <yp-rights-interests
        :services="services"
        :serviceStyle="serviceStyle"
      ></yp-rights-interests>
    </view>

    <!-- 广告banner -->
    <view class="swiper-box" v-if="swiperList.length != 0">
      <u-swiper
        class="swiper-image"
        :list="swiperList"
        height="350"
        mode="round"
        indicator-pos="bottomLeft"
        @click="unauthorizedTitle"
      ></u-swiper>
    </view>

    <!-- 跳转入口 -->
    <view class="setup-tool" v-if="toolServices.length != 0">
      <yp-tool-services
        :services="toolServices"
        :serviceStyle="toolStyle"
        @change="unauthorizedTitle"
      ></yp-tool-services>
    </view>

    <!-- 版权 -->
    <yp-copyright :edition="edition"></yp-copyright>

    <!-- 无网络提示 -->
    <u-no-network></u-no-network>
  </view>
</template>

<script>
import ypLoading from "@/components/yp-loading/yp-loading.vue";
import ypRoleInfo from "@/components/ui-components/yp-role-info/yp-role-info.vue";
import ypMemberCard from "@/components/ui-components/yp-member-card/yp-member-card.vue";
import ypRightsInterests from "@/components/ui-components/yp-rights-interests/yp-rights-interests.vue";
import ypToolServices from "@/components/ui-components/yp-tool-services/yp-tool-services.vue";
import ypCopyright from "@/components/ui-components/yp-copyright/yp-copyright.vue";
export default {
  components: {
    ypLoading,
    ypRoleInfo,
    ypMemberCard,
    ypRightsInterests,
    ypToolServices,
    ypCopyright,
  },
  data() {
    return {
      background: {
        backgroundImage: "linear-gradient(to right, #EBAE93, #E6907A)",
      },
      memberInfo: {
        avatar: this.config.projectLogo,
        realName: "点击头像授权登录",
        phone: "（未登录）",
      }, // 会员信息
      cardGradeList: [], // 会员卡等级列表
      integral: {
        // 积分信息
        integral: "0",
        balance: "¥0.00",
        giftCard: "0",
        coupon: "0",
      },
      services: [], // 权益列表
      serviceStyle: {}, // 权益样式
      swiperList: [], // 广告banner
      toolServices: [], // 设置列表
      toolStyle: {}, // 跳转入口样式
      edition: "", // 版本
      cardLogo: this.config.companyLogoBg,
      cardName: this.config.companyName,
    };
  },
  onLoad() {
    console.log("用户授权页");
    // 获取广告
    this.getSlideshows();
    // 获取会员权益
    this.getServicesStyle();
    // 获取跳转设置
    this.getToolStyle();
    // 获取数据字典
    this.cardLevelDataDics();
  },
  onShow() {},
  methods: {
    // 会员权益
    getServicesStyle() {
      let that = this;
      // 获取会员权益样式
      that
        .request({
          url: that.config.pictureNavigations,
          data: {
            status: true,
            site: "01",
          },
        })
        .then((res) => {
          if (res.statusCode != 200) return;
          let data = res.data;
          that.serviceStyle = data[0];
        });
      // 获取会员权益列表
      this.getPictureList("01");
    },
    // 获取会员权益列表
    getPictureList(cardlevel) {
      let that = this;
      that
        .request({
          url: that.config.pictureList,
          data: {
            cardlevel: cardlevel, // 01  02  03
            site: "01",
          },
        })
        .then((res) => {
          if (res.statusCode != 200) return;
          let data = res.data;
          that.services = data;
        });
    },
    // 跳转设置
    getToolStyle() {
      let that = this;
      // 获取跳转设样式
      that
        .request({
          url: that.config.pictureNavigations,
          data: {
            status: true,
            site: "02",
          },
        })
        .then((res) => {
          if (res.statusCode != 200) return;
          let data = res.data;
          that.toolStyle = data[0];
        });
      // 获取跳转列表
      that
        .request({
          url: that.config.pictureList,
          data: {
            cardlevel: "01", // 01  02  03
            site: "02",
          },
        })
        .then((res) => {
          if (res.statusCode != 200) return;
          let data = res.data;
          that.toolServices = data;
        });
    },
    // 获取广告 首页轮播
    getSlideshows() {
      let that = this;
      that
        .request({
          url: that.config.slideshows,
          data: {
            displayed: true,
            site: "2",
          },
        })
        .then((res) => {
          let data = res.data.data;
          if (res.statusCode == 200 && data.length != 0) {
            for (let i in data) {
              data[i].image = data[i].pictureUrl;
            }
            that.swiperList = data;
          }
        });
    },
    // 获取会员卡等级列表数据字典
    cardLevelDataDics() {
      let that = this;
      that
        .request({
          url: that.config.dataDics,
          header: {
            "Content-Type": "application/json; charset=utf-8",
          },
          data: {
            ddCode: 10018,
            status: true,
          },
        })
        .then((res) => {
          let data = res.data;
          if (res.statusCode == 200 && data.length >= 1) {
            that.cardGradeList = data;
          }
        });
    },
    // 手动切换会员卡
    cardSwitch(event) {
      let cardLevel = event.detail.current + 1;
      if (cardLevel < 10) {
        cardLevel = "0" + cardLevel;
      }
      // 获取会员权益列表
      this.getPictureList(cardLevel);
    },
    // 点击头像跳转个人设置
    personalData() {
      uni.redirectTo({
        url: "../startUp/startUp?isEntrance=02",
      });
    },
    // 未登录提示
    unauthorizedTitle() {
      uni.showToast({
        title: "未登录，请先授权登录！",
        icon: "none",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* 标题  */
.header {
  /* height: 450rpx; */
  background: linear-gradient(to right, #ebae93, #e6907a);
}

/* 下拉加载 start */
.loading-icon-text {
  display: flex;
  justify-content: center;
  height: 90rpx;
  margin-top: -90rpx;
}

.loading-icon-text image {
  width: 60rpx;
  height: 60rpx;
  margin: 15rpx 0;
}

@keyframes loadingImg {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loadingImg {
  animation: loadingImg 0.8s linear infinite;
}

/* 下拉加载 end */

/* 会员卡 start */
.member {
  /* height: 350rpx; */
  /* margin: -270rpx 20rpx; */
  /* width: 710rpx; */
  padding: 30rpx 20rpx 0;
  /* border-radius: 20rpx; */
  background: linear-gradient(to right, #ebae93, #e6907a);
}

.wrap-swiper {
  height: 350rpx;
}

.swiper-image {
  text-align: center;

  // image {
  // 	width: 650rpx;
  // 	border-radius: 45rpx;
  // }

  .bg-color {
    width: 710rpx;
    height: 350rpx;
    margin: 0 auto;
    // overflow: hidden;
    border-radius: 20rpx;
    background-color: #313131;
  }
}

.swiper-content {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  width: 670rpx;
  color: #ffffff;
}

.sp-header {
  display: flex;
  justify-content: space-between;
}

.sp-header-logo {
  display: flex;

  image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }

  .company-name {
    margin-left: 20rpx;
    font-size: 28rpx;
    line-height: 80rpx;
  }
}

.growth-value {
  font-size: 26rpx;
  color: #ffffff;
  line-height: 65rpx;
}

.growth-value > text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
  line-height: 65rpx;
}

.serial-number {
  font-size: 26rpx;
  color: #ffffff;
  line-height: 80rpx;
}

.sp-member {
  height: 120rpx;
}

.member-grade-current {
  .grade-current {
    display: flex;
    justify-content: center;
  }

  .grade-current-name {
    font-size: 40rpx;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    line-height: 70rpx;
  }

  .grade-current-name-01 {
    font-size: 45rpx;
    line-height: 100rpx;
  }

  .current-grade {
    width: 90rpx;
    height: 30rpx;
    text-align: center;
    margin: 16rpx 10rpx;
    line-height: 30rpx;
    font-size: 18rpx;
    font-weight: normal;
    color: #ffffff;
    border: 1rpx solid #ffffff;
    border-radius: 50rpx;
  }

  .current-grade-01 {
    margin: 35rpx 10rpx;
  }

  .current-grade-tran {
    opacity: 0;
  }

  .grade-time {
    font-size: 24rpx;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    line-height: 50rpx;
  }
}

.member-grade {
  font-size: 45rpx;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  line-height: 140rpx;
}

/* 会员卡 end */

/* 积分 start */
.integral {
  display: flex;
  justify-content: space-around;
  position: relative;
  height: 110rpx;
  margin-top: -60rpx;
  z-index: 30;
  background-color: #ffffff;
}

.integral-item {
  flex: 1;
  height: 110rpx;
  margin: 20rpx 0;
}

.integral-top {
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  line-height: 45rpx;
  color: #333333;
}

.integral-botton {
  font-size: 24rpx;
  text-align: center;
  line-height: 45rpx;
  color: #999999;
}

/* 积分 end */

/* 用户二维码/条形码 start */
.userCode {
  position: relative;
  height: 60vh;
}

.popup {
  height: 60vh;
  z-index: 40;
}

.bar-code {
  padding: 100rpx 0 20rpx;
  margin: 0 20rpx;
  border-bottom: 2rpx solid #eeeeee;
}

.bar-code-code {
  height: 200rpx;
}

.bar_code {
  width: 670rpx;
  height: 200rpx;
  margin: 0 20rpx;
}

.bar-code-num {
  height: 80rpx;
  font-size: 30rpx;
  text-align: center;
  color: #333333;
  line-height: 60rpx;
}

.qr-code > image {
  width: 300rpx;
  height: 300rpx;
  margin: 30rpx 225rpx;
}

.userCodeMask {
  position: absolute;
  top: 0;
  width: 750rpx;
  height: 60vh;
  background-color: #ffffff;
  z-index: 50;
}

/* 用户二维码/条形码 end */

/* 会员权益 start */
.service {
}

/* 会员权益 end */

/* 广告轮播 start */
.swiper-box {
  margin: 20rpx 20rpx 0;
}

.swiper-image {
  width: 710rpx;
}

/* 广告轮播 end */

/* 弹出式广告 start */
.couponPop {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.couponPop .couponPopView {
  width: 500rpx;
  margin: 0 auto;
}

.couponPopView > image {
  width: 500rpx;
}

.dvertisement-close {
  height: 80rpx;
  margin-top: 50rpx;
  text-align: center;
  line-height: 80rpx;
}

/* 弹出式广告 end */

/* 跳转入口 start */
.setup-tool {
  margin-top: 20rpx;
  /* padding-top: 30rpx; */
  background-color: #ffffff;
}

/* 跳转入口 end */
</style>
