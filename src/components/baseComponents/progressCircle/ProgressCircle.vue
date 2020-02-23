<template>
  <div class="progress-circle">
    <svg width="34" height="34" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <circle class="progress-background" cx="50" cy="50" r="48"  fill="transparent"/>
      <circle class="progress-bar" cx="50" cy="50" r="48"  fill="transparent" :stroke-dasharray="dashArray"  :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "ProgressCircle",
    props:{
      percent: {
        type: Number,
        default: 0
      }
    },
    data(){
      return {
        dashArray: 96 * Math.PI
      }
    },
    computed: {
      dashOffset(){
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style lang="less" scoped>
  .progress-circle{
    > svg{
      margin: 2px 0 0 1px;
      stroke-width: 8px;
      > .progress-background{
        transform-origin: center;
        transform: scale(0.9);
        stroke: #B98E08;
      }
      > .progress-bar{
        transform-origin: center;
        transform: scale(0.9) rotate(-90deg);
        stroke: @theme-font-color;
      }
    }
  }
</style>
