<template>
  <div class="topnav">
    <router-link to="/recommend" class="recommend"><span class="active">推荐</span></router-link>
    <router-link to="/singer" class="singer"><span>歌手</span></router-link>
    <router-link to="/rank" class="rank"><span>排行</span></router-link>
    <router-link to="/search" class="search"><span>搜索</span></router-link>
  </div>
</template>

<script>
  export default {
    name: "TopNav"
  }
</script>

<style lang="less" scoped>
  .text-center(@flex,@lh){
    flex: @flex;
    text-align: center;
    line-height: @lh;
  }
  .active{
    > span{
      color: @theme-font-color!important;
      border-bottom: 2px solid @theme-font-color;
    }
  }

  .topnav{
    width: 100%;
    height: 44px;
    background: @theme-background-color;
    display: flex;
    > .recommend{
      .text-center(1,44px)
    }
    > .rank{
      .text-center(1,44px)
    }
    > .singer{
      .text-center(1,44px)
    }
    > .search{
      .text-center(1,44px)
    }
    span{
      font-size: 14px;
      color: #CFB9B3;
      padding-bottom: 4px;
    }
  }
</style>
