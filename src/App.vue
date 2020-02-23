<template>
  <div id="app">
    <m-header></m-header>
    <top-nav></top-nav>
    <keep-alive>
      <router-view class="wrapper"></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHeader from './components/MHeader/MHeader'
  import TopNav from './components/topnav/TopNav'
  import Player from './components/Player/Player'

  export default {
    name: 'App',
    components: {
      MHeader,
      TopNav,
      Player
    }
  }
</script>

<style lang="less" scoped>
  #app {
    position: relative;
    height: 100%;
    > .wrapper{
      position: absolute;
      top: 88px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
    }
  }
</style>
