<template>
    <div class="search">
        <div class="headbar">
            <mu-icon-button class="backbtn" icon="arrow_back" slot="left" v-on:click="closeThisPage" />
            <input type="text" class="searchbox" placeholder="歌曲、歌手" v-model="keywords" v-on:keyup="searchSome" />
            <mu-icon-button class="clearbtn" icon="clear" slot="left" v-show="keywords.length>0" v-on:click="keywords=''" />            
        </div>  
        <ul class="searchlist">
            <mu-circular-progress class="center" :size="40" :strokeWidth="3" color="#f20" v-show="isLoading" />
            <li class="item" v-for="(song,index) in resultList" v-bind:key="index" v-on:click="playSong(song,index)">
                <div class="r-item">
                    <span class="songname" v-text="song.name"></span>
                    <p class="songinfo"><span class="singer">{{song.ar|combineName}}</span> - <span v-text="song.al.name"></span></p>
                </div> 
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:"search",
    data:function () {
        return {
            keywords:"",
            resultList:[],
            isLoading:false
        };
    },
    methods:{
        // temp
        closeThisPage:function () {
            this.$emit("close-search");
        },
        searchSome:function () {
            var that=this;
            // show loading
            that.isLoading=true;
            that.$http.get(that.$api.search(that.keywords))
                .then(res=>{
                    // hide loading
                    that.isLoading=false;
                    let data=res.data;
                    if (data.code==400) {
                        that.resultList=[];
                    } else if (data.code==200) {
                        that.resultList=data.result.songs;
                        if (data.result.songCount==0) {
                            that.resultList=[];
                        }
                    }
                })
                .catch(err=>{that.isLoading=false;console.error(err);});
        },
        playSong:function (item,index) {
            // closeSearchPage
            this.closeThisPage();
            // openPlayPage
            this.$emit("open-play");
            // push song to curPlaylist
            this.$emit("push-list",item);

            this.curSong={id:item.id};
            item._index=index;
            // save cursong data
            localStorage.setItem("curSong",JSON.stringify(item));
            // emit parent play current music
            bus.$emit("curmusicchange",index);
        },
    }
}
</script>
<style scoped>
.search{
    position: absolute;
    top:0;
    width:100%;
    min-height: 100vh;
    z-index:10;
    padding:56px 0;
    background-color: #fff;
}
.headbar{
    display: flex;
    position: fixed;
    top:0;
    width:100%;
    height:56px;
    background-color:#fff;
}
.headbar>.backbtn{
    color:#333;
}
.headbar>.clearbtn{
    position: absolute;
    top:50%;
    right:8%;
    transform:translate(0,-50%);
}
.headbar>.searchbox{
    border:none;
    outline:none;
    width:80%;
    padding:5px 50px 5px 10px;
    border-bottom:1px solid #ccc;
    font-size:0.8rem;
    transition:all 0.5s ease;
}
.headbar>.searchbox:focus{
    border-color:rgb(150,10,10);
}
.searchlist{
    padding:20px 10px;
}
.searchlist>.item{
    padding:10px 15px;
    border-bottom:1px solid #ccc;
    text-align:left;
}
.item .songname{
    font-size:0.8rem;
}
</style>

