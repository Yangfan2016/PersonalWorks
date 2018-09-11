/**
  * Author: Who-am-I ?
  * Theme: sina-blog
  * Issues: 1. next('.tip tip_succ') 
  */

$(function () {
    // 初始化,并打开注册框
    function initSignin() {
        // 表单初始化
        $('#signinbox').find('.exp').each(function (index,item) {
            item.isCan=false; // 验证初始化
        });
        // 数据清空
        $('#signinbox').find('.exp').val('');
        $('#memo').val('');
        // tip样式初始化
        $('.tip').css('display','none');
        $('#signinbox_submit').css({
            'backgroundPosition':'right center',
            'cursor':'not-allowed'
        });
        $('#signinbox').css('display','block').center($('#signinbox').width(),$('#signinbox').height());
        $('#lockscreen').css('display','block');
        // 禁止滚动
        $(document.body).addClass('ban-scroll');
    }
    // 更新文章
    function refreshPage() {
    	$.ajax({
        	url:"./php/refresh.php",
        	type:"POST",
        	data:{
        		'username':$('#user').val(),
        	},
        	success:function (text,status,xhr) {
        		text=JSON.parse(text);
        		// console.log(text,typeof text);
        		$('#main_body').html(' ');
        		var html='';
        		for (var i=0,len=text.length;i<len;i++) {
        			html+='<section><h2 class="heading">'+text[i]['title']+'<span class="head_date">'+text[i]['date']+'</span></h2><div class="body"><p>'+text[i]['content']+'</p></div></section>';

        		}
        		$('#main_body').html(html);
        	},
        });
    }

    // 打开登录框
	$('#info_login').bind('click',function () {
        // 清空数据
        $('#loginbox').find('input').val('');
        // 初始化
        $('#login_tip').css('visibility','hidden');
        $('#loginbox').css('display','block').center($('#loginbox').width(),$('#loginbox').height());
		$('#lockscreen').css('display','block');
		// 禁止滚动
		$(document.body).addClass('ban-scroll');
	});
    // 关闭登录框
	$('#login_close').bind('click',function () {
		$('#loginbox').css('display','none');
		$('#lockscreen').css('display','none');
		// 允许滚动
		$(document.body).removeClass('ban-scroll');
	});
    // 打开注册框
    $('#info_signin').bind('click',function () {
        initSignin();
    });
    // 关闭注册框
    $('#signin_close').bind('click',function () {
        $('#signinbox').css('display','none');
        $('#lockscreen').css('display','none');
        // 允许滚动
		$(document.body).removeClass('ban-scroll');
    });
    // 屏幕缩放，居中框
	$(window).resize(function () {
		$('#loginbox').center($('#loginbox').width(),$('#loginbox').height());
        $('#signinbox').center($('#signinbox').width(),$('#signinbox').height());
	});
	// 导入drag插件
    var login_dhead=$('#login_dhead').get(0);
    var signin_dhead=$('#signin_dhead').get(0);
    $('#loginbox').drag(login_dhead);
    $('#signinbox').drag(signin_dhead); 
    // 个人中心
    $('#info_me').hover(function () {
        $('#me_nav').slideDown(5);
    },function () {
        $('#me_nav').slideUp(5);    
    }); 
    // 分享侧栏
    $('#share').hover(function () {
        $('#share').animate({'left':'0px'},10);
    },function () {
        $('#share').animate({'left':'-252px'},10);
    });
    // 滚动屏幕，移动分享侧栏
    var shareTop=parseInt($('#share').css('top'));
    $(window).bind('scroll',function () {
        var scrollTop=(document.documentElement.scrollTop===0)?(document.body.scrollTop):(document.documentElement.scrollTop);
        var top=scrollTop+shareTop;
        setTimeout(function () {
            $('#share').animate({'top':top+'px'},10);
        },100);
    });
    // 注册框基本验证
    $('#signinbox').find('.exp').bind('focus',function () {
        $(this).nextAll().css('display','none');
        $(this).next('.tip tip_info').css('display','block');
    }).bind('blur',function () {
    	switch (this.id) {
            case 'newuser':
            if (!(/\s+/).test(this.value) && this.value.length>=2 && this.value.length<=20) {
                var _this=this; 
                $(_this).nextAll().css('display','none');
                $(_this).next('.tip tip_error').css('display','block').html('正在检测...');       
                // 检测重名
                $.ajax({
                    url:'./php/repeat.php',
                    type:'POST',
                    data:"username="+this.value,
                    success:function (text,status,xhr) {
                        $(_this).nextAll().css('display','none');
                        if (text==1) { // '用户名已存在！'
                            $(_this).next('.tip tip_error').css('display','block').html('用户名已存在！');
                            _this.isCan=false;
                        } else { // '成功'
                            $(_this).next('.tip tip_succ').css('display','block');
                            _this.isCan=true;
                            
                        }
                    },
                });

            } else {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_error').css('display','block').html('请输入6-20个合法字符！');
                this.isCan=false;
            }
            break;
            case 'newpwd':
            if (!(/\s+/).test(this.value) && (/[0-9A-Za-z]+/).test(this.value) && this.value.length>=6 && this.value.length<=20) {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_succ').css('display','block');
                this.isCan=true;
            } else {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_error').css('display','block');
                this.isCan=false;
            }
            break;
            case 'c_pwd':
            if ($('#newpwd').val()===$('#c_pwd').val()) {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_succ').css('display','block');
                this.isCan=true;
            } else {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_error').css('display','block');
                this.isCan=false;
            }
            break;
            case 'answer':
            if ($(this).val().length>=2 && $(this).val().length<=32) {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_succ').css('display','block');
                this.isCan=true;
            } else {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_error').css('display','block');
                this.isCan=false;
            }
            break;
            case 'email':
            if (!!(/^[0-9A-Za-z_\.\-]+@[0-9A-Za-z_\-]+([\.a-zA-Z]{2,4})+$/).test(this.value)) {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_succ').css('display','block');
                this.isCan=true;
            } else {
                $(this).nextAll().css('display','none');
                $(this).next('.tip tip_error').css('display','block');
                this.isCan=false;
            }
            break;
            default:console.log('SWITCH ERROR');
            break;
        }
        // 提交验证
        var c=0;
        for (var i=0,len=$('#signinbox').find('.exp').size();i<len;i++) {
            if (($('#signinbox').find('.exp').get(i).isCan)) {
            	c++;
            } else {
            	c--;
            }
        }
        if (c===len) {
            $('#signinbox_submit').css({
                'backgroundPosition':'left center',
                'cursor':'pointer'
            }).get(0).disabled=false;
        } else {
            $('#signinbox_submit').css({
                'backgroundPosition':'right center',
                'cursor':'not-allowed'
            }).get(0).disabled=true;
        }
    });
        
        
        
    // 密码强度验证
    $('#newpwd').bind('keyup',function () {
        // 初始化
        var code=0;
        $(this).nextAll().css('display','none');
        $(this).next('.tip tip_info').css('display','block');
        // 基本条件验证
        // 1. 6-20个字符
        if (this.value.length>=6 && this.value.length<=20) {
            $('.newpwd').eq(0).find('.q1').text('●');
        } else {
            $('.newpwd').eq(0).find('.q1').text('○');
        }
        // 2. 只能包含大小写字母、数字和非空格字符
        if (this.value.length>=1 && !(/\s/).test(this.value)) {
            $('.newpwd').eq(0).find('.q2').text('●');
        } else {
            $('.newpwd').eq(0).find('.q2').text('○');
        }
        // 3. 大、小写字母、数字、非空字符，2种以上
        // 数字
        if ((/\d/).test(this.value)) {
            code++;
        }
        // 小写字母
        if ((/[a-z]/).test(this.value)) {
            code++;
        }
        // 大写字母
        if ((/[A-Z]/).test(this.value)) {
            code++;
        }
        // 非空字符
        if ((/[^a-zA-Z0-9]/).test(this.value)) {
            code++;
        }
        if (code>=2) {
            $('.newpwd').eq(0).find('.q3').text('●');
        } else {
            $('.newpwd').eq(0).find('.q3').text('○');
        }

        // 高级验证 判断安全级别
        if (this.value.length>=10 && code>=3) {
            // 至少10个字符，且三种混写，高
            //  \d [a-zA-Z] \S
            $('.newpwd').eq(0).find('.s').css('color','green');
            $('.newpwd').eq(0).find('.s4').text(' 高');
        }
        else if (this.value.length>=8 && code>=2) {
            // 至少8个字符，且两种混写，中
            $('.newpwd').eq(0).find('.s1').eq(0).css('color','#fc0');
            $('.newpwd').eq(0).find('.s2').eq(0).css('color','#fc0');
            $('.newpwd').eq(0).find('.s3').eq(0).css('color','#666');
            $('.newpwd').eq(0).find('.s4').text(' 中').css('color','#fc0');
        }
        else if (this.value.length>=1) {
            // 至少一个字符，低
            $('.newpwd').eq(0).find('.s1').eq(0).css('color','#f20');
            $('.newpwd').eq(0).find('.s2').eq(0).css('color','#666');
            $('.newpwd').eq(0).find('.s3').eq(0).css('color','#666');
            $('.newpwd').eq(0).find('.s4').text(' 低').css('color','#f20');
        } else {
            $('.newpwd').eq(0).find('.s').css('color','#666');
            $('.newpwd').eq(0).find('.s4').text(' ');
        }
    });
    // 邮箱输入提示 模拟H5 <datalist>标签
    $('#email').bind('keyup',function (ev) {
        var $lis=$('#email-hint').find('li');

        // 当输入‘@’符号时,提示框消失
        if (($(this).val()+'').indexOf('@')!==-1) {
            $('#email-hint').css('display','none');
        } else {
            $('#email-hint').css('display','block');
        }
        // 同步提示框的数据
        var str=((typeof $(this).val())!=='string')?' ':($(this).val());
        $('#email-hint').find('li').find('span').html(str);
        // 点击数据列表，键入输入框文本
        $lis.bind('mousedown',function () {
            var str1=($(this).html()+'').replace(/(<\w+>|<\/\w+>)+/g,'');
            $('#email').val(str1);
        });
        // 键盘上下选择数据，键入输入框文本
        var ev=ev?ev:window.event;
        // 键盘下键
        if (ev.keyCode===40) {
            if ((typeof this.index==='undefined') || this.index>=($lis.size()-1)) {
                this.index=0;
            } else {
                this.index++;
            }
            $lis.css({
                'color':'#666',
                'backgroundColor':'#fff'
            });
            $lis.eq(this.index).css({
                'color':'#fff',
                'backgroundColor':'#26f'
            });
        }
        // 键盘上键
        if (ev.keyCode===38) {
            if ((typeof this.index==='undefined') || this.index<=0) {
                this.index=$lis.size()-1;
            } else {
                this.index--;
            }
            $lis.css({
                'color':'#666',
                'backgroundColor':'#fff'
            });
            $lis.eq(this.index).css({
                'color':'#fff',
                'backgroundColor':'#26f'
            });
        }
        // 回车输入数据
        if (ev.keyCode===13) {
            var str2=($lis.eq(this.index).html()+'').replace(/(<\w+>|<\/\w+>)+/g,'');
            $('#email').val(str2);
            $('#email-hint').css('display','none');
        }

    }).bind('blur',function () {
        $('#email-hint').css('display','none');
    });
    // 备注输入字数限制
    $('#memo').bind('keyup',function () {
        var len=!(200-$(this).val().length+1)?200:(200-$(this).val().length); // !(NaN+1)==true !(0+1)==false
        $('#maxlen').html(len);
    });
    // 选择日期 1970/1/1-2030/12/31
    (function () {
        var opt_year='';
        var opt_month='';
        var opt_day='';
        for (var i=0,len=61;i<len;i++) {
            opt_year+='<option>'+(+1970+i)+'</option>';
            if (i<=11) {
                opt_month+='<option>'+(+i+1)+'</option>';
            }
            if (i<=30) {
            	opt_day+='<option>'+(+i+1)+'</option>';
            }
        }
        $('#birth_year').html(opt_year);
        $('#birth_month').html(opt_month);
        $('#birth_day').html(opt_day);
        // 月份，年份改变时，改变日期
        function changeDate() {
        	var numY=+$('#birth_year').val();
            var numM=+$('#birth_month').val();
            var day=0;
            opt_day='';
            
            switch (numM) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    day=31;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    day=30;
                    break;
                case 2:
                    if (numY % 400===0 || (numY%4===0 && numY%100!==0)) {
                        day=29;// 闰年;
                    } else {
                        day=28;
                    }
                    break;
                default:
                console.log('SWITCH ERROR!!!');
                break;
            }
            for (var i=0,len=day;i<len;i++) {
                opt_day+='<option>'+(+i+1)+'</option>';
            }
            $('#birth_day').html(opt_day);
        }
        // 月份，年份改变时，改变日期
        $('#birth_year').bind('change',function () {
        	changeDate();
        });
        $('#birth_month').bind('change',function () {
        	changeDate();
        });
    }());
    // 导航切换动画
    for (var i=0,len=($('.nav_space').eq(0).find('li').size());i<len;i++) {
    	$('.nav_space').eq(0).find('li').get()[i].index=i;
    }
    $('.nav_space').eq(0).find('li').bind('mouseover',function (ev) {
    	var that=this;
    	$('.nav_bg').eq(0).animate({
    		'left':85*(that.index)+'px',
    	},5,function () {
    		$('.nav_bg_text').eq(0).animate({
    		'left':-85*(that.index)+'px',
    		},7);
    	});
    });
   	$('.nav_space').eq(0).find('li').bind('mouseout',function () {
    	$('.nav_bg').eq(0).animate({
    		'left':'0px',
    	},5,function () {
    		$('.nav_bg_text').eq(0).animate({
    		'left':'0px',
    		},7);
    	});
    });
    // 博文展开与收缩
    $('#main').find('.main_sidebar').find('.heading').bind('click',function () {
    	$(this).next().slideToggle(16);
    });
    // ============轮播器===================
    (function () {
    	// ===========轮播器1-----left=======================
	    for (var i=0,len=$('#tag').find('li').size();i<len;i++) {
	    	$('#tag').find('li').get(i).index=i;
	    }
	    // 轮播器主函数
	    function carousel(ind) {
	    	$('#tag').find('li').removeClass('active').eq(ind).addClass('active');
	    	$('#carousel').find('ul').animate({'left':-900*ind+'px'},15);
	    }
	    // 自动轮播
	    var timer;
	    var ind=1;
	    timer=setInterval(function () {
	    	if (ind>len-1) {ind=0;}
	    	carousel(ind);
	    	ind++;
	    },1500);
	    // 手动干预
	    $('#tag').find('li').hover(function () {
	    	clearInterval(timer);
	    	ind=this.index; // 实时更新列表索引
	    	carousel(ind);
	    },function () {
	    	clearInterval(timer);
	    	ind=(+this.index+1)>(len-1)?0:(+this.index+1);
	    	timer=setInterval(function () {
	    	if (ind>len-1) {ind=0;}
	    	carousel(ind);
	    	ind++;
	    	},1500);
	    });
	    // ===================轮播器2-----opacity=================
	    for (var j=0,len2=$('#tag2').find('li').size();j<len2;j++) {
	    	$('#tag2').find('li').get(j).index=j;
	    }
	    // 轮播器主函数
	    function carousel2(ind) {
	    	$('#tag2').find('li').removeClass('active').eq(ind).addClass('active');
	    	$('#carousel2').find('ul').find('li').css({'zIndex':1,'opacity':0});
	    	$('#carousel2').find('ul').find('li').eq(ind).css({'zIndex':2}).animate({'opacity':1},15);
	    }
	    // 自动轮播
	    var timer2;
	    var ind2=1;
	    timer2=setInterval(function () {
	    	if (ind2>len2-1) {ind2=0;}
	    	carousel2(ind2);
	    	ind2++;
	    },1500);
	    // 手动干预
	    $('#tag2').find('li').hover(function () {
	    	clearInterval(timer2);
	    	ind2=this.index; // 实时更新列表索引
	    	carousel2(ind2);
	    },function () {
	    	clearInterval(timer2);
	    	ind2=(+this.index+1)>(len2-1)?0:(+this.index+1);
	    	timer2=setInterval(function () {
	    	if (ind2>len2-1) {ind2=0;}
	    	carousel2(ind2);
	    	ind2++;
	    	},1500);
	    });
    }());
    // 延迟加载
    $(document).bind('scroll',function () {
    	var scrollTop=(document.documentElement.scrollTop===0)?(document.body.scrollTop):(document.documentElement.scrollTop);
    	var winHeight=(document.documentElement.clientHeight===0)?(document.body.clientHeight):(document.documentElement.clientHeight);
    	for (var i=0,len=$('#picbox').find('img').size();i<len;i++) {
    		var picTop=$('#picbox').find('figure').get(i).offsetTop;
    		var $that=$('#picbox').find('figure').find('img').eq(i);
    		if (scrollTop>(picTop-winHeight) && !($that.get(0).isLoaded)) {
	    		$that.attr('src',$that.attr('xsrc')).animate({'opacity':1},100);
	    		$that.get(0).isLoaded=true; // 防止重复加载
	    	}
    	}
    });
    // 预加载
    // 添加索引
    for (var i=0,len=$('#picbox').find('figure').size();i<len;i++) {
    	$('#picbox').find('figure').eq(i).find('img').attr('index',i);
    }
    $('#picbox').find('figure').find('img').click(function () {
    	var that=this;
    	var imgCur=new Image();
    	var imgPrev=new Image();
    	var imgNext=new Image();
    	var num=+$(that).attr('index'); // 0
    	var a=0;
    	var b=0;
    	imgCur.src=$(that).attr('bsrc');
    	
    	// 打来图片预览
    	$('#lockscreen').css({'display':'block'});
    	$('#viewbox').css({'display':'block'});
    	// 图片加载完成显示
    	$(imgCur).bind('load',function () {
    		$('#viewbox').find('figure').find('img').attr('src',imgCur.src);

    	});
    	// 关闭图片预览
    	$('#viewbox').find('.close').eq(0).click(function () {
	    	$('#lockscreen').css({'display':'none'});
	    	$('#viewbox').css({'display':'none'});
	    	$('#viewbox').find('figure').find('img').attr('src','');
	    });
    	// 左右切换图片
	    $('#viewbox').find('.prev').eq(0).click(function () {
	    	num=(num-1)>0?(num-1):11; // 11
    		imgPrev.src=$('#picbox').find('figure').eq(num).find('img').attr('bsrc');
	    	$('#viewbox').find('figure').find('img').attr('src',imgPrev.src);
	    });
	    $('#viewbox').find('.next').eq(0).click(function () {
	    	num=(num+1)>11?0:(num+1); // 0
	    	imgNext.src=$('#picbox').find('figure').eq(num).find('img').attr('bsrc');
	    	$('#viewbox').find('figure').find('img').attr('src',imgNext.src);
	    });
    	
    });

	// 提交服务器注册
    $('#signinbox_submit').click(function () {
        $('#load_sign').css('display','block');
        $.ajax({
            url:'./php/add.php',
            type:'POST',
            data:$('#siginform').serialize(),
            success:function (text,statue,xhr) {
                if (text==1) {
                    // 注册成功
                    $('#load_sign').html('OK!');
                    setTimeout(function () {
                        // 关闭注册框
                        $('#signinbox').css('display','none');
                        $('#load_sign').css('display','none');
                        // 初始化登录框 并打开登录框
                        $('#loginbox').find('input').val('');
                        $('#login_tip').css('visibility','hidden');
                        $('#loginbox').css('display','block').center($('#loginbox').width(),$('#loginbox').height());
                    },500);
                } else {
                    $('#load_sign').css('display','none').html('loading...');
                }
            },
        });
        // 禁止重复提交
        this.disabled=true;
        $(this).css({
            'backgroundPosition':'right center',
            'cursor':'not-allowed'
        });
    });
    // 登录检测
    $('#loginbox_submit').click(function () {
        // 初始化
        $('#login_tip').css('visibility','hidden');
        if ($('#user').val().length>=2 && $('#pwd').val().length>=6) {
            $('#load_login').css('display','block');
            $.ajax({
                url:"./php/isSign.php",
                type:"POST",
                data:$('#loginform').serialize(),
                success:function (text,status,xhr) {
                    if (text==1) {
                        // 登录成功
                        $('#load_login').html('OK!');
                        // 关闭登录框及提示框
                        setTimeout(function () {
                            $('#load_login').css('display','none');
                            $('#loginbox').css('display','none');
                            $('#lockscreen').css('display','none');
                            // 允许滚动
                            $(document.body).removeClass('ban-scroll');
                            // 显示用户面板
                        	$('#login_before').css('display','none');
                        	$('#info_user').html($('#user').val());
                        	$('#login_after').css('display','block');
                            // 更新用户的文章
            				refreshPage();
                        },500);
                        // 计入cookie

                        
                    } else {
                        $('#load_login').css('display','none');
                        $('#login_tip').css('visibility','visible');                    
                    }
                },
            });
        } else { 
            // 输入不合法
            $('#login_tip').css('visibility','visible');
        }
    });
    // 注册新用户
    $('#btn_signin').click(function () {
        // 关闭登录框
        $('#loginbox').css('display','none');
        // 清除注册框数据，并打开注册框
        initSignin();
    });
    // 个人中心
    $('#me_nav').click(function (ev) {
        ev=ev?ev:window.event;
        target=ev.target || window.srcElement;
        switch (target.className) {
            case "me__write":
                // 发文
                var $writebox=$('#writebox');
                var write_dhead=$('#write_dhead').get(0);
                $writebox.css('display','block').center($writebox.width(),$writebox.height()).drag(write_dhead);
                $('#lockscreen').css('display','block');
                break;
            case "me__skin":
                // 换肤
                var $skinbox=$('#skinbox');
                var skin_dhead=$('#skin_dhead').get(0);
                var $figures=$("#skinbox").find("figure"); // ???
                // 更新皮肤信息
                $.ajax({
                    url:"./php/skin.php",
                    type:"GET",
                    success:function (text,status,xhr) {
                        text=JSON.parse(text);
                        console.log(text);
                        // 存储数据
                        for (var i=0,len=$figures.size();i<len;i++) {
                            $("#skinbox").find("figure").eq(i).attr('data-bg',text[i]["bg"]).attr('data-bg_color',text[i]["bg_color"]);
                            $("#skinbox").find("figure").eq(i).find('img').eq(0).attr("src","./images/"+text[i]["bg_small"]);
                            $("#skinbox").find("figure").eq(i).find('figcaption').eq(0).html(text[i]["text"]);
                        }
                    },
                });
                $skinbox.css('display','block').center($skinbox.width(),$skinbox.height()).drag(write_dhead);
                $('#lockscreen').css('display','block');
                break;
            case "me__help":
                alert('帮助');
                break;
            case "me__exit":
                // 关闭用户面板，并清除数据
                $('#login_after').css('display','none');
                $('#login_before').css('display','block');
                $('#info_user').html('');
                $('#main_body').html('<section><h2 class="heading">标题<span class="head_date">2016/11/16</span></h2><div class="body"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non saepe, voluptas excepturi iste qui aspernatur ad eius praesentium. Distinctio reprehenderit debitis, sunt reiciendis error consequuntur, voluptatibus omnis inventore quidem magnam.</p></div></section>');
                break;
            default:
            alert('SWITCH ERROR!!!');
                break;
        }
    });
    // 关闭发文框
    $('#write_close').click(function () {
    	// 关闭发文框并清除数据
    	$('#writebox').css('display','none');
    	$('#lockscreen').css('display','none');
    	$('#write_tip').css('visibility','hidden');
    	$('#title').val("");
    	$('#content').val("");   
    });
    // 提交发文
    $('#writebox_submit').click(function () {
    	var title=$('#title').get(0);
    	var content=$('#content').get(0);
    	if (title.value=="" || content.value=="") {
    		$('#write_tip').css('visibility','visible');
    	} else {
    		// 去除空格
    		title.value=title.value.trim();
    		content.value=content.value.trim();
    		// 改变样式
    		$('#write_tip').css('visibility','hidden');
    		$('#load_write').css('display','block');
    		// 发送
    		$.ajax({
    			url:"./php/sendArticle.php",
    			type:"POST",
    			data:$('#writeform').serialize()+'&username='+$('#info_user').html(),
    			success:function (text,status,xhr) {
    				if (text==1) {
    					$('#load_write').html('ok');
	    				setTimeout(function () {
	    					$('#load_write').css('display','none').html('loading...');
	    					$('#writebox').css('display','none');
	    					$('#lockscreen').css('display','none');
    						// 更新用户的文章
            				refreshPage();
    						// 清空数据
	    					title.value="";
    						content.value="";
	    				},500);
    				}
    			},
    		});
    	}
    });
    // 关闭换肤框
    $("#skin_close").click(function () {
        $('#skinbox').css('display','none');
        $('#lockscreen').css('display','none');
    });
    // 选择皮肤，进行换肤
    $("#skinbox").find("figure").click(function () {
        // 初始化
        for (var i=0,len=$("#skinbox").find("figure").size();i<len;i++) {
            $("#skinbox").find("figure").eq(i).attr("flag",0);
        }
        $("body").css({
            "backgroundColor":$(this).attr("data-bg_color"),
            "backgroundImage":"url(./images/"+($(this).attr("data-bg"))+")",
        });
        // 标记当前皮肤，并存入数据库
        $(this).attr("flag",1);
        $.ajax({
            url:"./php/skinflag.php",
            type:"POST",
            data:{"active":$(this).find("figcaption").eq(0).html()},
            success:function (text,status,xhr) {
                console.log(text);
            },
        });
    });
    // 标记上一次的皮肤
    $.ajax({
        url:"./php/skincookie.php",
        type:"GET",
        success:function (text,status,xhr) {
            text=JSON.parse(text);
            console.log(text);
            $("body").css({
                "backgroundColor":text['bg_color'],
                "backgroundImage":"url(./images/"+text['bg']+")",
            });
        },
    });

});