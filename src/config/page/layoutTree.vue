
<template>
  <!--设计器状态 start-->
  <div v-if="$getComponetRenderType('design-proxy')" v-show="__desContext__.show" :class="{ 'ds-control-selected': __desContext__.selected }" :style="{ height: __desContext__.height }" class="designer-ctrl-proxy">
    <component :is="__context__.props.ctrlName" ref="ctrl" :is-design="__hasDesign__" v-bind.sync="__context__.props">
      <template v-for="slot in __context__.props.slots" v-slot:[slot.name]>
        <DsfLayoutTree v-for="child in slot.controls" :key="child.designId" :component-props.sync="child" :is-design="__hasDesign__" :parent-prop="_self" :root-prop="__context__.root"></DsfLayoutTree>
      </template>
    </component>
    <!--组件设计模式左上角按钮-->
    <div :class="{ 'designer-mask': __desContext__.mask }" class="designer-btns">
      <ul v-show="__desContext__.selected">
        <li v-if="__desContext__.hasInfo" class="info" title="元数据详情" @click.stop="$detail()" @mousedown.stop>
          <i class="iconfont fangdajing" />
        </li>
        <li v-if="__desContext__.hasDragDrop" ref="dragdrap" class="dragdrop" title="拖动" @click.stop @mousedown.stop>
          <i class="iconfont yidong" />
        </li>
        <li v-if="__desContext__.hasRemove" class="remove" title="移除" @click.stop="$remove()" @mousedown.stop>
          <i class="iconfont shanchu" />
        </li>
        <li v-if="__context__.props.isQuestionControl" class="setting" title="设置" @click.stop="$setting()" @mousedown.stop>
          <i class="iconfont shezhi" />
        </li>
      </ul>
      <div v-if="__context__.props.isFormControl" :title="__context__.props.caption" class="designer-code">{{ __context__.props.caption }}</div>
    </div>
  </div>
</template>
<script>
/* eslint-disable vue/prop-name-casing */
export default {
  name: 'DsfLayoutTree',
  inheritAttrs: false,
  provide () {
    return {
      $layoutParent: this
    }
  },
  inject: {
    layoutParent: {
      default: null
    }
  },
  props: {
    // 组件属性
    componentProps: {
      type: Object,
      default () {
        return null
      }
    },
    // 根组件
    rootProp: {
      type: Object,
      default () {
        return null
      }
    },
    // 父组件
    parentProp: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      $layoutContext: {
        props: null,
        root: null,
        parent: null,
        controls: {}
      },
      $designContext: {
        show: true,
        height: 'auto',
        width: 'auto',
        mask: false,
        hasInfo: false,
        hasDragDrop: true,
        hasRemove: true,
        selected: false
      },
      $events: {},
      $clientId: '',
      $scopeData: null,
      $isReload: false
    }
  },
  computed: {
    __context__ () {
      return this.$data.$layoutContext
    },
    __desContext__ () {
      return this.$data.$designContext
    },
    __hasDesign__ () {
      return this.$attrs['is-design']
    },
    __nodeSwitch__ () {
      let v = ''
      // let isFormControl = this.__context__.props.isFormControl;
      // let metadata_fullcode = this.__context__.props.metadata_fullcode;
      let isDesignProxy = this.__context__.props.designProxy
      if (isDesignProxy) {
        v = 'design-proxy'
      } else {
        v = 'design-no-proxy'
      }
      return v
    }
  },
  watch: {
    // 监听枚举类型的元数据中选项数据变化
    '__context__.props.metadata.dataSource': {
      handler (v) {
        if (this.__context__.props.metadata.ckey == 'items-meta-data') {
          // 枚举类型数据源请求
          setEnumItems.call(this, v)
        }
      }
    }
  },
  created () {
    this.__context__.props = this.componentProps
    if (this.__context__.props.view) {
      this.__context__.root = this
    } else {
      this.__context__.root = this.rootProp
    }
  },
  updated () {
    // if (this.$refs.ctrl) {
    // dsf.warn(this.__context__.props.ctrlName + "被更新")
    // }
  },
  mounted () {
    this.$refs.ctrl.$on('height.change', (evt) => {
      this.__desContext__.height = evt.args
    })
    // dsf.time(++count)
    designInit.call(this)
    let treeProxy = this.$refs.ctrl.$options.treeProxy
    if (treeProxy !== false) {
      createPropsProxy.call(this)
      createComputedProxy.call(this)
      createMethodsProxy.call(this)
    }
  },
  destroyed () {
    // console.log("销毁组件" + this.__context__.props.ctrlName)
    destroyPropsProxy.call(this)
    destroyComputedProxy.call(this)
    destroyMethodsProxy.call(this)
    this.__context__.props = null
  },
  methods: {
    $getComponetRenderType (type) {
      return this.__nodeSwitch__ === type && this.__context__.props
    },
    // 获取真实组件
    $$getComponent () {
      return this.$refs.ctrl
    },
    // 移除组件
    $remove () {
      // 移除组件
      let target = $(this.$el)
      let slotEl = $(target).closest('[slot-name]')
      let parent = dsf.designer.getParentControl(target)
      let slotName = slotEl.attr('slot-name')
      if (this.$$getComponent().isQuestionControl) {
        let nextEles = $(this.$$getComponent().$el).parent().nextAll().find('.ds-question-item'), nexts = []
        window._.forEach(nextEles, function (item) {
          nexts.push(item.__vue__)
        })
        this.rootProp.$parent.setNextQuestionIndex(this.$$getComponent().questionIndex, nexts)
      }
      if (parent) {
        parent = parent.get(0).__vue__
        // 此处需要有一个判断，组件的根元素直接是elementui的情况
        while (!parent.slots) {
          parent = parent.$parent
        }
        let slotIndex = _.findIndex(parent.slots, s => s.name == slotName)
        if (parent.slots[slotIndex]) {
          dsf.array.remove(parent.slots[slotIndex].controls, this.__context__.props)
        }
      }
    },
    // 设置组件
    $setting () {
      this.$bus.$emit(`questionSetting`)
    },
    $getRoot () {
      let root = this.rootProp
      if (!root && this.__context__.props.view) {
        root = this
      }
      return root
    },
    $detail () {
      const component = this.$$getComponent()
      const info = {
        caption: component.$options.ctrlCaption,
        id: component.metadata.id,
        name: component.metadata.name,
        typeText: component.metadata.type.text,
        typeValue: component.metadata.type.value
      }
      dsf.layer.openDialog({
        title: '信息',
        fullscreen: false,
        content: 'DsfComponentInfo',
        params: {
          info: info
        },
        width: '350px',
        height: '150px'
      })
    }
  }
}

// 枚举类型数据源请求
function setEnumItems (v) {
  if (v.type == 'static') {
    if (dsf.isDef(v.code)) {
      this.__context__.props.items = v.code
    }
  } else if (v.type == 'dict') {
    this.$http.get('/dict/getList/' + v.code)
      .done((result) => {
        this.__context__.props.items = result.data
      }).catch(() => { })
  } else if (v.type == 'db') {
    this.$http.get('/meta/tree/dbSource?rmId=' + v.code)
      .done((result) => {
        this.__context__.props.items = result.data
      }).catch(() => { })
  }
}

function designInit () {
  if (!this.$attrs['is-design']) {
    return
  }
  initDragDrop.call(this)
  // let config = this.__context__.props. || { markObserver: false, allowAddChild: false };
  this.__desContext__.mask = true
  this.__desContext__.hasInfo = false
  this.__desContext__.hasDragDrop = true
  this.__desContext__.hasRemove = true
  this.__desContext__.height = 'auto'
  let designOptions = dsf.getComponentDesignOptions(this.__context__.props.ctrlType)
  if (designOptions) {
    this.__desContext__.mask = designOptions.isMask
    this.__desContext__.hasInfo = designOptions.infoButton
    this.__desContext__.hasDragDrop = designOptions.dragButton
    this.__desContext__.hasRemove = designOptions.removeButton
    this.__desContext__.height = designOptions.fit ? '100%' : 'auto'
  }
}

function initDragDrop () {
  // 附加工具箱拖动
  if (this.$refs.dragdrap) {
    $(this.$refs.dragdrap).draggable({
      addClasses: false,
      appendTo: '.ds-designer',
      distance: 10,
      revert: 'invalid',
      cursor: 'default',
      containment: 'window',
      cursorAt: {
        left: -20,
        top: -20
      },
      helper: () => {
        let proxy = $("<div class='ds-tool-item proxy'>" + this.__context__.props.caption + '</div>')
        proxy.data('data', {
          state: 'move',
          attributes: this.__context__.props,
          component: this
        })
        return proxy
      },
      start: () => {
        this.__desContext__.show = false
      },
      stop: () => {
        this.__desContext__.show = true
      }
    })
  }
}

// 代理属性
function createPropsProxy () {
  // 代理组件属性
  let propsKey = Object.keys(this.$props)
  for (let k in this.__context__.props) {
    if (propsKey.indexOf(k) < 0) {
      Object.defineProperty(this, k, {
        configurable: true,
        set (v) {
          this.__context__.props[k] = v
        },
        get () {
          return this.__context__.props[k]
        }
      })
    } else {
      throw this.$refs.ctrl.ctrlName + '包含了与代理组件一样的属性"' + k + '"'
    }
  }
}
// 代理计算属性
function createComputedProxy () {
  // 代理计算属性
  if (this.$refs.ctrl && this.$refs.ctrl.$options.computed) {
    // 代理计算属性
    for (let k in this.$refs.ctrl.$options.computed) {
      Object.defineProperty(this, k, {
        configurable: true,
        set (v) {
          this.$refs.ctrl[k] = v
        },
        get () {
          return this.$refs.ctrl[k]
        }
      })
    }
  }
}
// 代理组件api
function createMethodsProxy () {
  // 代理方法
  if (this.$refs.ctrl && this.$refs.ctrl.$options.methods) {
    for (let k in this.$refs.ctrl.$options.methods) {
      this[k] = this.$refs.ctrl[k].bind(this.$refs.ctrl)
    }
  }
}

function destroyPropsProxy () {
  // 代理组件属性
  let propsKey = Object.keys(this.$props)
  for (let k in this.__context__.props) {
    if (propsKey.indexOf(k) < 0) {
      delete this[k]
    }
  }
}

function destroyComputedProxy () {
  // 代理计算属性
  if (this.$refs.ctrl && this.$refs.ctrl.$options.computed) {
    // 代理计算属性
    for (let k in this.$refs.ctrl.$options.computed) {
      delete this[k]
    }
  }
}

function destroyMethodsProxy () {
  if (this.$refs.ctrl && this.$refs.ctrl.$options.methods) {
    for (let k in this.$refs.ctrl.$options.methods) {
      this[k] = null
      delete this[k]
    }
  }
}

// 是否是表格结构的数据
function isChildScope (scope) {
  if (dsf.isDef(scope.row) || dsf.isDef(scope.$index) || dsf.isDef(scope.column)) {
    return true
  }
  return false
}

</script>
