<template>
  <div ref="singer">
    <list-view :data="singerList" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import ListView from '../baseComponents/ListView/ListView'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from "../../assets/js/mixin";

  export default {
    name: "Singer",
    mixins: [playlistMixin],
    data(){
      return {
        singerList: []
      }
    },
    created(){
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '0'
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 当点击某一个歌手时，改变url并将singer传回vuex中的setter
      selectSinger(singer){
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      // 从代理后台获取到歌手列表数据
      _getSingerList(){
        const url = process.env.BASE_URL + 'api/getSingerList/'
        this.$axios.get(url).then((res) => {
          if(res.data.code === 0){
            this.singerList = this._normallizSinger(res.data.data.list)
          }
        }).catch((err) => {
          console.log("加载歌手资源失败")
        })
      },
      _normallizSinger(list){
        let map = {
          hot: {
            title: "热门",
            items: []
          }
        }
        // 遍历歌手列表数据，将其按照字母a-z的方式存入一个数组中
        list.forEach((item,index) => {
          if(index<10){
            map.hot.items.push({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          const key = item.Findex
          if(!map[key]){
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        })
        let hot = []
        let ret = []
        for(let key in map){
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title === "热门"){
            hot.push(val)
          }
        }
        ret.sort((a, b) =>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style lang="less" scoped>

</style>
