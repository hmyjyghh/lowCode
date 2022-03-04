import control from './control'

/**
 * @class Layout
 * @description 布局组件核心类
 * @example
 * import lalyout from "./lalyout";
 *
 * export default {
 *    name: "xxxx", 组件 name
 *    ctrlCaption: "xxx", // 组件中文名称
 *    mixins: [lalyout],
 *    ...
 * }
 */
export default {
  mixins: [control],
  /**
   * @memberof Layout
   * @name Props 属性
   * @property {Boolean} [isListContent = false] 是否是列表模板中的内容组件
   */
  props: {
    // 是否是列表模板中的内容组件
    isListContent: {
      type: Boolean,
      default: false
    }
  },
  design: {
    // 设计器是是否在组件上产生遮罩
    isMask: false
  }
}
