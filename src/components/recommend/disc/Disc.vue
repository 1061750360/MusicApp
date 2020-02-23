<template>
  <div>
    <transition name="slide" appear>
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
  </div>
</template>

<script>
  import MusicList from "../../MusicList/MusicList"
  import {mapGetters} from 'vuex'
  import {createSong} from "../../../assets/js/Song"
  import {getVkey} from "../../../api/recommend"


  export default {
    name: "Disc",
    data(){
      return {
        songs: []
      }
    },
    methods: {
      _getDisc(dissID){
        if(!dissID){
          return this.$router.push('/recommend')
        }
        this.$axios.get(process.env.BASE_URL + "api/getDisc/").then((res) => {
          if(res.data.code === 0){
            let cdlist = res.data.cdlist
            this.songs = this._normalSongsList(cdlist[0].songlist)
          }
        }).catch((err) => {
          console.log("加载歌曲列表失败")
        })
      },
      _normalSongsList(list){
        let ret = []
        list.forEach((item) => {
          if(item.id){
            getVkey(item.mid).then((res) => {
              let vkey = res.data.items[0].vkey
              let newSongmid = res.data.items[0].songmid
              ret.push(createSong(item,vkey,newSongmid))
            }).catch((err) => {
              ret.push(createSong(item, "", ""))
            })
          }
        })
        return ret
      }
    },
    created(){
      this._getDisc(this.disc.creator)
    },
    computed: {
      title(){
        return this.disc.title
      },
      bgImage(){
        return this.disc.cover
      },
      ...mapGetters([
        'disc'
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
