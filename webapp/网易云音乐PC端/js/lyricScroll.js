/**
  * Theme: 歌词滚动
  * Dependence: jQuery
  * 
  */


/**
  * @Theme: 歌词时间格式转换
  * @Param: str
  * @Memo: 02:23.656-> 143.656
  *
  */
function formatLyricTime(str) {
	var arr=str.split(":");
	var second=0;
	if (arr.length==3) {
		second=-(-arr[0]*3600-arr[1]*60-arr[2]);
	} else {
		second=-(-arr[0]*60-arr[1]);
	}
	return second.toFixed(3);
}
/**
  * @Theme: 格式化歌词
  * @Param: str
  * @Memo: "[02:03.456]abc\n..." -> [{"timepoint":123.456,"lrcstr":"abc"},...]
  *
  */
function formatLyric(str) {
	var arr=[],
		brr=[],
		crr=[],
		data={};

	// 将字符串按“\n” 分割成数组
	arr=str.split("\n");
	// 去除最后一个空格
	arr.splice(-1,1);
	// 存入crr数组中
	for (var i=0;i<arr.length;i++) {
		// 将字符串按“]” 分割成数组
		brr=arr[i].split("]");
		// 匹配歌词时间，排除歌词附加信息 eg: "by:Treckiefans"
		// /^(\d+:){1,2}\d+\.?\d+$/g  match 00:02 || 00:00:03 || 00:00:05.2
		if (!!/^(\d+:){1,2}\d+\.?\d+$/g.test(brr[0].substring(1))) {
			data={
				"timepoint":formatLyricTime(brr[0].substring(1)),
				"lrcstr":brr[1] || "<br />"
			};
			// 将所有键值对放入数组中
			crr.push(data);
		} else {
			// 歌词贡献者信息，暂不处理 "by:Treckiefans"
		}
	}
	return crr;
}
/**
  * @Theme: 生成歌词 DOM
  * @Param: crr: 歌词信息数组 lrcBox 包围歌词的盒子
  * @Memo: 
  *
  */ 
function createLyricDOM(crr,lrcBox) {
	var docFrag=document.createDocumentFragment();
	// 清空lrcBox
	lrcBox.innerHTML="";
	for (var j=0;j<crr.length;j++) {
		var p=document.createElement("p");
		p.dataset.timepoint=crr[j]['timepoint'];
		p.dataset.index=j;
		p.className="lrc";
		p.innerHTML=crr[j]['lrcstr'];
		docFrag.appendChild(p);
		lrcBox.appendChild(docFrag);
	}
}



/**
  * @Theme: 歌词滚动  主函数
  * @Param: data={'jQ_lrcContainer':$lrcContainer,'jQ_lrcBox':$lrcBox,'jQ_audio':$audio}
  * @Memo: 主函数
  *
  */ 
function mainLrcScroll(data) {

	// init
	var $lrcContainer=data.jQ_lrcContainer,
		$lrcBox=data.jQ_lrcBox,
		$audio=data.jQ_audio,
		str=data.str,
		cls="lrc",
		cls_active="current";
	// srcoll
	var isScroll=true, // 是否允许滚动
	 	curIndex=-1; // flag
	localStorage.setItem("curLine",0); // 存储当前行

	/**
	  * @Theme: 歌词滚动
	  * @Param: i: 当前滚动行
	  * @Memo: 
	  *
	  */ 
	var jQ_moveLrc=function (i) {
		var top=$lrcBox.find(".lrc").get(i).dataset.top;
		if (!!isScroll) {
			// 如果当前行与curIndex不等则滚动
			if (i!==curIndex) {
				$lrcContainer.stop(true).animate({
					"scrollTop":top
				},300);
				curIndex=i;
			}
		}
	}


	// 格式化歌词
	var arrLrc=formatLyric(str);
	// 创建歌词DOM
	createLyricDOM(arrLrc,$lrcBox.get(0));

	// 限制滚动范围
	var minHeight=$lrcContainer.height()/2;
	var maxHeight=$lrcBox.height()-$lrcContainer.height();
	// 存入各行滚动值
	$lrcBox.find(".lrc").each(function (index,item) {
		var offsetTop=item.offsetTop;
		offsetTop=(offsetTop<=minHeight)?0:offsetTop-minHeight;
		offsetTop=(offsetTop>=maxHeight)?maxHeight:offsetTop;
		item.dataset.top=offsetTop;

	});
	// 默认第一行歌词高亮
	$lrcBox.find(".lrc").eq(0).addClass("current");

	//=================audio的timeupdate事件监听=====================
	$audio.on("timeupdate",function () {
		var _this=this;
		$lrcBox.find(".lrc").each(function (index,item) {
			if (Math.abs(_this.currentTime-item.dataset.timepoint)<=1) {
				$(item).addClass("current").siblings().removeClass("current");
				jQ_moveLrc(index);
				localStorage.setItem("curLine",index);
			}
		});
	});
	//=================audio的播放结束事件监听=====================
	$audio.on("ended",function () {
		$lrcContainer.stop(true).animate({
			"scrollTop":0
		},300);
	});
	//=================鼠标的移入移出事件监听=====================
	// 鼠标移入，歌词停止滚动，鼠标移除，歌词恢复滚动
	$lrcContainer.on("mouseover",function () {
		isScroll=false;
	}).on("mouseout",function () {
		isScroll=true;
	});

}

// export
window.mainLrcScroll=mainLrcScroll;
