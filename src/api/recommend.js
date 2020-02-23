import jsonp from '../assets/js/jsonp'

export function getRecommend() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&data=%7B%22recomPlaylist%22%3A%7B%22method%22%3A%22get_hot_recommend%22%2C%22param%22%3A%7B%22async%22%3A1%2C%22cmd%22%3A2%7D%2C%22module%22%3A%22playlist.HotRecommendServer%22%7D%7D'
  return jsonp(url)
}


export function getSliderImg() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=976692372&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&plarform=h5&uin=0&needNewCode=1'
  return jsonp(url)
}

export function getVkey(songmid) {
  const url = `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&inCharset=utf8&outCharset=utf-8&notice=0&format=json&hostUin=0&platform=h5&needNewCode=0&cid=205361747&uin=0&songmid=${songmid}&filename=C400${songmid}.m4a&guid=7175649092`
  return jsonp(url)
}
