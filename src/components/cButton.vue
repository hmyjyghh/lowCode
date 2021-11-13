<template>
  <el-button>{{ btn }}</el-button>
</template>

<script>
// 默认按钮组件
export default {
  name: 'cButton',
  data () {
    return {
      btn: '我是老按钮'
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  display: block;
  margin: 0 auto;
}
</style>
