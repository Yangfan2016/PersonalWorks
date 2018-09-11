/**
  * Time: 2016-08-30
  * Author: Who am I ?
  * Theme: capture
  * Issues: 
  */

// 截图插件
// @param:{video,canvas,img}
// @method: .main() .capture()
function CaptureImg(Cdata) {
    this.video=Cdata.video;
    this.canvas=Cdata.canvas
    this.img=Cdata.img;
    this.stream=null;
    this.ctx=this.canvas.getContext("2d");
}

CaptureImg.prototype.main=function () {
    var _this=this;
    var sizeCanvas = function () {
    setTimeout(function () {
        _this.canvas.width = _this.video.videoWidth;
        _this.canvas.height =_this.video.videoHeight;
        _this.img.width = _this.video.videoWidth;
        _this.img.height = _this.video.videoHeight;
    }, 100);
};
    var getUserMedia=navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
    getUserMedia.call(navigator,{video:true},function (localMediaStream) {
        _this.video.src=window.URL.createObjectURL(localMediaStream);
        _this. stream=localMediaStream;
        sizeCanvas();
    },function (e) {
        alert("rejected\n"+e);
        console.log("rejected",e);
    });
    
};

CaptureImg.prototype.capture=function () {
    var _this=this;
    if (_this.stream) {
        _this.ctx.drawImage(_this.video,0,0);
        _this.img.src=_this.canvas.toDataURL("image/png");
    }
};



