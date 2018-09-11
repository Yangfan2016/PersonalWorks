/**
  * Theme: index Utils
  * Dependence: jQuery
  *
  */


// Utils Func
/**
  * @Theme: 添加active样式
  * @Param: eles,eventType,className || 
  *         [eles,child],eventType,className 利用冒泡原理给新DOM也添加事件
  *
  */
var styleActive=function (eles,eventType,className) {
	// 利用冒泡原理给新DOM也添加事件
	if (eles instanceof Array) {
		eles[0].on(eventType,eles[1],function () {
			eles[0].find(eles[1]).each(function (index,item) {
				$(item).removeClass(className);
			});
			$(this).addClass(className);
		});
	} else {
		eles.on(eventType,function () {
			eles.each(function (index,item) {
				$(item).removeClass(className);
			});
			$(this).addClass(className);
		});	
	}
	
}
/**
  * @Theme: play btn switch style
  * @Param: $ele (eg: $("#playBtnGroup").find(".play")), playType:["play","pause"]
  */
var stylePlayBtn=function ($ele,playType) {
	var html_play='<i class="fa fa-play" aria-hidden="true"></i>';
	var html_pause='<i class="fa fa-pause" aria-hidden="true"></i>';
	$ele.html((playType==="play"?html_pause:html_play));
	
};
/**
  * @Theme: 提示框
  * @Param: tipType,tipText
  *			tipType: "error" | "info" | "ok"
  *
  */
var showTipBox=function (tipType,tipText) {
	$("#tipsBox").find(".tip").each(function (index,item) {
		$(item).removeClass("show");
	});
	$("#tipsBox").find(".tip_"+tipType).addClass("show").find(".tiptext").html(tipText);
	$("#backScreen").css("display","block");
	$("#tipsBox").css("display","block").on("animationend",function () {
		$(this).css("display","none");
		$("#backScreen").animate({
			"opacity":"0"
		},30,function () {
			$(this).css({
				"display":"none",
				"opacity":1
			});
		});
	});
};
/**
  * @Theme: 加载框
  * @Param: isShow [,loading_text]
  *			
  *
  */
var showLoadingBox=function (isShow,loading_text) {
	$("#loadingBox").css("display",(!!isShow?"block":"none"));
	!!loading_text && $("#loadingBox").find(".loading_text").html(loading_text);
};
/**
  * @Theme: 时间格式转换
  * @Param: seconds
  * @Memo: s-> h:m:s  1-> 01
  *
  */
var formatTime=function (seconds) {
	var h=0,
		i=0,
		s=Math.floor(seconds);
		h=Math.floor(s/3600);
		i=Math.floor((s%3600)/60);
		s=s%3600%60;

	return {
		H:h=h<10?"0"+h:h,
		I:i=i<10?"0"+i:i,
		S:s=s<10?"0"+s:s
	};
};
/**
  * @Theme: 日期格式转换
  * @Param: seconds
  * @Memo: 1486684800000 -> 2017-02-10
  *
  */
var formatDate=function (timestamp) {
	var now=new Date(timestamp);
	var y=now.getFullYear(),
		m=+1+now.getMonth(),
		d=now.getDate();

	return {
		Y:y,
		M:m=m<10?"0"+m:m,
		D:d=d<10?"0"+d:d
	};
}

$(function () {

	// =========================初始化=====================================

	// 清空所有本地存储数据
	localStorage.clear();

	// ===========================基础交互样式====================================
	
	// tab选项卡切换样式
	styleActive([$(".R_page .tabbtns"),".label_btn"],"click","active");
	// list切换样式
	styleActive([$("#listContainer>.list>.btngroups"),".btn"],"click","active");
	// tr切换样式
	styleActive([$(".infolist"),"tr"],"click","active");

	// 收起 | 展开 歌单列表
	$("#listContainer>.list>.title .unfoldlist").on("click",function () {
		var $btnGroups=$(this).parents(".list").find(".btngroups");
		if ($btnGroups.css("display")==="block") {
			$btnGroups.slideUp(500);
			$(this).html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
		} else {
			$btnGroups.slideDown(500);
			$(this).html('<i class="fa fa-angle-down" aria-hidden="true"></i>');
		}
	});



	// ==========================EXPORT============================

	// export 
	window.styleActive=styleActive;
	window.stylePlayBtn=stylePlayBtn;
	window.showTipBox=showTipBox;
	window.showLoadingBox=showLoadingBox;
	window.formatTime=formatTime;
	window.formatDate=formatDate;
});