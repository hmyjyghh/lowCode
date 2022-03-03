/* eslint-disable no-unused-vars */
import utils from './utils'
// import keys from './keys';

let pascalCaseRE = /^[A-Z][^\-]*$/g

let __ctrls__ = {}
let __designOptions__ = {}
let __options__ = {}
// let __temp__ = {};
let hasSymbol = typeof Symbol !== 'undefined' && utils.isNative(Symbol) && typeof Reflect !== 'undefined' && utils.isNative(Reflect.ownKeys)
let componentNameRE = /^(Dsf)(Mobile)?(\w+)/g

// 注册组件
function component (options) {
  if (!options.name) {
    throw '组件缺少name属性'
  }
  if (!options.name.startsWith('Dsf') && !options.name.startsWith('DSFMobile')) {
    throw '组件' + options.name + '的name属性PC端组件必须以Dsf开头，移动端组件必须以DsfMobile开发头'
  }
  if (!options.ctrlCaption) {
    throw options.name + '组件缺少ctrlCaption属性'
  }
  componentNameRE.lastIndex = 0
  let code = componentNameRE.exec(options.name)
  let arr = []
  if (code && code.length > 0) {
    for (let i = 1; i < code.length; i++) {
      if (code[i]) {
        arr.push(code[i].toLowerCase())
      }
    }
  }
  if (dsf.isUnDef(options.props)) {
    options.props = {}
  }
  let dsfCode = arr.join('.')
  options.props['ctrlType'] = {
    type: String,
    default: dsfCode
  }
  let ctrlType = options.ctrlType = dsfCode

  if (!__ctrls__[ctrlType]) {
    pascalCaseRE.lastIndex = 0
    if (!pascalCaseRE.test(options.name)) {
      throw options.name + '组件name属性请使用PascalCase方式命名'
    }
    if (!options.props) {
      options.props = {}
    }
    if (!dsf.hasOwn(options.props, 'ctrlName')) {
      options.props['ctrlName'] = {
        type: String,
        default: options.name
      }
    }
    if (!dsf.hasOwn(options.props, 'ctrlType')) {
      componentNameRE.lastIndex = 0
      let code = componentNameRE.exec(options.name)
      let arr = []
      if (code && code.length > 0) {
        for (let i = 1; i < code.length; i++) {
          if (code[i]) {
            arr.push(code[i].toLowerCase())
          }
        }
      }
      let dsfCode = arr.join('.')
      options.props['ctrlType'] = {
        type: String,
        default: dsfCode
      }
      options.ctrlType = dsfCode
    }

    let ctrlType = options.ctrlType.toLowerCase()

    let mixins = $getMinixsAndExtends(options, true, ['props', 'design'])
    // 将attributes数据提出取出来，存放到全局对象中
    let ctrlAttrs = $minixAttributes(options, mixins['props'])
    options.design = $mergeData(options.design || {}, mixins['design'])
    __ctrls__[ctrlType] = ctrlAttrs
    __designOptions__[ctrlType] = options.design
    __options__[ctrlType] = options
    return options
  } else {
    return __ctrls__[ctrlType]
  }
}

// 创建一个组件对象
function createComponent (key, attributes) {
  if (dsf.type(key) == 'string') {
    if (__ctrls__[key]) {
      let attrs = dsf.mix(true, {}, __ctrls__[key], attributes || {})
      if (!attrs.designId) {
        attrs.designId = dsf.uuid()
      }
      return attrs
    }
  } else if (dsf.type(key) == 'object') {
    if (!__ctrls__[key.ctrlType]) {
      component(key)
    }
    return createComponent(key.ctrlType, attributes)
  }
}

function getComponentOptions (key) {
  if (__options__[key]) {
    return __options__[key]
  }
}

// 获取组件design节点配置信息
function getComponentDesignOptions (key) {
  return __designOptions__[key]
}

// 补全加载布局时候组件属性
function fillComponentDefaultProps (props, callback) {
  if (props) {
    let c = dsf.createComponent(props.ctrlType)
    dsf.mix(props, dsf.mix(c, props))
    callback && callback(c)
    if (props.slots) {
      _.each(props.slots, slot => {
        let controls = slot.controls
        _.each(controls, ctrlProps => {
          fillComponentDefaultProps(ctrlProps, callback)
        })
      })
    }
  }
  return props
}

// 递归组件及子组件
function recursionComponentProps (props, callback) {
  if (props) {
    callback && callback(props)
    if (props.slots) {
      _.each(props.slots, slot => {
        let controls = slot.controls
        _.each(controls, ctrlProps => {
          recursionComponentProps(ctrlProps, callback)
        })
      })
    }
  }
}

function resizeDetector () {
  window.removeEventListener('resize', $resizeComponent)
  window.addEventListener('resize', $resizeComponent)
}

function $resizeComponent (event, pageComponent) {
  let page = pageComponent
  if (!page) {
    page = document.querySelectorAll('.ds-page')
  } else {
    page = [page]
  }
  _.each(page, (el) => {
    let component = el._isVue ? el : el.__vue__
    $resize(component)
  })
}

function $resize (component) {
  if (component.ctrlType && component.resize && !component.$$getComponent) {
    component.resize()
  }
  if (component.$children) {
    _.each(component.$children, (children) => {
      $resize(children)
    })
  }
}

// 获取混入信息
function $getMinixsAndExtends (options, isRoot, nodes) {
  let result = {},
    instance = {}
  let arr = []
  let extend = options.extends
  let mixins = options.mixins || []
  if (dsf.isDef(extend)) {
    arr = arr.push(extend)
  }
  if (mixins && mixins.length) {
    arr = arr.concat(mixins)
  }
  if (isRoot === false) {
    for (let k in nodes) {
      if (options[nodes[k]]) {
        result[nodes[k]] = dsf.mix({}, options[nodes[k]])
      }
    }
  }

  if (arr && arr.length) {
    for (let i = 0; i < arr.length; i++) {
      let from = $getMinixsAndExtends(arr[i], false, nodes)
      result = $mergeData(result, from)
    }
  }
  instance = $mergeData(instance, result)
  return instance
}

// 获取组件attributes函数中的对象
function $getAttributes (options, props) {
  let attributes = {},
    mixinsAttributes = {},
    instance = {}
  for (let k in options.props) {
    let attrVal
    if (dsf.isDef(options.props[k].default)) {
      let defaultVal
      let propDefault = options.props[k].default
      defaultVal = dsf.isFunction(propDefault) ? propDefault() : propDefault
      attrVal = defaultVal
    }
    attributes[k] = attrVal
  }
  for (let k in props) {
    let attrVal
    if (dsf.isDef(props[k].default)) {
      let defaultVal
      let propDefault = props[k].default
      defaultVal = dsf.isFunction(propDefault) ? propDefault() : propDefault
      attrVal = defaultVal
    }
    mixinsAttributes[k] = attrVal
  }
  $mergeData(attributes, mixinsAttributes)
  instance = $mergeData(instance, attributes)
  return instance
}

// 合并组件属性
function $mergeData (to, from) {
  if (!from) {
    return to
  }
  var key, toVal, fromVal
  var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from)

  for (var i = 0; i < keys.length; i++) {
    key = keys[i]
    toVal = to[key]
    fromVal = from[key]
    if (!dsf.hasOwn(to, key)) {
      to[key] = fromVal
    } else if (toVal !== fromVal && dsf.isPlainObject(toVal) && dsf.isPlainObject(fromVal)) {
      $mergeData(toVal, fromVal)
    }
  }
  return to
}

// 混入attributes
function $minixAttributes (options, mixinsProps) {
  // let key = dsf.kebabCase(options.name, "-");
  let ctrlAttrs = $getAttributes(options, mixinsProps)
  ctrlAttrs.ctrlName = options.name
  ctrlAttrs.ctrlType = options.ctrlType
  // 如果组件存在元数据
  if (ctrlAttrs.metadata) {
    let arr = options.ctrlType.split(/\.|-/g)
    ctrlAttrs.metadata.currentControl = { text: options.ctrlCaption, value: arr[arr.length - 1] }
    ctrlAttrs.metadata.controls = [ctrlAttrs.metadata.currentControl]
  }
  return ctrlAttrs
}

// //1.0映射与2.0的映射补丁
// let versionMap={
//   'dsf.textbox':'textbox',
//   'dsf.radiobox':'radiobox',
//   'dsf.checkbox':'checkbox'
// }

export default {
  component,
  createComponent,
  fillComponentDefaultProps,
  recursionComponentProps,
  getComponentDesignOptions,
  resizeDetector,
  resizeComponent: (page) => {
    $resizeComponent(null, page)
  },
  getComponentOptions
  // getComponentMetadataCreateFn
}
