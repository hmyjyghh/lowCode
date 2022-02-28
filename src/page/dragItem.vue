<template>
  <div :title="data.name||data.id" class="ds-tool-item ellipsis" :name="data.name">
    {{ data.name||data.id }}
  </div>
</template>
<script>
export default {
  name: 'DsfMetaDataItem',
  props: {
    data: {
      type: Object,
      default() {
        return null
      }
    }
  }
}
</script>