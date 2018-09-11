/**
  * Author:Who am I
  * Theme:swiper-Event
  * Version:1.0.1
  * Update:2016-12-26
  *
  */

/**
  * methods: obj.swiperon(eventType,callback) 
             obj.swiperoff(eventType,callback)
  * 
  * eventType: "swiperLeft" | "swiperRight" | "swiperTop" | "swiperBottom"
  */
(function () { 
    var pos={x:0,y:0}; // 记录手势位置 
    // 手势滑动 
    function swiper(obj,callback) { 
        // obj=obj || document; 
        // 手势按下 
        obj.addEventListener("touchstart",function (ev) { 
            var ev=ev?ev:window.event; 
            pos={x:ev.touches[0].clientX,y:ev.touches[0].clientY}; 
        },false); 
        // 手势移动 
        obj.addEventListener("touchmove",function (ev) { 
            var ev=ev?ev:window.event; 
            var curPos={x:ev.touches[0].clientX,y:ev.touches[0].clientY}; 
            var dis=Math.sqrt((curPos.x-pos.x)*(curPos.x-pos.x)+(curPos.y-pos.y)*(curPos.y-pos.y)); // 记录两点之间的距离 
            var vLine=Math.sin(Math.PI/4)*dis; // sin45° 
            if (Math.abs(curPos.y-pos.y)<=Math.abs(vLine)) { 
                if (curPos.x-pos.x>0) { 
                    console.log("右滑"); 
                    callback.moveRight && callback.moveRight.forEach(function (item,index) { 
                        item(); 
                    }); 
                } else { 
                    console.log("左滑"); 
                    callback.moveLeft && callback.moveLeft.forEach(function (item,index) { 
                        item(); 
                    }); 
                } 
            } else if (Math.abs(curPos.x-pos.x)<=Math.abs(vLine)) { 
                if (curPos.y-pos.y>0) { 
                    console.log("下滑"); 
                    callback.moveBottom && callback.moveBottom.forEach(function (item,index) { 
                        item(); 
                    }); 
                } else { 
                    console.log("上滑"); 
                    callback.moveTop && callback.moveTop.forEach(function (item,index) { 
                        item(); 
                    }); 
                } 
            }
            // 更新历史位置
            pos=curPos;
        },false); 
    } 
    // 触发滑动事件 
    HTMLElement.prototype.swiperon=function (eventType,func) { 
        var _this=this; 
        if (!_this[eventType]) { 
            _this[eventType]=[]; 
        } 
        _this[eventType].push(func); 
        switch(eventType) { 
            case "swiperLeft": 
            swiper(_this,{"moveLeft": _this[eventType]}); 
            break; 
            case "swiperRight": 
            swiper(_this,{"moveRight":_this[eventType]}); 
            break; 
            case "swiperTop": 
            swiper(_this,{"moveTop":_this[eventType]}); 
            break; 
            case "swiperBottom": 
            swiper(_this,{"moveBottom":_this[eventType]}); 
            break; 
            default:
            alert("SWITCH ERROR!"); 
            break; 
        } 
    }; 
    // 移除滑动事件 
    HTMLElement.prototype.swiperoff=function (eventType,func) { 
        var _this=this; 
        _this[eventType] && _this[eventType].forEach(function (item,index) { 
            if (item===func) { 
                _this[eventType].splice(index,1); 
            } 
        }); 
    }; 
    
}()); 
