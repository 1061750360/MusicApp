# music-app

> A Vue.js project about music


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Server--you need to start a server for api
```
# python code abot cors
import base64
import json
import time

import requests
from django.http import JsonResponse,HttpResponse

# 定义一个请求头
headers = {
    "user-agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Mobile Safari/537.36",
    "referer": "https://c.y.qq.com/",
    "host": "c.y.qq.com",
}
headers2 = {
    "user-agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Mobile Safari/537.36",
    "referer": "http://dl.stream.qqmusic.qq.com",
    "host": "dl.stream.qqmusic.qq.com"
}

headers3 = {
    "user-agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Mobile Safari/537.36",
    "referer": "https://y.qq.com/m/index.html?tab=toplist",
}



# 获得歌手列表
def getSingerList(request):
    url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=976692372&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq"
    res = requests.get(url, params=None, headers=headers)

    return JsonResponse(json.loads(res.text), safe=False,json_dumps_params={'ensure_ascii':False})

# 获得歌手所有歌曲列表
def getSingerDetail(request):
    singerId = request.GET.get('singerId')
    url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=100&songstatus=1&singermid=" + singerId
    res = requests.get(url, params=None, headers=headers)
    return JsonResponse(json.loads(res.text), safe=False,json_dumps_params={'ensure_ascii':False})



# 获取对应歌曲的歌词
def getLyric(request):
    songId = request.GET.get('songId')
    url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&nobase64=1&musicid={}&songtype=0&_=1577718325581".format(songId)
    res = requests.get(url, params=None, headers=headers2)
    return JsonResponse(json.loads(res.text[18:-1]), safe=False,json_dumps_params={'ensure_ascii':True})

# 根据给定的歌单 disstid 获取某个推荐歌单的歌曲列表，这里给了一个固定值，下面的url是获取多个歌单的，里面有content_id的键，这个也就是disstid
# https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&data=%7B%22recomPlaylist%22%3A%7B%22method%22%3A%22get_hot_recommend%22%2C%22param%22%3A%7B%22async%22%3A1%2C%22cmd%22%3A2%7D%2C%22module%22%3A%22playlist.HotRecommendServer%22%7D%7D&&callback=__jp0
def getDisc(request):
    # disstid = request.GET.get('disstid')
    url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&new_format=1&disstid=7372500022&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0"
    res = requests.get(url, params=None, headers=headers)
    return JsonResponse(json.loads(res.text), safe=False, json_dumps_params={'ensure_ascii': False})

def getTopList(request):
    timestamp = int(round(time.time() * 1000))
    url = "https://u.y.qq.com/cgi-bin/musicu.fcg?_=" + str(timestamp) + "&data={%22comm%22:{%22g_tk%22:5381,%22uin%22:1061750360,%22format%22:%22json%22,%22inCharset%22:%22utf-8%22,%22outCharset%22:%22utf-8%22,%22notice%22:0,%22platform%22:%22h5%22,%22needNewCode%22:1,%22ct%22:23,%22cv%22:0},%22topList%22:{%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:{}}}"
    res = requests.get(url, params=None, headers=headers3)
    return JsonResponse(json.loads(res.text), safe=False, json_dumps_params={'ensure_ascii': False})


def getTopListDetail(request):
    topId = request.GET.get('topId')
    date = request.GET.get('date')
    url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=788911273&inCharset=utf8&outCharset=utf-8&notice=0&format=jsonp&topid=" + str(topId) + "&tpl=3&page=detail&date=" + date + "&type=top&song_begin=0&song_num=30&hostUin=0&platform=yqq&needNewCode=0"
    res = requests.get(url, params=None, headers=headers3)
    return JsonResponse(json.loads(res.text), safe=False, json_dumps_params={'ensure_ascii': False})


# 获取关键热词
def getHotKey(request):
    url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=976692372&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&needNewCode=0'
    res = requests.get(url, params=None, headers=headers3)
    return JsonResponse(json.loads(res.text), safe=False, json_dumps_params={'ensure_ascii': False})

# 根据用户输入的词进行搜索
def getSearch(request):
    query = request.GET.get('query')
    page = request.GET.get('page')
    zhida = request.GET.get('zhida')

    url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?g_tk=976692372&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w={}&p={}&catZhida={}&n=20&ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&lossless=0&flag_qc=0'.format(query,page,zhida)
    res = requests.get(url, params=None, headers=headers3)
    return JsonResponse(json.loads(res.text), safe=False, json_dumps_params={'ensure_ascii': False})
```