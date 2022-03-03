/**
 * @class Control
 * @description 所有的组件都应该基于核心基础类开发
 * @example 
 * import control from "./control";
 * 
 * export default {
 *    name: "xxxx", 组件 name
 *    ctrlCaption: "xxx", // 组件中文名称
 *    mixins: [control],
 *    ...
 * }
 */
export default {
  // inheritAttrs:false,
  inject: {
    $vm: {
      default: null
    },
    $page: {
      default: null
    },
    $form: {
      default: null
    },
    $templateControl: {
      default: null
    },

  },
  comments: true,
  /**
   * @memberof Control
   * @name Props 属性
   * @property {Boolean} [isDesign = false] 是否是设计模式
   * @property {Object} [layoutRoot = null] 布局树的根组件，也就是page组件
   * @property {Object} [layoutParent = null] 布局树的父组件
   * @property {String} [designId = ""] 设计模式产生的id
   * @property {String} [caption = ""] 组件唯一名称
   * @property {Boolean} [visible = true] 组件是否可见
   * @property {Object} [metadata = null] 组件元数据
   * @property {Array} [classList = []] 组件样式列表
   * @property {Array} [classList = []] 组件样式列表
   * @property {Boolean} [noPadding = false] 是否不需要间距
   * @property {Array} [slots = []] 组件插槽
   * @property {Boolean} [isMergeHttp = false] 是否合并请求
   * @property {Boolean} [tbNoPadding = false] 是否取消上下边距
   * @property {Boolean} [lrNoPadding = false] 是否取消左右边距
   * @property {Object} [$local = null] 
   * @property {Boolean} [inSubTemplate = false] 是否在子表或者列表模板中
   * @property {ControlDevelopment} [development = {events: {},attrs: {}}] 二次开发配置
   * @property {Boolean} [designProxy = false] 设计器可否对他进行编辑
   * @property {Boolean} [designOnlySlot = false] 设计模式下当前组件仅仅起到一个插槽的作用，不会将子组件存放到该组件下
   */
  /**
   * @namespace ControlDevelopment
   * @description 二次开发配置
   * @property {Object} [events = {}] 事件
   * @property {Object} [attrs = {}] 属性
   */
  props: {
    //是否由业务组件创建
    isBusiness: {
      type: Boolean,
      default: false
    },
    //是否是设计模式
    isDesign: {
      type: Boolean,
      default: false
    },
    //数据ID
    dataId:{
      type: String,
      default: ""
    },
    //设计模式产生的id
    designId: {
      type: String,
      default: ""
    },
    //组件唯一名称
    caption: {
      type: String,
      default: ""
    },
    //组件是否可见
    visible: {
      type: Boolean,
      default: true
    },
    //组件元数据
    metadata: {
      type: Object,
      default () {
        return null;
      }
    },
    //组件样式列表
    classList: {
      type: Array,
      default () {
        return [];
      }
    },
    noPadding: {
      type: Boolean,
      default () {
        return false;
      }
    },
    //组件插槽
    slots: {
      type: Array,
      default () {
        return [];
      }
    },
    isMergeHttp: {
      type: Boolean,
      default: false
    },
    //取消上下边距
    tbNoPadding: {
      type: Boolean,
      default: false
    },
    //取消左右边距
    lrNoPadding: {
      type: Boolean,
      default: false
    },
    $local: {
      type: Object,
      default () {
        return null
      }
    },
    //是否在子表或者列表模板中
    // inSubTemplate: {
    //   type: Boolean,
    //   default: false
    // },
    //二次开发配置
    development: {
      type: Object,
      default () {
        return {
          // events: {},
          attrs: {}
        }
      }
    },
    /* ==================设计状态下,相关配置属性 ==================*/
    //设计器可否对他进行编辑
    designProxy: {
      type: Boolean,
      default: false
    },
    //设计模式下当前组件仅仅起到一个插槽的作用，不会将子组件存放到该组件下
    designOnlySlot: {
      type: Boolean,
      default: false
    },
    /* ==================设计状态下,相关配置属性 ================== */
    //自定义参数
    selfChooseList: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  computed: {
    getCss() {
      return this.$getClass();
    },
    props() {
      let _vm = this.$vm;
      if (_vm && !this.isDesign) {
        let key = "";
        if (this.inSubTemplate) {
          key = this.designId + "-" + (this.$local.row.$hash || this.$local.row._id || this.$local.$index);

        } else {
          key = this.designId;
        }
        return _vm.$controls[key];
      }
    },
    isDes() {
      return !!this.designId;
    },
    queryString() {
      let vmQuery = this.$vm ? this.$vm.queryString : null;
      let routerQuery = this.$route.query;
      return vmQuery || routerQuery;
    }
  },
  data() {
    return {};
  },
  beforeCreate() {},
  /**
   * @memberof Control 
   * @name LifeCycle 组件生命周期方法
   * @description 所有组件都有以上的周期监听方法
   * @example 
   * // 如果是驼峰命名的 使用时用全小写加-连接
   * beforeDestroy -> before-destroy 
   * @property {Function} created 创建开始触发
   * @property {Function} mounted 渲染创建完成
   * @property {Function} updated 数据更新
   * @property {Function} beforeDestroy 组件销毁前[before-destroy]
   * @property {Function} destroy 组件销毁后
   */
  created: function() {
    // 设计模式下,代理所有组件的props,使props可以通过组件自生改变
    if (this.isDesign) {
      if (this.$props) {
        for (let k in this.$props) {
          propsProxy.call(this, this.$props, k);
        }
      }
    }
    this.$dispatch("created", this);
  },
  mounted() {
    if (this.$el && this.$el.setAttribute) {
      this.$el.setAttribute("ctrl_type", this.$options.ctrlType);
    }
    if (this.isDesign && this.designId) {
      this.$el.setAttribute("des-id", this.designId);
    }
    this.$dispatch("mounted", this);
  },
  updated() {
    this.$dispatch("updated", this);
    // console.log(this.ctrlType + "更新")
  },
  beforeDestroy() {
    // if (!this.isDesign && this.inSubTemplate && this.$local && this.$vm) {
    //   let key = this.designId + "-" + (this.$local.row.$hash || this.$local.row._id || this.$local.$index);
    //   this.$vm.$delete(this.$vm.$controls, key);
    // }
    this.$dispatch("before-destroy", this);
  },
  destroyed() {
    if (this.viewContext && this.viewContext.viewData) {
      this.viewContext.viewData = null;
    }
    if (this.viewContext && this.viewContext.viewInitData) {
      this.viewContext.viewInitData = null;
    }
    this.$dispatch("destroy", this);
  },
  methods: {
    //构建元数据
    // createMetaData() {},
    //事件触发
    $dispatch(name, args) {
      let event = { target: this, name: name, args: args };
      this.$emit(name, event);
    },
    $dispatchTo(componentName, name, args) {
      let event = { target: this, name: name, args: args };
      eventTrigger.dispatch.call(this, componentName, name, event);
    },
    removeClass(keys) {
      keys = dsf.type(keys) == "array" ? keys : [keys];
      _.each(keys, k => dsf.array.remove(this.classList, k));
    },
    addClass(keys) {
      keys = dsf.type(keys) == "array" ? keys : [keys];
      _.each(keys, k => dsf.array.ensure(this.classList, k));
    },
    clearClass() {
      _.eachRight(this.classList, (k, i) => {
        dsf.array.removeAt(this.classList, i);
      });
    },
    closest(componentName) {
      var parent = this.$parent || this.$root;
      var name = parent.$options._componentTag;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options._componentTag;
        }
      }
      if (parent) {
        return parent;
      }
      return null;
    },
    postBefore() {
      return new Promise((resolve, reject) => {
        resolve()
      });
    },
    $getClass() {
      return [
        ...this.classList,
        !this.visible ? (this.isDesign ? 'ds-design-hide' : 'ds-hide') : "",
        this.tbNoPadding ? 'ds-top-bottom-no-padding' : '',
        this.lrNoPadding ? 'ds-left-right-no-padding' : ''
      ];
    },
    $getSlot(name) {
      let result = _.filter(this.slots, (s) => s.name == name);
      return result[0] ? result[0] : null;
    }
  },
  design: {
    //设计器是是否在组件上产生遮罩
    isMask: true,
    //设计器是是否在组件左上角是否有查看按钮
    infoButton: false,
    //设计器是否在组件左上角显示设置按钮
    dragButton: true,
    //设计器是是否在组件左上角是否有移除按钮
    removeButton: true,
    //组件加载到设计器上时组件高度默认在父容器铺满
    fit: false,
    layout: {
      isDeep: true,
      exclude: [],
      //创建布局时可以将作用域数据传入
      accpetContextData: false,
      attachAttributes: {},
      attachSlot: []
    },
    metadata: {
      isDeep: true,
      created() {}
    },

  }
};

function propsProxy(props, key) {
  let _this = this;
  Object.defineProperty(this, key, {
    set: function(v) {
      _this.$emit("update:" + key, v);
    },
    get: function() {
      return _this.$props[key];
    }
  });
}

// eslint-disable-next-line no-unused-vars
let eventTrigger = {
  broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
      var name = child.$options._componentTag;

      if (name === componentName) {
        child.$emit.apply(child, [eventName].concat(params));
      } else {
        broadcast.apply(child, [componentName, eventName].concat([params]));
      }
    });
  },
  dispatch(componentName, eventName, params) {
    var parent = this.$parent || this.$root;
    var name = parent.$options._componentTag;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
        name = parent.$options._componentTag;
      }
    }
    if (parent) {
      parent.$emit.apply(parent, [eventName].concat(params));
    }
  }
};