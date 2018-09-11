<template>
    <div class="playpage">
        <div class="headbar">
            <mu-icon-button class="backbtn" icon="arrow_back" slot="left" v-on:click="closeBox" />
            <div class="info">
                <p class="sing">{{curMusic.sing}}</p>
                <p class="singer">{{curMusic.singer|combineName}}</p>
            </div>
            <div class="line"></div>
        </div>
        <div class="page_bg" v-bind:style="{'background-image':'url('+curMusic.posterUrl+')'}"></div> <!-- curMusic.posterUrl -->
        <div class="cd">
            <div class="discbox" ref="musicDisc">
                <div class="disc_circle_outter"></div>
                <div class="disc_circle_inner">
                    <div class="cd_center"></div>
                </div>
                <div class="disc_img" v-bind:style="{'background-image':'url('+curMusic.posterUrl+')'}"></div>
            </div>
            <div class="swith" v-bind:class="{running:isPlaySong}"></div>
        </div>
        <div class="btngroup">
            <mu-icon-button v-if="playSongMode=='list_repeat'" class="" icon="repeat" v-on:click.stop="changePlaySongMode" />
            <mu-icon-button v-if="playSongMode=='sing_repeat'" class="" icon="repeat_one" v-on:click.stop="changePlaySongMode" />
            <mu-icon-button v-if="playSongMode=='random'"  class="" icon="shuffle" v-on:click.stop="changePlaySongMode" />
            <mu-icon-button iconClass="btn" icon="skip_previous" v-on:click.stop="playNextOrPrev(-1)" />
            <mu-icon-button iconClass="btn play" icon="play_circle_outline" v-if="!isPlaySong" v-on:click.stop="playMusic(true)" />
            <mu-icon-button iconClass="btn play" icon="pause_circle_outline" v-if="isPlaySong" v-on:click.stop="playMusic(false)" />
            <mu-icon-button iconClass="btn" icon="skip_next" v-on:click.stop="playNextOrPrev(1)" />
            <mu-icon-button iconClass="btn" icon="list" v-on:click.stop="$emit('open-popbox')" />                        
        </div>
    </div>
</template>
<script>
export default {
    name:"playpage",
    props:["curSong","isPlaySong","isCanPlaySong","playSongMode"],
    data:function () {
        return {
            musicDisc:null,
            curMusic:this.curSong,
            // temp
            tempURL:"../static/1.png"
        };
    },
    watch:{
        curSong:function (val,oldVal) {
            this.curMusic=val;
        },
        isPlaySong:function (val,oldVal) {
            this.rotateDisc(val);
        }
    },
    methods:{
        closeBox:function () {
            var that=this;
            that.$emit("close-box");
        },
        playMusic:function (boo) {
            if (this.isCanPlaySong) {
                this.$emit("change-status",boo);
            }
        },
        rotateDisc:function (boo) {
            var that=this;
            that.musicDisc.style.webkitAnimationPlayState=boo?"running":"paused";
        },
        playNextOrPrev:function (flag) {
            bus.$emit("play-next-music",flag);
        },
        changePlaySongMode:function () {
            bus.$emit("change-play-mode");
        }
    },
    mounted:function () {
        var that=this;
        that.musicDisc=that.$refs["musicDisc"];
        that.rotateDisc(that.isPlaySong);
    }
}
</script>
<style>
.playpage{
    position: absolute;
    top:0;
    width:100%;
    min-height: 100vh;
    z-index:11;
    background-color: #aaa;
}
.playpage .headbar{
    display: flex;
    position: relative;
    width:100%;
    height:56px;
}
.headbar>.backbtn{
    color:#fff;
}
.headbar>.info{
    width:80%;
    padding:8px 0;
    text-align:left;
}
.info>.sing{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.8rem;
    color:#fff;
}
.info>.singer{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color:#fff;
}
.headbar>.line{
    position: absolute;
    top:100%;
    width:100%;
    height: 1px;
    background-image: linear-gradient(270deg,hsla(0,0%,100%,0),hsla(0,0%,100%,.6),hsla(0,0%,100%,0));
    z-index:2;
}
.playpage .page_bg{
    position: absolute;
    top:0;
    width:100%;
    height: 100%;
    background-color:#aaa;
    background-repeat: no-repeat;
    background-size: cover;
    background-position:center;
    filter: blur(30px) opacity(0.8);
    z-index: -1;
    transition:all 1s ease;
}
.playpage .btngroup{
    display: flex;
    justify-content:space-between;
    position: absolute;
    width:100%;
    bottom:0;
    padding:5px 10px;
    color:#fff;
    background-image: linear-gradient(180deg,transparent,rgba(0,0,0,0.8));
}
.playpage .mu-icon-button{
    width:auto;
    height:auto;
}
.playpage .btngroup .btn{
    font-size: 1.5rem;
}
.playpage .btngroup .btn.play{
    font-size:2.8rem;
}
.playpage .cd{
    position: relative;
    min-height:50vh;
    overflow: hidden;
}
.cd>.swith{
    position: absolute;
    top:-10px;
    left:50%;
    width:90px;
    height:140px;
    background-image: url("../assets/swith.png");
    background-size:cover;
    z-index:0;
    transform-origin: 10px 10px;
    transform:rotate(-30deg);
    transition:transform 0.5s ease;
}
.cd>.swith.running{
    transform:rotate(0deg);
}
.playpage .discbox{
    position: relative;
    top:30vh;
    left:50%;
    width:calc(50vw + 80px);
    height:calc(50vw + 80px);
    transform: translate(-50%,-50%);
    animation: rotateA 6s linear infinite;
    animation-play-state: paused;
}
.playpage .disc_circle_outter{
    position: absolute;
    top:0;left:0;
    width:100%;
    height:100%;
    border-radius: 50%;
    background-image: repeating-radial-gradient(rgb(16, 17, 19), rgb(34, 34, 35) 2%);
    background-repeat: repeat;
    box-sizing: content-box;
}
.disc_circle_outter:after{
    content: "";
    position: absolute;
    top:50%;
    left:50%;
    width:calc(100% + 10px);
    height:calc(100% + 10px);
    border-radius:50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    background-color: rgba(255,255,255,0.2);
    z-index:-1;
}
.playpage .disc_circle_inner{
    position: absolute;
    top:40px;left:40px;
    width:50vw;
    height:50vw;
    border-radius: 50%;
    border:30px solid #090303;
    box-sizing: border-box;
    background-position:center;
    background-size: 100% 100%;
    background-color: rgb(153,21,6);
}
.cd_center{
    position: absolute;
    top:50%;
    left:50%;
    width:8px;
    height:8px;
    border-radius: 50%;
    transform:translate(-50%,-50%);
    background-color: #333;
}
.disc_circle_inner:before{
    content:"";
    position: absolute;
    top:50%;
    left:50%;
    width:30%;
    height:30%;
    border-radius: 50%;
    transform:translate(-50%,-50%);
    border:1px solid #222;
}
.disc_circle_inner:after{
    content:"";
    position: absolute;
    top:50%;
    left:50%;
    width:85%;
    height:85%;
    border-radius: 50%;
    transform:translate(-50%,-50%);
    border:1px solid #222;
}
.disc_img{
    position: absolute;
    top:40px;left:40px;
    width:50vw;
    height:50vw;
    border-radius: 50%;
    background-size:cover;
    background-position: center;
}
@keyframes rotateA{
    0%{
        transform: translate(-50%,-50%) rotate(0);
    }
    100%{
        transform: translate(-50%,-50%) rotate(360deg);
    }
}
</style>


