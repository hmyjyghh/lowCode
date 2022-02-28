<template>
  <div class="preview" @dragover.prevent @drop="drop">
    <div :id="item.info.id" v-for="(item, index) in components" :key="index"></div>
  </div>
</template>

<script>
// 取随机id
import guid from '@/utils/guid'
import { getTemplate } from './template'
import mount from './mount'
export default {
  data () {
    return {
      components: []
    }
  },
  methods: {
    drop (e) {
      let info = JSON.parse(e.dataTransfer.getData('info'))
      info.id = guid()
      let component = getTemplate(info)
      this.components.push(component)
      // console.log('component', this.components)
      this.mount()
    },
    mount () {
      // 挂载及更新视图中组件的位置信息
      let components = this.components
      components.filter(component => !component.parentId).forEach(component => {
        mount(component.info.id, component).then(vm => {
          // let el = document.getElementById(component.info.id)
          // component.position = {
          //   offsetLeft: el.offsetLeft,
          //   offsetRight: el.offsetLeft + el.clientWidth,
          //   offsetTop: el.offsetTop,
          //   offsetBottom: el.offsetTop + el.clientHeight
          // }
          // // 每次重新挂载后dom变动，更新scoped style
          // this.addUserStyle()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.preview {
  width: 100%;
  height: 100%;
}
</style>
