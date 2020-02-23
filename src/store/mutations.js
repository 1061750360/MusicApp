import Vue from 'vue'
import * as types from './mutation-types'


const mutations = {
  [types.SET_SINGER](state, singer){
    //当state中的数据是一个对象时，需要使用这种方式赋值，而不是state.singer = singer
    Vue.set(state,'singer',singer);
  },
  [types.SET_PLAYING_STATE](state, flag){
    Vue.set(state,'playing',flag);
  },
  [types.SET_FULL_SCREEN](state, flag){
    Vue.set(state,'fullScreen',flag);
  },
  [types.SET_PLAY_LIST](state, list){
    Vue.set(state,'playList',list);
  },
  [types.SET_SEQUENCE_LIST](state, list){
    Vue.set(state,'sequenceList',list);
  },
  [types.SET_MODE](state, mode){
    Vue.set(state,'mode',mode);
  },
  [types.SET_CURRENT_INDEX](state, index){
    Vue.set(state,'currentIndex',index);
  },
  [types.SET_DISC](state, disc){
    Vue.set(state,'disc',disc);
  },
  [types.SET_TOP_LIST](state, topList){
    Vue.set(state,'topList',topList);
  },
  [types.SET_SEARCH_HISTORY](state, history){
    Vue.set(state,'searchHistory',history);
  },
  [types.SET_PLAY_HISTORY](state, playHistory){
    Vue.set(state,'playHistory',playHistory);
  },
  [types.SET_FAVORITE_LIST](state, favoriteList){
    Vue.set(state,'favoriteList',favoriteList);
  },
}
export default mutations
