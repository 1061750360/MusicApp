<template>
  <Scroll class="suggest" :data="result" :pull-up="pullUp" :before-scroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon iconfont">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </Scroll>
</template>

<script>
  import {createSong} from '../../../assets/js/Song'
  import {getVkey} from "../../../api/recommend"
  import Scroll from '../Scroll/Scroll'
  import Loading from '../Loading/Loading'
  import NoResult from '../NoResult/NoResult'
  import {mapMutations,mapActions} from 'vuex'
  import Singer from '../../../assets/js/Singer'


  const TYPE_SINGER = 'singer'
  const perpage = 20  // 定义每一页有多少数量


  export default {
    name: "Suggest",
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        page: 0,
        result: [],
        pullUp: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    methods: {
      refresh(){
        this.$refs.suggest.refresh()
      },
      selectItem(item){
        // 如果是歌手，则传入歌手的mid，否则传入歌曲的mid
        if(item.type === TYPE_SINGER){
          let singer = new Singer(item.zhida_singer.singerMID, item.zhida_singer.singerName, item.zhida_singer.singerPic)

          this.$router.push({
            path: `/search/${singer.mid}`
          })
          this.setSinger(singer)
        }else{
          this.insertSong(item, true)
        }
        //  派发存取搜索历史的事件
        this.$emit('history')
      },
      getDisplayName(item){
        if(item.type === TYPE_SINGER){
          return item.zhida_singer.singerName
        }else {
          return `${item.name}-${item.singer}`
        }
      },
      getIconCls(item){
        if(item.type === TYPE_SINGER){
          return 'icon-mine'
        }else{
          return 'icon-yinle'
        }
      },
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.page++
        this._search(this.query, this.page)
      },
      listScroll(){
        this.$emit('listScroll')
      },
      _search(query,page){
        this.hasMore = true
        console.log(this.showSinger)

        // 抓取服务端数据
        let url = process.env.BASE_URL + `api/getSearch/?query=${query}&page=${page}&zhida=1`
        this.$axios.get(url).then((res) => {
          if(res.data.code === 0){
            let data = res.data.data
            if(this.showSinger){
              if(data.zhida && data.zhida.zhida_singer){
                // 如果this.result中已经有了歌手，则下次上拉刷新不在this.result中添加歌手
                if(!this.result[0] || this.result[0].type !== TYPE_SINGER){
                  this.result.push({...data.zhida, ...{type: TYPE_SINGER}})
                }
              }
            }
            if(data.song){
              data.song.list.forEach((item) => {
                if(item.id){
                  getVkey(item.mid).then((res) => {
                    let vkey = res.data.items[0].vkey
                    let newSongmid = res.data.items[0].songmid
                    this.result.push(createSong(item,vkey,newSongmid))
                  }).catch((err) => {
                    this.result.push(createSong(item, "", ""))
                  })
                }
              })
            }
            this._checkMore(query,page)
          }
        })
      },
      _checkMore(query,page){
        // 检查返回的数据中 total是否为0，若不为0，则可以继续从服务器中获取歌曲，也就是 this.hasMore=true
        let url = process.env.BASE_URL + `api/getSearch/?query=${query}&page=${page+1}&zhida=1`
        this.$axios.get(url).then((res) => {
          if(res.data.code === 0){
            if(res.data.data.song.totalnum === 0){
              this.hasMore = false
            }
          }
        }).catch((err) => {
          console.log("获取资源失败")
          this.hasMore = false
        })
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newVal){
        // 如果query的值为空时，不发送请求
        if(!newVal){
          return
        }
        this.result = []
        this._search(this.query, this.page)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang="less" scoped>
  .suggest{
    height: 100%;
    overflow: hidden;
    > .suggest-list{
      padding: 0 30px;
      > .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        > .icon{
          flex: 0 0 30px;
          width: 30px;
          color: hsla(0,0%,100%,.3);
        }
        > .name {
          flex: 1;
          font-size: 14px;
          color: hsla(0,0%,100%,.3);
          overflow: hidden;
          > .text{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
    > .no-result-wrapper{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
