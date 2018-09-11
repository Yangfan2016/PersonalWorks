/**
  * Author: Who am I ?
  * Theme: 多物体运动框架
  * Time: 2016-09-18
  * Info: width,height,font-size,top,left,right,bottom,opacity
  * @Issues: 
  *
  */

// cssGetSet()  ele,attr,val
function cssGetSet() {
    var ele=arguments[0];
    var attr=arguments[1];
    var val=arguments[2];
    if (arguments.length===2) {
        if (window.getComputedStyle) {
            return getComputedStyle(ele,false)[attr];
        } else {
            return ele.currentStyle[attr];
        }
    } else if (arguments.length===3) {
        if (attr==="opacity") {
            ele.style.cssText+=";opacity:"+val+";filter:alpha(opacity="+val*100+");";
        } else {
            ele.style[attr]=val+"px";
        }
        
    }
}
    
// ele,attr,toVal,time
function startMove(ele,attr,toVal,time) {
    var freshTime=time; // 30,15,5
    var speed=0;
    var to=parseInt(toVal);
    var from=parseInt(cssGetSet(ele,attr));
    // 初始化
    clearInterval(ele.timer);
    ele.timer=setInterval(function () {
        from=parseInt(cssGetSet(ele,attr));
        if (from==to) {
            clearInterval(ele.timer);
        } else {
            // 计算速度
            speed=(to-from)/10;
            // 取整
            speed=speed>0?Math.ceil(speed):Math.floor(speed);
            // 设置移动状态
            cssGetSet(ele,attr,(from+speed));
            document.title="速度"+speed;
        }
        
        
    },freshTime);
}