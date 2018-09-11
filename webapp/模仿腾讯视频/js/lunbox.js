/**
  * Author: Who am I
  * Thmeme: lunbo
  *
  */

$(function () {
	var $lunbo_ul=$("#lunbo_ul");
    var $liWidth=$lunbo_ul.find("li").eq(0).width();
    var count=3;
    var timer=null;

    function lunbo(i) {
    	clearTimeout(timer);
    	$lunbo_ul.animate({
    		"left":"-"+$liWidth*i+"px"
    	},1000,function () {
	    	timer=setTimeout(function () {
	    		lunbo((++i>count-1?0:i));
	    	},2500);
    	});
    }
    lunbo(0);
    
});