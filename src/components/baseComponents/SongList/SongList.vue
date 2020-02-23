<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="items">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "SongList",
    props: {
      songs:{
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song){
        return `${song.singer} · ${song.album}`
      },
      selectItem(song,index){
        this.$emit('select',song, index)
      },
      getRankCls(index){
        if(index <= 2){
          return `icon icon${index}`
        }else{
          return 'text'
        }
      },
      getRankText(index){
        if(index > 2){
          return index++
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .bg-image(@imageName){
    background-image: ~"url(./@{imageName}.png)";
  }


  .song-list{
    width:  100%;
    > ul{
      padding: 20px 30px;
      > li{
        height: 64px;
        width:  100%;
        display: flex;
        align-items: center;
        > .rank{
          flex: 0 0 25px;
          width: 25px;
          margin-right: 30px;
          text-align: center;
          > .icon{
            display: inline-block;
            width: 25px;
            height: 24px;
            background-size: cover;
            &.icon0{
              .bg-image('glod')
            }
            &.icon1{
              .bg-image('silver')
            }
            &.icon2{
              .bg-image('copper')
            }
          }
          > .text{
            color: @theme-font-color;
            font-size: 18px;
          }
        }
        > .content{
          flex: 1;
          overflow: hidden;
          > .name{
            color: #fff;
            width: 100%;
            font-size: 14px;
            font-weight: 400;
          }
          > .desc{
            width: 100%;
            color: rgba(255,255,255,0.3);
            font-size: 14px;
            margin-top: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
</style>
