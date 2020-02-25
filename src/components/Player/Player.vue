<template>
  <div>
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen" ref="normalPlayer">
      <div class="background">
        <img :src="currentSong.image" alt="">
      </div>
      <div class="top">
        <div class="back iconfont icon-back" @click="closeFullScreen"></div>
        <h2 class="song" v-html="currentSong.name"></h2>
        <h3 class="singer" v-html="currentSong.singer"></h3>
      </div>
      <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
        <div class="left-box" ref="leftBox">
          <div class="img-box">
            <div class="rotate-img" :class="rotateImg" ref="rotateImg">
              <img :src="currentSong.image" alt="">
            </div>
            <div class="lyric-box">
              <div class="lyric">{{playingLyric}}</div>
            </div>
          </div>
        </div>
        <scroll class="right-box" :data="currentLyric && currentLyric.lines" ref="lyricList">
          <div class="lyric">
            <div v-if="currentLyric">
              <p ref="lyricLine" class="txt" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="index" v-html="line.txt"></p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':dotShow==='cd'}"></span>
          <span class="dot" :class="{'active':dotShow==='lyric'}"></span>
        </div>
        <div class="process-wrapper">
          <span class="time time-left">{{currentTime | timeFormat}}</span>
          <div class="process-bar-wrapper">
            <div class="process-bar" @click="moveToClick">
              <div class="bar-inner" ref="processBar">
                <div class="process" ref="process"></div>
                <div class="process-btn-wrapper" ref="processBtn" @touchstart.prevent="processTouchStart" @touchmove.prevent="processTouchMove" @touchend.prevent="processTouchEnd">
                  <div class="process-btn"></div>
                </div>
              </div>
            </div>
          </div>
          <span class="time time-right">{{currentSong.duration | timeFormat}}</span>
        </div>
        <div class="play-controler">
          <ul>
            <li><i :class="iconMode" @click="changeMode"></i></li>
            <li><i class="iconfont icon-shangyishou" @click="prev" :class="disableCls"></i></li>
            <li><i class="bofang" :class="[playIcon,disableCls]" @click="togglePlaying"></i></li>
            <li><i class="iconfont icon-xiayishou" @click="next" :class="disableCls"></i></li>
            <li><i class="iconfont" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i></li>
          </ul>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen && currentIndex !== -1" @click="openFullScreen">
        <div class="icon">
          <img :class="rotateImg" :src="currentSong.image" alt="">
        </div>
        <div class="song">{{currentSong.name}}</div>
        <p-circle :percent="percent">
          <div class="play-control" :class="playIcon" @click.stop="togglePlaying"></div>
        </p-circle>
        <div class="play-list iconfont icon-bofangliebiao" @click.stop="showPlayList"></div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    <tip ref="tip" text="暂无版权，获取失败"></tip>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import PCircle from '../baseComponents/progressCircle/ProgressCircle'
  // 歌词解析库
  import Lyric from 'lyric-parser'
  import Scroll from '../baseComponents/Scroll/Scroll'
  import PlayList from '../PlayList/PlayList'
  import Tip from '../Tip/Tip'
  import {playerMixin} from "../../assets/js/mixin"
  import {playMode} from "../../assets/js/config"
  // 导入动画包create-keyframe-animation
  import animations from 'create-keyframe-animation'


  const processBtnWidth = 16

  export default {
    name: "Player",
    mixins: [playerMixin],
    data(){
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        dotShow: 'cd',
        playingLyric: null
      }
    },
    methods: {
      showPlayList(){
        this.$refs.playList.show()
      },
      closeFullScreen(){
        this.setFullScreen(false)
      },
      openFullScreen(){
        this.setFullScreen(true)
      },
      enter(el, done){
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 500,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.rotateImg, 'move', done)
      },
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.rotateImg.style.animation = ''
      },
      leave(el, done){
        this.$refs.rotateImg.style.transition = 'all 0.5s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.rotateImg.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.rotateImg.addEventListener('transitionend', done)
      },
      afterLeave(){
        this.$refs.rotateImg.style.transition = ''
        this.$refs.rotateImg.style['transform'] = ''

      },
      togglePlaying(){
        if(!this.songReady){
          return
        }
        this.setPlayingState(!this.playing)
        if(this.currentLyric){
          this.currentLyric.togglePlay()
        }
      },
      end(){
        if(this.mode === playMode.loop){
          this.loop()
        }else{
          this.next()
        }
      },
      loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if(this.currentLyric){
          this.currentLyric.seek(0)
        }
      },
      next(){
        if(!this.songReady){
          return
        }
        if(this.playList.length===1){
          this.loop()
          return
        }else{
          let index = this.currentIndex + 1
          if(index === this.playList.length){
            index = 0
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      prev(){
        if(!this.songReady){
          return
        }
        if(this.playList.length===1){
          this.loop()
          return
        }else{
          let index = this.currentIndex - 1
          if(index === -1){
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      ready(){
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      error(){
        this.songReady = false
        this.$refs.tip.show()
      },
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      // 进度条的三个事件
      processTouchStart(e){
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.process.clientWidth
      },
      processTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.processBar.clientWidth,Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      processTouchEnd(){
        this.touch.initiated = false
        this._triggerPercent()
      },
      moveToClick(e){
        this._offset(e.offsetX)
        this._triggerPercent()
      },
      handleLyric({lineNum, txt}){
        this.currentLineNum = lineNum
        if(lineNum > 5){
          let lineEl = this.$refs.lyricLine[lineNum-5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        }else{
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e){
        this.touch1.initialed = true
        this.touch1.startX = e.touches[0].pageX
        this.touch1.startY = e.touches[0].pageY
      },
      middleTouchMove(e){
        if(!this.touch1.initialed){
          return
        }
        const deltaX = e.touches[0].pageX - this.touch1.startX
        const deltaY = e.touches[0].pageY - this.touch1.startY
        if(Math.abs(deltaY) > Math.abs(deltaX)){
          return
        }
        const left = this.dotShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left+deltaX))
        this.touch1.percent = Math.abs(offsetWidth/window.innerWidth)
        this.$refs.lyricList.$el.style.transform = `translateX(${offsetWidth}px)`
        this.$refs.lyricList.$el.style.transition = `all 0 ease`
        this.$refs.leftBox.style.opacity = 1 - this.touch.percent
        this.$refs.leftBox.style.transition = `all 0 ease`
      },
      middleTouchEnd(){
        let offsetWidth = 0
        let opacity = 0
        if(this.dotShow === 'cd'){
          if(this.touch1.percent > 0.1){
            offsetWidth = -window.innerWidth
            opacity = 0
            this.dotShow = 'lyric'
          }else{
            opacity = 1
            offsetWidth = 0
          }
        }else{
          if(this.touch1.percent < 0.9){
            offsetWidth = 0
            opacity = 1
            this.dotShow = 'cd'
          }else{
            opacity = 0
            offsetWidth = -window.innerWidth
          }
        }
        this.$refs.lyricList.$el.style.transform = `translateX(${offsetWidth}px)`
        this.$refs.lyricList.$el.style.transition = `all 0.3s ease`
        this.$refs.leftBox.style.opacity = opacity
        this.$refs.leftBox.style.transition = `all 0.3s ease`
      },
      _triggerPercent(){
        const barWidth = this.$refs.processBar.clientWidth - processBtnWidth
        const percent = this.$refs.process.clientWidth / barWidth
        this.currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = this.currentTime
        if(!this.playing){
          this.togglePlaying()
        }
        if(this.currentLyric){
          this.currentLyric.seek(this.currentTime * 1000)
        }
      },
      _offset(offsetWidth){
        this.$refs.process.style.width = `${offsetWidth}px`
        this.$refs.processBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
      },
      // 获取大的旋转图片到小的旋转图片的位置
      _getPosAndScale(){
        const targetWidth = 40
        const leftOffset = 40
        const bottomOffset = 30
        const topOffset = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth/2 - leftOffset)
        const y = window.innerHeight - topOffset - width/2 - bottomOffset
        return {x, y, scale}
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    created(){
      // 保存进度条的事件信息
      this.touch = {}
      this.touch1 = {}
    },
    computed: {
      rotateImg(){
        return this.playing ? 'start-rotate':'start-rotate stop-rotate'
      },
      playIcon(){
        return this.playing ? 'iconfont icon-zanting2':'iconfont icon-bofang2'
      },
      disableCls(){
        return this.songReady? '' : 'disable'
      },
      percent(){
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
      ])
    },
    // "http://dl.stream.qqmusic.qq.com/C400001qvvgF38HVc4.m4a?vkey=&guid=7175649092&uin=0&fromtag=66"
    watch: {
      currentSong(newSong, oldSong){
        if(!newSong.id){
          return
        }
        if(newSong.id === oldSong.id){
          return
        }
        if(this.currentLyric){
          this.currentLyric.stop()
        }
        clearTimeout(this.timer)
        // 加载歌词并播放歌曲
        this.timer = setTimeout(() => {
          this.currentSong.getLyric(this.currentSong.id).then((lyric) => {
            if(this.currentSong.lyric !== lyric){
              return
            }
            this.currentLyric = new Lyric(lyric, this.handleLyric)
            if(this.playing && this.songReady){
              this.currentLyric.play()
            }
          }).catch(() => {
            this.currentLyric = null
            this.playingLyric = ""
            this.currentLineNum = 0
          })
          this.$refs.audio.play()
        }, 1000)
      },
      playing(newVal){
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newVal ? audio.play() : audio.pause()
        })
      },
      currentTime(newVal){
        let percent = newVal / this.currentSong.duration
        if(percent>=0 && !this.touch.initiated){
          const barWidth = this.$refs.processBar.clientWidth - processBtnWidth
          const offsetWidth = percent * barWidth
          this._offset(offsetWidth)
        }
      },
      fullScreen(newVal){
        if(newVal){
          this.$refs.normalPlayer.style['z-index'] = "99999"
        }else{
          this.$refs.normalPlayer.style['z-index'] = "-99999"
        }
      }
    },
    filters: {
      timeFormat(interval){
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = interval % 60
        let s = second.toString().padStart(2,'0')
        return `${minute}:${s}`
      }
    },
    components: {
      PCircle,
      Scroll,
      PlayList,
      Tip
    }
  }
</script>

<style lang="less" scoped>
  .normal-player{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: @theme-background-color;
    color: #fff;
    z-index: 999999;
    > .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: .6;
      filter: blur(20px);
      > img{
        width: 100%;
        height: 100%;
      }
    }
    > .top{
      position: relative;
      width: 100%;
      margin-bottom: 20px;
      > .back{
        position: absolute;
        left: 15px;
        top: 8px;
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        transform: rotate(-90deg);
        font-size: 24px;
        color: @theme-font-color;
      }
      > .song{
        text-align: center;
        line-height: 40px;
        font-size: 18px;
      }
      > .singer{
        height: 20px;
        font-size: 14px;
        text-align: center;
      }
    }
    > .middle{
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;
      white-space: nowrap;
      > .left-box{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%;
        > .img-box{
          position: absolute;
          left: 15%;
          top: 10%;
          width: 70%;
          height: 70%;
          > .lyric-box{
            position: absolute;
            bottom: -30px;
            left: 10%;
            width: 80%;
            overflow: hidden;
            text-align: center;
            > .lyric{
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              color: hsla(0,0%,100%,.5);
            }
          }
          > .rotate-img{
            position: relative;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid hsla(0,0%,100%,.1);
            border-radius: 50%;
            > img{
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
      > .right-box{
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        > .lyric{
          > div{
            > .txt{
              color: rgba(255,255,255,0.5);
              font-size: 14px;
              text-align: center;
              line-height: 32px;
            }
            > .current{
              color: @theme-font-color;
            }
          }
        }
      }
    }
    > .bottom{
      position: absolute;
      bottom: 10px;
      width: 100%;
      > .dot-wrapper{
        text-align: center;
        font-size: 0;
        > .dot{
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: hsla(0,0%,100%,.5);
        }
        > .active{
          width: 20px;
          border-radius: 5px;
          background: hsla(0,0%,100%,.8);
        }
      }
      > .process-wrapper{
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        > .process-bar-wrapper{
          flex: 1;
          > .process-bar{
            height: 30px;
            > .bar-inner{
              position: relative;
              top: 13px;
              height: 4px;
              background: rgba(0,0,0,.3);
              > .process{
                position: absolute;
                height: 100%;
                background: @theme-font-color;
              }
              > .process-btn-wrapper{
                position: absolute;
                left: -8px;
                top: -13px;
                width: 30px;
                height: 30px;
                > .process-btn{
                  position: relative;
                  top: 7px;
                  left: 7px;
                  box-sizing: border-box;
                  width: 16px;
                  height: 16px;
                  border: 3px solid #fff;
                  border-radius: 50%;
                  background: @theme-font-color;
                }
              }
            }
          }
        }
        > .time{
          color: #fff;
          font-size: 12px;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
        }
        > .time-left{
          text-align: left;
        }
        > .time-right{
          text-align: right;
        }
      }
      > .play-controler{
        > ul{
          display: flex;
          > li{
            flex: 1;
            display: flex;
            justify-content: center;
            > i{
              &::before{
                font-size: 35px;
                color: @theme-font-color;
                font-weight: bold;
                line-height: 30px;
              }
            }
            > .bofang{
              &::before{
                font-size: 40px;
              }
            }
          }
        }
      }
    }
  }
  .mini-player{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: rgb(211, 167, 157);
    z-index: 999999;
    display: flex;
    justify-content: space-around;
    align-items: center;
    > .icon{
      width: 40px;
      height: 40px;
      margin-left: 20px;
      > img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    > .song{
      flex: 1;
      height: 20px;
      margin: 0 0 2px 4px;
      font-size: 14px;
      color: #fff;
    }
    > .progress-circle{
      position: relative;
      > .play-control{
        position: absolute;
        top: 11px;
        left: 11px;
        font-size: 15px;
        color: #B98E08;
      }
    }

    > .play-list{
      font-size: 34px;
      color: @theme-font-color;
      margin: 0 5px 0 10px;
    }
  }
  /*设置按钮为不可点击状态的颜色*/
  .disable{
    &::before{
      color: #AF8E43!important;
    }
  }
  /*播放器动画效果*/
  .normal-enter,
  .normal-leave-to{
    opacity: 0;
    .top{
      transform: translate3d(0,-100px,0);
    }
    .bottom{
      transform: translate3d(0,100px,0);
    }
  }
  .normal-enter-active,
  .normal-leave-active{
    transition: all 0.5s;
    .top, .bottom{
      transition: all 0.5s cubic-bezier(.82,.14,.2,1.6);
    }
  }
  .mini-enter,
  .mini-leave-to{
    opacity: 0;
  }
  .mini-enter-active,
  .mini-leave-active{
    transition: all 0.5s;
  }
  /*rotate-img旋转动画*/
  .start-rotate{
    animation: rotateImg 20s linear infinite;
  }
  .stop-rotate{
    animation-play-state: paused;
  }
  @keyframes rotateImg {
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
