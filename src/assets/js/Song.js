import axios from 'axios'

// 歌曲类
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}){
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric(id){
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }
    return  new Promise((resolve, reject) => {
      axios.get(process.env.BASE_URL +`api/getLyric/?songId=${id}`).then((res) => {
        if(res.data.retcode === 0){
          this.lyric = res.data.lyric.toString()
          this.lyric = this.lyric.replace(/&#10;/ig, "\n")
          this.lyric = this.lyric.replace(/&#58;/ig, ":")
          this.lyric = this.lyric.replace(/&#46;/ig, ".")
          this.lyric = this.lyric.replace(/&#32;/ig, " ")
          this.lyric = this.lyric.replace(/&#40;/ig, "(")
          this.lyric = this.lyric.replace(/&#41;/ig, ")")
          this.lyric = this.lyric.replace(/&#45;/ig, "-")
          this.lyric = this.lyric.replace(/&#124;/ig, "|")
          resolve(this.lyric)
        }else{
          reject("no lyric")
        }
      })
    })

  }
}

// 返回歌曲类的实例，工厂函数
export function createSong(musicData) {
  if (musicData.musicData) {
    musicData = musicData.musicData
  }
  return new Song({
    id: musicData.songid || musicData.id,
    mid: musicData.songmid || musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname || musicData.name,
    album: musicData.albumname ? musicData.albumname : (musicData.album ? musicData.album.name : ""),
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${musicData.singer[0].mid}.jpg?max_age=2592000`
    // url: vkey ? `https://ws.stream.qqmusic.qq.com/${vkey}` : ""
  })
}

// 返回这首歌曲所有歌手的名字，用“/”拼接，如： “林俊杰/王菲”
function filterSinger(singer) {
  let ret = []
  if(!singer){
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
