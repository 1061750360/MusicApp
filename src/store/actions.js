import * as types from './mutation-types'
import {playMode} from "../assets/js/config"
import {shuffle} from "../assets/js/utils"
import {saveSearch, deleteSearch, clearSearch, savePlay, deleteFavorite, saveFavorite} from "../assets/js/cache"


function findListIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 播放歌曲
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)

  if(state.mode === playMode.random){
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findListIndex(randomList, list[index])
  }else{
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_MODE, playMode.sequence)
}

// 随机播放
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)

  let randomList =  shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 在搜索栏下搜索歌曲并播放，此时调用这个方法，在已有的播放列表中插入搜索到的要播放的歌曲
export const insertSong = function ({commit, state}, song, fullScreen) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]

  // 查找当前列表中是否有和待插入的歌曲一样的歌曲，并返回其索引
  let fIndex = findListIndex(playList, song)
  currentIndex++
  playList.splice(currentIndex, 0, song)
  if(fIndex > -1){
    if(currentIndex > fIndex){
      playList.splice(fIndex, 1)
      currentIndex--
    }else{
      playList.splice(fIndex + 1, 1)
    }
  }
  let currentSIndex = findListIndex(sequenceList, currentSong) + 1
  let fsIndex = findListIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)

  if(fsIndex > -1){
    if(currentSIndex > fsIndex){
      sequenceList.splice(fsIndex, 1)
    }else{
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, fullScreen)
  commit(types.SET_PLAYING_STATE, true)
}

// 保存搜索历史
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除搜索历史记录,单个
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 删除搜索历史记录,全部，垃圾桶功能
export const deleteAllSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}


// 从播放列表中删除一首歌
export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findListIndex(playList, song)
  playList.splice(pIndex, 1)

  let sIndex = findListIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if(currentIndex > pIndex || currentIndex === playList.length){
    currentIndex--
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 清空播放歌曲列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}


// 保存播放歌曲历史
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 收藏喜欢的歌曲
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 取消收藏喜欢的歌曲
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
