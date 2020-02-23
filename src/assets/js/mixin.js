import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from "./config"
import {shuffle} from '../../assets/js/utils'


// 该mixin用于处理：当底部有迷你播放器时，让整个页面底部的内容上升一段距离，防止播放器覆盖了内容
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted(){
    this.handlePlaylist(this.playList)
  },
  activated(){
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal){
      this.handlePlaylist(this.playList)
    }
  },
  methods: {
    handlePlaylist(){
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  methods: {
    getFavoriteIcon(song){
      if(this.isFavorite(song)){
        return 'icon-androidfavorite'
      }else{
        return 'icon-androidfavoriteoutline'
      }
    },
    toggleFavorite(song){
      if(this.isFavorite(song)){
        this.deleteFavoriteList(song)
      }else{
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    changeMode(){
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if(mode === playMode.random){
        list = shuffle(this.sequenceList)
      }else{
        list = this.sequenceList
      }
      this.resetCurrenIndex(list)
      this.setPlayList(list)
    },
    resetCurrenIndex(list){
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  },
  computed: {
    iconMode(){
      return this.mode === playMode.sequence ? "iconfont icon-xunhuan" : this.mode === playMode.loop ? "iconfont icon-danquxunhuan" : "iconfont icon-suiji"
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList',
      'favoriteList'
    ])
  }
}


export const searchMixin = {
  data(){
    return {
      query: '',
      refreshDelay: 200
    }
  },
  computed: {
  ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput(){
      this.$refs.searchBox.blur()
    },
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    onQueryChange(query){
      this.query = query
    },
    addQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  }
}

