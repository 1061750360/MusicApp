<template>
    <div class="rank" ref="rank">
      <Scroll class="toplist" :data="topList" ref="scroll">
        <div class="toplist-container">
          <ul v-for="items in topList">
            <li class="item" v-for="item in items.toplist" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.frontPicUrl" alt="">
              </div>
              <ul class="songlist">
                <li class="song" v-for="(song, index) in item.song">
                  <span>{{index + 1}}、</span>
                  <span>{{song.title}}-{{song.singerName}}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="loading-container" v-show="!topList.length">
          <Loading></Loading>
        </div>
      </Scroll>
      <router-view></router-view>
    </div>
</template>

<script>
  import Scroll from '../baseComponents/Scroll/Scroll'
  import Loading from '../baseComponents/Loading/Loading'
  import {playlistMixin} from "../../assets/js/mixin"
  import {mapMutations} from 'vuex'

  export default {
    name: "Rank",
    mixins: [playlistMixin],
    data(){
      return {
        topList: []
      }
    },
    methods: {
      selectItem(item){
        this.$router.push({
          path: `/rank/${item.topId}`
        })
        console.log(item,"123")
        this.setTopList(item)
      },
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.rank.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getTopList(){
        let url = process.env.BASE_URL + "api/getTopList/"
        this.$axios.get(url).then((res) => {
          if(res.data.code === 0){
            this.topList = res.data.topList.data.group
          }
        }).catch((err) => {
          console.log("加载排行榜资源失败")
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    created(){
      this._getTopList()
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="less" scoped>
  .rank{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
    > .toplist{
      height: 100%;
      overflow: hidden;
      > .toplist-container{
        > ul{
          > .item{
            display: flex;
            margin: 0 20px;
            padding-top: 20px;
            height: 100px;
            > .icon{
              width: 100px;
              height: 100px;
              > img{
                width: 100%;
                height: 100%;
              }
            }
            > .songlist{
              -webkit-box-flex: 1;
              -ms-flex: 1;
              flex: 1;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-orient: vertical;
              -webkit-box-direction: normal;
              -ms-flex-direction: column;
              flex-direction: column;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              justify-content: center;
              padding: 0 20px;
              height: 100px;
              overflow: hidden;
              background: #333;
              color: rgba(255,255,255,0.3);
              font-size: 12px;
              > .song{
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                line-height: 26px;
              }
            }
          }
        }
      }
      > .loading-container{
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
      }
    }
  }
</style>
