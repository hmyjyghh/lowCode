<template>
  <div ref="designerPanel" class="ds-designer">
    <div class="designer-head">
      <div class="designer_tools">
        <!-- <DsfButton v-for="(button, $index) in layout.buttons" v-show="button.show.call(_self,button)" :key="$index" :title="button.text" :icon="button.icon" btn-style="icon-text" @click="button.handler($event, button)">
          {{ button.text }}
        </DsfButton> -->
        <span v-for="(button, $index) in layout.buttons" :key="$index">{{ button.text }}</span>
      </div>
    </div>
    <div class="designer-content">
      <div class="designer-center">
        <div class="designer-page">
          <DsfLayoutTree
            v-if="page"
            ref="viewProxy"
            style="position: absolute; height: 100%; width: 100%;"
            :is-design="true"
            :component-props.sync="page"
            @dragstart.native.prevent
            @mousedown.native.stop="mouseDownHanlder($event)"
            @mousemove.native="mouseMoveHanlder($event)"
            @contextmenu.native="contextMenuOpen($event)"
            @click.native="selectedComponent($event)"
          ></DsfLayoutTree>
        </div>
        <div class="designer-left">
          <div class="designer-left-tools">
            <el-tabs v-model="layout.toolsBox.activeName">
              <el-tab-pane v-for="tab in layout.toolsBox.tabs" :key="tab.name" :label="tab.label" :name="tab.name">
                <template v-slot:label>
                  <div style="padding-left:4px">{{ tab.label }}</div>
                </template>
                <!--控件组-->
                <template v-if="tab.name == 'base'">
                  <el-collapse v-for="(group, $index) in tools.groups" :key="$index" v-model="tools.activeName" accordion>
                    <el-collapse-item :name="group.title">
                      <template slot="title">
                        <div :title="group.title" class="ellipsis" style="font-size:14px">{{ group.title }}</div>
                      </template>
                      <div class="ds-tools-group-content" style="padding: 10px;max-height:60vh;overflow:auto">
                        <drag-item v-for="(item, itemindex) in group.items" :key="itemindex" :data="item"></drag-item>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="designer-right">
          <DsfDesignerProperties :data="attributesGroup" :owner="attributesOwner"></DsfDesignerProperties>
        </div>
      </div>
    </div>
    <div v-show="dragProxy.show" ref="dragProxy" class="drag-proxy hhh-sd"></div>
    <div v-if="contextMenu.show" ref="contextmenu" class="ds-contextmenu" :style="{ top: contextMenu.pos.y + 'px', left: contextMenu.pos.x + 'px' }">
      <dl class="ds-contextmenu-child ds-contextmenu-anim">
        <template v-for="(item, $index) in contextMenu.items">
          <dd v-if="dsf.type(item) == 'object'" :key="$index" :class="{ disabled: item.disabled }" @click="contextMenuItemClick(item, $event)">
            <a>{{ item.text }}</a>
          </dd>
          <dd v-else-if="item == '-'" :key="$index" class="split"></dd>
        </template>
      </dl>
    </div>
  </div>
</template>
<script>
import jsonSchema from '@/temp/2.json'
import $ from 'jquery'
import extDefaultCode from './extCode'
import dragItem from './dragItem'
import groups from './group'
export default {
  name: 'DsfDesigner',
  components: { dragItem },
  props: {
    material: {
      type: Array,
      default () {
        return []
      }
    },
    business: {
      type: String,
      default: ''
    },
    module: {
      type: String,
      default: ''
    },
    pageName: {
      type: String,
      default: ''
    },
    pageTitle: {
      type: String,
      default: ''
    },
    mobile: {
      type: Boolean,
      default: false
    },
    tpl: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      firstOpen: true,
      saved: false,
      mousedown: {
        target: null
      },
      design: true,
      layout: {
        buttons: [
          { text: '保存', icon: 'baocun', handler: this.saveLayout, show: () => this.tpl === false },
          { text: '保存模板', icon: 'baocun', handler: this.saveLayoutToTemplate, show: () => this.tpl === true },
          { text: '暂存', icon: 'baocun', handler: this.stageSaveLayout, show: () => this.tpl === false },
          { text: '预览', icon: 'icon_yulan', handler: this.preView, show: () => true },
          { text: '模板', icon: 'shebeikaifa1', handler: this.useTpl, show: () => true }
        ],
        toolsBox: {
          // tab默认选中
          activeName: 'base',
          tabs: [
            { name: 'base', label: '基础组件' }
          ]
        }
      },
      page: null,
      tools: {
        activeName: '',
        groups: groups // this.material
      },
      useControlsGroup: {
        activeName: '',
        groups: []
      },
      useMetaGroup: {
        activeName: '',
        groups: []
      },
      useBusinessControlGroup: {
        activeName: '',
        groups: []
      },
      dragProxy: {
        show: false
      },
      attributesGroup: [],
      attributesOwner: {},
      subTree: [],
      controls: {},
      dragMouseMoveTarget: null,
      contextMenu: {
        show: true,
        items: [],
        pos: { x: -10, y: -10 },
        target: null
      },
      extJsCode: extDefaultCode,
      extCssCode: '',
      extScssCode: ''

    }
  },
  computed: {
    dragProxy_el () {
      return this.$refs.dragProxy
    },
    toolBoxGroup () {
      let arr = []
      _.each(this.material, (m) => {
        let tool = {
          title: m.title,
          items: []
        }
        _.each(m.items, (el) => {
          el.type = 'control'
          if (this.mobile) {
            el.isMobile && tool.items.push(el)
          } else {
            tool.items.push(el)
          }
        })
        if (tool.items.length > 0) {
          arr.push(tool)
        }
      })
      return arr
    }
  },
  created () {
    window.designer = this
    this.initToolsBox()
  },
  mounted () {
    this.init()
    this.loadLayout()
  },
  updated () { },
  methods: {
    dragEnd () {
      $('.designer-page').off('mousemove.tooldrag')
      $(this.dragProxy_el).appendTo(this.$el)
      this.dragProxy.show = false
    },
    init () {
      this.initToolDrag()
      this.initDrop()
    },
    // 初始化左侧组件工具箱
    initToolsBox () {
      // this.tools.groups = this.toolBoxGroup
      if (this.tools.groups[0].title) {
        this.tools.activeName = this.tools.groups[0].title
      }
    },
    // 初始化左侧工具箱拖动
    initToolDrag () {
      // 附加工具箱拖动
      $('.ds-tool-item').draggable({
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
        helper: (evt) => {
          let source = $(evt.currentTarget)
          let attrs = source.get(0).__vue__.data
          let proxy = source.clone()
          proxy.addClass('proxy')
          proxy.data('data', {
            state: 'add',
            attributes: attrs
          })
          return proxy
        },
        start: (evt) => {
          // 拖动时取消右键、鼠标点击痕迹
          this.contextMenuClose()
          dsf.designer.broadcast(this, 'clearContextMemuHandler', evt, null)
          dsf.designer.broadcast(this, 'clearMouseDownHandler', evt, null)
        },
        stop: () => {
          this.dragEnd()
        }
      })
    },
    // 初始化右侧接受拖动
    initDrop () {
      $('.designer-page').droppable({
        tolerance: 'pointer',
        drop: (evt, ui) => {
          let data = ui.helper.data('data')
          let proxy = $(this.dragProxy_el)
          let slotEl = proxy.closest('[slot-name]')
          let slotName = slotEl.attr('slot-name')
          let container = dsf.designer.getParentControl(proxy)
          this.dropHandler(evt, container, slotName, data)
          this.dragEnd()
        },
        over: () => {
          $('.designer-page').on('mousemove.tooldrag', (evt) => {
            this.dragMouseMoveHandler(evt)
            evt.preventDefault()
          })
        },
        out: () => {
          this.dragEnd()
        }
      })
    },
    // 拖放时候，鼠标经过元素时触发
    dragMouseMoveHandler (evt) {
      let target = $(evt.target)
      let box = null
      if (target.hasClass('drag-proxy')) {
        return
      }
      if (target.is('[slot-name]')) { // 判断是否有插槽 显示红框
        let allow = dsf.designer.isAllowDrop(target, this)
        if (allow) {
          box = target
          this.dragProxy.show = true
          let proxy = $(this.dragProxy_el)
          box.append(proxy) // drag-proxy  红框
        }
      } else {
        let ctrl = target.closest('.designer-ctrl-proxy')
        if (ctrl && ctrl.length > 0) {
          if (
            (!target.hasClass('designer-mask') &&
              !target.hasClass('ds-control')) ||
            target.hasClass('ds-no-drop')
          ) {
            return
          }
          let vueComponent = dsf.designer.getComponent(
            ctrl.get(0).__vue__,
            this
          )
          if (vueComponent) {
            if (vueComponent.$$getComponent) {
              vueComponent = vueComponent.$$getComponent()
            }
            box = ctrl.closest('[slot-name]')
            let allow = dsf.designer.isAllowDrop(box, this)
            if (allow) {
              let height = target.height()
              let proxy = $(this.dragProxy_el)
              this.dragProxy.show = true
              if (evt.offsetY < height / 2) {
                ctrl.before(proxy)
              } else {
                ctrl.after(proxy)
              }
            }
          }
        }
      }
    },
    // 拖拽完成
    dropHandler (evt, container, slot, data) {
      let next = $(this.dragProxy_el).next('.designer-ctrl-proxy')
      if (this.dragProxy.show === true) {
        addToSlot.call(this, next.length ? next : null, container, slot, data)
      }
    },
    // 将组件添加到指定位置
    addControl (parent, slot, child, index) {
      if (!child.designId) {
        child.designId = dsf.uuid()
      }
      if (!child.caption) {
        let arr = child.ctrlType.split('.')
        child.caption = arr[arr.length - 1].toLowerCase() + this.$refs.viewProxy.getSerial()
      }
      if (parent.$$getComponent) {
        // 如果是代理组件
        parent = parent.$children[0]
      } else {
        // 此处需要有一个判断，组件的根元素直接是elementui的情况
        while (!parent.slots) {
          parent = parent.$parent
        }
      }
      // if (child.metadata) {
      //   let metadataLevel = 0;
      //   if (isInSubtable(parent)) {
      //     metadataLevel = 1;
      //   }
      // }
      if (parent.$el) {
        // 如果在子表中或者列表中是表单组建不显示label区域
        let isSubtableCell = parent.$el.matches('.ds-subtable-cell-content')
        let isDataGridCell = parent.$el.matches('.ds-datagrid-cell-content')
        if ((isSubtableCell || isDataGridCell) && child.isFormControl) {
          child.showLabel = false
          child.simple = true
          child.lrNoPadding = true
        } else {
          child.simple = false
          child.lrNoPadding = false
        }
      }
      let slotIndex = _.findIndex(parent.slots, (s) => s.name == slot)
      if (slotIndex >= 0) {
        // 判断是后入还是中间插入
        if (dsf.isUnDef(index) || index < 0) {
          parent.slots[slotIndex].controls.push(child)
        } else {
          parent.slots[slotIndex].controls.splice(index, 0, child)
        }
        child.isQuestionControl &&
          this.setQuestionIndex(child, parent.slots[slotIndex].controls, index)
      }
      // 问卷题自动选择控件
      if (child.isQuestionControl) {
        if (!this.$questionComponentTemp) {
          this.$questionComponentTemp = {}
        }
        setTimeout(() => {
          $(`[des-id=${child.designId}]`).trigger('click')
        }, 0)
      }
      // console.log('模式选择', child);
    },
    // 问卷索引设置
    setQuestionIndex (child, childs, postion) {
      // 后入
      if (dsf.isUnDef(postion) || postion < 0) {
        this.setPrevQuestionIndex(child, childs)
      } else {
        let index = 0
        _.forEach(childs, function (item, i) {
          if (item.isQuestionControl && item.hasQuestionIndex && item.visible) {
            index++
            item.questionIndex = index
          }
        })
      }
    },
    // 设置childs中child之前所有问卷组件索引
    setPrevQuestionIndex (child, childs) {
      let index = 0
      _.find(childs, function (item) {
        if (item.isQuestionControl && item.hasQuestionIndex && item.visible) {
          index++
          item.questionIndex = index
        }
        if (item.designId == child.designId) {
          return true
        }
      })
    },
    // 设置index之后所有问卷组件索引
    setNextQuestionIndex (index, nexts) {
      _.forEach(nexts, function (item) {
        if (item.hasQuestionIndex && item.visible) {
          item.questionIndex = index
          index++
        }
      })
    },
    // 选中组件
    selectedComponent ($event) {
      window.setTimeout(() => {
        this.contextMenuClose()
        let target = $($event.target)
        let component_el = target.closest('.designer-ctrl-proxy')
        if (component_el.length) {
          let component = component_el.get(0).__vue__
          let allComponents = $('.designer-ctrl-proxy')
          allComponents.each(function (i, el) {
            let c = el.__vue__
            c && (c.__desContext__.selected = false)
          })
          if (component) {
            if (!component.view) {
              component.__desContext__.selected = true
            }
          }
          dsf.http
            .get('./static/pd_attributes/' + component.ctrlType + '.json?random=' + new Date().getTime()) // json文件改变后缓存问题
            .done((res) => {
              this.attributesGroup = res || []
              this.attributesOwner = component
              if (component.isQuestionControl && this.$questionComponentTemp && !this.$questionComponentTemp[component.designId]) {
                this.$questionComponentTemp[component.designId] = true
                setTimeout(() => {
                  this.$bus.$emit(`questionSetting`)
                }, 200)
              }
            })
            .error((err) => {
              this.attributesGroup = []
              this.attributesOwner = component
              dsf.error(err)
            })
        }
      }, 0)
      $event.preventDefault()
      $event.stopPropagation()
    },
    /* --- 设计 事件 ----- */
    // 处理设计时需要打开右键菜单的组件
    contextMenuOpen (evt) {
      let component = dsf.designer.getComponentByTarget(evt.target)
      if (!component) {
        return
      }
      dsf.designer.broadcast(
        this,
        'clearContextMemuHandler',
        evt,
        null,
        component
      )
      do {
        let _options = component ? component.$options : {}
        let _contextMenuHandler = _options.design
          ? _options.design.contextMenuHandler
          : null
        if (!_contextMenuHandler) {
          component = component.$parent
        } else {
          break
        }
      } while (component != this.$root)
      let options = component.$options
      let contextMenuHandler = component.$options.design
        ? component.$options.design.contextMenuHandler
        : null
      if (contextMenuHandler) {
        this.contextMenuClose()
        let items = options.design.contextMenuHandler.call(
          component,
          evt,
          this
        )
        if (items && items.length > 0) {
          this.$nextTick(() => {
            this.contextMenu.items = items
            this.contextMenu.show = true
            this.contextMenu.target = component
            this.$nextTick(() => {
              let cm = this.$refs.contextmenu
              if (cm && cm.childNodes[0]) {
                cm = cm.childNodes[0]
                this.contextMenu.pos.x = evt.pageX
                this.contextMenu.pos.y = evt.pageY
                if (
                  this.contextMenu.pos.y + cm.offsetHeight >
                  this.$refs.designerPanel.offsetHeight
                ) {
                  this.contextMenu.pos.y = evt.pageY - cm.offsetHeight
                }
              }
            })
          })
          $(document).one('click', this.contextMenuClose)
        }
        evt.stopPropagation()
        evt.preventDefault()
      }
    },
    // 右键菜单关闭
    contextMenuClose () {
      this.contextMenu.items = []
      this.contextMenu.show = false
      this.contextMenu.target = null
    },
    // 右键菜单点击
    contextMenuItemClick (item, evt) {
      if (!item.disabled) {
        item.handler.call(this.contextMenu.target, item)
      } else {
        evt.preventDefault()
        evt.stopPropagation()
      }
    },
    // 处理设计时需要操作鼠标点下事件的组件
    mouseDownHanlder (evt) {
      try {
        if (evt.button != 0) {
          return
        }
        let component = dsf.designer.getComponentByTarget(evt.target)
        if (!component) {
          return
        }
        // 设计器会向下级所有组件触发,可用于清理下级所有组件触发过mousedown事件留下的痕迹
        dsf.designer.broadcast(
          this,
          'clearMouseDownHandler',
          evt,
          null,
          component
        )
        this.mousedown.target = component
        let options = component ? component.$options : {}
        if (options.design.mouseDownHandler) {
          options.design.mouseDownHandler.call(component, evt, this)
        }
      } catch (ex) {
        dsf.error(ex)
      } finally {
        $(document).one('mouseup', this.mouseUpHandler)
      }
    },
    // 处理设计时需要操作鼠标点下事件的组件,组件必须触发过mousedown
    mouseMoveHanlder (evt) {
      try {
        if (this.mousedown.target) {
          let options = this.mousedown.target.$options || {}
          if (options.design.mouseMoveHandler) {
            options.design.mouseMoveHandler.call(
              this.mousedown.target,
              evt,
              this
            )
          }
        }
      } catch (ex) {
        dsf.error(ex)
      }
    },
    mouseUpHandler (evt) {
      try {
        if (this.mousedown.target) {
          let options = this.mousedown.target.$options || {}
          if (options.design.mouseUpHandler) {
            options.design.mouseUpHandler.call(
              this.mousedown.target,
              evt,
              this
            )
          }
        }
      } catch (ex) {
        dsf.error(ex)
      } finally {
        this.mousedown.target = null
      }
    },
    /* --- 设计 事件 ----- */

    // 生成二次开发js
    openExtJs () {
      dsf.layer.pc.openDialog({
        title: '自定义扩展',
        fullscreen: true,
        overflow: 'hidden',
        content: 'MonacoEditor',
        params: {
          code: this.extJsCode
        },
        btns: [
          {
            text: '确定',
            handler: (component) => {
              this.extJsCode = component.getContent()
            }
          },
          {
            text: '取消'
          }
        ]
      })
    },
    // 生成css
    openExtCss () {
      dsf.layer.pc.openDialog({
        title: '自定义样式',
        fullscreen: true,
        overflow: 'hidden',
        content: 'MonacoEditor',
        params: {
          code: this.extScssCode || '',
          language: 'scss'
        },
        btns: [
          {
            text: '确定',
            handler: (component) => {
              this.extScssCode = component.getContent()
            }
          },
          {
            text: '取消'
          }
        ]
      })
    },

    openVueTemplate () {
      let page = this.$refs.viewProxy
      dsf.designer.createViewMetaData(page)
      this.$nextTick(() => {
        let layout = dsf.designer.getLayoutInfo(page)
        let result = dsf.designer.convertTemplateAndControlData(layout)
        let tpl = dsf.beautify.html(result.tpl)
        dsf.layer.pc.openDialog({
          title: 'Vue模板',
          fullscreen: true,
          overflow: 'hidden',
          content: 'MonacoEditor',
          params: {
            code: tpl || '',
            language: 'html'
          }
        })
      })
    },
    // 加载布局
    loadLayout (business, module, pname) {
      // let dialog = dsf.layer.pc.loading()
      let b = business || this.business
      let m = module || this.module
      let pn = pname || this.pageName
      let title = this.pageTitle
      let ctrlType = 'dsf.page'
      let defaultPageAttrs = {
        caption: 'page',
        name: pn,
        title: title,
        context: { B: b, M: m }
      }
      if (b && m && pn) {
        let layout = null, scss = null, designer = null
        getLayout.call(this, b, m, pn, title, this.mobile, this.tpl)
          .then((res) => {
            let dom = $('<div>' + res.data + '</div>')
            let layoutStr = dom.children("script[id='layout']").html() || ''
            let scssStr = dom.children("script[id='scss']").html() || ''
            let designerStr = dom.children("script[id='designer']").html() || ''
            let layoutFn = new Function(
              [
                'var layout=' + (layoutStr || 'null') + ';',
                'return layout;'
              ].join('\n')
            )
            let scssFn = new Function(
              ['return ' + JSON.stringify(scssStr.trim() || '')].join('\n')
            )
            let designerFn = new Function(
              ['return ' + (designerStr || '{}').trim()].join('\n')
            )
            layout = dsf.fillComponentDefaultProps(layoutFn())
            scss = scssFn()
            designer = designerFn()
            if (!this.tpl) {
              return new Promise((resolve) => {
                getExtJs(b, m, pn, this.mobile, this.tpl)
                  .then((res) => {
                    let code = res.data
                    this.extJsCode = code
                    resolve()
                  })
                  .catch(() => {
                    this.extJsCode = extDefaultCode
                    resolve()
                  })
              })
            }
          })
          .catch((ex) => {
            dsf.error(ex)
          })
          .finally(() => {
            if (layout) {
              this.page = createComponent(ctrlType, layout, this.mobile)
              this.extScssCode = scss || ''
              // 加载元数据组
              let metadataGroup = designer.metadataGroup || []
              loadMetaDataGroup.call(this, metadataGroup)
              // 加载业务组件组
              let businessGroup = designer.businessControlGroup || []
              loadBusinessComponetGroup.call(this, businessGroup)
              this.firstOpen = false
              this.saved = true
            } else {
              this.page = createComponent(ctrlType, defaultPageAttrs, this.mobile)
              this.firstOpen = true
              this.saved = false
            }
            // dsf.layer.pc.closeLoading(dialog)
          })
      } else {
        // this.page = createComponent(ctrlType, defaultPageAttrs, this.mobile)
        this.page = jsonSchema
        // dsf.layer.pc.closeLoading(dialog)
        this.firstOpen = true
        this.saved = false
      }
    },
    // 将组件添加到设计器的组件列表中
    pushToControls (component) {
      this.controls[component.designId] = component
    },
    // 保存布局
    saveLayout () {
      let validateResult = dsf.designer.saveLayoutValidate(this.$refs.viewProxy)
      if (validateResult !== false) {
        saveLayout.call(this)
      }
    },
    // 保存模板
    saveLayoutToTemplate () {
      saveLayoutToTemplate.call(this)
    },
    // 预览
    preView () {
      preView.call(this)
    },
    // 生成业务组件数据
    saveBusinessComponent () {
      let _this = this
      let controls = []
      this.$openDialog({
        title: '组件选择',
        width: '1000px',
        height: '50vh',
        params: {
          designer: this
        },
        content: 'DesComponents',
        btns: [
          {
            text: '确定',
            handler (data) {
              let vr = data.validate()
              if (vr === false) {
                return false
              }
              let controlList = data.yes()
              if (controlList.length) {
                _.each(controlList, (el) => {
                  el.metadata.id = ''
                  el.metadata.at = ''
                  el.metadata_fullcode = ''
                })
                window.setTimeout(() => {
                  _this.saveToBusinessComponentGroup(controlList)
                }, 1000)
              }
            }
          },
          { text: '取消' }
        ]
      })
    },
    // 保存到业务组件组
    saveToBusinessComponentGroup (controlList) {
      let _this = this
      dsf.layer.openDialog({
        title: '保存到',
        fullscreen: false,
        content: 'DesBusinessComponent',
        width: '500px',
        height: '500px',
        btns: [
          {
            text: '确定',
            handler: (res) => {
              let data = res.radioData
              let loadding = dsf.layer.pc.loading()
              let sublist = _.map(controlList, (el, i) => {
                return {
                  'dsfa_rm_bc_list.version': '1',
                  'dsfa_rm_bc_list.name': el.label,
                  'dsfa_rm_bc_list.code': el.caption,
                  'dsfa_rm_bc_list.content': JSON.stringify(el, (key, val) => {
                    // 去除掉无效提交的项
                    if (key === 'designId') {
                      return ''
                    } else {
                      return val
                    }
                  }),
                  'dsfa_rm_bc_list.ds_order': (i + 1)
                }
              })
              let params = {
                namespace: 'dsfa.rm.bc',
                pageName: 'edit',
                data: JSON.stringify({
                  'dsfa_rm_bc_list': sublist,
                  '_id': data['dsfa_rm_id'],
                  'dsfa_rm.ID': data['ID'],
                  'dsfa_rm.dsfa_rm_id': data['dsfa_rm_id']
                })
              }
              _this.$webAPI.formSave(params)
                .then(({ data }) => {
                  if (data.state == '20000') {
                    dsf.layer.pc.message('保存成功', true)
                    loadBusinessComponetGroup.call(this, [{ id: data.data['dsfa_rm.dsfa_rm_id'] }])
                  } else {
                    dsf.layer.pc.message(data.message, false)
                  }
                })
                .catch((ex) => {
                  dsf.layer.pc.message('保存出现错误', false)
                })
                .finally(() => {
                  dsf.layer.pc.closeLoading(loadding)
                })
            }
          },
          {
            text: '取消'
          }
        ]
      })
    },
    // 模板
    useTpl () {
      let _this = this
      dsf.layer.openDialog({
        title: '选择布局模板',
        fullscreen: false,
        content: 'DesUseLayoutTpl',
        width: '500px',
        height: '500px',
        btns: [
          {
            text: '确定',
            handler: (data) => {
              let tplData = data.radioData
              if (_.isNull(tplData)) {
                dsf.layer.message('请选择一个模板', false)
                return false
              } else {
                var path = tplData.path.split('/')
                var b = path.shift()
                var pn = path.pop()
                var m = path.join('.')
                let layout = null, scss = null, designer = null
                getLayout.call(this, b, m, pn, this.pageTitle, this.mobile, true)
                  .then((res) => {
                    let dom = $('<div>' + res.data + '</div>')
                    let layoutStr = dom.children("script[id='layout']").html() || ''
                    let scssStr = dom.children("script[id='scss']").html() || ''
                    let designerStr = dom.children("script[id='designer']").html() || ''
                    let layoutFn = new Function(
                      [
                        'var layout=' + (layoutStr || 'null') + ';',
                        'return layout;'
                      ].join('\n')
                    )
                    let scssFn = new Function(
                      ['return ' + JSON.stringify(scssStr.trim() || '')].join('\n')
                    )
                    let designerFn = new Function(
                      ['return ' + (designerStr || '{}').trim()].join('\n')
                    )
                    layout = dsf.fillComponentDefaultProps(layoutFn())
                    scss = scssFn()
                    designer = designerFn()
                  })
                  .catch((ex) => {
                    dsf.layer.pc.message('读取模板失败', false)
                  })
                  .finally(() => {
                    if (layout) {
                      let context = this.page.context
                      let name = this.page.name
                      _this.page = null
                      this.$nextTick(() => {
                        // 此处dsf.mix是为了保持页面原有命名空间和名称
                        _this.page = createComponent('dsf.page', dsf.mix(layout, { context: context, name: name }))
                      })
                    }
                  })
              }
            }
          },
          {
            text: '取消'
          }
        ]
      })
    },
    // 控件组
    saveCtrl () {
      dsf.layer.openDialog({
        title: '选择控件组',
        fullscreen: false,
        content: 'DesControlSelect',
        width: '500px',
        height: '500px',
        btns: [
          {
            text: '确定',
            handler: (data) => {
              if (data.checkNodeList.length > 0) {
                let ctrlData = checkData.call(this, data.checkNodeList)
                console.log('确定---', ctrlData)
              }
            }
          },
          {
            text: '取消'
          }
        ]
      })
    },
    // 自定义组件
    selectComponents () {
      dsf.layer.openDialog({
        title: '选择组件',
        fullscreen: false,
        content: 'DesCustomComponent',
        width: '500px',
        btns: [
          {
            text: '确定',
            handler: (data) => {
              const checkNodeList = data.yes()
              // tabsIndex 0 == 控件组（2） 1 == 业务组件(12)
              const typeValue = data.tabIndex == '0' ? 2 : 12
              if (checkNodeList.length > 0) {
                let ctrlData = checkData.call(this, checkNodeList)
                if (typeValue == 12) {
                  let list = _.map(ctrlData, (c) => {
                    return {
                      'id': c.dsfa_rm_id,
                      'type': 12
                    }
                  })
                  loadBusinessComponetGroup.call(this, list)
                }
                // else if (typeValue == 2) {
                // }
                // console.log('获取数据', typeValue, checkNodeList);
              } else {
                dsf.layer.message('请选择一个组件', false)
                return false
              }
            }
          },
          {
            text: '取消'
          }
        ]
      })
    },
    // 元数据组
    selectMateGroup () {
      dsf.layer.openDialog({
        title: '选择元数据组',
        fullscreen: false,
        content: 'DesMetaDataSelect',
        width: '500px',
        btns: [
          {
            text: '确定',
            handler: (data) => {
              const checkNodeList = data.yes()
              if (checkNodeList.length > 0) {
                let ctrlData = checkData.call(this, checkNodeList)
                let nameSpaceList = []
                let d = _.map(ctrlData, (data) => {
                  return {
                    id: data.type_value == '8' ? data.dsfa_rm_id : data.ID,
                    type: data.type_value
                  }
                })
                loadMetaDataGroup.call(this, d)
              }
            }
          },
          {
            text: '取消'
          }
        ]
      })
    },
    removeMetaDataGroup (group) {
      dsf.layer.pc.confirm('确定要删除该元数据吗?')
        .then(() => {
          dsf.array.remove(this.useMetaGroup.groups, group)
        }).catch(() => { })
    },
    // 删除业务组件组
    removeBusinessGroup (group) {
      dsf.layer.pc.confirm('确定要删除该元数据吗?')
        .then(() => {
          dsf.array.remove(this.useBusinessControlGroup.groups, group)
        }).catch(() => { })
    }
  }
}

// 取出控件组数据 并去重
function checkData (data) {
  let arr = []
  const getData = function (list) {
    list.forEach(function (row) {
      if (row.children) {
        getData(row.children)
      } else {
        arr.push(row)
      }
    })
  }
  getData(data)
  return _.uniqBy(arr, 'dsfa_rm_id')
}

// 将组件添加到插槽
function addToSlot (obstacle, container, slot, data) {
  let component = container.get(0).__vue__
  let attributes = component,
    index = null,
    newComp = null
  // if (obstacle) {
  //   // 如果拖放位置已经存在组件，则计算该组件位置，准备插入到其前
  //   let target = obstacle.get(0).__vue__
  //   let slotItem = _.find(attributes.slots, (s) => s.name === slot)
  //   index = _.findIndex(slotItem.controls, (com) => com === target.__context__.props)
  // }
  // 从左侧工具箱拖放过来
  if (data.state == 'add') {
    newComp = createComponent(
      data.attributes.ctrlType,
      {
      },
      this.mobile
    )
    if (newComp.metadata) {
      newComp.metadata.level = 0
    }
    console.log('组件数据', data)
    console.log('组件对象', newComp)
    if (data.attributes.dataId) {
      newComp.dataId = data.attributes.dataId
    }
    newComp && this.addControl(attributes, slot, newComp, index)
    if (data.attributes.type == 'control') {
      newComp = createComponent(
        data.attributes.ctrlType,
        {
        },
        this.mobile
      )
      if (newComp.metadata) {
        newComp.metadata.level = 0
      }
      console.log('组件数据', data)
      console.log('组件对象', newComp)
      if (data.attributes.dataId) {
        newComp.dataId = data.attributes.dataId
      }
      newComp && this.addControl(attributes, slot, newComp, index)
    } else if (data.attributes.type == 'metadata') {
      var metadata = data.attributes.data
      var currentControl = null
      if (metadata.currentControl) {
        currentControl = metadata.currentControl.value
      } else {
        currentControl = metadata.controls[0].value
      }
      newComp = createComponent(
        currentControl, {},
        this.mobile
      )
      // let metadata_instance = dsf.mix({}, metadata);
      newComp.metadata.id = metadata.id
      newComp.metadata.at = metadata.at
      newComp.metadata.code = metadata.code
      newComp.metadata.name = metadata.name
      newComp.metadata.defaultValue = metadata.defaultValue
      newComp.metadata.controls = metadata.controls
      newComp.metadata.dataSource = metadata.dataSource
      newComp.metadata.type = metadata.type
      newComp.metadata.order = metadata.order
      newComp.metadata.isFromMetaData = true
      newComp.metadata.currentControl = newComp.metadata.controls[0]
      newComp.metadata.level = 0
      newComp.caption = metadata.code
      newComp.label = metadata.name
      newComp && this.addControl(attributes, slot, newComp, index)
    } else if (data.attributes.type == 'business') {
      var controlData = data.attributes.data
      let layoutProps = JSON.parse(controlData.content)
      dsf.recursionComponentProps(layoutProps, (props) => {
        let ctrl = dsf.createComponent(props.ctrlType, props)
        dsf.mix(props, ctrl)
        props.designId = dsf.uuid()
        if (props.isFormControl) {
          props.isBusiness = true
        }
      })
      this.addControl(attributes, slot, layoutProps, index)
    }
  } else {
    data.component.$remove()
    this.$nextTick(() => {
      this.addControl(attributes, slot, data.attributes, index)
    })
  }
}
// {id: "test.wenjin.form.sub", type: "3"}

function getLayout (business, module, pname, title, isMobile, isTpl) {
  // console.log("dsfsfdsf")
  let b = business || ''
  let m = module || ''
  let pn = pname || ''
  let htmlPath = dsf.designer.getLayoutPath(b, m, pn, isMobile, isTpl)
  return this.$http.get(htmlPath, null, { responseType: 'text' })
}

function getExtJs (b, m, pn, isMobile, isTpl) {
  let extPath = dsf.designer.getExtPath(b, m, pn, isMobile, isTpl)
  return dsf.http.get(extPath, null, { responseType: 'text' })
}

// 保存布局
function saveLayout () {
  let dialog = dsf.layer.pc.loading()
  let page = this.$refs.viewProxy
  // dsf.designer.saveLayoutValidate(page);
  let md = dsf.designer.createViewMetaData(page)
  this.$nextTick(() => {
    let layout = dsf.designer.getLayoutInfo(page)
    layout = dsf.designer.controlToJson(layout)
    let css = ''
    let scss = this.extScssCode || ''
    let ns = (this.page.context.B || '') + '.' + (this.page.context.M || '')
    let moduleName = ns + '.' + (this.page.name || '')
    let designer = { 'metadataGroup': {}, 'controlGroup': {}, 'businessControlGroup': {} }
    designer['metadataGroup'] = _.map(this.useMetaGroup.groups, (m) => {
      return { name: m.title || m.name, id: m.id, type: m.type }
    })
    designer['businessControlGroup'] = _.map(this.useBusinessControlGroup.groups, (b) => {
      return { name: b.title, id: b.id, type: b.type }
    })
    if (md && (page.pageType == 'form' || page.pageType == 'question' || page.pageType == 'exam')) {
      let metadataGroup = []
      _.each(md.metadata, (m, key) => {
        let arr = key.split('.')
        let metaDataKey = arr[0]
        let mID = metaDataKey.replace(/_/g, '.')
        let isExist = _.find(designer['metadataGroup'], (mg) => {
          return mg.id == mID
        })
        if (!isExist) {
          designer['metadataGroup'].push({ name: mID + '元数据', id: mID, type: 3 })
        }
      })
    }
    // let ns = this.page.context.B + "." + this.page.context.M + "." + this.page.name;
    dsf.designer.compileCss(this.extScssCode, moduleName)
      .then((cssStr) => {
        this.extCssCode = cssStr
        css = this.extCssCode
      })
      .then(() => {
        let extJs = this.extJsCode
        extJs = dsf.beautify.js(extJs, {
          indent_size: '2',
          indent_char: ' ',
          // 保持数组压缩
          keep_array_indentation: false,
          // 链式方法换行
          break_chained_methods: true,
          // 换行长度
          wrap_line_length: 0,
          space_after_anon_function: true
        })
        let x = '/'
        let post = {
          isMobile: this.isMobile,
          md: JSON.stringify(md),
          layout: [
            `<script type="text/template" id="layout">\n${layout}\n<${x}script>`,
            `<script type="text/template" id="css">\n${css}\n<${x}script>`,
            `<script type="text/template" id="scss">\n${scss}\n<${x}script>`,
            `<script type="text/template" id="designer">\n${JSON.stringify(designer)}\n<${x}script>`
          ].join('\n'),
          extJsCode: extJs,
          evJsCode: '',
          pageName: this.page.name,
          namespace: ns,
          pageTitle: this.page.title
        }
        // console.log(post)
        let dialog = dsf.layer.pc.loading()
        this.$webAPI.pageBuild(post)
          .done((result) => {
            if (result.state == '20000') {
              dsf.layer.message('保存成功', true)
              this.saved = true
            } else {
              dsf.layer.message(result.message, false)
            }
          })
          .error((error) => {
            dsf.layer.message('保存失败', false)
          })
          .always(() => {
            loadMetaDataGroup.call(this, designer['metadataGroup'])
            dsf.layer.pc.closeLoading(dialog)
          })
      })
      .catch((errorMsg) => {
        dsf.layer.pc.closeLoading(dialog)
        dsf.layer.pc.message(errorMsg, false)
      })
  })
}

// 保存模板
function saveLayoutToTemplate () {
  if (this.tpl == 1) {
    // 递归清空掉所有无用的元数据
    let page = this.$refs.viewProxy
    dsf.designer.recursionLayoutTree(page, null, null, child => {
      if (child.metadata && child.metadata.isFromMetaData) {
        child.metadata_fullcode = ''
      }
    })
    this.$nextTick(() => {
      let layout = dsf.designer.getLayoutInfo(page)
      layout = dsf.designer.controlToJson(layout)
      let css = ''
      let scss = this.extScssCode || ''
      let ns = (this.page.context.B || '') + '.' + (this.page.context.M || '')
      let moduleName = ns + '.' + (this.page.name || '')
      let designer = { 'metadataGroup': {}, 'controlGroup': {} }
      designer['metadataGroup'] = _.map(this.useMetaGroup.groups, (m) => {
        return { name: m.name, id: m.id, type: m.type }
      })
      let x = '/'
      let post = {
        isMobile: this.isMobile,
        layout: [
          `<script type="text/template" id="layout">\n${layout}\n<${x}script>`,
          `<script type="text/template" id="css"><${x}script>`,
          `<script type="text/template" id="scss">\n${scss}\n<${x}script>`,
          `<script type="text/template" id="designer">\n${JSON.stringify(designer)}\n<${x}script>`
        ].join('\n'),
        pageName: this.page.name,
        namespace: ns
        // pageTitle: this.page.title,
      }
      let dialog = dsf.layer.pc.loading()
      this.$webAPI.pageSaveTemplate(post)
        .done((result) => {
          result.state == 20000 ? dsf.layer.message('保存成功', true) : dsf.layer.message(result.message, false)
        })
        .error((error) => {
          dsf.layer.message('保存失败', false)
        })
        .always(() => {
          // loadMetaDataGroup.call(this, designer['metadataGroup']);
          dsf.layer.pc.closeLoading(dialog)
        })
    })
  }
}

function preView () {
  let page = this.$refs.viewProxy.$$getComponent()
  dsf.designer.createViewMetaData(page)
  this.$nextTick(() => {
    let str = dsf.designer.getLayoutInfo(page, true)
    str = dsf.designer.controlToJson(str)
    let x = '/'
    let layoutStr = `<script type="text/template" id="layout">\n${str}\n<${x}script>`
    window.localStorage.setItem('layoutContent', layoutStr)
    window.open('./designer.html#' + (this.mobile ? '/mobile' : '/pc') + '/preview')
  })
}

function createComponent (name, attrs, isMobile) {
  let fn = dsf.designer.createComponent
  if (isMobile) {
    fn = dsf.designer.createMobileComponent
  }
  let _attrs = dsf.mix(attrs, { designProxy: true })
  return fn(name, _attrs)
}

// 加载元数据组
async function loadMetaDataGroup (params) {
  try {
    // 去除重复
    params = _.uniqBy(params, (v) => v.id)
    let result = await requestMetaDataGroupContent.call(this, params)
    _.each(result, (r) => {
      let metadataList = r.data
      metadataList = _.filter(metadataList || [], (m) => {
        if (m.type_value == 3) {
          return _.map(params, 'id').indexOf(m.ID) >= 0
        } else {
          return _.map(params, 'id').indexOf(m.dsfa_rm_id) >= 0
        }
      })
      _.each(metadataList, (group) => {
        metadataToUseMetaDataGroup.call(this, group)
      })
    })
  } catch (ex) {
    dsf.error(ex)
  }
}

// 加载业务组件租
async function loadBusinessComponetGroup (params) {
  try {
    // 去除重复
    params = _.uniqBy(params, (v) => v.id)
    let result = await requestBusinessComponent.call(this, params)
    _.each(result.data, (r) => {
      businessToUseBusinessGroup.call(this, r)
    })
  } catch (ex) {
    dsf.error(ex)
  }
}

// 获取元数据组
function requestMetaDataGroupContent (params) {
  let httpList = []
  for (let i = 0; i < params.length; i++) {
    if (params[i].type == '3') {
      httpList.push(this.$http.get('/rm/list/meta', { namespace: params[i].id }))
    } else if (params[i].type == '8') {
      httpList.push(this.$http.get('/dbsource/rmId', { rmId: params[i].id }))
    }
  }
  return this.$http.all(httpList)
}

// 获取业务组件中的组件信息
function requestBusinessComponent (params) {
  let ids = _.map(params, (el) => {
    return el.id
  })
  return this.$webAPI.getBusinessComponets(ids)
}

// 将元数据添加到设计器的元数据组中
function metadataToUseMetaDataGroup (group) {
  let id = group.type_value == 8 ? group.dsfa_rm_id : group.ID
  let result = {
    id: id,
    title: group.name,
    type: group.type_value,
    items: []
  }
  _.each(group.metadata, (m) => {
    let item = {
      'type': 'metadata',
      'name': m.name,
      'data': m,
      'group': group,
      'id': m.id
    }
    result.items.push(item)
  })
  let index = _.findIndex(this.useMetaGroup.groups, (g) => {
    return g.id == result.id
  })
  if (index < 0) {
    this.useMetaGroup.groups.push(result)
  } else {
    this.useMetaGroup.groups[index].items = result.items
  }
  this.$nextTick(() => {
    // 附加拖动
    this.initToolDrag()
  })
}

// 将业务组件添加到设计器可选业务组件组中
function businessToUseBusinessGroup (group) {
  let result = {
    id: group.rmId,
    title: group.name,
    type: 12,
    items: []
  }
  _.each(group.bcList, (m) => {
    let item = {
      'type': 'business',
      'name': m.name,
      'data': m,
      'group': group,
      'id': m.id
    }
    result.items.push(item)
  })
  let index = _.findIndex(this.useBusinessControlGroup.groups, (g) => {
    return g.id == result.id
  })
  if (index < 0) {
    this.useBusinessControlGroup.groups.push(result)
  } else {
    this.useBusinessControlGroup.groups[index].items = result.items
  }
  this.$nextTick(() => {
    // 附加拖动
    this.initToolDrag()
  })
}

</script>
