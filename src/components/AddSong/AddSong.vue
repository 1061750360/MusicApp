<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="iconfont icon-chacha"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songListScroll" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </scroll>
          <scroll :refresh-delay="refreshDelay" ref="searchListScroll"  class="list-scroll" v-if="currentIndex===1" :data="searchHistory">
            <div class="inner-list">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :show-singer="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <tip text="成功添加歌曲到播放列表" ref="tip"></tip>
    </div>
  </transition>
</template>

<script>
  import SearchBox from '../baseComponents/SearchBox/SearchBox'
  import Suggest from '../baseComponents/Suggest/Suggest'
  import Scroll from '../baseComponents/Scroll/Scroll'
  import Switches from '../Switches/Switches'
  import SongList from '../baseComponents/SongList/SongList'
  import SearchList from '../baseComponents/SearchList/SearchList'
  import Tip from '../Tip/Tip'
  import {searchMixin} from "../../assets/js/mixin"
  import {mapGetters, mapActions} from 'vuex'
  import Song from '../../assets/js/Song'

  export default {
    name: "AddSong",
    mixins: [searchMixin],
    data(){
      return {
        showFlag: false,
        showSinger: false,
        switches: [{name: '最近播放'}, {name: '历史记录'}],
        currentIndex: 0
      }
    },
    methods: {
      show(){
        this.showFlag = true
        setTimeout(() => {
          if(this.currentIndex === 0){
            this.$refs.songListScroll.refresh()
          }else{
            this.$refs.searchListScroll.refresh()
          }
        }, 20)
      },
      hide(){
        this.showFlag = false
      },
      selectSuggest(){
        this.saveSearch()
        this.showTip()
      },
      switchItem(index){
        this.currentIndex = index
      },
      selectSong(song, index){
        if(index !== 0){
          this.insertSong(new Song(song), false)
          this.showTip()
        }
      },
      showTip(){
        this.$refs.tip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      Tip
    }
  }
</script>

<style lang="less" scoped>
  .add-song{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 9999999999999;
    background: @theme-background-color;
    &.slide-enter-active,&.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter,&.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    > .header{
      position: relative;
      height: 40px;
      text-align: center;
      > .title{
        line-height: 44px;
        font-size: 16px;
        color: #fff;
      }
      > .close{
        position: absolute;
        top: 0;
        right: 8px;
        > .iconfont{
          display: block;
          padding: 12px;
          font-size: 20px;
          font-weight: 600;
          color: @theme-font-color;
        }
      }
    }
    > .search-box-wrapper{
      margin: 20px;
    }
    > .shortcut{
      > .list-wrapper{
        position: absolute;
        top: 165px;
        bottom: 0;
        width: 100%;
        > .list-scroll{
          height: 100%;
          overflow: hidden;
          > .inner-list{
            padding: 20px 30px;
          }
        }
      }
    }
  }
</style>
