<template>
	<view class="copyright">
		Copyright @ 悦朋科技提供技术支持 {{ edition != '' ? ' V' + edition : '' }}
	</view>
</template>

<script>
	export default {
		props: {
			edition: String
		},
		data() {
			return {
				
			}
		},
		mounted() {
			
		}
	}
</script>

<style scoped>
	.copyright {
		height: 100rpx;
		line-height: 80rpx;
		color: #989896;
		font-size: 25rpx;
		text-align: center;
	}
</style>
