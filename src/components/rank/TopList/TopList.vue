<template>
  <transition name="slide" appear>
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from "../../MusicList/MusicList"
  import {mapGetters} from 'vuex'
  import {getVkey} from "../../../api/recommend"
  import {createSong} from "../../../assets/js/Song"


  export default {
    name: "TopList",
    data(){
      return {
        songs: [],
        rank: true
      }
    },
    created(){
      this._getTopListDetail()
    },
    methods: {
      _getTopListDetail(){
        if(!this.topList.topId){
          return this.$router.push("/rank")
        }
        let url = process.env.BASE_URL + `api/getTopListDetail/?topId=${this.topList.topId}&date=${this.topList.period}`
        this.$axios.get(url).then((res) => {
          console.log(res.data)
          if(res.data.code === 0){
            console.log(res.data.songlist,"2222")

            this.songs = this._normalSongsList(res.data.songlist)
            console.log(this.songs,"232")

          }
        }).catch((err) => {
          console.log(err)
        })
      },
      _normalSongsList(list){
        let ret = []
        list.forEach((item) => {
          if(item.data.songid){
            getVkey(item.data.songmid).then((res) => {
              let vkey = res.data.items[0].vkey
              let newSongmid = res.data.items[0].songmid
              ret.push(createSong(item.data,vkey,newSongmid))
            }).catch((err) => {
              ret.push(createSong(item.data, "", ""))
            })
          }
        })
        return ret
      }
    },
    computed: {
      title(){
        return this.topList.title
      },
      bgImage(){
        if(this.songs.length){
          return this.songs[0].image
        }
        return this.topList.mbFrontPicUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    components: {MusicList}
  }
</script>

<style lang="less" scoped>
  .slide-enter,
  .slide-leave-to{
    transform: translateX(100%);
  }
  .slide-enter-active,
  .slide-leave-active{
    transition: all 0.5s ease-in-out;
  }
</style>
