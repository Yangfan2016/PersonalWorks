<template>
    <div class="details" id="detailPage">
        <div class="d_content">
            <mu-appbar class="appbar" v-bind:zDepth="0" title="歌单" id="appbar">
                <mu-icon-button icon="arrow_back" slot="left" v-on:click="closeList" />
            </mu-appbar>
            <div class="coverbox">
                <div class="cover_user">
                    <div class="user_pic"><img v-bind:src="playList.coverImgUrl" alt="" style="width:100%;height:auto;"></div>
                    <div class="user_info">
                        <div v-text="playList.name"></div>
                        <div v-text="playList.creator && playList.creator.nickname"></div>
                    </div>
                </div>
                <div class="cover_bg"><img v-bind:src="playList.coverImgUrl" alt="" style="width:100%;height:100%;"></div>
            </div>
            <div class="listbox" id="listBOX">
                <div class="playbar">
                    <mu-icon-button icon="play_circle_outline" size="30" class="l-no play_btn" v-on:click="playAllFromFirst"></mu-icon-button>
                    <div class="r-item play_text">
                        <p>播放全部<span class="text_count">（共{{songList.length}}首）</span></p>
                    </div> 
                </div>
                <ul class="songlist">
                    <li class="listitem" v-bind:class="{active:item.id==curSong.id}" v-for="(item,index) in songList" v-bind:key="index">
                        <div class="l-no">
                            <mu-icon-button v-if="item.id==curSong.id" icon="volume_up" />
                            <span v-else v-text="index+1"></span>
                        </div>
                        <div class="r-item" v-on:click.stop="playSong(item,index)">
                            <span class="songname" v-text="item.name"></span>
                            <p class="songinfo"><span class="singer">{{item.ar|combineName}}</span> - <span v-text="item.al.name"></span></p>
                        </div> 
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"details",
    props:["playList","songList","curMusic"],
    data:function () {
        return {
            curSong:this.curMusic
        };
    },
    methods:{
        closeList:function () {
            this.$emit("close-list");
        },
        playSong:function (item,index) {
            this.curSong={id:item.id};
            item._index=index;
            // save cursong data
            localStorage.setItem("curSong",JSON.stringify(item));
            // emit parent play current music
            bus.$emit("curmusicchange",index);
        },
        playAllFromFirst:function () {
            bus.$emit("play-all");
        }
    },
    mounted:function () {
        var that=this;
        var detailPage=document.getElementById("detailPage");
        var appbar=document.getElementById("appbar");
        var listBOX=document.getElementById("listBOX");
        var top=listBOX.getBoundingClientRect().top-parseInt(getComputedStyle(appbar,null)["height"]);

        bus.$on("playlistchange",function (song) {
            that.curSong.id=song.id;
        });

        // BUG
        detailPage.addEventListener("scroll",function () {
            if (detailPage.scrollTop>=top) {
                appbar.style.backgroundColor="rgb(150, 10, 10)";
            } else {
                appbar.style.backgroundColor="rgba(0,0,0,0.15)";
            }
        },false);

    }
}
</script>
<style scoped>
.details{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height: 100vh;
    padding:0 0 70px 0;
    z-index:10;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
}
.mu-appbar{
    transition:all 0.8s ease;
    background-color: rgba(0,0,0,0.15);
}
.coverbox{
    position: relative;
    padding: 60px 0 20px 0;
    overflow: hidden;
}
.cover_user{
    display: -webkit-flex;
    display: flex;
    padding:30px 20px 0 20px;
}
.user_pic{
    flex-basis: 150px;
}
.user_info{
    max-width:50%;
    padding:10px 15px;
    overflow: hidden;
    text-align:left;
    font-size: 0.8rem;
    color:#fff;
}
.cover_bg{
    position: absolute;
    top:0;left: 0;
    width:100%;
    height:100%;
    overflow: hidden;
    -webkit-filter: blur(10px);
    filter: blur(10px);
    z-index: -1;
}
.listBox{
    background-color: #fff;
}
.listitem.active{
    color:#cc2005;
}
.listitem,
.playbar{
    position: relative;
    padding-left:48px;
    height:48px;
    overflow: hidden;
}
.play_btn{
    color:#000;
}
.play_text{
    font-size:0.8rem;
    line-height:48px;
}
.text_count{
    font-size:0.7rem;
    color:#999;
}
.l-no{
    position: absolute;
    top:0;
    left:0;
    width:48px;
    line-height:48px;
    font-size: 0.8rem;
    text-align:center;
}
.r-item{
    max-width:95%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-top:1px solid #ddd;
    text-align:left;
}
.r-item:first-of-type{
    border:none;
}
.songname{
    font-size: 0.9rem;
}
.songinfo{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.singer{
    color:#840000;
}
</style>
