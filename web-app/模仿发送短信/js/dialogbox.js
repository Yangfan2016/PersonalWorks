/**
  * Time: 2016-09-05
  * Author: Who am I ?
  * Theme: Baidu Voice I/O
  * Issues: 
  */

// @param:dialogbox,dialogcontent,duration
// @method:  .show()  .hide()
function Dialogbox(Ddata) {
    this.dialogbox=Ddata.dialogbox;
    this.dialogcontent=Ddata.dialogcontent;
    this.duration=Ddata.duration;
}

Dialogbox.prototype.show=function () {
    var that=this;
    that.dialogcontent.className="dialogcontent";
        setCss(that.dialogbox,"height:100vh;");
        that.dialogcontent.className+=" d_move";
        setTimeout(function () {
            setCss(that.dialogcontent,"top:20%;");
        },that.duration);
};

Dialogbox.prototype.hide=function () {
    var that=this;
    that.dialogcontent.className="dialogcontent";
        setCss(that.dialogbox,"height:0;");
        setCss(that.dialogcontent,"top:-100vh;");
};




