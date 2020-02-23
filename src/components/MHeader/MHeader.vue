<template>
  <div class="mheader">
    <img src="./logo.png" alt="">
    <span>FunnyDay Music</span>
    <router-link to="/user" class="mine" tag="div">
      <i class="iconfont icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "MHeader"
  }
</script>

<style lang="less" scoped>
  .mheader{
    height: 44px;
    width: 100%;
    background: @theme-background-color;
    display: flex;
    justify-content: center;
    align-items: center;
    > img{
      display: inline-block;
      height: 28px;
      margin-right: 10px;
    }
    >span{
      color: @theme-font-color;
    }
    > .mine{
      position: absolute;
      top: 0;
      right: 0;
      width: 44px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-mine{
        display: block;
        font-size: 24px;
        color: #ffcd32;
      }
    }

  }
</style>
