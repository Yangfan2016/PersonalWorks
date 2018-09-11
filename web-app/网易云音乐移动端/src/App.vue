<template>
  	<div id="app">
		<!-- 导航 -->
		<mu-appbar class="appbar" v-bind:zDepth="0">
			<mu-icon-button icon="menu" slot="left"/>
			<mu-flat-button label="我的" class="demo-flat-button" to="/me"></mu-flat-button>
			<mu-flat-button label="发现" class="demo-flat-button" to="/"></mu-flat-button>
			<mu-flat-button label="动态" class="demo-flat-button" to="/dynamic"></mu-flat-button>
			<mu-icon-button icon="search" slot="right" v-on:click="searchMusic" />
		</mu-appbar>
		<!-- router -->
		<transition name="slide-left" mode="out-in">
			<router-view class="view" v-on:push-list="addMusicList" v-bind="{
				curSong:curMusic
			}"></router-view>      
		</transition>
		<!-- 播放条 -->
		<div class="musicbar" v-if="isShowMusicBar" v-on:click="openMusicBox">
			<div class="music_poster">
				<div class="poster_pic">
					<img v-bind:src="curMusic.posterUrl" alt="Vue" style="width:100%;height:100%;" />
				</div>
				<div class="poster_info">
					<span class="text info_singname" v-text="curMusic.sing"></span>
					<span class="text info_singer">{{curMusic.singer|combineName}}</span>
				</div>
			</div>
			<div class="music_btn">
				<mu-icon-button icon="play_circle_outline" v-if="!isPlay" v-on:click.stop="startPlay" />
				<mu-icon-button icon="paused_circle_outline" v-if="isPlay" v-on:click.stop="stopPlay" />
				<mu-icon-button icon="playlist_play" v-on:click.stop="openPlayListBox" />
			</div>
		</div>
		<!-- 播放页 -->
		<transition name="slideVertical">
			<music-play v-show="isOpenMusicPage" v-bind="{
				curSong:curMusic,
				isCanPlaySong:isCanPlay,
				isPlaySong:isPlay,
				playSongMode:playMode
			}" v-on:close-box="closeMusicBox" v-on:change-status="changePlayStatus" v-on:open-popbox="openPlayListBox"></music-play>
		</transition>
		<!-- 歌单列表 -->
		<mu-popup position="bottom" v-bind:overlay="true" popupClass="popup-bottom-playlist" v-bind:open="isOpenPlayListBox" v-on:close="isOpenPlayListBox=false">
			<ul class="popup-song-detail" id="popBOX">
				<li class="song_btngroup">
					<span style="display:inline-block;" v-on:click="changePlayMode">
						<mu-flat-button v-if="playMode=='list_repeat'" v-bind:label="'列表循环 ('+musicList.length+')'" class="" icon="repeat" />
						<mu-flat-button v-if="playMode=='sing_repeat'" v-bind:label="'单曲循环 ('+musicList.length+')'" class="" icon="repeat_one" />
						<mu-flat-button v-if="playMode=='random'" v-bind:label="'随机播放 ('+musicList.length+')'" class="" icon="shuffle" />
					</span>
					<mu-flat-button label="清空列表" style="float:right;" icon="delete" v-on:click="clearMusicList" />
				</li>
				<li class="song_data" v-for="(song,index) in musicList" v-bind:key="index">
					<div class="s_left" v-bind:class="{active:song.id===curMusic.id}" v-bind:data-current="song.id===curMusic.id" v-on:click.stop="playSong(song,index)">
						<span v-text="song.name"></span>-<span>{{song.ar|combineName}}</span>
					</div>
				</li>
			</ul>
		</mu-popup>	
		<!-- Audio -->
        <audio id="audio" v-bind:src="curMusic.src" ref="audiobox" v-show="false"></audio>
		<!-- test -->
		<search v-if="isOpenSearchPage" v-on:close-search="isOpenSearchPage=false" v-on:open-play="isOpenMusicPage=true" v-on:push-list="pushCurPlayList"></search>
	  </div>
</template>
<script>
import PlayPage from "./components/PlayPage.vue"
import SearchPage from "./components/SearchPage.vue"

export default {
	name: 'app',
	data:function () {
		return {
			activeTab:'tab1',
			isShowMusicBar:false,
			isOpenMusicPage:false,
			isOpenPlayListBox:false,
			isOpenSearchPage:false,
			isLoad:false,
			isCanPlay:false,
			isPlay:false,
			audioBox:null,
			curMusic:{
				sing:"网易云音乐",
				singer:[{name:""}],
				duration:0,
			},
			curPlaylist:{},
			musicList:[], // 播放列表
			playModeList:["list_repeat","sing_repeat","random"],
			playMode:"list_repeat",
			index:0,
		};
	},
	watch:{
		isPlay:function (val,oldVal) {
			val?this.startPlay():this.stopPlay();
		}
	},
	methods:{
		handleTabChange:function (val) {
			this.activeTab=val;
		},
		openPlayListBox:function () {
			var that=this;
			this.isOpenPlayListBox=true;

			setTimeout(function() {
				var popBOX=document.getElementById("popBOX");
				var current=popBOX.querySelectorAll("[data-current]")[0];
				current && current.scrollIntoView({behavior:"smooth"});
			}, 0);
		},
		openMusicBox:function () {
			var that=this;
			that.isOpenMusicPage=true;
		},
		closeMusicBox:function () {
			var that=this;
			that.isOpenMusicPage=false;
		},
		getSongById:function (id,succ,fail) {
			var that=this;

			that.$http({
				url:that.$api.getSong(id),
				method:"GET",
			}).then(res=>{
				succ && succ(res.data);
			}).catch(err=>{
				console.error(err);
				fail && fail(err);
			});
		},
		playSong:function (song,eq) {
			// close popup
			this.isOpenPlayListBox=false;
			// save cursong data
			song._index=eq;
            localStorage.setItem("curSong",JSON.stringify(song));
			// play this song
			this.playThisSong();
			// emit change curmusic data
			bus.$emit("playlistchange",song);
		},
		playThisSong:function () {
			var that=this;
			var curSong=JSON.parse(localStorage.getItem("curSong"));

			// Don't repeat play music
			if (curSong.id==that.curMusic.id) {
				// if play return
				if (that.isPlay) {
					return false;
				}
				// if playstatus is paused let it play
				if (!that.isPlay && that.musicList.length>0) {
					that.startPlay();
					return false;
				}
			}
			// show music bottom bar
			that.isShowMusicBar=true;
			// push playlist to musiclist
			let playlist=localStorage.getItem("playlist-"+that.curPlaylist.id);
			playlist && that.addMusicList(JSON.parse(playlist));
			// init
			that.isCanPlay=false;
            // save cur music data
			that.curMusic.id=curSong.id;
			that.curMusic.eq=curSong._index;
			that.curMusic.posterUrl=curSong.al.picUrl;
			that.curMusic.sing=curSong.name;
			that.curMusic.singer=curSong.ar;

			// request song by id
			if (localStorage.getItem("curSongExData-"+curSong.id)==null) {
				that.getSongById(curSong.id,function (song) {
					// load music data
					that.loadedSong(song.data[0]);
					// playmusic
					that.isPlay=true;
					// save
					localStorage.setItem("curSongExData-"+curSong.id,JSON.stringify(song.data[0]));
				},function (err) {
					that.isCanPlay=false;
					that.isPlay=false;
					console.log("加载失败 ",err);
				});
			} else {
				let exData=JSON.parse(localStorage.getItem("curSongExData-"+curSong.id));
				// load music data
				that.loadedSong(exData);
				// playmusic
				that.isPlay=true;
			}
		},
		loadedSong:function (data) {
			var that=this;
			that.curMusic.src=data.url; // TODO 多歌曲
			that.curMusic.duration=that.audioBox.duration || 0;
			that.audioBox.src=data.url;
			that.audioBox.load();
			that.isLoad = true;
		},
		startPlay:function () {
			var that=this;
			if (that.isCanPlay) {
				that.audioBox.pause();
				let p1=that.audioBox.play();
				p1.then(res=>{
					that.isPlay=true;
					console.log("开始播放");
				}).catch(err=>{
					that.isPlay=false; //BUG  DOMExcept:The play() request was interrupted by a new load request
					console.error(err);
					console.log("播放失败");
				});
			}
		},
		stopPlay:function () {
			var that=this;

			that.isPlay=false;
			that.audioBox.pause();
			console.log("停止播放");
		},
		changePlayStatus:function (boo) {
			this.isPlay=boo;
		},
		addMusicList:function (playlist) {
			this.curPlaylist.id=playlist.id;
			playlist.tracks && (this.musicList=playlist.tracks);
		},
		clearMusicList:function () {
			this.isShowMusicBar=false;
			this.isOpenPlayListBox=false;
			this.isOpenMusicPage=false;
			this.musicList=[];
			this.stopPlay();
			// remove highlight
			bus.$emit("playlistchange",{id:-1});
		},
		changePlayMode:function () {
			this.index=(this.index+1)%3;
			this.playMode=this.playModeList[this.index];
		},
		// 顺序播放
		playByAesOrder:function (flag) {
			var that=this;
			var songLen=that.musicList.length;
			var eq=that.curMusic.eq;

			flag==-1?eq--:eq++;
			return eq=((eq%songLen)+songLen)%songLen;
		},
		// 随机播放
		playByRanOrder:function () {
			var that=this;
			var songLen=that.musicList.length;
			var eq=that.curMusic.eq;

			return eq=Math.floor(Math.random()*songLen);
		},
		// 上下首切换
		playNextOrPrevSong:function (flag) {
			var that=this;
			var eq=0;
			switch (that.playMode) {
				case "list_repeat":
					eq=that.playByAesOrder(flag);
					break;
				case "sing_repeat":
					eq=that.curMusic.eq;
					break;
				case "random":
					eq=that.playByRanOrder();
					break;
				default:
					break;
			}
			// play No.eq song
			that.playSong(that.musicList[eq],eq);
		},
		// 进入搜索页
		searchMusic:function () {
			// TODO
			var that=this;
			that.isOpenSearchPage=true;
		},
		// 加入播放列表
		pushCurPlayList:function (song) {
			this.musicList.push(song);
		}
	},
	mounted:function () {
		var that=this;

		// EVENT BUS
		bus.$on("curmusicchange",function (eq) {
			that.playThisSong();
		});

		bus.$on("play-next-music",function (flag) {
			that.playNextOrPrevSong(flag);
		});

		bus.$on("change-play-mode",function () {
			that.changePlayMode();
		});

		bus.$on("play-all",function () {
			that.openMusicBox();
			that.playSong(that.musicList[0],0);
		});
		
		that.audioBox=that.$refs["audiobox"];
		

		var audio=that.audioBox;

		// Event canplay
		audio.addEventListener("canplay",function () {
			that.isCanPlay=true;
			if (that.isPlay) {
				that.startPlay();
			} else {
				that.stopPlay();
			}
		},false);
	},
	components:{
		"music-play":PlayPage,
		"search":SearchPage
	}
}
</script>
<style>
*{padding:0;margin:0;}
ul{list-style-type:none;}
.clearfix{zoom:1;}
.clearfix:after{content:".";display:block;height:0;clear:both;}
.center{
	position:fixed;
	top:50%;left:50%;
	-webkit-transform:translate(-50%,-50%);
	transform:translate(-50%,-50%);
}
html,body{
	width:100%;
	height:100%;
}
html{
	font-size:20px;
}
body{
	font-size:0.6rem;
}
#app{
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	/*  margin-top: 60px;*/
	padding:56px 0 56px 0;
}
.appbar{
	position:fixed;
	top:0;
	display:flex;
	z-index:5;  
	background-color: rgb(150,10,10);
}
.musicbar{
	display: flex;
	justify-content: space-between;
	position: fixed;
	bottom:0;
	left: 0;
	right:0;
	padding:10px 10px;
	background-color: #fff;
	z-index:10;
}
.music_poster{
	display: flex;
}
.poster_pic{
	width:50px;
	height:48px;
	background-color: #9c3;
}
.poster_info{
	margin:0 10px;
	line-height:24px;
	text-align:left;
}
.poster_info>.text{
	width:100px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.info_singname{
	display:block;
}
.info_singer{
	display:block;
}
.music_btn .mu-icon{
	font-size: 1.5rem;
}
.popup-bottom-playlist{
	width:100%;
	max-height:50%;
	overflow-x: hidden;
	overflow-y: auto;
	padding:10px 15px;
	box-sizing: border-box;
}
.song_data{
	padding:5px 0;
	border-bottom:1px solid #e8e8e8;
}
.song_data:last-of-type{
	padding:2px 0 0 0;
	border:none;
}
.s_left{
	max-width:70%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size: 0.7rem;
}
.s_left.active{
	color:#cc2005;
}

/* animation */
.slide-left-enter{
  transform:translateX(100%);
}
.slide-left-enter-active{
  transition:transform 0.6s ease;
}
.slide-left-leave-active{
  transition: transform 0.3s ease;
}
.slide-left-leave-to{
  transform:translateX(100%);
}

.slideVertical-enter{
  transform:translateY(100%);
}
.slideVertical-enter-active{
  transition:transform 0.5s ease;
}
.slideVertical-leave-active{
  transition: transform 0.3s ease;
}
.slideVertical-leave-to{
  transform:translateY(100%);
}
</style>
