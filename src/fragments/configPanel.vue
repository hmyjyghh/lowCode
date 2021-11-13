<template>
  <div>
    <DsfDesignerProperties :data="data"></DsfDesignerProperties>
  </div>
</template>

<script>
// import { components } from '../config'

// import { DsfDesignerProperties } from '../config'

export default {
  name: 'configPanel',
  props: {
    currentPickType: {
      type: String,
      default: 'cButton'
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    // ...components
    // DsfDesignerProperties
  },
  methods: {
    // vue的实例属性$options是用来获取定义在data外的数据和方法的。
    renderPanel (h, type) {
      if (!type) return
      const components = this.$options.components
      // console.log('components', components);
      // console.log('components[type]', components[type]);
      // console.log('函数', components[type].render);

      return (
        components[type].render.call(this, h)
      )
    }
  },
  render (h) {
    // console.log('h', h);
    // 初始化参数
    const _type = this.currentPickType
    console.log('_type', _type);
    // 渲染面板
    // let _panel = this.renderPanel(h, _type)

    // return _panel
  },
  mounted() {
    // console.log('components', components);
  }
}
</script>
