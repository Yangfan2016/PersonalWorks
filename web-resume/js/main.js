/**
  * Author:Who am I ?
  * Theme:Resume
  * Time:2016-11-11
  **/
function getId(selector) {
	return document.getElementById(selector);
}
function init() {
	var lockScreen=getId("lockScreen");
	var bigBox=getId("bigBox");
	var preSmall=getId("preSmall");
	var preBig=getId("preBig");
	var bigClose=getId("bigClose");
	var tabNav=getId("tabNav");
	var tabNavLis=tabNav.getElementsByTagName("a");
	var detailBox=getId("detailBox");
	var detailBoxItems=detailBox.querySelectorAll(".detail_item");
	// 添加索引
	for (var i=0,len=tabNavLis.length;i<len;i++) {
		tabNavLis[i].setAttribute("index",i);
		detailBoxItems[i].setAttribute("index",i);
	}
	// 打开信息放大框
	preSmall.addEventListener("click",function () {
		preBig.innerHTML=preSmall.innerHTML;
		bigBox.style.display="block";
		lockScreen.style.display="block";
	},false);
	// 关闭信息放大框
	bigClose.addEventListener("click",function () {
		bigBox.style.display="none";
		lockScreen.style.display="none";
		preBig.innerHTML="";
	},false);
	// 选项卡
	tabNav.addEventListener("click",function (ev) {
		ev=ev?ev:window.event;
		target=ev.target || window.event.srcElement;
		if (target.tagName==="A") {
			var num=+target.getAttribute("index");
			for (var i=0,len=detailBoxItems.length;i<len;i++) {
				detailBoxItems[i].className=detailBoxItems[i].className.replace(" active","");
			}
			detailBoxItems[num].className+=" active";
		}
	},false);
}
window.addEventListener("load",init,false);