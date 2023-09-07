<template>
	<view class="content">
		<web-view :src="embedSrc"></web-view>
		
		<!-- 暂无设置公众号 -->
		<view class="isembed" v-if="embedSrc == ''">
			<u-empty text="暂未设置公众号" mode="message"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				embedSrc: ''
			}
		},
		onLoad(options) {
			this.embedSrc = options.embedSrc ? options.embedSrc : this.config.embedSrc
			// 动态设置导航栏标题
			uni.setNavigationBarTitle({
			    title: options.title
			})
		},
		methods: {
			
		}
	}
</script>

<style>
	page {
		background-color: #EEEEEE;
	}
</style>

<style scoped>
	.isembed{
		margin-top: 20vh;
	}
</style>
