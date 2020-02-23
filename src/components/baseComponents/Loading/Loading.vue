<template>
  <div class="loading">
    <img src="./uploading.gif" alt="">
    <p>{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: "Loading",
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>

<style lang="less" scoped>
  .loading{
    width: 100%;
    text-align: center;
    > img{
      width: 24px;
      height: 24px;
    }
    > p{
      color: #fff;
      font-size: 14px;
    }
  }
</style>
