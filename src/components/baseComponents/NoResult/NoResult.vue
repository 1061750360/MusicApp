<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: "NoResult",
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .no-result{
    text-align: center;
    > .no-result-icon{
      width: 160px;
      height: 120px;
      margin: 0 auto;
      background-image: url("404.jpg");
      background-size: 160px 120px;
    }
    > .no-result-text{
      margin-top: 30px;
      font-size: 16px;
      color: rgba(255,255,255,0.3);
    }
  }
</style>
