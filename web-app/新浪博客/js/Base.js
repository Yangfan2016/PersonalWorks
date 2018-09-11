/**
  * Name: Base.js
  * Author: Who-am-I-?
  * From: jQuery
  * Issue: 1. 事件监听与事件删除 需要重写 line #33 #42 #346
  		   2. CSS高级选择器
		   3. html() / text()  兼容性
		   4. animate() 匀速运动？？？
		   
  *
  **/
(function (window,document) {
	// toolFunc 工具(公共)函数
	// 跨浏览器获取css样式
	function getCssStyle(ele,attr) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(ele,false)[attr];
		} else {
			return this.eles[i].currentStyle[attr];
		}
	}
	// for循环
	function foreach(arr,callback) {
		for (var i=0,len=arr.length;i<len;i++) {
			callback(i,arr[i]);
		}
	}
	// hasClass判断是否有这个className
	function hasClass(str,className) {
		var reg=new RegExp("(\\s|^)"+className+"(\\s|$)");
		var boo=false;
		return boo=(str.match(reg))?true:false;
	}
	// deleteClass 移除className
	function deleteClass(item,className) {
		// 正则 "abc"|| "abc ad" || "ad abc" || "ad abc ac"
		var reg=new RegExp("(\\s|^)"+className+"(\\s|$)");
		item.className=item.className.replace(new RegExp("(\\s|^)"+className+"(\\s|$)"),"");
	}
	// addEvent 添加监听事件
	function addEvent(ele,type,callback) {
		if (window.addEventListener) {
			ele.addEventListener(type,callback,false);
		} else if (window.attachEvent) {
			ele.attachEvent('on'+type,callback);
		} else {
			ele['on'+type]=callback;
		}
	}
	// deleEvent 移除监听事件
	function deleEvent(ele,type,callback) {
		if (window.addEventListener) {
			ele.removeEventListener(type,callback,false);
		} else if (window.attachEvent) {
			ele.detachEvent('on'+type,callback);
		} else {
			ele['on'+type]=null;
		}
	}
	// 获取ID
	function getById(id) {
		return document.getElementById(id);
	}
	// 获取Tag
	function getByTag(tagName,parent) {
		if (!parent) {
			parent=document;
		}
		return parent.getElementsByTagName(tagName);
	}
	// 获取ClassName
	function getByClass(className,parent) {
		if (!parent) {
			parent=document;
		}
		var nodes=[];
		var allNodes=null;
		if (!!document.getElementsByClassName) {
			allNodes=parent.getElementsByClassName(className);
			for (var i=0,len=allNodes.length;i<len;i++) {
				nodes.push(allNodes[i]);
			}
		} else {
			allNodes=parent.getElementsByTagName('*');
			for (var i=0,len=allNodes.length;i<len;i++) {
				if (allNodes[i].className.indexOf(className)!==-1) {
					nodes.push(allNodes[i]);
				}
			}
		}
		return nodes;
	}
	// 获取name
	function getByName(name,parent) {
		if (!parent) {
			parent=document;
		}
		return parent.getElementsByName(name);
	}
	// 浏览器检测
	function browser(window) {
		var ua=window.navigator.userAgent.toLowerCase();
        var browser={};
        var arrMatch=[];
            (arrMatch=ua.match(/msie ([\d\.]+)/))?(browser={name:'ie',version:arrMatch[1]}):
            (arrMatch=ua.match(/opr\/([\d\.]+)/))?(browser={name:'opera',version:arrMatch[1]}):
            (arrMatch=ua.match(/firefox\/([\d\.]+)/))?(browser={name:'firefox',version:arrMatch[1]}):
            (arrMatch=ua.match(/version\/([\d\.]+).*safari/))?(browser={name:'safari',version:arrMatch[1]}):
            (arrMatch=ua.match(/chrome\/([\d\.]+)/))?(browser={name:'chrome',version:arrMatch[1]}):0;
        return browser;
	}
	// animate 动画 缓冲(默认) element,{attr:val},400/600/200,fn,type(匀速运动？？？)
	function animate(obj,objData,speed,callback) {
		var pos='',
			start=0,
			end=0,
			duration=0,
			max=0;
		
		speed=speed || 400; // 默认速度400
		// 初始化
		clearInterval(obj.timer);
		// 开启定时器
		obj.timer=setInterval(function () {
			var isStop=true;
			// 多属性同时运动
			for (var attr in objData) {
				pos=attr;
				// 区分属性是否为透明度
				if (pos==='opacity') {
					pos='opacity';
					end=(objData[attr])*100; // 1*100=100
					start=(getCssStyle(obj,'opacity'))*100; // 0.5*100=50
					duration=(end-parseInt(getCssStyle(obj,pos)*100))/speed;
					duration=duration>0?Math.ceil(duration):Math.floor(duration);
					if (Math.abs(end-(getCssStyle(obj,pos))*100)<=Math.abs(duration)) {
						obj.style.opacity=end/100;
						obj.style.filter='alpha(opacity='+end+')';
						flag=true;
						// console.log('done '+attr+':'+objData[attr]);
						
					} else {
						obj.style.opacity=(+getCssStyle(obj,'opacity')+duration/100);
						obj.style.filter='alpha(opacity='+((+getCssStyle(obj,'opacity')+duration))+')';
					}
					if (parseInt(getCssStyle(obj,pos)*100)!==end) {flag=false;}
				} else {
					pos=attr;
					start=parseInt(getCssStyle(obj,pos) || getCssStyle(obj,pos));
					end=parseInt(objData[attr]);
					duration=(end-parseInt(getCssStyle(obj,pos)))/speed;
					duration=duration>0?Math.ceil(duration):Math.floor(duration);
					if (Math.abs(end-parseInt(getCssStyle(obj,pos)))<=Math.abs(duration)) {
						obj.style[pos]=end+'px';
						flag=true;
						// console.log('done '+attr+':'+objData[attr]);
						
					} else {
						obj.style[pos]=parseInt(getCssStyle(obj,pos))+duration+'px';
					}
					if (parseInt(getCssStyle(obj,pos))!==end) {flag=false;}
				}
				// 没有到达终点，设置isStop为false
				if (attr==='opacity') {
					if ((+getCssStyle(obj,attr))!==(+end/100)) {isStop=false;}
				} else {
				 	if (parseInt(getCssStyle(obj,attr))!==end) {isStop=false;}
				}
			}
			// 所有动画到达终点，关闭定时器
			if (isStop) {
				clearInterval(obj.timer);
				console.log('=====done=====');
				obj.stop=true;// 预留功能
				if (!!callback) {callback();}
			} 

		},13);

		return obj.timer;
	}

	/**
	  * Base
	  * @param: Base(selector)
	  */
	/*=============================START==============================================*/
	// Base 构造函数
	var Base=function (selector) {
		// 去new化构造器
		if (!(this instanceof Base)) {
			return new Base.fn.init(selector); // 为了避免无限递归，重新new 一个构造器init
		}
		// this=>Base
		this.selector=selector;
		this.version='1.0.0'; // 版本
		this.author='Who am I ?';
		this.eles=[]; // DOM元素
		// 简单选择器
		if (!!selector) {
			if (typeof selector==='object' && selector!=='undefined') {
				this.eles[0]=selector; // document || window || this || obj(js)
			} else if (typeof selector==='string') { // '#box' | '.cls' | 'h2'
				if (!!document.querySelectorAll) {
					this.query(selector);
				} else {
					console.warn('Your browser didn\'t support querySelectorAll');
					// do something...
					switch(selector.charAt(0)) {
						case '#':
							this.getId(selector.substr(1));
							break;
						case '.':
							this.getClass(selector.substr(1));
							break;
						default:
							this.getTag(selector);
						break;
					}
				}
			} else if (typeof selector==='function') { // $(function () {});
				this.eles.push(document);
				this.ready(selector);
			}
		}
	};
	// =================实例方法================================
	Base.fn=Base.prototype={
		constructor:Base,
		init:function (selector) {
			return new Base(selector);
		},
		each:function (callback) {
			var me=this;
			return Base.each(me.eles,callback);
		},
		extend:function (name,fn) {
			Base.prototype[name]=fn;
		},
		//  选择器
		getId:function (id) {
			this.eles.push(getById(id));
			return this;
		},
		getTag:function (tag,parent) {
			var elements=getByTag(tag,parent);
			var me=this;
			foreach(elements,function (index,item) {
				me.eles.push(item);
			});
			return this;
		},
		getName:function (name,parent) {
			var elements=getByName(name,parent);
			var me=this;
			foreach(elements,function (index,item) {
				me.eles.push(item);
			});
			return this;
		},
		getClass:function (className,parent) {
			var elements=getByClass(className,parent);
			var me=this;
			foreach(elements,function (index,item) {
				me.eles.push(item);
			});
			return this;
		},
		query:function (selector) {
			var elements=document.querySelectorAll(selector);
			var me=this;
			foreach(elements,function (index,item) {
				me.eles.push(item);
			});
			return this;
		},
		// 高级选择器
		// find 后代选择器
		find:function (selector) {
			var me=this;
			var childs=[]; // 存放新的节点（后代节点）
			foreach(me.eles,function (index,item) {			
				switch(selector.charAt(0)) {
					case '#':
						childs.push(getById(selector.substr(1)));
						break;
					case '.':
					    var cls=getByClass(selector.substr(1),item);
						foreach(cls,function (ind,val) {
							childs.push(val);
						});
						break;
					default:
						var tags=(!!document.querySelectorAll)?(item.querySelectorAll(selector)):(getByTag(selector,item));
						foreach(tags,function (ind,val) {
							childs.push(val);
						});
					break;
				}
			});
			me.eles=[]; // 清空原有DOM节点
			me.eles=childs; // 重新添加DOM节点
			return this;
		},
		// 返回指定索引的js原生对象
		get:function (n) {
			var me=this;
			if (typeof n==='undefined') {
				return me.eles;
			} else {
				return me.eles[n];
			}
		},
		// 返回指定索引的Base对象
		eq:function (n) {
			var me=this;
			var nodes=[];
			nodes.push(me.eles[n]);
			me.eles=nodes;
			return this;
		},
		// 获取元素所在位置相对于其他兄弟的索引
		index:function () {
			var that=this.eles[0]; // <ul><li this>0</li><li>1</li><li>2</li></ul>
			var parent=that.parentNode; // ul->li-p-li
			var result=null;
			for (var i in parent.children) {
				if (that===parent.children[i]) {
					return result=i;
				}
			}			
			return -1;
		},
		// html() 获取|设置innerHTML
		html:function (str) {
			var me=this;
			var result=null;
			foreach(me.eles,function (index,item) {
				if (typeof str==='undefined') {
					return result=item.innerHTML;
				} else {
					item.innerHTML=str;
				}
			});
			return result || this;
		},
		// text() 获取|设置innerText
		text:function (str) {
			var me=this;
			var result=null;
			foreach(me.eles,function (index,item) {
				if (typeof str==='undefined') {
					return result=item.innerText;
				} else {
					item.innerText=str;
				}
			});
			return result || this;
		},
		// val() 获取|设置value
		val:function (str) {
			var me=this;
			var result=null;
			foreach(me.eles,function (index,item) {
				if (typeof str==='undefined') {
					return result=item.value;
				} else {
					item.value=str;
				}
			});
			return result || this;
		},
		// attr() 获取|设置attribute
		attr:function (prop,val) {
			var me=this;
			var result=null;
			foreach(me.eles,function (index,item) {
				if (typeof val==='undefined') {
					return result=item.getAttribute(prop);
				} else {
					item.setAttribute(prop,val);
				}
			});
			return result || this;
		},
		// removeAttr() 移除指定属性
		removeAttr:function (prop) {
			var me=this;
			foreach(me.eles,function (index,item) {
				item.removeAttribute(prop);
			});
			return this;
		},
		// css部分 (attr,val)|(attr)|{key:val}
		css:function () {
			var me=this;
			var result=null;
			var args=arguments;
			foreach(me.eles,function (index,item) {
				if (args.length===1) {
					// {key:val}
					if (typeof args[0]==='object') {
						for (var key in args[0]) {
							item.style[key]=args[0][key];
						}
					} else { // attr
						return result=getCssStyle(item,args[0]);
					}
				} else if (args.length===2) { // (attr,val)
					item.style[args[0]]=args[1];
				}
			});
			return result || this;
		},
		// width()
		width:function (val) {
			var me=this;
			var result=null;
			foreach(me.eles,function (index,item) {
				if (typeof val==='undefined') {
					return result=item.offsetWidth;
				} else {
					item.style['width']=val;
				}
			});
			return result || this;
		},
		// height()
		height:function (val) {
			var me=this;
			var result=null;
			foreach(me.eles,function (index,item) {
				if (typeof val==='undefined') {
					return result=item.offsetHeight;
				} else {
					item.style['height']=val;
				}
			});
			return result || this;
		},
		// size()  DOM 元素的个数length
 		size:function () {
 			var me=this;
 			return me.eles.length;
 		},
		// 下一个同级节点
		next:function (selector) {
			var me=this;
			var str='';
			if (!!selector) {
				if (selector.indexOf('#')!==-1) {
					str='id';
					selector=selector.substr(1);
				} else if (selector.indexOf('.')!==-1) {
					str='className';
					selector=selector.substr(1);
				} else {
					str='tagName'; // 'DIV/H2'=>'div/h2'
					selector=selector.toUpperCase();
				}
			}
			// var reg=new RegExp("(\\s|^)"+selector+"(\\s|$)");
			foreach(me.eles,function (index,item) {
				me.eles[index]=item.nextSibling;
				if (me.eles[index]===null || me.eles[index].nodeType===3) {
					me.next();
					if (!!selector) {
						while ((me.eles[index][str])!==selector) {
							me.next();
						}
					}
				}
			});
			return this;
		},
		// 上一个同级节点
		prev:function (selector) {
			var me=this;
			var str='';
			if (!!selector) {
				if (selector.indexOf('#')!==-1) {
					str='id';
					selector=selector.substr(1);
				} else if (selector.indexOf('.')!==-1) {
					str='className';
					selector=selector.substr(1);
				} else {
					str='tagName'; // 'DIV/H2'=>'div/h2'
					selector=selector.toUpperCase();
				}
			}
			foreach(me.eles,function (index,item) {
				me.eles[index]=item.previousSibling;
				if (me.eles[index]===null || me.eles[index].nodeType===3) {
					me.prev();
					if (!!selector) {
						while ((me.eles[index][str])!==selector) {
							me.prev();
						}
					}
				}
			});
			return this;
		},
		// 下面所有同级节点
		nextAll:function () {
			var me=this;
			var allchilds=null;
			var newchilds=[];
			foreach(me.eles,function (index,item) {
				allchilds=item.parentNode.children; // HTMLCollection对象，不是数组
				for (var i=0,len=allchilds.length;i<len;i++) {
					if (item===allchilds[i]) {
						// [i+1,len)
						newchilds=[].slice.call(allchilds,i+1,len); // HTMLCollection对象，不是数组
					}
				}
			});
			me.eles=newchilds;
			return this;
		},
		// 上面所有同级节点
		prevAll:function () {
			var me=this;
			var allchilds=null;
			var newchilds=[];
			foreach(me.eles,function (index,item) {
				allchilds=item.parentNode.children; // HTMLCollection对象，不是数组
				for (var i=0,len=allchilds.length;i<len;i++) {
					if (item===allchilds[i]) {
						// [0,i)
						newchilds=[].slice.call(allchilds,0,i); // HTMLCollection对象，不是数组
					}
				}
			});
			me.eles=newchilds;
			return this;
		},
		// 动画部分
		// 动画 data={top:'100px'} speed=400/200/600
		animate:function (data,speed,callback) {
			var me=this;
			var moveData={};
			// 存放多个属性
			for (var i in data) {
				if (!!data[i]) {
					moveData[i]=data[i];
				}
			}
			// console.log(moveData);
			foreach(me.eles,function (index,item) {
				animate(item,moveData,speed,callback);
			});
			return this;
		},
		// hide() display=none
		hide:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				// 存放元素显示时的css样式
				if (!item.width && !item.height && !item.opacity) {
					item.width=getCssStyle(item,'width'); // 100px
					item.height=getCssStyle(item,'height'); // 100px
					item.opacity=getCssStyle(item,'opacity'); // 0.5
				}
				item.timer=animate(item,{
					'opacity':0,
					'width':'0px',
					'height':'0px',
				},(speed || 400),function () {
					item.style.display="none";
					if (!!callback) {callback()};
				});
			});
			return this;
		},
		// show() display=block
		show:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				item.style.display="block";
				// 存放元素显示时的css样式
				if (!item.width && !item.height && !item.opacity) {
					item.width=getCssStyle(item,'width'); // 100px
					item.height=getCssStyle(item,'height'); // 100px
					item.opacity=getCssStyle(item,'opacity') || 1; // 0.5
					item.style.width='0px';
					item.style.height='0px';
					item.style.opacity='0';
				}
				// 执行动画
				item.timer=animate(item,{
					'opacity':item.opacity, // 0.5
					'width':item.width, // 100px
					'height':item.height, // 100px
				},(speed || 400),function () {					
					if (!!callback) {callback()};
				});
			});
			return this;
		},
		// 淡出
		fadeOut:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				// 存放元素显示时的css样式
				if (!item.opacity) {
					item.opacity=getCssStyle(item,'opacity') || 1; // 0.5
				}
				item.timer=animate(item,{
					'opacity':0,
				},(speed || 400),function () {
					item.style.display="none";
					if (!!callback) {callback()};
				});
			});
			return this;
		},
		// 淡入
		fadeIn:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				item.style.display="block";
				// 存放元素显示时的css样式
				if (!item.opacity) {
					item.opacity=getCssStyle(item,'opacity') || 1; // 0.5
					item.style.opacity=0;
				}
				// 执行动画
				item.timer=animate(item,{
					'opacity':item.opacity, // 0.5
				},(speed || 400),function () {					
					if (!!callback) {callback()};
				});
			});
			return this;
		},
		// 上滑
		slideUp:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				// 存放元素显示时的css样式
				if (!item.height) {
					item.height=getCssStyle(item,'height'); // 100px
				}
				item.timer=animate(item,{
					'height':'0px',
				},(speed || 400),function () {
					item.style.display="none";
					if (!!callback) {callback()};
				});
			});
			return this;
		},
		// 下拉
		slideDown:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				item.style.display="block";
				// 存放元素显示时的css样式
				if (!item.height) {
					item.height=getCssStyle(item,'height'); // 100px
					item.style.height='0px';
				}
				// 执行动画
				item.timer=animate(item,{
					'height':item.height, // 100px
				},(speed || 400),function () {					
					if (!!callback) {callback()};
				});
			});
			return this;
		},
		// toggle()  show=>hide=>show=>...
		toggle:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				if (getCssStyle(item,'display')==='none') {
					$(item).show((speed || 400),function () {					
						if (!!callback) {callback()};
					});
				} else {
					$(item).hide((speed || 400),function () {					
						if (!!callback) {callback()};
					});
				}
			});
			return this;
		},
		// fadeToggle()
		fadeToggle:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				if (getCssStyle(item,'opacity')==='0') {
					$(item).fadeIn((speed || 400),function () {					
						if (!!callback) {callback()};
					});
				} else {
					$(item).fadeOut((speed || 400),function () {					
						if (!!callback) {callback()};
					});
				}
			});
			return this;
		},
		// slideToggle()
		slideToggle:function (speed,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				if (getCssStyle(item,'height')==='0px') {
					$(item).slideDown((speed || 400),function () {					
						if (!!callback) {callback()};
					});
				} else {
					$(item).slideUp((speed || 400),function () {					
						if (!!callback) {callback()};
					});
				}
			});
			return this;
		},
		// fadeTo()
		fadeTo:function (speed,opacity,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				animate(item,{
					'opacity':opacity,
				},(speed || 400),function () {					
					if (!!callback) {callback()};
				});
			});
			return this;	
		},
		// className部分
		// addClass(cls)
		addClass:function(className) {
			var me=this;
			foreach(me.eles,function (index,item) {
				if(!hasClass(item.className,className)) {
					item.className+=" "+className; 
				}
			});
			return this;
		},
		// removeClass(cls) || removeClass()
		removeClass:function(className) {
			var me=this;
			foreach(me.eles,function (index,item) {
				if (!className) {
					item.className="";
					console.log(!className);
				}
				else if (!!className && hasClass(item.className,className)) {
					deleteClass(item,className);
				}
			});
			return this;
		},
		// 事件部分
		// bind(ev,fn)
		bind:function (eventType,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				addEvent(item,eventType,callback);
			});
			return this;
		},
		// unbind(ev,fn)
		unbind:function (eventType,callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				deleEvent(item,eventType,callback);
			});
			return this;
		},
		// click(fn)
		click:function (callback) {
			var me=this;
			foreach(me.eles,function (index,item) {
				addEvent(item,'click',callback);
			});
			return this;
		},
		// hover(f1,f2) || hover(f1)
		hover:function (over,out) {
			var me=this;
			if (!out) {
				out=over;
			}
			foreach(me.eles,function (index,item) {
				addEvent(item,'mouseover',over);
				addEvent(item,'mouseout',out);
			});
			return this;
		},
		// resize(fn)    window.onresize=fn;
		resize:function (fn) {
			addEvent(window,'resize',fn);
			return this;
		},
		// DOM加载部分
		// document.onDOMConentLoaded
		ready:function (fn) {
			var timer=null;
			var isReady=false;
			function doReady(fn) {
				if (isReady) {
					fn();
					clearInterval(timer);
					return;
				}
			}
			if (!!document.addEventListener) { // W3C标准
				addEvent(document,'DOMContentLoaded',function () {
					fn();
					deleEvent(document,'DOMContentLoaded',arguments.callee);
				});
			} else if (browser(window).name==='ie' && browser(window).version<9) {  // IE<9
				timer=setInterval(function () {
					try {
						document.documentElement.doScroll('left');
						isReady=true;
						doReady(fn);
					} catch (err) {

					}
				},1);
			} else { // 旧版浏览器
				timer=setInterval(function () {
					if (document && document.getElementById && document.getElementsByTagName) {
						isReady=true;
						doReady(fn);
					}
				},1);
			}
		},
		// window.onload
		load:function (fn) {
			addEvent(window,'load',function () {
				fn();
				deleEvent(window,'load',arguments.callee);
			});
		},
		// $().serialize()
		serialize:function () {
			var me=this;
			var str='';
			foreach(me.eles,function (index,item) {
				var eles=item.elements;
		        var arr=[];
		        for (var i=0,len=eles.length;i<len;i++) {
		            switch (eles[i].type) {
		                case undefined:
		                case 'file':
		                case 'button':
		                case 'submit':
		                case 'reset':
		                    break;
		                case 'radio':
		                case 'checkbox':
		                    if (!eles[i].selected) {
		                        break;
		                    }
		                case 'select-one':
		                case 'select-multiple':
		                    for (var j=0,len2=eles[i].options.length;j<len2;j++) {
		                        if (eles[i].options[j].selected) {
		                            arr.push(eles[i].name+'='+(eles[i].options[j].value || eles[i].options[j].text));
		                        }
		                    }
		                    break;
		                default:
		                arr.push(eles[i].name+'='+eles[i].value);
		                    break;
		            }
		            
		        }
		        str=arr.join('&');
			});
			return str;
		},

	};
	// **使init对象实例拥有Base对象的原型方法
	Base.prototype.init.prototype=Base.prototype;

	// ==================静态方法===============================
	// 遍历 $.func()
	Base.each=function (arr,callback) {
		foreach(arr,callback);
	};
	// 浏览器信息 $.browser()
	Base.browser=browser(window);
	// ajax $.ajax()
	Base.ajax=function (obj) {
		var xhr=null;
		var arrSend=[];

		// 1. create XHR object
		if (typeof XMLHttpRequest !='undefined') {
			xhr=new XMLHttpRequest();
		} else if (typeof ActiveXObject !='undefined') {
			xhr=new ActiveXObject('Microsoft.XMLHTTP');
		} else {
			throw new Error('your browser didn\'t support XHR Object');
		}
		// 2. open
		xhr.open((obj.type.toUpperCase()),obj.url,(obj.async || true));
		// POST ex
		if (obj.type.toUpperCase()==='POST') {
			// 2.1 set POST contentType
			xhr.setRequestHeader('Content-Type',(obj.contentType || 'application/x-www-form-urlencoded'));
			// 2.2 data {name:'lee',age:100}=> 'name=lee&age=100', 
			if (obj.data && typeof obj.data==='object') {
				// 序列化
				for (var key in obj.data) {
					arrSend.push(key+'='+obj.data[key]);
				}
				obj.data=arrSend.join('&');
			}
			
		}
		// 3. send
		xhr.send((obj.data || null));
		// 4. listen callback
		xhr.addEventListener('readystatechange',function () {
			if (xhr.readyState===4) {
				if (xhr.status===200) {
					obj.success(xhr.responseText,xhr.status,xhr);
				} else {
					obj.error(xhr,'error',xhr.statusText);
				}
			} 
		},false);
	};
	// $.extend({add:function () {},val:1,});
	Base.extend=function (obj) {
		for (var key in obj) {
			Base[key]=obj[key];
		}
	};
	// 去空格
	Base.trim=function (str) {
		return str=str.replace(/(^\s*)|(\s*$)/g,'');
	};
	// ======================扩展部分===============================	
	// $().center(w,h) 设置元素相对于浏览器窗口居中
	Base.fn.extend('center',function (width,height) {
		var top=0;
		var left=0;
		var me=this;
		foreach(me.eles,function (index,item) {
    		top=(document.documentElement.clientHeight-height)/2; 
    		left=(document.documentElement.clientWidth-width)/2;
	    	item.style.top=top+'px'; 
	    	item.style.left=left+'px'; 
		});
		return this;
	});
	
	/************************THE END**********************************/

	// 将Base和$暴露出去 
	window.$=window.Base=Base;	
}(window,document));

