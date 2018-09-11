/**
  * Theme: music player data request
  * Dependence: jQuery
  *
  */


// create jsonp
function createJsonp(reqdata) {
	$.ajax({
		url:reqdata.url,
		data:reqdata.data,
		dataType:"jsonp",
		jsonp:"callback",
		success:function (res) {				
			reqdata.callback(res);
		},
		error:function (err) {
			console.warn(err.status);
		}
	});
}
//  请求API (PHP) GET
function requestAPI(req) {
	$.ajax({
		url:req.url,
		type:"GET",
		data:req.data,
		success:function (res) {
			req.callback(JSON.parse(res)); // str->json
		},
		error:function (err) {
			console.warn(err.status);
		}
	});
}

// 搜索请求数据
function searchRequest(str) {
	// 搜索内容非空判断
	if (!str) {
		showTipBox("error","不能为空哟！");
	} else if (str===localStorage.getItem("searchString")) {
		// 避免重复请求
		showTipBox("error","重复请求了！");
	} else {
		console.log("res-200 "+str);
		showLoadingBox(true);
		// jsonp
		createJsonp({
			url:"http://s.music.163.com/search/get/?",
			data:{
				s:str,
				limit:100,
				type:1
			},
			callback:function (data) {
				showLoadingBox(false);
				if (!data.result) {
					showTipBox("error","查无此曲！"); // 查无此歌
				} else {
					console.log(data);
					// render DOM
					var songs=data.result.songs;
					var listLen=songs.length;
					var listHtml='';
					for (var i=0;i<listLen;i++) {
						listHtml+=`
							<tr data-index="`+i+`"  data-id="`+songs[i]['id']+`" data-song-name="`+songs[i]['name']+`" data-duration="`+songs[i]['duration']+`" data-audio="`+songs[i]['audio']+`" data-album-name="`+songs[i]['album']['name']+`" data-album-pic="`+songs[i]['album']['picUrl']+`" data-singer-name="`+songs[i]['artists'][0]['name']+`">
								<td class="index" data-num="`+((+i+1)<10?"0"+(+i+1):(+i+1))+`">`+((+i+1)<10?"0"+(+i+1):(+i+1))+`</td>
								<td><i class="fa fa-heart-o" aria-hidden="true"></i>&nbsp;
<i class="fa fa-download" aria-hidden="true"></i></td>
								<td>`+songs[i]['name']+`</td>
								<td>`+songs[i]['artists'][0]['name']+`</td>
								<td>`+songs[i]['album']['name']+`</td>
								<td>`+'--:--'+`</td>
							</tr>
						`;
					}
					// refreshDOM
					$("#infoList_search").html(listHtml);
					// render search count
					$("#search_count").find(".input").html(str);
					$("#search_count").find(".count").html(data.result.songCount);

					
					
				}
			}
		});
	}
	localStorage.setItem("searchString",str);
}
// 刷新DOM tbody
function refreshDOM(songLen) {
	var tr=$("#infoList_playlist").find("tr").get(0), // 歌单列表第一行
		media=$("#audio").get(0), // 音频audio对象
	 	$songDetail=$("#songDetail"); // 歌曲详情页信息

	// 更新数据 歌曲数量
	localStorage.setItem("songLen",songLen);
	// 初始化播放资源
	$(media).attr("src",tr.dataset.audio);
	// 暂停播放
	media.pause();
	// 初始化播放时长
	$("#audio_duration").html(tr.dataset.durationFormat);
	// 高亮第一行
	$(tr).eq(0).find("td.index").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').addClass("active");
	// 刷新小窗歌曲信息
	$("#smallwindow_albumPic").attr("src",tr.dataset.albumPic);
	// 刷新小窗专辑封面
	$("#smallwindow_songName").html(tr.dataset.songName);
	$("#smallwindow_singerName").html(tr.dataset.singerName);

	// 储存当前歌曲必要信息
	localStorage.setItem("curPlayInfo_songID",tr.dataset.id);
	localStorage.setItem("curPlayInfo_songName",tr.dataset.songName);
	localStorage.setItem("curPlayInfo_singersName",tr.dataset.singerName);
	localStorage.setItem("curPlayInfo_albumName",tr.dataset.albumName);
	localStorage.setItem("curPlayInfo_albumPic",tr.dataset.albumPic);
	localStorage.setItem("curPlayInfo_audioSrc",tr.dataset.audio);

	// 刷新歌曲详情页bg和poster
	$("#bgBlur").css({
		"backgroundImage":'url("'+localStorage.getItem('curPlayInfo_albumPic')+'")'
	});
	$("#bgDisc").css({
		"backgroundImage":'url("'+localStorage.getItem('curPlayInfo_albumPic')+'")'
	});

	// 刷新歌曲基本信息
	$songDetail.find(".songname").html(localStorage.getItem('curPlayInfo_songName'));
	$songDetail.find(".albumname").html(localStorage.getItem('curPlayInfo_singersName'));
	$songDetail.find(".singersname").html(localStorage.getItem('curPlayInfo_albumName'));

	// 生成歌词
	createScrollLrc();

}
// 生产滚动歌词
function createScrollLrc() {
	// 获取歌词
	var songID=localStorage.getItem("curPlayInfo_songID");
	// 避免重复请求
	if (!localStorage.getItem("lyric-"+songID)) {
		// 请求歌词信息
		requestAPI({
			url:"./api.php",
			data:{
				"API_type":"get_music_lyric",
				"queryString":{
					"id":songID
				}
			},
			callback:function (data) {
				console.log(data.nolyric);
				// 判断是否有歌词
				if (!data.nolyric) {
					// 储存歌词
					localStorage.setItem("lyric-"+songID,data.lrc.lyric);
					// 生成滚动歌词
					mainLrcScroll({
						"jQ_lrcContainer":$("#lrcContainer"),
						"jQ_lrcBox":$("#lrcBox"),
						"jQ_audio":$("#audio"),
						"str":data.lrc.lyric,
					});
					console.log("网络歌词");
				} else {
					$("#lrcBox").html("<p>暂无歌词</p>");
					console.log("暂无歌词");
				}
			}
		});
	} else {
		mainLrcScroll({
			"jQ_lrcContainer":$("#lrcContainer"),
			"jQ_lrcBox":$("#lrcBox"),
			"jQ_audio":$("#audio"),
			"str":localStorage.getItem("lyric-"+songID),
		});
		console.log("本地歌词");
	}
}
// 初始化歌单数据
function initPlaylist(data) {
	var docFrag=document.createDocumentFragment(),
		result=data['result'],
		tracks=result['tracks'],
		songLen=tracks.length,
		tr=null,
		td=null,
		timeObj={},
		createTime="",
		singerArr=[],
		allSinger="";

	// 清空
	$("#infoList_playlist").html(' ');
	// 生产歌单列表
	for (var i=0;i<songLen;i++) {
		// ms->s /1000  格式化时间 00:00
		timeObj=formatTime(tracks[i]['duration']/1000); 
		// 多个歌手名字组合
		for (var j=0;j<tracks[i]['artists'].length;j++) {
			singerArr.push(tracks[i]['artists'][j]['name']);
		}
		allSinger=singerArr.join(" / ");
		// 清除
		singerArr=[];

		// 创建tr 设置tr
		tr=document.createElement("tr"); 
		tr.dataset.index=i;
		tr.dataset.id=tracks[i]['id'];
		tr.dataset.songName=tracks[i]['name'];
		tr.dataset.duration=tracks[i]['duration'];
		tr.dataset.durationFormat=timeObj.I+":"+timeObj.S;
		tr.dataset.audio=tracks[i]['mp3Url'];
		tr.dataset.singerName=allSinger;
		tr.dataset.albumName=tracks[i]['album']['name'];
		tr.dataset.albumPic=tracks[i]['album']['picUrl'];
		tr.innerHTML=`
			<td class="index" data-num="`+((+i+1)<10?"0"+(+i+1):(+i+1))+`">`+((+i+1)<10?"0"+(+i+1):(+i+1))+`</td>
			<td><i class="fa fa-heart-o" aria-hidden="true"></i>&nbsp;
<i class="fa fa-download" aria-hidden="true"></i></td>
			<td>`+tracks[i]['name']+`</td>
			<td>`+allSinger+`</td>
			<td>`+tracks[i]['album']['name']+`</td>
			<td>`+timeObj.I+`:`+timeObj.S+`</td>
		`;
		docFrag.appendChild(tr);
	}
 	// 重新渲染DOM
	$("#infoList_playlist").append(docFrag);
	// 生成歌单的基本信息
	createTime=formatDate(result.createTime);
	$("#playlist_listPic").attr("src",result.coverImgUrl);
	$("#playlist_listName").html(result.name);
	$("#playlist_userFace").attr("src",result.creator.avatarUrl);
	$("#playlist_userName").html(result.creator.nickname);
	$("#playlist_createTime").html(createTime.Y+"-"+createTime.M+"-"+createTime.D);
	$("#playlist_trackCount").html(result.trackCount);
	$("#playlist_playCount").html(result.playCount);

	/* ==================== REFRESH DOM =============================== */
	refreshDOM(songLen);

}

// init
$(function () {

	// 基本信息
	var Author={
		"nickname":"前端2017--闯",
		"id_like":"40730905"
	};
	// 搜索歌曲功能函数
	var funcSearch=function () {
		var strSearch=$("#inpSearch").val().trim();
		// 显示搜索页 隐藏列表页
		$("#pageMain").slideUp(300);
		$("#pageSearch").slideDown(300);
		// 缩放歌曲详情页
		$("#pageSongDetail").css({
			"top":"100%",
			"right":"100%",
			"opacity":0
		});
		// 请求数据
		searchRequest(strSearch);
	};

	// ===============初始化========================

	// 初始化歌单 我喜欢的音乐
	showLoadingBox(true);
	requestAPI({
		url:"./api.php",
		data:{
			"API_type":"get_playlist_info",
			"queryString":{
				"id":Author["id_like"]
			}
		},
		callback:function (data) {
			initPlaylist(data);
			showLoadingBox(false);
		}
	});

	// ===============搜索功能========================

	// 顶部菜单input回车搜索
	$("#inpSearch").on("keydown",function (ev) {
		var ev=ev || window.event;
		if (ev.keyCode===13) {
			funcSearch();
		}
	});
	// 顶部菜单query图标点击搜索
	$("#top_searchBtn").on("click",function () {
		funcSearch();
	});
	
	// ===============歌单功能========================

	// 切换歌单与搜索页
	$("#list_create_like").on("click",function () {
		// 显示列表页 隐藏搜索页
		$("#pageSearch").slideUp(500);
		$("#pageMain").slideDown(500);
	});
	
	// ===============歌曲详情页======================== 

	// 展开与缩放歌曲详情页
	$("#btnExpandPlayBox").on("click",function () {
		// style: 展开歌曲详情页
		$("#pageSongDetail").css({
			"top":"60px",
			"right":0,
			"opacity":1
		});
	});
	$("#btnCompressPlayBox").on("click",function () {
		// style: 缩放歌曲详情页
		$("#pageSongDetail").css({
			"top":"100%",
			"right":"100%",
			"opacity":0
		});
	});


	// ==============EXPORT=====================

	// export
	window.requestAPI=requestAPI;

});


