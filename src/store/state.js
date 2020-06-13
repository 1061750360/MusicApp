import {playMode} from "../assets/js/config"
import {loadSearch, loadPlay, loadFavorite} from "../assets/js/cache"

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [], // 播放列表
  sequenceList: [],  // 随机播放的顺序
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state
