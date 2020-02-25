<template>
  <Scroll class="listview" :data="data" ref="listView" :listen-scroll="listenScroll" @scroll="scroll" :probe-type="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item"  @click="showDetail(item)">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="singerName">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :class="{'current': currentIndex===index}" :data-index="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="scrollY<0">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </Scroll>
</template>

<script>
  import Scroll from '../Scroll/Scroll'
  import {getData} from '../../../assets/js/dom'

  const ANCHOR_HEIGHT = 18
  const FIXED_TITLE_HEIGHT = 30

  export default {
    name: "ListView",
    data(){
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created(){
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    props: {
      data: {
        type: Array,
        default: ()=>{}
      }
    },
    computed: {
      shortcutList(){
        return this.data.map((group) => {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle(){
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ""
      }
    },
    methods: {
      showDetail(item){
        this.$emit('select',item)
      },
      onShortcutTouchStart(e){
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(parseInt(anchorIndex))
      },
      onShortcutTouchMove(e){
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = Math.floor(((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT))
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta + 1
        this._scrollTo(parseInt(anchorIndex))
      },
      scroll(pos){
        this.scrollY = Math.round(pos.y)
      },
      refresh(){
        this.$refs.listView.refresh()
      },
      _scrollTo(index){
        if(!index && index !== 0){
          return
        }
        if(index < 0){
          index = 0
        }else if(index > this.listHeight.length - 2){
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
          this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight(){
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i=0;i<list.length;i++){
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
    },
    watch: {
      data(){
        setTimeout(() => {
          this._calculateHeight()
        },20)
      },
      scrollY(newY){
        const listHeight = this.listHeight
        for(let i=0;i<listHeight.length;i++){
          let height1 = listHeight[i]
          let height2 = listHeight[i+1]
          if(!height2 || (-newY >= height1 && -newY < height2 )){
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        this.currentIndex = 0
      },
      diff(newVal){
        let fixedTop = (newVal>0 && newVal<FIXED_TITLE_HEIGHT) ? newVal-FIXED_TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop){
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translateY(${fixedTop}px)`
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="less" scoped>
  .listview{
    position: relative;
    height: 100%;
    > ul{
      > .list-group{
        > h2{
          width: 100%;
          height: 30px;
          line-height: 30px;
          margin: 0;
          padding-left: 20px;
          background: #333;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
        }
        > ul{
          > .list-group-item{
            height: 50px;
            width: 100%;
            padding: 20px 0 0 30px;
            display: flex;
            justify-content: left;
            > .avatar{
              width: 50px;
              height: 50px;
              border-radius: 50%;

            }
            > .singerName{
              margin-left: 20px;
              line-height: 50px;
              font-size: 14px;
              color: rgba(255,255,255,0.5);
            }
          }
        }
        > .loading-container{
          position: fixed;
          bottom: 25%;
          left: 0;
          z-index: 1;
        }
      }
    }
    > .shortcut{
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.3);
      padding: 20px 0;
      border-radius: 10px;
      width: 20px;
      box-sizing: border-box;
      z-index: 9;
      > ul{
        display: flex;
        flex-direction: column;
        > .item{
          flex: 1;
          padding: 3px;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-align: center;
          line-height: 1;
        }
        > .current{
          color: @theme-font-color;
        }
      }
    }
    > .list-fixed{
      position: absolute;
      top: 0;
      height: 30px;
      width: 100%;
      background: #333;
      > .fixed-title{
        height: 100%;
        width: 100%;
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        line-height: 30px;
        padding-left: 20px;
        font-weight: 400;
      }
    }
  }
</style>
