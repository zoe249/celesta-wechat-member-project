<template>
  <view>
    <!-- 加载 -->
    <yp-loading ref="loading" :type="2"></yp-loading>
    <!-- 无网络提示 -->
    <u-no-network></u-no-network>
  </view>
</template>

<script>
import ypLoading from "@/components/yp-loading/yp-loading.vue";
export default {
  components: {
    ypLoading,
  },
  data() {
    return {
      isLogin: false, // 是否已绑定账号
      isEntrance: "01", // 01：项目正常启动进入，02：未登录点击登录进入
    };
  },
  onLoad(option) {
    if (option.isEntrance) {
      this.isEntrance = option.isEntrance;
    }
  },
  onShow() {
    uni.hideHomeButton();
    // 自动登录
    this.onLogin();
    // 获取配色
    this.uiColor();
  },
  methods: {
    // 自动登录
    onLogin() {
      let that = this;
      that.$refs.loading.open();
      uni.login({
        success: (res) => {
          uni.removeStorageSync("token");
          that
            .request({
              url:
                that.config.getLogin +
                "?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=" +
                res.code +
                "&appCode=00",
              method: "POST",
              header: {
                "Content-Type": "application/json; charset=utf-8",
              },
            })
            .then((res) => {
              // 用户存在
              let data = res.data;
              that.$refs.loading.close();
              if (res.statusCode == 200 && data.access_token) {
                // 保存 token 到全局
                uni.setStorageSync("token", data.access_token);
                // 获取会员用户
                that.memberUser();
              } else {
                // 未注册
                getApp().globalData.isLogin = 1;
                console.log(that.isEntrance);
                if (that.isEntrance == "01") {
                  uni.reLaunch({
                    url: "../home/index-unauthorized",
                  });
                } else {
                  uni.reLaunch({
                    url: "../login/login",
                  });
                }
              }
            });
        },
      });
    },
    // 获取用户会员信息
    memberUser() {
      let that = this;
      that.$refs.loading.open();
      that
        .request({
          url: that.config.memberUser,
        })
        .then((res) => {
          that.$refs.loading.close();
          if (res.statusCode != 200) return;
          // 缓存用户信息
          console.log("获取用户的会员信息", res.data);
          uni.setStorageSync("memberInfo", res.data);
          // 已注册
          getApp().globalData.isLogin = 2;
          // 会员卡是否领取
          that.getCardInfo();
        });
    },
    // 会员卡是否领取
    getCardInfo() {
      let that = this;
      that.$refs.loading.open();
      uni.request({
        url:
          that.config.protocol +
          that.config.host +
          that.config.getCardStatusByUser,
        method: "GET",
        data: {
          unionId: uni.getStorageSync("memberInfo").unionId,
        },
        success: (res) => {
		  res.data.detail = 1
          that.$refs.loading.close();
		  
          if (res.data.detail == 1) {
            // 存在已领取
            // 已注册已领取 完成
            uni.reLaunch({
              url: "../home/index",
            });
          } else if (res.data.detail == 0) {
            // 跳转领取会员卡
            uni.redirectTo({
              url: "../receiveCard/receiveCard",
            });
          } else {
            // 未关注公众号
            uni.showToast({
              title: res.data.detail,
              icon: "none",
            });
            setTimeout(() => {
              uni.reLaunch({
                url: "../home/index",
              });
            }, 2000);
          }
        },
      });
    },
  },
};
</script>

<style scoped></style>
