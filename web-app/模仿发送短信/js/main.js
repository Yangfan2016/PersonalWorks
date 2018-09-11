/**
  * Time: 2016-08-28
  * Author: Who am I ?
  * Theme: Meizu Message App simulator
  * Issues: 
  */
  
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
function getDom() {
    var str="",eq=0;
    str=arguments[0];
    eq=arguments[1];
    if (arguments.length===1) {
        return document.querySelector(str);
    } else if (arguments.length===2) {
        if (eq==="all") {
            return document.querySelectorAll(str);
        } else {
            return document.querySelectorAll(str)[eq];
        }
    } else {
        alert("格式不对或不支持querySelectorAll/querySelector");
    }
}

function setCss(ele,str) {
    ele.style.cssText=""+str;
}
// 8月28日 19:37   m月d日 h:min 
function getTime(format) {
    var now=new Date();
    var y=now.getFullYear();
    var m=now.getMonth()+1;
    var d=now.getDate();
    var h=now.getHours();
    var min=now.getMinutes();
    var s=now.getSeconds();
    // 12小时制
    var am="";
    h=+h; // 转换成数字
    am=h>12?"下午 ":"上午 ";
    h=h>12?h-12:h;
    h=h<10?"0"+h:h;
    min=min<10?"0"+min:min;
    s=s<10?"0"+s:s;
    
    return m+"月"+d+"日 "+am+h+":"+min;
}

function madeMessage(parent,val,dir) {
    // 去空格
    var text=val.trim();
    var time="";
    var child=document.createElement("div");
    time=getTime("8月28日 19:37");
    child.className="container clearfix";
    child.innerHTML=
   		'<div class="msgbox '+dir+'">'+
      		'<div class="time">'+time+'</div>'+
      		'<p class="message">'+text+'</p>'+
      		'<div class="dele">删除</div>'+
   		'</div>';
    parent.appendChild(child);
}

function removeNode(node) {
    node.parentNode.removeChild(node);
}
// 自动回复，内容处理函数
function autoReply(text) {
    var replyText=text.trim();
    if ((/[\bHello\b|你好|您好]/gi.test(replyText))) {
        replyText="Hello，你好！";
    } else if ((/[天气|气象]/g.test(replyText))) {
        replyText="正在查询天气……"
    } else if ((/[位置|定位|在哪|地方]/g.test(replyText))) {
        replyText="正在定位……";
    } else if ((/[再见|88|拜拜|bye]/gi.test(replyText))) {
        replyText="byebye";
    } else if ((/[美女|帅哥|约吗]/g.test(replyText))) {
        replyText="呀，骚货";
    } else if ((/[滚|猪吗|卧槽|我操|撒币|傻逼|妈的|智障]/g.test(replyText))) {
        replyText="不文明的现代人！";
    } else {
        replyText+="<br/>No System command !";
    }
    return replyText;
}
// 滚动到最底部 ele,location (main,parentHeight)
function scrollToWhere(ele,location) {
    ele.scrollTop=location;
    console.log(location);
}
// 阻止冒泡
function stopBubble(ev) {
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else {
        ev.cancelBubble=true;
    }
}           

function init() {
    var input=getDom("#inputtext");
    var bthSend=getDom("#send");
    var parent=getDom("#overflowbox");
    var deles=getDom(".dele","all");
    var containers=getDom(".container","all");
    var more=getDom("#more");
    var panel=getDom(".multifunction",0);
    var main=getDom(".main",0);
    var capturebox=getDom(".capturebox",0);
    var videobox=getDom(".videobox",0);
    var btnCapture=getDom("#capture");
    var btnClose=getDom("#close");
    var voicebox=getDom(".voice",0);
    var dialogbox=getDom(".dialogbox",0);
    var dialogcontent=getDom(".dialogcontent",0);
    
    // 输入框value全为空格时，发送按钮不可用    oninput
    bindEvent(input,'input',function () {
        var reg=/^\s+$/g;
        var bool=reg.test(this.value)?"off":"on";
        bthSend.className=bool;
        if (bool==="off") {
            bthSend.disabled=true;
        } else {
            bthSend.disabled=false;
        }
    });
    
    // 发送内容. ontouchend
    bindEvent(bthSend,'touchend',function () {
        if (this.disabled==false) {
            // 去除html敏感词 </>
            var text=(input.value).replace(/<[^<>\d*]+>+/g,"");
            madeMessage(parent,text,"right");
            // 滚动到最底部
            scrollToWhere(main,parent.offsetHeight-main.offsetHeight);
            // 回复函数
            callback(parent,input.value);
            // 清空输入框
            input.value="";
            // 按钮禁止
            bthSend.className="off";
            bthSend.disabled=true;
        }

    });
    
    // 点击按钮，删除节点
    bindEvent(parent,'touchend',function (ev) {
        var ev=ev?ev:window.event;
        var target=ev.target || ev.srcElement;
        if (target.className==="dele") {
            removeNode(target.parentNode);
        }
    });
    
    // 回复函数
    function callback(parent,val) {
        var val2="系统回复：";
        var val1=autoReply(val);
        setTimeout(function () {
            madeMessage(parent,val2+val1,"left");
            // 滚动到最底部
            scrollToWhere(main,parent.offsetHeight-main.offsetHeight);
        },1500);   
    
    } 
    // 关闭videobox
    function isShowVideo(bool) {
        if (bool) {
            setCss(videobox,"left:0;right:0;");
        } else {
            setCss(videobox,"left:110%;right:210%;");
        }
        
    }
        
    // 更多功能
    bindEvent(more,'touchend',function () {
        // 展开面板
        if (this.className!=="keyboard") {
            setCss(panel,"display:block;");
            setCss(this,"color:transparent;");
            this.className="keyboard";
            main.className+=" short";
            // 滚动到最底部
            scrollToWhere(main,parent.offsetHeight-main.offsetHeight+150);
        } else {
            setCss(panel,"display:none;");
            setCss(this,"color:;");
            this.className="";
            main.className=main.className.replace(" short","");
            // 滚动到最底部
            scrollToWhere(main,parent.offsetHeight-main.offsetHeight);
        }
        console.log("main.offsetHeight",main.offsetHeight);
        console.log("parent.offsetHeight",parent.offsetHeight);
        isShowVideo(false);
    });
    
    // 功能：截图
    var cap1=null;
    bindEvent(capturebox,'touchend',function () {
        isShowVideo(true);
        cap1=new CaptureImg({
           "video":getDom("#video"),
           "canvas":getDom("#canvas"),
           "img":getDom("#captureimg")
        });
        cap1.main();
    });
    
    // 截图并发送
    bindEvent(btnCapture,'touchend',function () {
        cap1.capture();
    });
     bindEvent(getDom("#captureimg"),'touchend',function () {
        if (confirm("要截图吗？")) {
           var html='<img src="'+cap1.img.src+'" />'; madeMessage(parent,html,"right");
        }
        isShowVideo(false);
    });
    
    // 关闭videobox
    bindEvent(btnClose,'touchend',function () {
        isShowVideo(false);
    });
    
    // 弹出窗口
    var dialog1=new Dialogbox({
    "dialogcontent":dialogcontent,
    "dialogbox":dialogbox,
    "duration":1000
    });
    
    bindEvent(voicebox,'touchend',function () {
        dialog1.show();
    });
    
    // 关闭窗口
    var d_btnclose=getDom(".btnclose",0);
    var d_close=getDom(".d_head>.close",0);
    bindEvent(d_btnclose,'touchend',function () {
        dialog1.hide();
    });
    bindEvent(d_close,'touchend',function () {
        dialog1.hide();
    });
    
    bindEvent(dialogcontent,'touchend',function (ev) {
        stopBubble(ev);
    });
    
    bindEvent(dialogbox,'touchend',function () {
        dialog1.hide();
    });
}

bindEvent(window,'load',init);