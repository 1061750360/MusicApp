<template>
  <div class="music-list">
    <div class="top-box">
      <i class="icon-back iconfont icon-icon_on_the_left" @click="back"></i>
      <h1 class="title" v-html="title"></h1>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="this.scrollY>-55">
        <div class="play" @click="randomPlayMusic">
          <i class="icon-play iconfont icon-bofang"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
      <Loading v-if="!songs.length" class="loading-container"></Loading>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../baseComponents/Scroll/Scroll'
  import SongList from '../baseComponents/SongList/SongList'
  import Loading from '../baseComponents/Loading/Loading'
  import {mapActions} from 'vuex'
  import {playlistMixin} from '../../assets/js/mixin'


  export default {
    name: "MusicList",
    mixins: [playlistMixin],
    data(){
      return {
        scrollY: 0
      }
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    created(){
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imgHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${this.imgHeight}px`
      if(!this.fullScreen){
        this.$refs.list.$el.style.bottom = '60px'
      }else{
        this.$refs.list.$el.style.bottom = '0'
      }
    },
    watch: {
      scrollY(newY){
        let s = -40+newY
        // 设置一个layer的滚动范围
        let minscrollY = Math.max(-this.imgHeight,s)
        this.$refs.layer.style.top = `${minscrollY}px`
        let zIndex = 0
        let scale = 1  // 定义歌手图片放大的尺寸
        let blur = 0   // 定义图片的高斯模糊
        const percent = Math.abs(newY / this.imgHeight)
        if(newY>0){
          scale = 1 + percent
        }else{
          blur = Math.min(20 * percent, 20)
        }
        // 设置图片的高斯模糊
        this.$refs.filter.style["backdrop-filter"] = `blur(${blur}px)`
        this.$refs.filter.style["webkitBackdrop-filter"] = `blur(${blur}px)`
        if(newY < minscrollY){
          zIndex = 999
          this.$refs.bgImage.style.paddingTop = '0'
          this.$refs.bgImage.style.height = '40px'
        }else{
          this.$refs.bgImage.style.paddingTop = "70%"
          this.$refs.bgImage.style.height = '0'
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style["transform"] = `scale(${scale})`
        this.$refs.bgImage.style["webkitTransform"] = `scale(${scale})`
      }
    },
    computed: {
      bgStyle(){
        return `background-image: url(${this.bgImage})`
      }
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos){
        // 如果歌曲列表的顶部刚好与顶部的歌手名字栏的底部相接触，那么就让歌曲列表的值保持固定
        if((parseInt(this.imgHeight)+pos.y) <= 40){
          this.scrollY = -(parseInt(this.imgHeight) - 40)
        }
        this.scrollY = pos.y
      },
      back(){
        this.$router.back()
      },
      selectItem(item, index){
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      randomPlayMusic(){
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style lang="less" scoped>
  .music-list{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: @theme-background-color;
    > .top-box{
      position: relative;
      height: 40px;
      width: 100%;
      z-index: 1000;
      > .icon-back{
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        color: @theme-font-color;
        font-size: 24px;
        text-align: center;
        line-height: 40px;
      }
      > .title{
        height: 100%;
        font-size: 18px;
        font-weight: 200;
        color: #fff;
        text-align: center;
        line-height: 42px;
      }
    }
    > .bg-image{
      position: relative;
      top: -40px;
      height: 0;
      width: 100%;
      padding-top: 70%;
      background-size: cover;
      > .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7,17,27,0.4);
      }
      > .play-wrapper{
        position: absolute;
        height: 32px;
        width: 100%;
        bottom: 20px;
        display: flex;
        justify-content: center;
        z-index: 99;
        > .play{
          position: relative;
          height: 100%;
          width: 135px;
          box-sizing: border-box;
          border: 1px solid @theme-font-color;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          > .icon-play{
            position: absolute;
            left: 15px;
            display: inline-block;
            font-size: 24px;
            color: @theme-font-color;
          }
          > .text{
            margin-left: 20px;
            text-align: center;
            line-height: 32px;
            font-size: 12px;
            color: @theme-font-color;
          }
        }
      }
    }
    > .list{
      position: fixed;
      left: 0;
      width: 100%;
      z-index: 100;
      > .song-list{
      }
    }
    > .layer{
      position: relative;
      top: -40px;
      left: 0;
      width: 100%;
      height: 100%;
      background: @theme-background-color;
      z-index: 100;
    }
  }

  .loading-container{
    position: fixed;
    bottom: 25%;
    left: 0;
  }
</style>
