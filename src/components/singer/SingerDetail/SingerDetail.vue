<template>
  <transition mode="out-in" appear>
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {createSong} from '../../../assets/js/Song'
  import {getVkey} from "../../../api/recommend";
  import MusicList from '../../MusicList/MusicList'
  import {singer} from "../../../store/getters";


  export default {
    name: "SingerDetail",
    data(){
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      }
    },
    created(){
      this._getDetail()
    },
    methods: {
      _getDetail(){
        if(!this.singer.id){
          this.$router.push('/singer')
          return
        }
        const url = process.env.BASE_URL + `api/getSingerDetail/?singerId=${this.singer.id}`
        this.$axios.get(url).then((res) => {
          if(res.data.code === 0){
            this.songs = this._normalizeSongs(res.data.data.list)
          }
        }).catch((err) => {
          console.log("加载歌手歌曲失败")
        })
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if(musicData.songid){
            getVkey(musicData.songmid).then((res) => {
              let vkey = res.data.items[0].vkey
              let newSongmid = res.data.items[0].songmid
              ret.push(createSong(musicData,vkey,newSongmid))
            }).catch((err) => {
              ret.push(createSong(musicData,"",""))
            })
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="less" scoped>
  .v-enter,
  .v-leave-to{
    transform: translateX(100%);
  }
  .v-enter-active,
  .v-leave-active{
    transition: all 0.5s ease-in-out;
  }
</style>
