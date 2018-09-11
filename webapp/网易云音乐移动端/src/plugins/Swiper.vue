<template>
	<div class="swiper">
		<swiper v-bind:options="swiperOption" ref="mySwiperA">
			<!-- 幻灯内容 -->
			<swiper-slide v-for="banner in banners" v-bind:key="banner"><img v-bind:src="banner" alt="" /></swiper-slide>
			<!-- 以下控件元素均为可选 -->
			<div class="swiper-pagination" slot="pagination"></div>
			<!-- <div class="swiper-button-prev" slot="button-prev"></div>
			<div class="swiper-button-next" slot="button-next"></div> -->
			<!-- <div class="swiper-scrollbar"  slot="scrollbar"></div> -->
		</swiper>
	</div>
</template>
<script>
  export default{
    data(){
      return {
      	banners:[
      		'./static/1.png',
      		'./static/2.png',
      		'./static/3.png',
      		'./static/4.png',
      		'./static/5.png'
      	],
        swiperOption: {
          // 所有配置均为可选（同Swiper配置） 
          notNextTick: true,
          autoplay: 3000,
          loop:true,
          grabCursor : true,
          setWrapperSize :true,
          autoHeight: true,
          pagination : '.swiper-pagination',
          paginationClickable :true,
          // prevButton:'.swiper-button-prev',
          // nextButton:'.swiper-button-next',
          // scrollbar:'.swiper-scrollbar',
          mousewheelControl : true,
          observeParents:true,
          onTransitionStart(swiper){
           //console.log(swiper)
          }
      }
    }
  },
  computed: {
    swiper() {
     return this.$refs.mySwiperA.swiper
    }
  },
  mounted() {
    //console.log("每次切换都会触发我");
    // this.swiper.slideTo(3, 1000, false)
    // console.log(this.swiper);
   }
}
</script>