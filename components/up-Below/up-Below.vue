<!-- 
组件用法：
	<upBelow v-on:pulldown="pulldown" v-on:reachbottom="reachbottom">
		自定义刷新动画
		<view class="pulldown-loadng" slot="pulldown">
			<view class="loading-icon-text">
				<image class="loadingImg" src="../../static/up-Below/refresh.png" alt="刷新logo"></image>
				喜欢请5评，谢谢...
			</view>
		</view>
		需要展示的内容
		<view slot="content">
			<view v-for="t in 50">
				请下拉刷新或者上拉加载：查看打印{{t}}
			</view>
		</view>
		预留空位 （可选）
		<view slot="empty" style="height: 100rpx;"></view>
	</upBelow>
	
	js
	import upBelow from "@/components/up-Below/up-Below.vue"
	components: {
		upBelow
	}
	
	pulldown(e) {
		let {
			stop
		} = e;
		console.log("触发下拉刷新");
		setTimeout(() => {
			console.log("刷新成功");
			stop();
		}, 1000)
	},
	reachbottom(e) {
		let {
			stop
		} = e;
		console.log("触发上拉加载");
		setTimeout(() => {
			console.log("加载成功");
			stop();
		}, 1000)
	}

 -->


<template>
	<scroll-view
	  class="scroll-view"
	  scroll-y="true"
	  @scrolltoupper="bindscrolltoupper"
	  @scrolltolower="bindscrolltolower"
	  @scroll="bindscroll"
	  @touchstart="touchstart"
	  @touchmove="touchmove"
	  @touchend="touchend"
	>
	  <view class="pulldown-loading-box" v-bind:style="'transform:translateY('+(-(115-offset))+'%)'">
		 <!-- 加载动画 -->
		 <slot name="pulldown"></slot>
	  </view>
	  <view class="main" v-bind:style="'transform:translateY('+offset*1.5+'rpx)'">
		<!-- 内容 -->
		<slot name="content"></slot>
		<!-- tab空位 -->
		<slot name="empty"></slot>
	  </view>
	</scroll-view>
</template>

<script>
	export default{
		data(){
			return {
				offset: 0,
				onTheTop:true,
				touchSpot: {
					startX: 0,
					startY: 0
				 },
			}
		},
		methods:{
			bindscrolltolower: function (e) {
        //可以从父组件传值统一控制上拉加载结束
        if ( this.lock) return;
        this.lock = true;
        //上拉加载
        this.$emit("reachbottom",{
          stop: () => {
            this.lock = false;
          }
        });
			 },
			bindscrolltoupper: function (e) {
			  this.onTheTop = true;
			},
			bindscroll: function (e) {
			  if (e.detail.scrollTop === 0) {
				this.onTheTop = true;
			  } else {
				this.onTheTop = false;
			  }
			},
			touchstart(e) {
			  if (!this.onTheTop || !e.changedTouches[0]) return;
			  const { pageX, pageY } = e.changedTouches[0];
			  this.touchSpot.startX = pageX;
			  this.touchSpot.startY = pageY;
			},
			touchmove(e) {
			  //return//关闭下拉刷新
			  if (!this.onTheTop || !e.changedTouches[0]) {
				return;
			  } else if (!this.touchSpot.startX) {
				const { pageX, pageY } = e.changedTouches[0];
				this.touchSpot.startX = pageX;
				this.touchSpot.startY = pageY;
				
				return;
			  }
			  const { pageX, pageY } = e.changedTouches[0];
			  let offset = (pageY - this.touchSpot.startY) / 2;
			  this.offset=offset > 100 ? 100 : offset;
			
			},
			touchend(e) {
			  // return
			  if (this.offset >= 70) {
				if (this.offset < 100) {
					this.offset=100;
				}
        // 下拉刷新
        this.$emit("pulldown",{
					stop:()=>{
						setTimeout(() => {
						  this.offset=0
						}, 600);
					}
				});
			   
			  } else {
				  this.offset=0
			  }
			  this.resetTouchSpot();
			},
			resetTouchSpot() {
			  this.touchSpot = {
				startX: 0,
				startY: 0
			  };
			}
		}
	}
</script>

<style>
	.scroll-view {
	  position: absolute;
	  top: 0;
	  bottom: 0;
	  right: 0;
	  left: 0;
	}
	
	.pulldown-loading-box {
	  position: fixed;
	  left: 0;
	  right: 0;
	  z-index: 3;
	  transform: translateY(-100%);
	  transition: transform .3s;
	}
	.main {
	  transition: transform .3s;
	}
</style>
