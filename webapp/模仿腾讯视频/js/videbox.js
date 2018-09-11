/**
  * Author: Who am I
  * Theme: Tencent videobox
  *	Issue: 1. $(ele).is(":animated")
  * Libs: 1. Zepto-1.2.0
  * Get: 1. 全屏整个页面，(**只能由用户触发事件实现)
  **/


// 开启全屏
function launchFullScreen(ele) {
	if (ele.requestFullscreen) {
		ele.requestFullscreen();
	} else if (ele.webkitRequestFullScreen()) {
		ele.webkitRequestFullScreen();
	} else if (ele.mozRequestFullScreen) {
		ele.mozRequestFullScreen();
	} else if (ele.msRequestFullScreen) {
		ele.msRequestFullScreen();
	}
}
// 退出全屏
function exitFullScreen() {
	if (document.cancelFullScreen) {
		document.cancelFullScreen();
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msCancelFullScreen) {
		document.msCancelFullScreen();
	}
}
// 秒转时分秒
function timeTurn(seconds) {
	var h=Math.floor(seconds/3600);
	var m=Math.floor((seconds%3600-seconds%60)/60);
	var s=Math.floor(seconds%60);
	h=h<10?"0"+h:h;
	m=m<10?"0"+m:m;
	s=s<10?"0"+s:s;
	return {h:h,m:m,s:s};
}
// 生成提示框
function makeTipBox(fontAwesome,text) {
	var $tip=$('<div class="tipbox"><i class="fa '+fontAwesome+'" aria-hidden="true"></i> '+text+'</div>');
	$("#videobox").append($tip);
	$tip.on("animationend",function () {
		$tip.remove(); // css 动画结束后，删除当前节点
	});
}

// 播放器
/**
  * Function: 1. 全屏 | 退出全屏
              2. 播放 | 暂停
              3. 快进 | 快退
              4. 音量增 | 减
              5. 拖动进度条，改变播放进度
              6. 体验功能
  *
  *
  */
// 主
function init() {
	var video=document.getElementById("video");
	var videoBox=document.getElementById("videobox");
	var btnPlay=document.getElementById("btn_play"); // 播放、暂停
	var btnFull=document.getElementById("btn_full"); // 全屏、退出
	var timeStart=document.getElementById("time_start"); // 起始时间
	var timeEnd=document.getElementById("time_end"); // 结束时间
	var progressOffset=$("#progress").get(0).getBoundingClientRect(); // 获取进度条box相对于视窗的位置，返回 {}
	var progressOffset_L=progressOffset.left;
	var progressOffset_W=progressOffset.width;
	var isDrag=false; // 允许、禁止拖动进度条
	var isDo=true; // 用户是否操作
	var isMove=false; // 是否快进，快退
	var start=0;
	var changeTime=0;
	var timer=undefined;

	// 初始化
	// 监听视频canplay事件
	video.addEventListener("canplay",function () {
     	// 刷新播放总长
     	var end=timeTurn(video.duration);
     	timeEnd.innerHTML=end.h+":"+end.m+":"+end.s;
 	},false);
 	// 监听视频播放时间改变事件
	video.addEventListener("timeupdate",function () {
		if (!isDrag) {
		    // 显示起始时间和总长
		    start=timeTurn(video.currentTime);
			timeStart.innerHTML=start.h+":"+start.m+":"+start.s;
		    // 更新进度条
		    $("#progresBar").css({"width":(video.currentTime/video.duration*100).toFixed(2)+"%"}); 
		}
	});
	// 监听视频播放完成事件
	video.addEventListener("ended",function () {
	 	// 清除定时器
	 	clearTimeout(timer);
	 	// 底部控制台显示
		$("#controlbox").animate({
			"opacity":1,
			"bottom":0
		},300);
		// 播放按钮样式变为播放图标
		$("#btn_play").find("i").removeClass().addClass("fa fa-play");
		// 中间按钮显示
		$("#btn_play_center").css("display","block").animate({
			"opacity":1
		},500);
	},false);
	// 监听屏幕旋转事件
	window.addEventListener("orientationchange",function () {
	    if (Math.abs(window.orientation)===90) {
	        // 横屏
	    	videoBox.style.cssText=";width:100vw;height:100vh";
	    } else {
	        // 竖屏
	        exitFullScreen();
	        videoBox.style.cssText=";width:100vw;height:40vh";
	    }
	},false);

	

	// 1. 全屏
	// 触摸全屏按钮，视频全屏(videobox)
	btnFull.addEventListener("touchstart",function () {
		// 判断是否全屏
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
			launchFullScreen(videoBox);
			// 样式变为退出全屏图标
			$("#btn_full").find("i").removeClass().addClass("fa fa-compress");
		} else {
			exitFullScreen();
			// 样式变为全屏图标
			$("#btn_full").find("i").removeClass().addClass("fa fa-expand");
		}
	},false);
	// 触摸video区域，视频全屏(videobox)
	video.addEventListener("touchstart",function () { 
		launchFullScreen(videoBox); // 全屏videobox
		isDo=true; // 用户正在操作
		clearTimeout(timer); // 清除定时器
		// 样式变为退出全屏图标
		$("#btn_full").find("i").removeClass().addClass("fa fa-compress");
		// 底部控制台显示|隐藏
		if (!isMove) {
		    if ($("#controlbox").css("bottom")=="0px") {
			    // 隐藏
			    $("#controlbox").animate({
					"bottom":"-"+$("#controlbox").css("height"),
					"opacity":0
				},300);
			} else {
			    // 显示
			    $("#controlbox").animate({
					"opacity":1,
					"bottom":0
				},300);
			}
		}
	},false);
	// 2. 播放 | 暂停
	// 触摸播放按钮，播放 | 暂停视频
	btnPlay.addEventListener("touchstart",function () {
		if (video.paused) {
			video.play();
			// 中间播放按钮消失
			$("#btn_play_center").css("display","block").animate({
				"opacity":0
			},500,function () {
				$("#btn_play_center").css("display","none");
			});
			// 播放按钮样式变为暂停图标
			$("#btn_play").find("i").removeClass().addClass("fa fa-pause");
			// 底部控制台隐藏
			$("#controlbox").animate({
				"bottom":"-"+$("#controlbox").css("height"),
				"opacity":0
			},300);
		} else {
			video.pause();
			// 中间按钮显示
			$("#btn_play_center").css("display","block").animate({
				"opacity":1
			},500);
			// 播放按钮样式变为播放图标
			$("#btn_play").find("i").removeClass().addClass("fa fa-play");
			// 底部控制台显示
			$("#controlbox").animate({
				"opacity":1,
				"bottom":0
			},300);
		}
	});
	// 触摸video中间播放按钮，播放按钮
	$("#btn_play_center").on("touchstart",function () {
		video.play();
		// 中间播放按钮消失
		$("#btn_play_center").animate({
			"opacity":0
		},500,function () {
			$("#btn_play_center").css("display","none");
		});
		// 播放按钮样式变为暂停
		$("#btn_play").find("i").removeClass().addClass("fa fa-pause");
		// 底部控制台隐藏
		$("#controlbox").animate({
			"bottom":"-"+$("#controlbox").css("height"),
			"opacity":0
		},300);
	});
	// 3. 快进 | 快退
	// 左滑video区域，视频后退 5秒      
    $("#video").on("swipeLeft",function () {
    	var video_curT=video.currentTime;
		video.currentTime=(video_curT-5)<=0?0:(video_curT-5);
		makeTipBox("fa-backward","-5s"); // 生成提示框
	});
	// 右滑video区域，视频前进 5秒
 	$("#video").on("swipeRight",function () {
 		var video_curT=video.currentTime;
		video.currentTime=(video_curT+5)>=video.duration?video.duration:(video_curT+5);
		makeTipBox("fa-forward","+5s"); // 生成提示框
	});
	// 4. 音量增 | 减
	// 上滑video区域，音量增加 20%
 	$("#video").on("swipeUp",function () {
 		var video_vol=video.volume;
		video.volume=((video_vol+0.2)>=1?1:(video_vol+0.2)).toFixed(2);
		makeTipBox("fa-volume-up",video.volume*100+"%"); // 生成提示框
	});
	// 下滑video区域，音量减少 20%
 	$("#video").on("swipeDown",function () {
 		var video_vol=video.volume;
		video.volume=((video_vol-0.2)<=0?0:(video_vol-0.2)).toFixed(2);
		makeTipBox("fa-volume-down",video.volume*100+"%"); // 生成提示框
	});
	// 5. 拖动圆点，改变播放进度
	// 拖动圆点，改变进度条
	$("#controlArc").on("touchstart",function (ev) {
	    var ev=ev?ev:window.event;
	    var ex=ev.touches[0].clientX;
	    var arcOffset=$("#controlArc").get(0).getBoundingClientRect();
	    var arcOffset_L=arcOffset.left;
	    var disX=ex-arcOffset_L;
	    isDrag=true;
	    // 点击样式
	    $(this).addClass("hover");
	    $("#controlArc").on("touchmove",function (ev) {
	        if (isDrag) {
	            // 更新进度条
	            var ev=ev?ev:window.event;
	            var ex2=ev.touches[0].clientX;
	            var disX2=(((ex2-progressOffset_L-disX)/progressOffset_W)*100).toFixed(2);
	           	disX2=disX2<=0?0:(disX2>=100?100:disX2); 
	           	$("#progresBar").css("width",disX2+"%"); 
	           	
	           	// 更新时间
	           	changeTime=video.duration*disX2/100;
	           	start=timeTurn(changeTime);
	           	timeStart.innerHTML=start.h+":"+start.m+":"+start.s;
	        }
	    });
	});
	// 手势抬起，禁止拖动
	$("#controlArc").on("touchend",function () {
	   	isDrag=false;
	   	video.currentTime=changeTime;
	   	// 移除点击样式
	   	$(this).removeClass("hover");
	});
	// 6. 体验功能(3秒用户不操作后，控制台自动隐藏)
	// 触摸videobox区域，用户正在操作
	$("#videobox").on("touchstart",function () {
	    isDo=true;
	    clearTimeout(timer);
	});
	// 抬起手指(videobox区域)，用户不操作
	videobox.addEventListener("touchend",function () {
	    isDo=false;
	    isMove=false;
	    // 3秒用户不操作后，控制台自动隐藏
	    if ($("#controlbox").css("bottom")=="0px" && !isDo && !video.paused) {    
		    timer=setTimeout(function () {
				// 隐藏
			    $("#controlbox").animate({
					"bottom":"-"+$("#controlbox").css("height"),
					"opacity":0
				},300,function () {
				    clearTimeout(timer);
				});
			},3000);
		}
	}); 
	// 滑动屏幕，用户操作
	$("#video").on("touchmove",function () {
	    isDo=true;
	    isMove=true;
	    clearTimeout(timer);
	    if ($("#controlbox").css("opacity")==0) {
	    	$("#controlbox").css({
		    	"bottom":0,
		    	"opacity":1
		    });
	    }
	});
}
window.addEventListener("load",init,false);

