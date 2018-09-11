/**
  *
  *  
  */

// 导入文件
var define=function (srcPath) {
    var script=document.createElement("script");
    var head=document.getElementsByTagName("head")[0];
    script.src=srcPath;
    head.appendChild(script);
};
// 导入jQuery
define("../../libs/jQuery-3.1.1/jquery-3.1.1.min.js");  // 路径相对于index.html文件

function init() {
    // alert($().jquery);
    // 插件开始
    $.fn.extend({
        "ripple":function (eventType) {
            return $(this).each(function () {
                var me=$(this);
                me.on(eventType,function (ev) {
                    var ex=ev.clientX || ev.touches[0].clientX;
                    var ey=ev.clientY || ev.touches[0].clientY;
                    var x=ex-me.offset().left-2;
                    var y=ey-me.offset().top-2;
                    var rippleEle=$("<span class='ripple'></span>");
                    rippleEle.css({
                "top":y+"px",
                "left":x+"px"  
                    });
                    me.append(rippleEle);
                    rippleEle.on("animationend",function () {
                        rippleEle.remove();
                    
                    });
                });
            });
        }
    });
    
    $("#more").ripple("touchstart");
    $(".capturebox").css({
        "position":"relative",
        "overflow":"hidden"
    }).ripple("touchstart");
}
window.addEventListener("load",init,false);
// DOMContentLoaded

