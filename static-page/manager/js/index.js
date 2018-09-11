/**
  * Author:ZH
  * Theme:page
  * Time
  **/

// 计算指定月[,指定年]的月份的最大天数
function lastDay(month,undefinded) {
	var month=month+""; // to string
	var lastDay=1;
	var year=new Date().getFullYear();
	if (arguments.length===2) {
		year=arguments[1];
	}
	switch (month) {
		case "1":
		case "3":
		case "5":
		case "7":
		case "8":
		case "10":
		case "12":
			lastDay=31;
			break;
		case "4":
		case "6":
		case "9":
		case "11":
			lastDay=30;
			break;
		case "2":
			if (year%400===0 || (year%4===0 && year%100!==0)) {
				lastDay=29; // 闰年
			} else {
				lastDay=28;
			}
			break;
		default:alert("SWITCH ERROR");
			break;
	}
	return lastDay;
}
// 主
function init() {

	// tab选项卡
	var tab=document.getElementById("tab");
	var labs=tab.getElementsByTagName("label");
	// 监听事件
	tab.addEventListener("click",function (ev) {
		var ev=ev?ev:window.event;
		var target=ev.target || window.srcElement;
		var i=0,len=labs.length;
		for (;i<len;i++) {
			labs[i].className="";
		}
		if (target.nodeName==="LABEL") {
			target.className="active";
		}
	},false);

	// 轮播图
	var count=4;
	// 前一页
	$("#btnPrev").click(function () {
		var ulLeft=Math.floor(Math.abs(parseInt($("#blockBox").css("left"))));
		var containerW=$("#container").width();
		if (!$("#blockBox").is(":animated")) {
			if (ulLeft===0) {
				$("#blockBox").animate({
					"left":"-"+containerW*(count-1)+"px",
				},500);
			} else {
				$("#blockBox").animate({
					"left":"+="+containerW+"px",
				},500);
			}
		}
	});
	// 后一页
	$("#btnNext").click(function () {
		var ulLeft=Math.floor(Math.abs(parseInt($("#blockBox").css("left"))));
		var containerW=$("#container").width();
		if (!$("#blockBox").is(":animated")) {
			if (ulLeft===(count-1)*containerW) {
				$("#blockBox").animate({
					"left":"0",
				},500);
			} else {
				$("#blockBox").animate({
					"left":"-="+containerW+"px",
				},500);
			}
		}
	});

	// 文件夹折叠下拉
	$("#folderbox").on("click",".folderbtn",function (ev) {
		$(this).siblings(".usercontent_files").slideToggle();
		if (!this.flag) {
			$(this).closest(".folder").addClass("active");
		} else {
			$(this).closest(".folder").removeClass("active");

		}
		this.flag=!this.flag;
	});

	// 登录框放大镜的显示与隐藏
	$("#inputQuery").blur(function () {
		if (this.value.length!==0) {
			this.style.backgroundImage="url()";
		}
	});

	// 日历
	function makeCalendar(year,month) {
		var $tds=$("#calendarBox").find("td");
		var now=new Date(year+"/"+month+"/01"); 
		var week=now.getDay(); // 获取本月第一天的星期 4
		var first=1;
		var last=lastDay(month);
		// 清空
		$tds.each(function (index,item) {
			$(item).html("");
		});
		// 生成日历
		for (var i=week;i<last+week;i++) {
			$tds.eq(i).html('<span class="day">'+first+'</span><br /><span class="lunar">初一</span>');
			first++;
		}
	}
	makeCalendar(new Date().getFullYear(),new Date().getMonth()+1); // 2016,12

	// 选择日期生成新日历
	var now=new Date();
	var year=now.getFullYear();
	var month=+now.getMonth()+1;
	// 默认选中今年的本月
	$("#selectYear").find("option").each(function (index,item) {
		item.selected=false;
		if (parseInt($(item).html())==year) {
			item.selected=true;
		}
	});
	$("#selectMonth").find("option").each(function (index,item) {
		item.selected=false;
		if (parseInt($(item).html())==month) {
			item.selected=true;
		}
	});
	// 下拉菜单选择指定日期
	$("#selectYear").bind("change",function () {
		makeCalendar(this.value,$("#selectMonth").val());
	});
	$("#selectMonth").bind("change",function () {
		makeCalendar($("#selectYear").val(),this.value);
	});
	
	// 返回今天
	$("#backToNow").click(function () {
		makeCalendar(new Date().getFullYear(),new Date().getMonth()+1); // 2016,12
		$("#selectYear").val(new Date().getFullYear());
		$("#selectMonth").val(new Date().getMonth()+1);
	});

	// 农历计算
	//???

}
window.addEventListener("load",init,false);



