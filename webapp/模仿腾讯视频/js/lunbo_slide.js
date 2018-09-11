/**
  *   Author:Who am I
  *   Theme: lunbo_slide
  *
  */

$(function () {
    /**
      * @Author:Who am I
      * @Theme: lunbo_slide
      * @param: selector_ul,selector_p
      */
    function SlideBox(obj) {
        var _this=this;
        _this.slidebox=$(obj['selector_ul']).eq(0);
        _this.cur=_this.slidebox.find("li.active");
        _this.slideboxInfo=_this.slidebox.siblings(obj['selector_p']).eq(0);
        _this.videoTitle=_this.slideboxInfo.find(".video_title").eq(0);
        _this.videoInfo=_this.slideboxInfo.find(".video_info").eq(0);
        _this.init();
    }
    SlideBox.prototype.init=function () {
       var _this=this;
       // 初始化
       // 初始化视频信息
       _this.videoTitle.html(_this.cur.get(0).dataset.title);
       _this.videoInfo.html(_this.cur.get(0).dataset.info);
       // 初始化层叠顺序
       _this.slidebox.find("li.next").each(function (index,item) {
           item.style.zIndex="-"+index;
       });

       // 左滑
       _this.slidebox.swipeLeft(function () {
            if (!_this.slidebox.find("li:last-of-type").hasClass("active")) {
                _this.cur.next().removeClass().addClass("active");
                _this.cur.removeClass().addClass("prev");
                _this.cur=_this.slidebox.find("li.active");
                // 更新视频信息
                _this.videoTitle.html(_this.cur.get(0).dataset.title);
                _this.videoInfo.html(_this.cur.get(0).dataset.info);
                // 改变层叠顺序
                _this.slidebox.find("li.prev").each(function (index,item) {
                    item.style.zIndex="1";
                });
            }
       });
       // 右滑
       _this.slidebox.swipeRight(function () {
            if (!_this.slidebox.find("li:first-of-type").hasClass("active")) {
                 _this.cur.prev().removeClass().addClass("active");
                 _this.cur.removeClass().addClass("next");
                 _this.cur=_this.slidebox.find("li.active");
                 // 更新视频信息
                 _this.videoTitle.html(_this.cur.get(0).dataset.title);
                 _this.videoInfo.html(_this.cur.get(0).dataset.info);
                 // 改变层叠顺序
                 _this.slidebox.find("li.next").each(function (index,item) {
                     item.style.zIndex="-"+index;
                 });
            }
       });
    };

    // big slidebox
    var slidebox_big=new SlideBox({
        'selector_ul':"#slidebox_big",
        'selector_p':".slidebox_info"
    });
    // small slidebox
    var slidebox_big=new SlideBox({
        'selector_ul':"#slidebox_small",
        'selector_p':".slidebox_info"
    });
   
});