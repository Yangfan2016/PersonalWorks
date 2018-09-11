/**
  * Author: Who am I ?
  * Theme: play-music-controller
  * Time: 2016-09-26
  * Update: 2016-10-01
  * Update_log: 1. 取消定时器，用timeupdate事件
  * Function: next/prev/loop/drag/volume
  * Issues: 1. 模拟事件点击
  *         2. 动画初始化
  *         3. 判断是 pc 端还是 mobile 端 
  * Get: 1. audio={currentTime: 当前时间,duration:总时长,play():播放,pause():暂停,volume:音量,timeupdate:事件,ended:事件,durationchange:事件}
  */

// getDom()
function getDom(selector) {
    return document.querySelectorAll(selector);
}
// bindEvent()
function bindEvent(ele,eventType,callback) {
    if (typeof ele.addEventListener==="function") {
        ele.addEventListener(eventType,callback,false);
    } else if (typeof ele.attachEvent==="function") {
        ele.attachEvent('on'+eventType,callback);
    } else {
        ele['on'+eventType]=callback;
    }
}
// play|pause  animation
function isPlay(ele,boo) {
    if (!boo) {
        ele.style.webkitAnimationPlayState="paused";
        ele.style.animationPlayState="paused";
    } else {
        ele.style.webkitAnimationPlayState="running";
        ele.style.animationPlayState="running";
    }
}
// init()
function init() {
    // 元素
    var playBtn=getDom("#playBtn")[0],
        prevBtn=getDom("#prevBtn")[0],
        nextBtn=getDom("#nextBtn")[0],
        blur=getDom(".blur")[0],
        main=getDom(".main")[0],
        discBox=getDom(".discBox")[0],
        disc=getDom(".discBox .disc")[0],
        disc_border=getDom(".discBox .border")[0],
        audio=getDom("#audio")[0],
        progressBox=getDom(".progressBox")[0],
        progressBar=getDom(".progressBar")[0],
        progressBar_arc=getDom(".progressBar .arc")[0],
        curTime=getDom(".curTime")[0],
        totalTime=getDom(".totalTime")[0],
        songName=getDom("#songName")[0],
        singerName=getDom("#singerName")[0],
        volume=getDom(".volume")[0],
        volumnbar=getDom("#volumnbar")[0];
    // 数据
    var audio_m=99,
        audio_s=59,
        curT=0,
        curM=0,
        curS=0;
    // 音频数据
    var musicData=[{
        "lm":99,
        "ls":59,
        "src":'./src/kimtaeyeon-I.mp3',
        "bg":'./images/kimtaeyeon.jpg',
        "songName":"I",
        "singerName":"Kim Tae Yeon"
    },{
        "lm":99,
        "ls":59,
        "src":'./src/GG-Gee.mp3',
        "bg":'./images/279465.jpg',
        "songName":"Gee(korean)",
        "singerName":"Girl's generation"
    }];
    var songs_len=musicData.length;
    var i=0; // 第一首歌
    var isDrag=false; // 是否拖动进度条

    // 程序初始化
    function initPlayer() {
        isPlay(disc,false);
        isPlay(disc_border,false);
        audio.pause();
        audio.volume=Math.round(volumnbar.offsetWidth/volume.offsetWidth*100)/100;
        playBtn.className="fa fa-play-circle";
    }
    // 切换歌曲
    function changeSong(i) {
    	audio_m=Math.floor(audio.duration/60);
	    audio_s=Math.round(audio.duration-audio_m*60);
	    musicData[i].lm=audio_m<10?"0"+audio_m:audio_m;
	    musicData[i].ls=audio_s<10?"0"+audio_s:audio_s;
	    progressBar.style.width="0";
        curTime.innerHTML="00:00";
        totalTime.innerHTML=musicData[i].lm+":"+musicData[i].ls;
   		disc.style.backgroundImage='url('+musicData[i].bg+')';
   		blur.style.backgroundImage='url('+musicData[i].bg+')';
   		songName.innerHTML=musicData[i].songName;
   		singerName.innerHTML=musicData[i].singerName;
    }
    // 播放主程序
    function mainPlay() {
        // 按钮样式切换
        playBtn.className=(playBtn.className.indexOf("play")!==-1)?"fa fa-pause-circle":"fa fa-play-circle";
        // 按钮行为判断
        if (playBtn.className.indexOf("play")!==-1) {
            isPlay(disc,false);
            isPlay(disc_border,false);
            audio.pause();
        } else {
            isPlay(disc,true);
            isPlay(disc_border,true);
            audio.play();
        }
    }
    // 程序初始化
    initPlayer();
    changeSong(0);
    // 下一首 Func1
    bindEvent(nextBtn,"touchstart",function () {
   		// 初始化
   		initPlayer();
   		i=i+1>songs_len-1?0:i+1;//console.log("next: "+i);
   		audio.src=musicData[i].src;
   		// 自动播放
    	mainPlay();
    });
    // 上一首 Func2
    bindEvent(prevBtn,"touchstart",function () {
        // 初始化
   		initPlayer();
   		i=i-1<0?songs_len-1:i-1;//console.log("perv: "+i);
   		audio.src=musicData[i].src;
   		// 自动播放
   		mainPlay();
    });
    // 播放|暂停 Func3
    bindEvent(playBtn,"touchstart",function () {
        mainPlay();
    });
    // 时长改变触发事件
    bindEvent(audio,"durationchange",function () {
        changeSong(i);
    });
    // 动态刷新当前时间和进度条
    bindEvent(audio,"timeupdate",function () {
    	if (!isDrag) {
            // 时间
            curM=Math.floor(audio.currentTime/60);
            curS=Math.round(audio.currentTime-curM*60);
            curM=curM<10?"0"+curM:curM;
            curS=curS<10?"0"+curS:curS;
            curTime.innerHTML=curM+":"+curS;
            // 进度条
            var curLong=Math.round(audio.currentTime/audio.duration*(progressBox.offsetWidth-16));
            progressBar.style.width=curLong+"px";
        }
    });
    // 播放完成，进行下一首播放 Func4
    bindEvent(audio,"ended",function () {
        initPlayer();
        nextBtn.click(); // touchstart 模拟事件触发???
    });
    // 拖动进度条改变播放进度 Func5
    bindEvent(progressBar_arc,"touchstart",function() {
        bindEvent(progressBar_arc,"touchmove",function (ev) {
    		isDrag=true; // 开始拖动进度条
            var ev=ev?ev:window.event;
    		var ex=ev.touches[0].clientX;
    		var out_Left=+main.offsetLeft+progressBox.offsetLeft;
    		var left=(ex-out_Left)<0?0:((ex-out_Left)>progressBox.offsetWidth-16?progressBox.offsetWidth-16:ex-out_Left);
    		progressBar.style.width=Math.round(left)+"px";
    		// console.log(left);
    		curT=Math.round(audio.duration*(left/(progressBox.offsetWidth-16)));
    		curM=Math.floor(curT/60);
    	    curS=Math.round(curT-curM*60);
    	    curM=curM<10?"0"+curM:curM;
	        curS=curS<10?"0"+curS:curS;
    	    curTime.innerHTML=curM+":"+curS;
    	});
    });
    bindEvent(progressBar_arc,"touchend",function () {
    	audio.currentTime=curT;
        isDrag=false; // 停止拖动进度条
    });
    // 拖动声音按钮，改变音量 Func6
    bindEvent(volumnbar,"touchstart",function () {
        bindEvent(volumnbar,"touchmove",function (ev) {
            var ev=ev?ev:window.event;
            var ex=ev.touches[0].clientX;
            var out_Left=+main.offsetLeft+volume.offsetLeft+volumnbar.offsetLeft;
            var left=ex-out_Left<0?0:((ex-out_Left)>volume.offsetWidth?volume.offsetWidth:ex-out_Left);
            volumnbar.style.width=Math.round(left)+"px";
            audio.volume=Math.round(left/volume.offsetWidth*100)/100;
            console.log(Math.round(left),audio.volume);
        });
    });

}
bindEvent(window,"load",init);