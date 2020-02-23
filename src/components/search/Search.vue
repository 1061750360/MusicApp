<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <Scroll :refresh-delay="refreshDelay" class="shortcut" :data="shoutcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <i class="iconfont icon-icon--" @click="showConfirm"></i>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @history="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空搜索历史" confirm-btn-text="清空" @confirm="deleteAllSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from '../baseComponents/SearchBox/SearchBox'
  import Suggest from '../baseComponents/Suggest/Suggest'
  import SearchList from '../baseComponents/SearchList/SearchList'
  import Confirm from '../baseComponents/Confirm/Confirm'
  import Scroll from '../baseComponents/Scroll/Scroll'
  import {mapActions} from 'vuex'
  import {playlistMixin, searchMixin} from "../../assets/js/mixin";


  export default {
    name: "Search",
    mixins: [playlistMixin, searchMixin],
    data(){
      return {
        hotKey: [],
      }
    },
    methods: {
      handlePlaylist(playlist){
        // 重新计算底部的高度并重新计算scroll的高度
        const bottom = playlist.length > 0 ? '60px': ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      showConfirm(){
        this.$refs.confirm.show()
      },
      _getHotKey(){
        this.$axios.get(process.env.BASE_URL + "api/getHotKey/").then((res) => {
          if(res.data.code === 0){
            this.hotKey = res.data.data.hotkey.slice(0, 10)
          }
        })
      },
      ...mapActions([
        'deleteAllSearchHistory'
      ])
    },
    watch: {
      query(newQuery){
        if(!newQuery){
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    computed: {
      shoutcut(){
        return this.hotKey.concat(this.searchHistory)
      },
    },
    created(){
      this._getHotKey()
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
  }
</script>

<style lang="less" scoped>
  .search{
    > .search-box-wrapper{
      margin: 20px;
    }
    > .shortcut-wrapper{
      position: fixed;
      top: 175px;
      bottom: 0;
      width: 100%;
      > .shortcut{
        height: 100%;
        overflow: hidden;
        .hot-key{
          margin: 0 20px 20px 20px;
          > .title{
            margin-bottom: 20px;
            font-size: 14px;
            color: rgba(255,255,255,0.5);
          }
          > ul{
            > .item{
              display: inline-block;
              padding: 2px 10px;
              margin: 0 20px 10px 0;
              border-radius: 6px;
              background: #333;
              font-size: 14px;
              color: rgba(255,255,255,0.3);
              > span{
                margin: 0;
                padding: 0;
                border: 0;
                font-size: 100%;
                font-weight: 400;
                vertical-align: baseline;
              }
            }
          }
        }
        .search-history{
          position: relative;
          margin: 0 20px;
          > .title{
            display: flex;
            align-items: center;
            height: 40px;
            font-size: 14px;
            color: rgba(255,255,255,0.5);
            > .text{
              flex: 1;
            }
          }
        }
      }
    }
    > .search-result{
      position: fixed;
      width: 100%;
      top: 175px;
      bottom: 0;
    }
  }
</style>
