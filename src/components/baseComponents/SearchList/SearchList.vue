<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" v-for="item in searches" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <i class="iconfont icon-chacha" @click.stop="deleteOne(item)"></i>
      </li>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: "SearchList",
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item){
        this.$emit('select', item)
      },
      deleteOne(item){
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="less" scoped>
  .search-list{
    > ul{
      > .search-item{
        display: flex;
        align-items: center;
        height: 40px;
        &.list-enter-active,
        &.list-leave-active{
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to{
          height: 0;
        }
        > .text{
          flex: 1;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }
        > .iconfont{
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }
      }
    }
  }

</style>
