import storage from 'good-storage'

// 这个key代表搜索历史是一个长度为15的列表
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
// 这个key代表播放历史是一个长度为200的列表
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200
//
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

// 在数组中第一位插入一个val，有长度限制和值的重复限制
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if(index === 0){
    return
  }
  if(index > 0){
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if(maxLen && arr.length > maxLen){
    arr.pop()
  }
}

// 从数组中删除元素
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if(index > -1){
    arr.splice(index, 1)
  }
}

// 将搜索历史保存到storage中
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 从storage中读取搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}


// 从storage中删除搜索历史，单个
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}


// 从storage中删除搜索历史，全部
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}


// 将播放历史保存到storage中
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 从storage中读取播放历史
export function loadPlay(song) {
  return storage.get(PLAY_KEY, [])
}

// 将喜欢的歌曲保存到storage中
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// 从storage中删除喜欢的歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// 获取storage中喜欢的歌曲列表
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
