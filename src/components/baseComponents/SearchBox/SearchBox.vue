<template>
  <div class="search-box">
    <i class="icon-search iconfont icon-tubiao-"></i>
    <input type="text" v-model="query" :placeholder="placeholder" ref="input">
    <i class="icon-dismiss iconfont icon-chacha" v-show="query.length" @click="clearInput()"></i>
  </div>
</template>

<script>
  import {debounce} from "../../../assets/js/utils";

  export default {
    name: "SearchBox",
    props: {
      placeholder: {
        type: String,
        default: "搜索歌曲、歌手"
      }
    },
    data(){
      return {
        query: ''
      }
    },
    methods: {
      clearInput(){
        this.query = ''
        this.$refs.input.focus()
      },
      setQuery(query){
        this.query = query
      },
      blur(){
        this.$refs.input.blur()
      }
    },
    created(){
      // 向外暴露一个newQuery，也就是最新键入的搜索关键词, debounce为节流函数
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style lang="less" scoped>
  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: #333333;
    border-radius: 6px;
    > .icon-search{
      font-size: 24px;
      color: @theme-font-color;
    }
    > input{
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: #333333;
      color: #fff;
      font-size: 14px;
      border: none;
      &::placeholder{
        color: #717171;
      }
    }
    > .icon-dismiss{
      font-size: 16px;
      color: @theme-font-color;
    }
  }
</style>
