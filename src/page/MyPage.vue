<template>
  <div class="mainpage">
    <div class="top"></div>
    <div class="main">
      <div class="main-l">
        <span>物料堆</span>
        <components ref="components" />
      </div>
      <div class="main-c">
        预览-渲染引擎
        <preview ref="preview" />
      </div>
      <div class="main-r">
        <span>配置面板</span>
        <config class="attributes-content" />
      </div>
    </div>
  </div>
</template>

<script>
// import cButton from '@/components/cButton.vue'
import config from '@/components/config'
import components from '@/components/components'
import preview from '@/components/preview'
export default {
  name: 'mypage',
  components: {
    config,
    components,
    preview
  },
  data () {
    return {
      list: ['Button']
    }
  },
  methods: {
    handleDrag (ev) {
      ev.dataTransfer.setData('text', ev.target.id)
    },
    handleDrop (ev) {
      ev.preventDefault()
      // var data = ev.dataTransfer.getData('text')
      ev.target.appendChild('<c-button></c-button>')
    }
  }
}
</script>

<style lang="scss" scoped>
.mainpage {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    height: 60px;
    border-bottom: 1px solid red;
  }
  .main {
    flex: 1;
    display: flex;
    > div{
      border-right: 1px solid red;
    }
    .main-l, .main-r {
      width: 20%;
    }
    .main-c {
      flex: 1;
    }
  }
}
</style>
