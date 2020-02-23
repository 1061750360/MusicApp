<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="iconfont icon-icon--"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent" :refresh-delay="refreshDelay">
          <transition-group tag="ul" name="list">
            <li :key="item.id" class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)" ref="listItem">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i class="iconfont" :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="iconfont icon-chacha"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="iconfont icon-tianjia"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirm-btn-text="清空" @confirm="confirmClear"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import Scroll from '../baseComponents/Scroll/Scroll'
  import Confirm from '../baseComponents/Confirm/Confirm'
  import AddSong from '../AddSong/AddSong'
  import {playMode} from "../../assets/js/config"
  import {playerMixin} from "../../assets/js/mixin"

  export default {
    name: "PlayList",
    mixins: [playerMixin],
    data(){
      return {
        showFlag: false,
        refreshDelay: 100
      }
    },
    methods: {
      show(){
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrolltoCurrent(this.currentSong)
        },20)
      },
      hide(){
        this.showFlag = false
      },
      getCurrentIcon(item){
        if(this.currentSong.id === item.id)
        return 'iconfont icon-bofang'
      },
      selectItem(item, index){
        if(this.mode === playMode.random){
          index = this.playList.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      scrolltoCurrent(currentSong){
        const index = this.sequenceList.findIndex((song) => {
          return currentSong.id === song.id
        })
        console.log("555555556",index)
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },
      deleteOne(item){
        this.deleteSong(item)
        if(!this.playList.length){
          this.hide()
        }
      },
      showConfirm(){
        this.$refs.confirm.show()
      },
      confirmClear(){
        this.deleteSongList()
        this.hide()
      },
      addSong(){
        this.$refs.addSong.show()
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    },
    computed: {
      modeText(){
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    watch: {
      currentSong(newSong, oldSong){
        if(!this.showFlag || newSong.id === oldSong.id){
          return
        }
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrolltoCurrent(newSong)
        },20)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style lang="less" scoped>
  // 播放列表出场和离场动画
  .list-fade-enter,
  .list-fade-leave-to{
    opacity: 0;
    .list-wrapper{
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-fade-enter-active,
  .list-fade-leave-active{
    transition: opacity 0.3s;
    .list-wrapper{
      transition: all 0.3s;
    }
  }

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999999999999999;
    background-color: rgba(0,0,0,.3);
    > .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #333;
      > .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        > .title{
          display: flex;
          align-items: center;
          > .text{
            flex: 1;
            font-size: 14px;
            color: hsla(0,0%,100%,.5);
          }
        }
      }
      > .list-content {
        max-height: 240px;
        overflow: hidden;
        > ul{
          > .item {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 0 30px 0 20px;
            overflow: hidden;
            &.list-enter-active,
            &.list-leave-active{
              transition: all 0.1s linear;
            }
            &.list-enter,
            &.list-leave-to{
              height: 0;
            }
            > .current{
              width: 20px;
              margin-right: 5px;
            }
            > .text {
              flex: 1;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size: 14px;
              color: hsla(0,0%,100%,.3);
            }
          }
        }
      }
      > .list-operate {
        width: 160px;
        margin: 20px auto 30px;
        > .add{
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid hsla(0,0%,100%,.5);
          border-radius: 100px;
          color: @theme-font-color;
          > .text{
            font-size: 12px;
          }
        }
      }
      > .list-close {
        text-align: center;
        line-height: 50px;
        background: rgba(0,0,0,0.5);
        font-size: 16px;
        color: hsla(0,0%,100%,.5);
      }
    }
  }
  .iconfont{
    font-size: 18px;
    margin-right: 5px;
    color: @theme-font-color;
  }
</style>
