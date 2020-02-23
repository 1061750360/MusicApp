<template>
  <div ref="recommends" class="recommends">
    <Scroll :data="recommends" ref="scroll" class="scroll">
      <div class="recommend">
        <div class="title">热门歌单推荐</div>
        <ul>
          <li @click="selectItem(item)" v-for="item in recommends" :key="item.content_id">
            <div class="icon">
              <img v-lazy="item.cover" alt="">
            </div>
            <div class="text">
              <h2 class="name">{{item.username}}</h2>
              <p class="desc">{{item.title}}</p>
            </div>
          </li>
        </ul>
        <loading v-if="!recommends.length" class="loading-container"></loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRecommend} from '../../api/recommend'
  import Scroll from '../baseComponents/Scroll/Scroll'
  import Loading from '../baseComponents/Loading/Loading'
  import {playlistMixin} from "../../assets/js/mixin"
  import {mapMutations} from 'vuex'

  export default {
    name: "Recommend",
    mixins: [playlistMixin],
    data(){
      return {
        recommends: []
      }
    },
    created(){
      this._getRecommend()
    },
    components: {
      Scroll,
      Loading
    },
    methods:{
      selectItem(item){
        this.$router.push({
          path: `/recommend/${item.creator}`
        })
        this.setDisc(item)
      },
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.recommends.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend(){
        getRecommend().then((res) => {
          // 当res.code === 0 时代表请求数据成功
          if(res.code === 0){
            this.recommends = res.recomPlaylist.data.v_hot
          }else{
            console.log('请求资源失败')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style lang="less" scoped>
  .recommends{
    > .scroll{
      width: 100%;
      height: 100%;
      .recommend{
        > .title{
          height: 65px;
          width: 100%;
          text-align: center;
          line-height: 65px;
          color: @theme-font-color;
          font-size: 14px;
        }
        > ul{
          > li{
            height: 83px;
            width: 100%;
            padding: 0 20px 20px;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-start;
            > .icon{
              width: 60px;
              height: 60px;
              padding-right: 20px;
              > img{
                width: 100%;
                height: 100%;
              }
            }
            > .text{
              display: flex;
              flex-direction: column;
              justify-content: center;
              > .name{
                margin: 0 0 10px 0;
                font-weight: 400;
                font-size: 14px;
                color: #fff;
              }
              > .desc{
                margin: 0;
                font-size: 14px;
                color: rgba(255,255,255,0.3);
              }
            }
          }
        }
        > .loading-container{
          position: fixed;
          bottom: 25%;
          left: 0;
        }
      }
    }
  }
</style>
