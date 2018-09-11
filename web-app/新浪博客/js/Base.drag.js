/**
  * Theme: Base-drag插件
  * Param: 可拖动区域
  */

// drag(p_head)
	$.fn.extend('drag',function (head) {
	    var me=this;
	    $.each(me.eles,function (index,item) {
		    // 拖动区域为头部时
		    if (!head) {
		        head=item;
		    }
		    $(head).bind('mousedown',function (ev) {
		    	var ev=ev?ev:window.event;
		        var offsetX=item.offsetLeft;
		        var offsetY=item.offsetTop;
		        var disLeft=ev.clientX-offsetX;
		        var disTop=ev.clientY-offsetY;
		        var _this=this;
		        // 修复 IE 鼠标拖出可视窗口的bug
		        if (typeof _this.setCapture!='undefined') {
		            _this.setCapture();
		        }
		        $(document).bind('mousemove',move);
		        $(document).bind('mouseup',up);
		        function move(ev) {
		        	var ev=ev?ev:window.event;
		            var left=ev.clientX-disLeft;
		            var top=ev.clientY-disTop;
		            left=left<20?0:((left+item.offsetWidth)>document.documentElement.clientWidth?(document.documentElement.clientWidth-item.offsetWidth):left);
		            top=top<50?30:((top+item.offsetHeight)>document.documentElement.clientHeight?(document.documentElement.clientHeight-item.offsetHeight):top);
		            item.style.left=left+'px';
		            item.style.top=top+'px';
		        }
		        function up() {
		        	$(document).unbind('mousemove',move);
		        	$(document).unbind('mouseup',up);
		        	// 修复 IE 鼠标拖出可视窗口的bug
		        	if (typeof _this.releaseCapture!='undefined') {
		            	_this.releaseCapture();
		        	}
		        }
		    });
	    }); 
	});