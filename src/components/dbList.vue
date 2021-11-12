<template>
    <div class="dblist-v2">我是待办组件</div>  
</template>

    
<script>
// 默认输入组件
export default {
  name: 'DBList',
  data () {
    return {
      
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.$emit('viewMounted', this)
    // })
  }
}
</script>

<style scoped>
.dblist-v2 {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.07);
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 0 20px;
    font-family: 'pf';
    position: relative;
    height: 200px;
    line-height: 200px;
    text-align: center;
}
</style>