/**
  * Time: 2016-09-06
  * Update: 2016-09-14
  * Author: Who am I ?
  * Theme: calculator
  * Issues: 1. 浮点运算精度丢失问题=>toFixed(n) 四舍五入保留n位小数
  *          2. 前导0过滤问题=> 正则表达式不熟
  *          3. 阻止冒泡导致的副作用
  */
  
// param:ele,eventType,callback
function bindEvent(ele,eventType,callback) {
    if (typeof ele.addEventListener==='function') {
        ele.addEventListener(eventType,callback,false);
    } else if (typeof ele.attachEvent==='function') {
        ele.attachEvent('on'+eventType,callback);
    } else {
        ele['on'+eventType]=callback;
    }
}
// param:str,eq
function getDom(str) {
        return  document.querySelectorAll(str) || alert("不支持querySelectorAll");
}
// 滚动到底部
function scrollBottom(outter,inner) {
	outter.scrollTop=inner.offsetHeight-outter.offsetHeight+20;
	// 还有20px的margin
}
// 00=>0   ???
function delZero(html) {
    return html.replace(/([^0]0{1,})([1-9]+)[+]?/g,"$2");
}
// 保留2位小数
function calc(exp) {
    try{
        result=eval(exp).toFixed(2);
    } catch(er) {
        //result=er;
        result='<span class="wrong">出错了呀！</span>';
    }
    return result;
}

// main func
function init() {
    var screen=getDom(".screen")[0];
    var scrollBox=getDom(".screenbox .scrollbox")[0];
    var input=getDom(".scrollbox .input")[0];
    var output;
    var operatorBox=getDom(".operatorbox")[0];
    var options=getDom(".operatorbox>div");
    var result="";
    var str="";
    var clear=getDom("#clear")[0];
    var equal=getDom("#equal")[0];
    var del=getDom("#del")[0];
    
    // 事件代理
    bindEvent(operatorBox,"touchstart",function (ev) {
        var ev=ev?ev:window.event;
        var target=ev.target || ev.srcElement;
        // 触摸交互效果
        target.className+=" active";
    });
    // 事件代理
    bindEvent(operatorBox,"touchend",function (ev) {
        
        var ev=ev?ev:window.event;
        var target=ev.target || ev.srcElement;
        // 触摸交互效果
        target.className=target.className.replace(" active","");
        
        if (target.nodeName==="DIV" && target.parentNode===operatorBox) {
            // 过滤关键字，并加入输入框中
            if (input.innerHTML==="0") {
                input.innerHTML="";
            }
            input.innerHTML+=(target.innerHTML+"").replace(/(del|AC|C)/g,"");
            str+=(target.innerHTML+"").replace(/(del|AC|C)/g,"").replace("×","*").replace("÷","/").replace("％","%");
            
            if (target.className!=="clear") {
                clear.innerHTML="C";
            }
            //delZero(input.innerHTML);
        }
        scrollBottom(screen,scrollBox);
    });
    // 计算结果
    bindEvent(equal,"touchend",function () {
        result=calc(str || 0);
        output=document.createElement("p");
        output.className="output";
        output.innerHTML=input.innerHTML+"=<br/>"+result;
        scrollBox.insertBefore(output,input);
        input.innerHTML="0";
        str="";
        clear.innerHTML="AC";
        scrollBottom(screen,scrollBox);
    });
    // 逐个删除输入框内容
    bindEvent(del,"touchend",function (ev) {
        input.innerHTML=input.innerHTML.substring(0,input.innerHTML.length-1);
        if (input.innerHTML==="") {
            input.innerHTML="0";
        }
        str=input.innerHTML;
        // 阻止冒泡
        ev.stopPropagation();
        // 副作用
        this.className=this.className.replace(" active","");
    });
    // 清除屏幕
    bindEvent(clear,"touchend",function (ev) {
        if (this.innerHTML==="C") {
            input.innerHTML="0";
            str="";
        } else if (this.innerHTML==="AC") {
            scrollBox.innerHTML='<p class="input">0</p>';
            input=getDom(".input")[0];
        }
        // 阻止冒泡
        ev.stopPropagation();
        // 副作用
        this.className=this.className.replace(" active","");
    });
    
    alert("Action: \n"+"结果保留两位小数");
}

bindEvent(window,'load',init);