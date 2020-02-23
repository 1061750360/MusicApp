<template>
  <transition name="fade">
    <div class="tip" v-show="showFlag">
      <span class="text">{{text}}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "Tip",
    props: {
      text: {
        type: String,
        default: ''
      },
      time: {
        type: Number,
        default: 2000
      }
    },
    data(){
      return {
        showFlag: false
      }
    },
    methods: {
      show(){
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, this.time)
      },
      hide(){
        this.showFlag = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .fade-enter,
  .fade-leave-to{
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: all 0.3s;
  }

  .tip{
    position: fixed;
    bottom: 15%;
    left: 50%;
    width: 60%;
    transform: translateX(-50%);
    background-color: #333;
    border-radius: 10px;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    z-index: 9999999;
    > .text{
      font-size: 16px;
      color: rgba(255,255,255,0.3);
      text-align: center;
    }
  }
</style>
