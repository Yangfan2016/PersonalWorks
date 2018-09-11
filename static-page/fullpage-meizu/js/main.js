/** @Ahthors: Who am I ?
  * @Theme: simulator the page of meizu(meilan note2)
  * @Time: 2016/08/12
  * @Gets: fullpage.js
  */

  
$(document).ready(function () {
	var $nav_2=$("#nav_2"); // 获取固定导航元素
	// 启用全屏插件   // $(fp).fullpage();
	$("#fp_meizu").fullpage({
		verticalCentered:false, // 取消垂直居中
		navigation:true, // 显示导航圆点
		navigationTooltips:['','青年良品','多彩纤薄机身','一体化成型','5.5 英寸 1080P','64 位八核 CPU','双 4G 双卡双待','1300 万像素','3100mAh 典型容量','Android 5.1 内核',''], // 设置导航圆点提示信息
		scrollingSpeed:700, // 设置滚动速度
		anchors:['','qingnian','duocai','yitihua','1080P','64CPU','dual4G','1300w','3100mAh','Android',''], // 设置锚链接
		// 页面离开回调函数
		onLeave:function (index,nextIndex,direction) {
			// 设置顶部固定导航条的动画
			if (index==2 && nextIndex==1 && direction=='up') {
				$nav_2.animate({
					'top':'84px'
				},700);
			}
			else if (index==1 && nextIndex==2 && direction=='down') {
				$nav_2.animate({
					'top':'0'
				},300);
			}
			else if (index==3 && nextIndex==2 && direction=='up') {
				$nav_2.animate({
					'top':'0'
				},500);
			}
			else {
				$nav_2.animate({
					'top':'-84px'
				},500);
			}
			// 页面离开时初始化页面动画
			switch (index) {
				case 2:
				$(".s-qingnian>*").animate({'opacity':'0.5'},500);
				break;
				case 3:
				$(".s-duocai>.img_box>img.blue").animate({'left':'-600px'},700);
				$(".s-duocai>.img_box>img.white").animate({'left':'2000px'},700);
				break;
				case 4:
				$(".s-yitihua>.detail-box").animate({'top':'100%'},500);
				break;
				case 5:
				$(".s-1080p .info-list").slideUp(500);
				break;
				case 6:
				$(".s-64bitcpu>.detail-box>h1").animate({'left':'100%'},700);
				$(".s-64bitcpu>.detail-box>p").animate({'right':'100%'},700);
				break;
				case 7:
				$(".s-dual4G>.phone-card>img.cc-b").show(300);
				$(".s-dual4G>.phone-card>img.cc-a").hide(500);
				break;
				case 8:
				$(".s-1300w").animate({'opacity':'0.2'},800);
				break;
				case 9:
				$(".s-3100mah>.detail-box>h1").animate({'bottom':'200%'},700);
				$(".s-3100mah>.detail-box>p").animate({'top':'200%'},700);
				break;
			}
		},
		// 页面加载完后回调函数
		afterLoad:function (anchorLink,index) {
			// 设置页面动画
			switch (index) {
				case 2:
				$(".s-qingnian>*").animate({'opacity':'1'},500);
				break;
				case 3:
				$(".s-duocai>.img_box>img.blue").animate({'left':'230px'},700);
				$(".s-duocai>.img_box>img.white").animate({'left':'480px'},700);
				break;
				case 4:
				$(".s-yitihua>.detail-box").animate({'top':'60%'},500);
				break;
				case 5:
				$(".s-1080p .info-list").slideDown(500);
				break;
				case 6:
				$(".s-64bitcpu>.detail-box>h1").animate({'left':'0'},700);
				$(".s-64bitcpu>.detail-box>p").animate({'right':'0'},700);
				break;
				case 7:
				$(".s-dual4G>.phone-card>img.cc-b").hide(500);
				$(".s-dual4G>.phone-card>img.cc-a").show(300);
				break;
				case 8:
				$(".s-1300w").animate({'opacity':'1'},800);
				break;
				case 9:
				$(".s-3100mah>.detail-box>h1").animate({'bottom':'0'},700);
				$(".s-3100mah>.detail-box>p").animate({'top':'0'},700);
				break;
			}
		},
	});
});