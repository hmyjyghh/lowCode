<template>
  <!-- <DsfRow ref="row" :gutter="gutter" :min-height="minHeight" :class="getCss">
    <slot></slot>
  </DsfRow> -->
  <el-row class="ds-control ds-row" :gutter="(isDesign?0:gutter)" :class="getCss">
    <el-col v-for="(slot, $index) in slots" :key="$index" :style="getStyle()" :slot-name="slot.name">
      <slot :name="slot.name"></slot>
    </el-col>
    <!-- <el-col :span="12" />
    <el-col :span="12" /> -->
  </el-row>
</template>
<script>
import layout from '@/mixins/layout'

/**
 * @class DsfRow12
 * @augments Layout
 * @description 一行两列
 * @example
 * <DsfRow12></DsfRow12>
 */
export default dsf.component({
  name: 'DsfRow12',
  ctrlCaption: '一行两列',
  mixins: [layout],
  /**
   * @memberof DsfRow12
   * @name Props 属性
   * @property {String} [minHeight = "0"] 最小高度
   * @property {Number} [gutter = "0"] 两端间距
   * @property {Array} [slots = "[{ name: 'default', controls: [] }]"] 插槽
   */
  props: {
    minHeight: {
      type: String,
      default: '0'
    },
    gutter: {
      type: Number,
      default: 0
    },
    slots: {
      type: Array,
      default () {
        return [
          { name: 'default', controls: [] }
        ]
      }
    }
  },
  computed: {
    getCss () {
      return [
        ...this.$getClass(),
        this.isDesign ? '' : 'ds-no-padding'
      ]
    },
    cols () {
      return this.$refs.row.cols
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    // createDesignerColumns.call(this)
  },
  methods: {
    getStyle () {
      let style = {}
      if (!this.isDesign) {
        style['min-height'] = this.minHeight + 'px'
      }
      return style
    }
  }
})
function createDesignerColumns () {
  if (this.isDesign) {
    if (this.slots[0].controls.length == 0) {
      let size = 2
      for (let i = 0; i < size; i++) {
        let span = 24 / size
        let obj = {
          'height': 'auto',
          'span': span
        }
        this.slots[0].controls.push(dsf.designer.createComponent('dsf.col', obj))
      }
    }
  }
}
</script>
