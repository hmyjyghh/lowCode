<template>
  <div>
    <ul class="components-list">
      <li draggable="true" @dragstart="dragStart" data-name="Text">文本</li>
      <li draggable="true" @dragstart="dragStart" data-name="A">链接</li>
      <li draggable="true" @dragstart="dragStart" data-name="Img">图片</li>
      <li draggable="true" @dragstart="dragStart" data-name="Br">换行</li>
      <li draggable="true" @dragstart="dragStart" data-name="Div">div</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    dragStart (e) {
      let componentName = e.target.getAttribute('data-name')
      let info = {
        name: componentName
      }
      e.dataTransfer.setData('info', JSON.stringify(info))
    }
  }
}
</script>
