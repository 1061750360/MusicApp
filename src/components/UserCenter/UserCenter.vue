<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click.stop="back">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="iconfont icon-bofang"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteScroll" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <song-list :songs="favoriteList" @select="selectSong"></song-list>
        </scroll>
        <scroll ref="playListScroll"  class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <song-list :songs="playHistory" @select="selectSong"></song-list>
        </scroll>
      </div>
      <div class="no-result-wrapper">
        <no-result :title="noResultTitle" v-show="noResult"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from '../Switches/Switches'
  import Scroll from '../baseComponents/Scroll/Scroll'
  import SongList from '../baseComponents/SongList/SongList'
  import Song from '../../assets/js/Song'
  import NoResult from '../baseComponents/NoResult/NoResult'

  import {mapGetters, mapActions} from 'vuex'
  import {playlistMixin} from "../../assets/js/mixin"

  export default {
    name: "UserCenter",
    mixins: [playlistMixin],
    data(){
      return {
        switches: [{name: '我喜欢的'}, {name: '最近听的'}],
        currentIndex: 0
      }
    },
    computed: {
      noResult(){
        if(this.currentIndex === 0){
          return !this.favoriteList.length
        }else{
          return !this.playHistory.length
        }
      },
      noResultTitle(){
        if(this.currentIndex === 0){
          return '暂无收藏歌曲'
        }else{
          return '你还没有听过歌曲'
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      switchItem(index){
        this.currentIndex = index
      },
      selectSong(song){
        this.insertSong(new Song(song), true)
      },
      back(){
        this.$router.back()
      },
      random(){
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if(list.length === 0){
          return
        }
        list = list.map((song) => {
          return new Song(song)
        })
        this.randomPlay({
          list
        })
      },
      handlePlaylist(playList){
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteScroll && this.$refs.favoriteScroll.refresh()
        this.$refs.playListScroll && this.$refs.playListScroll.refresh()
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    }
  }
</script>

<style lang="less" scoped>
  .user-center{
    position: fixed!important;
    top: 0!important;
    bottom: 0!important;
    z-index: 0;
    width: 100%!important;
    background: @theme-background-color;
    &.slide-enter-active,
    &.slide-leave-active{
      transition: all 0.3s;
    }
    &.slide-enter,
    &.slide-leave-to{
      transform: translate3d(100%,0,0);
    }
    > .back{
      position: absolute;
      top: 15px;
      left: 6px;
      color: @theme-font-color;
      > .icon-back{
        font-size: 24px;
      }
    }
    > .switches-wrapper{
      margin: 10px 0 30px 0;
    }
    > .play-btn{
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.5);;
      color: rgba(255,255,255,0.5);;
      border-radius: 100px;
      font-size: 13px;
      display: flex;
      justify-content: center;
      align-items: center;
      > .text{
        margin-left: 5px;
      }
    }
    > .list-wrapper{
      position: absolute;
      top: 120px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      > .list-scroll{
        height: 100%;
      }
    }
    > .no-result-wrapper{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
