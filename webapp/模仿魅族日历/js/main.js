/**
  * Time: 2016-09-14
  * Update: 2016-10-20
  * Author: Who am I ?
  * Theme: calendar 
  * Issues:1. 农历(阴历)的计算
  */

// 事件绑定
function bindEvent(ele,eventType,callback) {
    if (typeof ele.addEventListener==="function") {
        ele.addEventListener(eventType,callback,false);
    } else if (typeof ele.attachEvent==="function") {
        ele.attachEvent("on"+eventType,callback);
    } else {
        ele["on"+eventType]=callback;
    }
}
// 获取DOM元素
function getDom(selector) {
    return document.querySelectorAll(selector) || alert("不支持querySelectorAll");
}
// 1-12月最大天数
function maxLastDay(m,y) {
    var month=+m;
    var year=+y;
    var maxLast=30;
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
        maxLast=31;
        break;
        case 4:
        case 6:
        case 9:
        case 11:
        maxLast=30;
        break;
        case 2:
        if (y%400===0 || (y%4===0 && y%100!==0)) {
            maxLast=29;
        } else {
            maxLast=28;
        }
        break;
        default:
        alert("switch error");
        break;
    }
    return maxLast;
}
// createCalendar
function createCalendar(parent,num) {
    var html="";
    for (var i=0,len=num;i<len;i++) {
        html+="<div><h5>0</h5><p>农历</p></div>";
    }
    parent.innerHTML=html;
}
// calendar 阳历
// @param: cy,cm,eles
function calendar(cy,cm,eles) {
    var firstNow=new Date(cy+"/"+cm+"/1");
    var firstWeek=firstNow.getDay();
    var cur=new Date();
    var curYear=cur.getFullYear();
    var curMonth=cur.getMonth()+1; // 0-11=>1-12
    var curDay=cur.getDate();
    var lastDay=maxLastDay(cm,cy);
    firstWeek=(firstWeek===0)?7:firstWeek; // 0-6=> 1-7
    var num=1;// 第一天
    var last=lastDay;
    // 清空日历
    for(var i=0,len=eles.length;i<len;i++) {
        eles[i].innerHTML="&nbsp;";
    }
    // 生成日历
    for(var j=0,len=eles.length;j<len;j++) {
        if (num<=last) {
            eles[firstWeek-1+j].innerHTML=num;
            num++;
            // 高亮当前日期
            if (eles[firstWeek-1+j].innerHTML==curDay && cy==curYear && cm==curMonth) {
                eles[firstWeek-1+j].parentNode.className="item active";
            } else {
                eles[firstWeek-1+j].parentNode.className="item";
            }
        }
    }
    
}
// 换肤
function faceChange(link,ran) {
    switch(ran) {
        case 1:
        link.href="./css/red.css";
        break;
        case 2:
        link.href="./css/blue.css";
        break;
        case 3:
        link.href="./css/green.css";
        break;
        default:
        console.log("switch error");
        break;
    }
}

function init() {
    var calendarBox=getDom(".calendar")[0];
    var pannel_left=getDom(".pannel_date")[0];
    var dialogBox=getDom(".dialogbox")[0];
    var btnClose=getDom(".close")[0];
    var btnSave=getDom(".btnsave")[0];
    var selectYear=getDom("#s_year")[0];
    var selectMonth=getDom("#s_month")[0];
    var setYear=getDom(".nowYear")[0];
    var setMonth=getDom(".nowMonth")[0];
    var setDay=getDom(".nowDay")[0];
    var dates=getDom(".calendar h5");
    var now=new Date();
    var y=now.getFullYear();
    var m=now.getMonth()+1;
    var d=now.getDate();
    var cssLink=getDom("#stylelink")[0];
    var rand=1;
    var timeDis=getDom(".nowDay_jintian")[0];
    var addSome=getDom(".add")[0];
    var goBack=getDom(".page_goback")[0];
    var indexPage=getDom("#indexPage")[0];
    var notePage=getDom("#notePage")[0];
    var note_footer=getDom("#notePage .footer")[0];
    var noteName=getDom(".notebox .notename")[0];
    var noteLocation=getDom(".notebox .notelocation")[0];
    var timeFrom=getDom(".timefrom")[0];
    var timeTo=getDom(".timeto")[0];
    var c_save=getDom(".c_save")[0];
    var c_cancel=getDom(".c_cancel")[0];
    var isNull=true;
    var noteData={};
    var index_noteBox=getDom("#indexPage .noteBox")[0];
    var newNote;
    var index_head=getDom("#indexPage .head")[0];
    var index_main=getDom("#indexPage .main")[0];
    var moveLeft;
    var moveTop;
    var pageWidth=document.body.clientWidth || document.documentElement.clientWidth;

    // 左上角面板显示日期
    setYear.innerHTML=y;
    setMonth.innerHTML=m;
    setDay.innerHTML=d;
    timeDis.innerHTML="今天";
    // 显示日历
    createCalendar(calendarBox,7*6);
    dates=getDom(".calendar h5");
    // @param: y,m,eles
    calendar(y,m,dates);
    // 生成选择框的年份
    selectYear.innerHTML="";
    for (var i=0,len=100;i<len;i++) {
        selectYear.innerHTML+='<option value="'+(+1990+i)+'">'+(+1990+i)+'年</option>';
    }
    
    // 指定年份月份
    bindEvent(pannel_left,"touchend",function () {
        dialogBox.style.cssText=";display:block;";
    });
    // 关闭弹出框
    bindEvent(btnClose,"touchend",function () {
        dialogBox.style.cssText=";display:none;";
    });
    // 渲染指定日期日历
    bindEvent(btnSave,"touchend",function () {
        y=(selectYear.value);
        m=(selectMonth.value);
        dialogBox.style.cssText=";display:none;";
        setYear.innerHTML=y;
        setMonth.innerHTML=m;
        setDay.innerHTML=d;
        calendar(y,m,dates);
        // 换肤
        rand=rand>3?1:rand+1;
        faceChange(cssLink,rand);
    });
    // 点击日期刷新左上角面板
    bindEvent(calendarBox,"touchend",function (ev) {
        var ev=ev?ev:window.event;
        var target=ev.target || ev.srcElement;
        if (target.nodeName==="H5") {
            var Dis=(d-target.innerHTML);
            if (setMonth.innerHTML==(now.getMonth()+1) && setYear.innerHTML==(now.getFullYear())) {
                if (Dis===0) {
                    timeDis.innerHTML="今天";
                } else if (Dis>0) {
                    if (Dis===1) {
                        timeDis.innerHTML="昨天";
                    } else {
                        timeDis.innerHTML=Dis+"天前";
                    }
                } else if (Dis<0) {
                    if (Dis===-1) {
                        timeDis.innerHTML="明天";
                    } else {
                        timeDis.innerHTML=-Dis+"天后";
                    }
                }
            } else {
                timeDis.innerHTML="待计算……";
            }
            
        }
    });
    // 添加记事本 click
    bindEvent(addSome,"click",function () {
        // 页面切换
        startMove(notePage,"left","0",15);
        startMove(note_footer,"bottom","0",30);
        timeFrom.innerHTML=setYear.innerHTML+"/"+setMonth.innerHTML+"/"+setDay.innerHTML;
        timeTo.innerHTML=setYear.innerHTML+"/"+setMonth.innerHTML+"/"+setDay.innerHTML;       
    });
    // 退出记事本
    bindEvent(goBack,"touchend",function () {
        startMove(notePage,"left",pageWidth+"px",15);
        startMove(note_footer,"bottom","-60px",15);
    });
    // 取消记事
    bindEvent(c_cancel,"touchend",function () {
        startMove(notePage,"left",pageWidth+"px",15); startMove(note_footer,"bottom","-60px",15);
    });
    // 输入框非空判断
    bindEvent(notePage,"keyup",function (ev) {
        var ev=ev?ev:window.event;
        var target=ev.target || ev.srcElement;
        if (target.nodeName==="INPUT") {
            if (!(/^\s*$/g).test(target.value)) {
                c_save.style.color="#333";
                isNull=false;
            } else {
                c_save.style.color="#c6c6c6";
                isNull=true;
            }
        }
    });
    // 生成记事
    bindEvent(c_save,"touchend",function () {
        if (!isNull) {
            if (noteName.value==="") {
                noteData.name="无标题";
            } else {
                noteData.name=noteName.value.trim();
            }
            noteData.location=noteLocation.value.trim();
            // 生成新笔记
            newNote=document.createElement("div");
            newNote.className="newnote clearfix";
            var now=new Date();
            var nowTime=(+now.getHours()>=12?'下午 ':'上午 ')+now.getHours()+':'+now.getMinutes();
            newNote.innerHTML='<span class="left_arc"><!--圆点--></span>'+
                '<div class="time">'+nowTime+'</div>'+
                '<div class="article">'+
                '<div class="notename">'+noteData.name+'</div>'+
                '<div class="notelocation">'+noteData.location+'</div>'+
                '</div>';
            index_noteBox.appendChild(newNote);
            index_noteBox.style.cssText=";display:block;";
            // 退出记事本
            startMove(notePage,"left",pageWidth+"px",15); startMove(note_footer,"bottom","-60px",15);
            // 初始化输入框
            noteName.value="";
            noteLocation.value="";
            isNull=true;
            c_save.style.color="#c6c6c6";
        } else {
            alert("请输入完整");
        }
    });
    // 按住添加按钮移动位置
    bindEvent(addSome,"touchstart",function () {
        addSome.style.cssText+=";opacity:0.5;filter:alpha(opacity=50);";
        if (moveLeft) {
            addSome.style.cssText+=";left:"+moveLeft+"px;top:"+moveTop+"px;";
        }
        // 按住添加按钮移动位置
        bindEvent(addSome,"touchmove",function (ev) {
            var ev=ev?ev:window.event;
            var mouseX=ev.touches[0].clientX;
            var mouseY=ev.touches[0].clientY;
            var minY=+(index_head.offsetHeight);
            var maxY=+minY+(index_main.offsetHeight)-(addSome.offsetHeight);
            var minX=0+(addSome.offsetHeight);
            var maxX=+(index_main.offsetWidth)-(addSome.offsetHeight);
            mouseX=mouseX<minX?minX:(mouseX>maxX?maxX:mouseX);
            mouseY=mouseY<minY?minY:(mouseY>maxY?maxY:mouseY);
            addSome.style.left=(Math.floor(mouseX))+"px";
            addSome.style.top=(Math.floor(mouseY))+"px";
            moveLeft=(Math.floor(mouseX));
            moveTop=(Math.floor(mouseY));
            ev.preventDefault();
            document.title="x: "+moveLeft+" y: "+moveTop;
        });
    });
    // 释放添加按钮
    bindEvent(addSome,"touchend",function () {
        addSome.style.cssText+=";opacity:1;filter:alpha(opacity=100);left:"+moveLeft+"px;top:"+moveTop+"px;";
    });
}
bindEvent(window,"load",init);
