<template>
  <ul class="switches">
    <li class="switch-items" v-for="(item, index) in switches" :class="{'active': currentIndex === index}" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "Switches",
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index){
        this.$emit('switch', index)
      }
    }
  }
</script>

<style lang="less" scoped>
  .switches{
    display: flex;
    align-items: center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid #333;
    border-radius: 5px;
    > .switch-items{
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: 14px;
      color: hsla(0,0%,100%,.3);
      > span{

      }
      &.active{
        background: #333;
        color: #fff;
      }
    }
  }
</style>
