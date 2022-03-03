/* eslint-disable no-unused-vars */

let dbKeyWords = {
  'TRIGGER': 1,
  'WHERE': 1,
  'REVOKE': 1,
  'THEN': 1,
  'CONNECT': 1,
  'GRANT': 1,
  'HAVING': 1,
  'NULL': 1,
  'ALL': 1,
  'INDEX': 1,
  'SMALLINT': 1,
  'RENAME': 1,
  'EXCLUSIVE': 1,
  'BETWEEN': 1,
  'SHARE': 1,
  'MODE': 1,
  'UNION': 1,
  'SET': 1,
  'START': 1,
  'VALUES': 1,
  'VIEW': 1,
  'WITH': 1,
  'CHAR': 1,
  'FROM': 1,
  'SELECT': 1,
  'BY': 1,
  'OR': 1,
  'ELSE': 1,
  'CHECK': 1,
  'VARCHAR2': 1,
  'CREATE': 1,
  'AS': 1,
  'TABLE': 1,
  'LONG': 1,
  'ASC': 1,
  'DESC': 1,
  'CLUSTER': 1,
  'FLOAT': 1,
  'NOT': 1,
  'DELETE': 1,
  'ALTER': 1,
  'IDENTIFIED': 1,
  'INTEGER': 1,
  'SIZE': 1,
  'NOWAIT': 1,
  'ANY': 1,
  'FOR': 1,
  'INTERSECT': 1,
  'SYNONYM': 1,
  'PCTFREE': 1,
  'UPDATE': 1,
  'DEFAULT': 1,
  'UNIQUE': 1,
  'PRIOR': 1,
  'RESOURCE': 1,
  'DATE': 1,
  'RAW': 1,
  'OPTION': 1,
  'OF': 1,
  'DECIMAL': 1,
  'PUBLIC': 1,
  'TO': 1,
  'INSERT': 1,
  'DROP': 1,
  'COMPRESS': 1,
  'LIKE': 1,
  'NOCOMPRESS': 1,
  'IS': 1,
  'ON': 1,
  'EXISTS': 1,
  'DISTINCT': 1,
  'LOCK': 1,
  'AND': 1,
  'GROUP': 1,
  'VARCHAR': 1,
  'IN': 1,
  'INTO': 1,
  'NUMBER': 1,
  'ORDER': 1,
  'MINUS': 1
}

function getParentControl (el) {
  let target = $(el)
  let slotEl = $(target).closest('[slot-name]')
  let container = null

  let mark = false
  // 判断插槽元素是否本身就是一个组件且不是一个被镶嵌在其他组件内部
  if (slotEl.hasClass('ds-control')) {
    let vueComponent = slotEl.get(0).__vue__
    if (vueComponent && vueComponent.$props.designOnlySlot) {
      mark = true
    }
  }
  // 插糟是个普通的html元素
  else {
    mark = true
  }
  if (mark) {
    container = slotEl.parents('.ds-control')
  } else {
    container = slotEl
  }
  return container
}

function getComponent (comp, maxComponent) {
  let vueComponent = comp
  if (vueComponent) {
    // 如果组件不是按我们系统规范创建的组件则则继续向上查找
    while (!vueComponent.$props.ctrlName) {
      vueComponent = vueComponent.$parent
      if (vueComponent.$el == maxComponent.$el) {
        vueComponent = null
        break
      }
    }
  }
  return vueComponent
}

function createComponent (name, attrs) {
  let comp = dsf.createComponent(name, attrs)
  if (!comp.designId) {
    comp.designId = dsf.uuid()
  }
  return comp
}

function createMobileComponent (name, attrs) {
  let arr = name.split('.')
  // let key = "mobile-";
  if (arr[1] != 'mobile') {
    arr.splice(1, 0, 'mobile')
    name = arr.join('.')
  }
  // if (attrs.ctrlType) {
  //   if (attrs.ctrlType.indexOf(key) != 0) {
  //     attrs.ctrlType = key + attrs.ctrlType;
  //   }
  // }
  let comp = dsf.createComponent(name, attrs)
  if (!comp.designId) {
    comp.designId = dsf.uuid()
  }
  return comp
}

// 获取触发事件的组件
function getComponentByTarget (target) {
  target = $(target)
  target = target.closest('.designer-ctrl-proxy')
  let component = target.get(0).__vue__
  if (component) {
    component = component.$$getComponent ? component.$$getComponent() : component
    return component
  }
  return null
}

// 是否允许拖放
function isAllowDrop (target, maxComponent) {
  let curr = null,
    count = 0,
    allow = true
  if (!target) {
    return false
  }
  if (target.jquery) {
    curr = target.length > 0 ? target.get(0) : null
  } else {
    curr = target
  }
  if (!curr) {
    return false
  }
  do {
    if (curr == maxComponent.$el) {
      break
    }
    if (curr.__vue__) {
      let vueComponent = getComponent(curr.__vue__, maxComponent)
      if (vueComponent && !vueComponent.$props.isDesign) {
        allow = false
        break
      } else {
        break
      }
    } else {
      curr = curr.parentNode
    }
    count++
  } while (count < 100)
  return allow
}

// 将组件转化为json
function controlToJson (ctrl) {
  return JSON.stringify(ctrl)
}

// 向下传播设计器事件
function broadcast (sourceComponent, eventName, evt, params, excludeComponent) {
  sourceComponent.$children.forEach(child => {
    if (child.$options.design && child.$options.design[eventName]) {
      if (excludeComponent != child) {
        child.$options.design[eventName].call(child, evt, params)
      }
    }
    broadcast(child, eventName, evt, params, excludeComponent)
  })
}

// 保存布局是被排除的属性
let layoutExclude = ['layoutRoot', 'layoutParent', 'isDesign', '$vm', '$local']

function getLayoutInfo (page, isPreView) {
  let arrs = [],
    root = null
  recursionLayoutTree(page, null, null, (component, parent, slotName) => {
    let parentProps = arrs[arrs.length - 1]
    let designOptions = component.$options ? component.$options.design : null
    if (designOptions) {
      let layoutNode = designOptions.layout || {}
      layoutNode.before && layoutNode.before.call(component)
    }
    let props = dsf.mix(true, {}, component.$props)
    if (component.$attrs['slot-name']) {
      props['slot-name'] = component.$attrs['slot-name']
    }
    let excludeProps = [...layoutExclude]
    if (component.$options && component.$options.design) {
      let layout = component.$options.design.layout
      if (layout) {
        let exclude = layout.exclude || []
        excludeProps = excludeProps.concat(exclude)
      }
    }
    if (component.isFormControl) {
      if (component.$parent.$parent && component.$parent.$parent.span) {
        // 查找组件父亲，如果在dsfcol组件内则记录下组件占多少栅格，改属性可用于自动布局
        props.colSpan = component.$parent.$parent.span || 24
      } else {
        props.colSpan = 24
      }
    }
    _.each(excludeProps, exc => {
      if (isPreView) {
        if (!exc.startsWith('#')) {
          delete props[exc]
        }
      } else {
        delete props[exc]
      }
    })

    arrs.push(props)
    if (!parentProps) {
      root = props
    }
    let slots = props.slots
    _.each(slots, slot => {
      slot.controls = []
    })
    if (parentProps) {
      let slot = _.find(parentProps.slots, s => s.name == slotName)
      if (slot) {
        slot.controls.push(props)
      }
    }
  }, () => {
    arrs.pop()
  })
  return root
}

// 递归组件
function recursionLayoutTree (component, parent, slotName, callback, callbackAfter) {
  if (component) {
    while (!component.$$getComponent) {
      component = component.$parent
    }
    if (!component) {
      return
    }
    component = component.$$getComponent()
    let isContinue
    if (callback) {
      isContinue = callback(component, parent, slotName)
    }
    if (isContinue !== false) {
      let designMethods = component.$options.design
      let layoutNode = designMethods.layout
      let isdeep = dsf.isFunction(layoutNode.isDeep) ? layoutNode.isDeep.call(component) : layoutNode.isDeep
      if (isdeep !== false) {
        _.each(component.slots || [], slot => {
          _.each(slot.controls || [], control => {
            let desid = control.designId
            let target = $("[des-id='" + desid + "']")
            if (target.length) {
              let child = target.get(0).__vue__
              recursionLayoutTree(child, component, slot.name, callback, callbackAfter)
            }
          })
        })
      }
    }
    callbackAfter && callbackAfter(component, parent, slotName)
  }
}

// 保存布局时验证
function saveLayoutValidate (page) {
  let errors = []
  recursionLayoutTree(page, null, null, (el, parent, slotName) => {
    if (el.isFormControl) {
      // 验证表单组件的标识不能等于自己组件的名字开头，避免提交时数据库生成无意义的字段和表
      _.each(validateCaption(el), (error) => {
        errors.push(error)
      })
    }
  })
  if (errors.length) {
    dsf.layer.pc.message(errors[0], false)
    return false
  }
}

function validateCaption (el) {
  let errors = []
  let name = el.$props.ctrlType.split('.')[1]
  if (el.$props.caption.startsWith(name)) {
    errors.push(el.$props.caption + '组件标识是无意义的，请修改')
  }
  if (dbKeyWords[el.$props.caption.toUpperCase()] === 1) {
    errors.push(el.$props.caption + '为特殊关键字不可使用')
  }
  return errors
}

// 获取extjs路径
function getExtPath (b, m, pn, isMobile, isTpl) {
  let tplOrViews = isTpl ? 'tpl' : 'views'
  let folder = [b, m].join('.')
  let clientDirs = isMobile ? dsf.url.getWebPath('~/mobile/' + tplOrViews) : dsf.url.getWebPath('~/pc/' + tplOrViews)
  let extPath = `${clientDirs}/${folder}/${pn}.ext.js?t=${new Date().getTime()}`
  return extPath
}

// 获取layout文件路径
function getLayoutPath (b, m, pn, isMobile, isTpl) {
  let tplOrViews = isTpl ? 'temp' : 'views'
  let folder = [b, m].join('.')
  let clientDirs = isMobile ? dsf.url.getWebPath('~/mobile/' + tplOrViews) : dsf.url.getWebPath('~/pc/' + tplOrViews)
  let htmlPath = `${clientDirs}/${folder}/${pn}.layout.html?t=${new Date().getTime()}`
  return htmlPath
}

// 创建页面元数据
function createViewMetaData (page) {
  let md = {
    accessRole: [],
    isForm: page.pageType == 'form',
    pageState: page.pageType,
    xssConfig: page.xssConfig,
    init: { privilege: [] },
    query: {},
    browseScope: {},
    metadata: {},
    isMobile: false
  }
  let result = createComponentMetaData(page, page)
  _.each(result, item => {
    if (item.schema) {
      let scheam = item.schema
      let list = dsf.type(scheam) != 'array' ? [scheam] : scheam
      _.each(list, el => {
        if (el.metadata) {
          md.metadata[el.key] = el.metadata
        }
        if (el.query) {
          md.query = el.query
        }
        if (el.browseScope) {
          md.browseScope = el.browseScope
        }
      })
    }
  })
  return md
}

// 创建组建元数据
function createComponentMetaData (component, root) {
  let arr = []
  recursionLayoutTree(component, null, null, el => {
    let designOptions = el.$options.design || {}
    let metadataNode = designOptions.metadata || {}
    let result = metadataNode.create && metadataNode.create.call(el, root)
    result && arr.push({
      component: el,
      schema: result
    })
    let isDeep = dsf.isDef(metadataNode.isDeep) ? metadataNode.isDeep : true
    if (!isDeep) {
      return false
    }
  })
  let ns_arr = [root.context.B, root.context.M]
  let key = ns_arr.join('_').replace(/\./g, '_')
  for (let i = 0; i < arr.length; i++) {
    let com = arr[i].component
    let result = arr[i].schema
    // 如果当前组件是子表
    if (com.isOneToMany) {
      let subMetaDataKey = ''
      // 先查看子表内部是否存在不同的元数据
      let existFormMeta = []
      _.each(result, (el) => {
        if (el.metadata) {
          if (el.metadata.isFromMetaData) {
            existFormMeta.push(el.metadata)
          }
        }
      })
      // 循环子表生成的元数据结构（类型为数组，包含子表中的子组件。且子表本身元数据对象排在数组第一个）
      _.each(result, (el, i) => {
        let ctrl = el.self
        let currMetaDataKey = ''
        if (i == 0) {
          if (existFormMeta.length > 0) {
            let code_arr = existFormMeta[0].at.split('.')
            el.metadata.code = code_arr[code_arr.length - 1]
            el.metadata.id = code_arr.join('.')
            el.metadata.at = code_arr.join('.')
            el.metadata.name = ''
            ctrl.metadata_fullcode = code_arr.join('_')
            el.metadata.pinyin = ctrl.pinyin === true
            currMetaDataKey = subMetaDataKey = code_arr.join('_')
          } else {
            el.metadata.code = ctrl.caption
            el.metadata.id = ns_arr.join('.') + '.' + ctrl.caption
            el.metadata.at = ns_arr.join('.')
            el.metadata.name = ctrl.metadata.name || ctrl.label
            ctrl.metadata_fullcode = key + '_' + ctrl.caption
            el.metadata.pinyin = ctrl.pinyin === true
            currMetaDataKey = subMetaDataKey = key + '_' + ctrl.caption
          }
        } else {
          if (el.metadata) {
            if (!el.metadata.isFromMetaData) {
              el.metadata.code = ctrl.caption
              el.metadata.id = subMetaDataKey.replace(/\_/g, '.') + '.' + ctrl.caption
              el.metadata.at = subMetaDataKey.replace(/\_/g, '.')
              el.metadata.name = ctrl.metadata.name || ctrl.label
              ctrl.metadata_fullcode = subMetaDataKey + '.' + ctrl.caption
              currMetaDataKey = subMetaDataKey + '.' + ctrl.caption
            } else {
              let code_arr = el.metadata.id.split('.')
              let fullCode = code_arr.slice(0, code_arr.length - 1).join('_') + '.' + code_arr[code_arr.length - 1]
              ctrl.metadata_fullcode = fullCode
              currMetaDataKey = fullCode
            }
          }
        }
        el.metadata.level = 1
        el.key = currMetaDataKey
      })
    } else {
      result = dsf.type(result) == 'array' ? result : [result]
      _.each(result, (el) => {
        let ctrl = el.self
        if (el.metadata) {
          if (el.metadata.ckey == 'nav-tree-meta-data') {
            let caption = ctrl.caption
            el.metadata.code = caption
            el.metadata.name = ctrl.metadata.name || ctrl.label
            el.metadata.level = 0

            if (ctrl.async && ctrl.asyncDataSource * 1 == 2 && ctrl.asyncChooseMetaData.code && ctrl.asyncChooseMetaData.code.id) {
              el.metadata.id = ctrl.asyncChooseMetaData.code.at + '.' + caption
              el.metadata.at = ctrl.asyncChooseMetaData.code.at
              key = ctrl.asyncChooseMetaData.code.at.split('.').join('_')
            } else {
              let _k = key
              el.metadata.id = _k.replace(/\_/g, '.') + '.' + caption
              el.metadata.at = _k.replace(/\_/g, '.')
            }

            key += '.' + caption
            ctrl.metadata_fullcode = key
            el.key = key
          } else if (!el.metadata.isFromMetaData) {
            el.metadata.code = ctrl.caption
            el.metadata.id = ns_arr.join('.') + '.' + ctrl.caption
            el.metadata.at = ns_arr.join('.')
            el.metadata.name = ctrl.metadata.name || ctrl.label
            el.metadata.level = 0
            ctrl.metadata_fullcode = key + '.' + ctrl.caption
            el.key = key + '.' + ctrl.caption
            el.metadata.pinyin = ctrl.pinyin === true
          } else {
            let code_arr = el.metadata.id.split('.')
            let fullCode = code_arr.slice(0, code_arr.length - 1).join('_') + '.' + code_arr[code_arr.length - 1]
            ctrl.metadata_fullcode = fullCode
            el.key = fullCode
            el.metadata.pinyin = ctrl.pinyin === true
          }
        }
      })
    }
  }
  return arr
}
// let innerControls = ['DsfCol', 'DsfTableRow', 'DsfTableCell'];

// 转化vue模板
function convertTemplateAndControlData (layout, isPreView) {
  layout = dsf.mix(true, {}, layout)

  /**
   * node：当前布局组建的props
   * parent：夫组件的props
   * slot：当前组件所在的插槽信息
   * isRepeat：是否在一个表格循环内
   * prefix：循环表格组件的caption前缀（暂时无用）
   * simple：遇到表单组件时是否显示一个<span>代理组件的输出（数据列表中使用，避免列表加载数据时每行都要实例化组件）
   */
  function createElement (node, parent, slot, slotScope, scopeDataKey, isRepeat, prefix, simple) {
    let arr = [],
      props = {}
    let isFormControl = node.isFormControl
    let metadataFullCode = node.metadata_fullcode
    let modelExpress = '$viewData'
    if (isRepeat) {
      let s = []
      if (slotScope) {
        s.push(slotScope)
      }
      if (scopeDataKey) {
        s.push(scopeDataKey)
      }
      if (s.length) {
        modelExpress = s.join('.')
      }
    }
    // let modelExpress = (isRepeat) ? (slotScope ? slotScope + (scopeDataKey ? "." + scopeDataKey : "") : "") : "$viewData"
    let attachAttrs = {}
    if (isFormControl && metadataFullCode) {
      attachAttrs['v-model'] = modelExpress + "['" + metadataFullCode + "']"
      // 如果是枚举型组件增加items属性的绑定
      if (node.metadata.ckey == 'items-meta-data' && !isPreView) {
        attachAttrs[':items'] = "$enum['" + metadataFullCode + "']"
      }
    }
    if (node.treeProxy) {
      _.each(node.slots, (s, i) => {
        if (s.controls.length > 0) {
          _.each(s.controls, (c, ii) => {
            let child = createElement(c, parent, { slotName: s.name, slotIndex: i, $index: ii }, slotScope, scopeDataKey, isRepeat, prefix, simple)
            arr.push(...child.tpl)
            dsf.mix(props, child.props)
          })
        }
      })
    }
    // 特殊判断HTML组件，将html组建内容直接显示到模板
    else if (node.ctrlName == 'DsfHtml' && !isPreView) {
      if (node.html) {
        arr.push(dsf.unescapeHTML(node.html))
      }
    } else {
      let ref = ''
      if (!isRepeat) {
        attachAttrs['v-bind.sync'] = "$controls['" + node.designId + "']"
        if (node.caption) {
          ref = "'" + node.caption + "'"
        }
        attachAttrs[':$local'] = modelExpress
      } else {
        attachAttrs['v-bind'] = "updateControlPropsInTemplate('" + node.designId + "',scope)"
        // if (node.caption) {

        //   ref = "'" + $templateInControlInstance.caption + "-" + node.caption + "-'+scope.$index";
        // }
        attachAttrs[':$local'] = modelExpress
        // attachAttrs[":inSubTemplate"] = "true";
      }

      attachAttrs[':key'] = "'" + node.designId + "'"

      if (ref) {
        attachAttrs[':ref'] = ref
        attachAttrs[':ctrl-id'] = ref
      }
      if (node.view) {
        attachAttrs['v-if'] = 'isLoaded'
      }
      let attrMap = getVuePropsAndEventMap(attachAttrs)
      let customAttrs = !isPreView ? getVuePropsAndEventMap(node.development['attrs'] || {}) : {}
      let mergeAttrs = { ...attrMap, ...customAttrs }
      let attrsArr = _.map(mergeAttrs, (attr) => {
        let name = attr.prefix + attr.propName + attr.modifier
        return name + '=' + attr.value
      })
      // 注入自定义事件
      // let eventMap = !isPreView ? getVuePropsAndEventMap(node.development['events']) : {};
      // let eventArr = _.map(eventMap, (attr) => {
      //   let name = (attr.prefix || "@") + attr.propName + attr.modifier;
      //   return name + "=" + attr.value;
      // });

      let textProxy = node.isFormControl && simple
      if (textProxy) {
        arr.push(`<template v-if="!${modelExpress + '.$editing'}">`)
        // arr.push(`<DsfTextFunctional :text="${modelExpress+ "['" + metadataFullCode + "']"}${(node.formatter?"|proxy('"+node.formatter+"')":"")}"></DsfTextFunctional>`)
        arr.push(`<span :title="${modelExpress + "['" + metadataFullCode + "']"}${(node.formatter ? "|proxy('" + node.formatter + "')" : '')}">{{${modelExpress + "['" + metadataFullCode + "']"}${(node.formatter ? "|proxy('" + node.formatter + "')" : '')}}}</span>`)
        arr.push('</template>')
        arr.push('<template v-else>')
      }
      arr.push('<' + node.ctrlName + ' ' + attrsArr.join(' ') + '>')
      _.each(node.slots, (s, i) => {
        if (s.controls.length > 0) {
          let templateMark = true
          if (s.name == 'default' && !s.scope) {
            templateMark = false
          }
          if (templateMark) {
            arr.push('<template v-slot:' + s.name + (s.scope ? '=' + JSON.stringify(s.scope) : '') + '>')
          }
          let repeat = s.repeat === true
          let prefix = s.repeat === true ? node.caption : ''
          let dataKey = s.dataKey
          let scopeName = s.scope
          let textProxy = s.textProxy
          _.each(s.controls, (c, ii) => {
            let child = createElement(c, node, { slotName: s.name, slotIndex: i, $index: ii }, scopeName, dataKey, repeat, prefix, textProxy)
            arr.push(...child.tpl)
            dsf.mix(props, child.props)
          })
          if (templateMark) {
            arr.push('</template>')
          }
        }
      })
      arr.push('</' + node.ctrlName + '>')
      if (textProxy) {
        arr.push('</template>')
      }
      props[node.designId] = node
    }
    return {
      props: props,
      tpl: arr
    }
  }
  let result = createElement(layout, null)
  return {
    props: result.props,
    tpl: result.tpl.join('\n')
  }
}

function getVuePropsAndEventMap (props) {
  let attrMap = {}
  _.each(props, (s, i) => {
    // let attr = attachAttrs[i];
    var propExpressArray = i.split('.')
    let rexpVueProp = /(:|v-bind:?|v-on:?|@)?([^\.:]*)(\..+)?/g
    let propName = '',
      prefix = '',
      modifier = ''
    let group = rexpVueProp.exec(i)
    if (group && group.length > 1) {
      propName = group[2]
      prefix = group[1]
      modifier = group[3]
    }
    if (dsf.type(s) != 'string' && (propExpressArray[0].startsWith(':') || propExpressArray[0].startsWith('v-bind:'))) {
      s = '' + s
    }
    let attr = {
      propName: (propName || ''),
      prefix: (prefix || ''),
      modifier: (modifier || ''),
      value: JSON.stringify(s)
    }
    attrMap[propName || prefix] = attr
  })
  return attrMap
}

// 编译scss
function compileCss (scssStr, nameSpace) {
  return new Promise((resolve, reject) => {
    var sass = new Sass()
    var scss = [
      '.ds-page' + (nameSpace ? '[module-name="' + nameSpace + '"]' : '') + '{',
      scssStr,
      '}'
    ]
    var files = dsf.config.designer.scss || []
    sass.preloadFiles(dsf.config.designer.scssDir + 'pc/scss', '', files, () => {
      let scssFiles = _.map(files, (file) => `@import "${file}";`)
      scss = [...scssFiles, ...scss]
      sass.compile(scss.join('\n'), function (result) {
        if (result.status == 0) {
          let cssStr = dsf.beautify.css(result.text, {
            indent_size: '2',
            indent_char: ' '
          })
          resolve(cssStr)
        } else {
          let errorMsg = '编译错误:' + result.message
          dsf.error(errorMsg)
          reject(errorMsg)
        }
      })
    })
  })
}

// function closestPage(this){

// }

var skipMap = {
  'Math': 1,
  'Date': 1,
  'Number': 1,
  'String': 1,
  'Boolean': 1,
  'Object': 1,
  '$event': 1,
  'window': 1,
  '__vmodel__': 1,
  '__local__': 1,
  'scope': 1,
  '_self': 1,
  'JSON': 1,
  'this': 1,
  'true': 1,
  'false': 1,
  'dsf': 1
}
let stringNum = 0
let stringPool = {
  map: {}
}
let rlocalVar = /[$a-zA-Z_][$a-zA-Z0-9_]*\(?/g
var rvmKey = /(^|[^\w\u00c0-\uFFFF_])(@|##)(?=[$\w])/g
var robjectProp = /\.[\w\.\$]+/g // 对象的属性 el.xxx 中的xxx
var rregexp = /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/g
var rshortCircuit = /\|\|/g
var ruselessSp = /\s*(\.|\|)\s*/g
var rpipeline = /\|(?=\?\?)/
var rfill = /\?\?\d+/g
var rfilterName = /\|(\w+)/g
var robjectKey = /(\{|\,)\s*([\$\w]+)\s*:/g // 对象的键名与冒号 {xxx:1,yyy: 2}中的xxx, yyy

function addScope (expr) {
  stringPool.map = {}
  var input = expr.replace(rregexp, function (a, b) {
    return b + dig(a.slice(b.length))
  }) // 移除所有正则
  input = clearString(input) // 移除所有字符串

  input = input.replace(rshortCircuit, dig) // 移除所有短路运算符
    .replace(ruselessSp, '$1') // 移除.|两端空白
    .replace(robjectKey, function (_, a, b) {
      // 移除所有键名
      return a + dig(b) + ':' // 比如 ms-widget="[{is:'ms-address-wrap', $id:'address'}]"这样极端的情况
    })
    .replace(rvmKey, '$1__vmodel__.') // 转换@与##为__vmodel__.
    .replace(rfilterName, function (a, b) {
      // 移除所有过滤器的名字
      return '|' + dig(b)
    })

  input = addScopeForLocal(input) // 在本地变量前添加__vmodel__
  var filters = input.split(rpipeline) // 根据管道符切割表达式
  var body = filters.shift().replace(rfill, fill).trim()
  if (/\?\?\d/.test(body)) {
    body = body.replace(rfill, fill)
  }
  return body
}

function addScopeForLocal (str) {
  let props = str.replace(robjectProp, dig)
  let result = props.replace(rlocalVar, function (el /*, a, c, d */) {
    if (!skipMap[el]) {
      let isFunction = false
      if (el.endsWith('(')) {
        isFunction = true
      }
      if (isFunction) {
        let fnName = el.replace('(', '')
        return "$proxyFn('" + fnName + "',"
      }
    }
    return el
  })
  return result
}

function dig (a) {
  var key = '??' + stringNum++
  stringPool.map[key] = a
  return key + ' '
}

function fill (a) {
  var val = stringPool.map[a]
  return val
}

function clearString (str) {
  var array = readString(str)
  for (var i = 0, n = array.length; i < n; i++) {
    str = str.replace(array[i], dig)
  }
  return str
}

function readString (str, i, ret) {
  var end = false,
    s = 0,
    i = i || 0
  ret = ret || []
  for (var n = str.length; i < n; i++) {
    var c = str.charAt(i)
    if (!end) {
      if (c === "'") {
        end = "'"
        s = i
      } else if (c === '"') {
        end = '"'
        s = i
      }
    } else {
      if (c === end) {
        ret.push(str.slice(s, i + 1))
        end = false
      }
    }
  }
  if (end !== false) {
    return readString(str, s + 1, ret)
  }
  return ret
}

export default {
  getParentControl,
  // getBuildSlotTemplate,
  isAllowDrop,
  controlToJson,
  broadcast,
  getLayoutInfo,
  getComponent,
  recursionLayoutTree,
  createViewMetaData,
  createComponentMetaData,
  getComponentByTarget,
  createComponent,
  createMobileComponent,
  convertTemplateAndControlData,
  saveLayoutValidate,
  compileCss,
  validateCaption,
  getExtPath,
  getLayoutPath
}
