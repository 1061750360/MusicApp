import jsonp from '../assets/js/jsonp'
import axios from 'axios'

// 获取sign值，然后根据sign获得歌曲的vKey值，从而拼接出歌曲资源的url
// 参数格式如下：const data = {"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"5690143136","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"5690143136","songmid":["003dN2o305HIt6"],"songtype":[0],"uin":"1061750360","loginflag":1,"platform":"20"}},"comm":{"uin":1061750360,"format":"json","ct":24,"cv":0}}

function getSign(data) {
  let str = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let count = Math.floor(Math.random() * 7 + 10);
  let sign = 'zza';
  for(let i = 0; i < count ; i++){
    sign += str[Math.floor(Math.random() * 36)];
  }
  sign += global.__sign_hash_20200305('CJBPACrRuNy7'+JSON.stringify(data));
  return sign
}


// 获得推荐列表
export function getRecommend() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&data=%7B%22recomPlaylist%22%3A%7B%22method%22%3A%22get_hot_recommend%22%2C%22param%22%3A%7B%22async%22%3A1%2C%22cmd%22%3A2%7D%2C%22module%22%3A%22playlist.HotRecommendServer%22%7D%7D'
  return jsonp(url)
}

// 获得首页轮播图，暂时不用
export function getSliderImg() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=976692372&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&plarform=h5&uin=0&needNewCode=1'
  return jsonp(url)
}

// 获取vkey，下载歌曲资源得重要参数
export function getVkey(songMid) {
  const data = {"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"5690143136","songmid":[songMid],"songtype":[0],"uin":"1061750360","loginflag":1,"platform":"20"}},"comm":{"uin":1061750360,"format":"json","ct":24,"cv":0}}
  const sign = getSign(data)
  return axios.get(`http://127.0.0.1:8000/api/getVkey/?data=${JSON.stringify(data)}&sign=${sign}`)
}
