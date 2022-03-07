<template>
  <div class="dblist-v2 parentboxv2" :class="'skin-' + skin + ` dblist-${dataId} listDefaultFont-${getFontSizeNum(listDefaultFontSize, globalFontSize)} listActiveFont-${getFontSizeNum(listActiveFontSize, globalFontSize, true)} listHover-${listHoverFontSize} controlStyle-${controlStyle}`" :style="{ margin: margin, height: (height == 0 ? 300 : height) + 'px', background: cardTabBgColor ? cardTabBgColor : titleBarBgColor, 'border-radius': bordertype == 'round' ? roundsize : '0px' }">
    <div class="platform_card_bts" :class="'bts-' + controlStyle">
      <div v-show="activeName == 'remote_doc_exchange' && tabslist['remote_doc_exchange']['receiveRemoteDoc']" class="addbtn" @click="receiveRemote()">接收远程公文</div>
      <div v-show="isShowSearchInput" class="C00040-select" style="margin-top: 0px; width: 150px; float: right; margin-right: 0px">
        <input ref="wysearch" v-model="searchValue" type="text" style="width: 150px; padding: 0 35px 0 10px" placeholder="请输入关键词" @blur="searchBlur()" @keyup.enter="getDbData(activeName)" />
        <img class="serachimg" :src="dsf.url.getWebPath(`$/platform/imgs/theme/${skin}/search.png`)" alt="" style="top: 5px" title="搜索" srcset="" @click="getDbData(activeName)" />
      </div>
      <div v-if="isShowTodoBtn && (activeName == 'todo' || activeName == 'todoagency') && openBatchOperate" v-show="!isShowSearchInput" class="addbtn" @click="batchSend()">批量办理</div>
      <div v-show="activeName == 'toread' && isdatalist" class="allselect" :class="{ unselect: isselectall }" @click="allSelectBtn()">{{ isselectall ? '取消全选' : '全选' }}</div>
      <div v-if="isShowReadBtn && activeName == 'toread'" v-show="!isShowSearchInput" class="addbtn redbtn" style="margin-left: 10px" @click="batchRead">批量阅毕</div>
      <div v-if="isShowSearch" v-show="!isShowSearchInput" class="img" @click="searchIconClick()">
        <img src="../../public/platform/imgs/v1/search.png" alt="" class="default-img" title="搜索" srcset="" />
        <img :src="dsf.url.getWebPath(`$/platform/imgs/theme/${skin}/search-1.png`)" alt="" class="hover-img" title="搜索" srcset="" />
      </div>
      <div v-show="activeName != 'alldo' && activeNewAdd.newFileUrl" class="img" :class="{ plusimg: isShowPlusImg }" @click="goNewFile()">
        <i class="gzticonfont menu-icon-chuangjianx"></i>
      </div>
      <div v-show="activeName != 'alldo' && moreShowType == 'icon'" class="img" @click="goPage()">
        <i class="gzticonfont menu-icon-gengduo"></i>
      </div>
      <div v-show="activeName != 'alldo' && moreShowType == 'moreone'" class="img" @click="goPage()">
        <span>更多</span>
      </div>
      <div v-show="settingShow && isshowmore" class="img" @click="showCtrlSetDialogFun()">
        <i class="gzticonfont menu-icon-shezhi1"></i>
      </div>
    </div>

    <!-- <el-tabs :class="{'borderm20': titleBarStyle == 'borderbottom', 'margin20': isWhiteColor, 'otherMargin': !isWhiteColor, 'tabs-sousuo': isShowSearch, 'ts-el-tabs-small': activeName!='alldo', 'ts-el-tabs': (isShowTodoBtn || isShowReadBtn || activeName=='toread'), 'ts-el-tabs-long': (activeName=='remote_doc_exchange'&&tabslist['remote_doc_exchange']['receiveRemoteDoc']), 'ts-el-tabs-long2': (activeName=='toread'&&isShowReadBtn) }" v-model="activeName" @tab-click="handleClick"> -->
    <el-tabs v-model="activeName" :class="getTabsCSS" :before-leave="beforeLeave" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tabdata" :key="index" :name="item.tab">
        <span slot="label" class="platform_tab_title_remind_v1" :class="'tabnum-' + (item.num1 == 99 ? '3' : item.num1 > 9 ? '2' : '1')">
          {{ item.show }}
          <label v-show="item.num1 > 0" :class="activeName == item.tab ? 'active' : remindShowType == 1 ? 'active' : ''">{{ activeName == item.tab ? item.num : remindShowType == 1 ? item.num : '' }}</label>
        </span>
        <div class="containbox" :style="getContainboxStyle()">
          <db-contain
            v-if="loadedTabName.indexOf(',' + item.tab + ',') > -1"
            ref="child"
            :list-url="listUrl"
            :list-url-exe="listUrlExe"
            :skin="skin"
            :page-size="pageSize + 2"
            :dbinfo="item"
            :all-tabs="allTabNames"
            :search-value="searchValue"
            :list-active-style="getHoverBarStyle()"
            :two-where="getTwoWhere(item.tab)"
            :sort-type="getSortType()"
            :enable-hover-bar="enableHoverBar"
            :is-show-bao-ming="isShowBaoMing"
            :open-batch-dispose="openBatchDispose"
            :is-show-node-name="isShowNodeName"
            :is-show-name="isShowName"
            :is-showno-text="isShownoText"
            :is-open-special="isOpenSpecial"
            :font-gg-color="fontGgColor"
            :modulecolor="modulecolor"
            :unreadis-bold="unreadisBold"
            :action-name="{
              actionName0: actionName0,
              actionName1: actionName1,
              actionName2: actionName2,
              actionName3: actionName3,
              actionName4: actionName4,
              actionName5: actionName5,
              actionName6: actionName6,
              actionName7: actionName7,
              actionName8: actionName8,
              actionName9: actionName9,
              actionName10: actionName10,
              actionName11: actionName11,
              actionName12: actionName12,
            }"
            :show-data="isShowData"
            :dialog-heg="dialogHeight"
            :right-three-column="rightThreeColumn"
            :username-text-aligin="usernameTextAligin"
            @reloadDBInfo="getDbData"
            @changeBtnStatus="changeBtnStatus"
            @toreadChange="toreadChange"
          ></db-contain>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="CtrlSetDialogTitle" top="50px" width="800px" :visible.sync="showCtrlSetDialog" :append-to-body="true">
      <div class="mainf" :style="{ height: dialogHeight + 'px' }">
        <iframe :src="CtrlSetDialogUrl" width="100%" height="100%" scrolling="auto" frameborder="0"></iframe>
      </div>
    </el-dialog>
    <el-dialog :title="VideoTxName" :visible.sync="dialogVisibleVideo" width="800px" :append-to-body="true">
      <div class="iframe7-div" :style="{ height: dialogHeight + 'px' }">
        <iframe id="layui-layer-iframe7" scrolling="auto" allowtransparency="true" name="layui-layer-iframe7" onload="this.className='';" class="layui-layer-iframe7" frameborder="0" :src="(VideoTxurl.indexOf('DreamWeb') > -1 ? '' : dsf.config.webRoot.webPath) + VideoTxurl"></iframe>
      </div>
    </el-dialog>
    <!-- 这里的title 要对应tab 名称 -->
    <el-dialog :title="plusPopupTitle" :visible.sync="dialogVisiblePlus" width="800px" :append-to-body="true">
      <div class="iframe7-div" :style="{ height: dialogHeight + 'px' }">
        <iframe id="layui-layer-iframe7" scrolling="auto" allowtransparency="true" name="layui-layer-iframe7" onload="this.className='';" class="layui-layer-iframe7" frameborder="0" :src="plusPopupUrl"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import control from '@/mixins/control'
import DbContain from './DbContain-v2'
import { MessageBox, Message } from 'element-ui'
export default dsf.component({
  ctrlCaption: '待办列表V2',
  mixins: [control],
  name: 'DsfDblistV2',
  components: {
    DbContain
  },
  props: {
    margin: {
      type: String,
      default: '20px'
    },
    countUrl: {
      type: String,
      default: 'ctrl/officeInfo/getDsfaTabsInfo'
    },
    listUrl: {
      type: String,
      default: 'ctrl/officeInfo/getDsfaTabsData'
    },
    countUrlExe: {
      type: String,
      default: ''
    },
    listUrlExe: {
      type: String,
      default: ''
    },
    subHeight: {
      type: Number,
      default: 360
    },
    fixedHeight: {
      type: Number,
      default: 0
    },
    isShowSearch: {
      type: Boolean,
      default: false
    },
    controlStyle: {
      type: String,
      default: 'dreamweb'
    },
    listDefaultFontSize: {
      type: Number,
      default: 16
    },
    listActiveFontSize: {
      type: Number,
      default: 16
    },
    listHoverFontSize: {
      type: Boolean,
      default: false
    },
    contentBgType: {
      type: Number,
      default: 0
    },
    contentBgAlpha: {
      type: Number,
      default: 0
    },
    contentBgColor: {
      type: String,
      default: ''
    },
    titleBarBgColor: {
      type: String,
      default: ''
    },
    enableHoverBar: {
      type: Boolean,
      default: true
    },
    hoverBarBgType: {
      type: Number,
      default: 0
    },
    hoverBarBgAlpha: {
      type: Number,
      default: 0
    },
    hoverBarBgColor: {
      type: String,
      default: ''
    },
    isShowBaoMing: {
      type: Boolean,
      default: true
    },
    openBatchDispose: {
      type: Boolean,
      default: true
    },
    openBatchOperate: {
      type: Boolean,
      default: false
    },
    isShowNodeName: {
      type: Boolean,
      default: true
    },
    remindShowType: {
      type: Number,
      default: 0
    },
    refreshType: {
      type: String,
      default: 'inbox,distribt,remind,notice,meeting,collect,remoteDoc,remoteFeedBack'
    },
    VideoOpenType: {
      type: String,
      default: 'popup'
    },
    actionName0: {
      type: String,
      default: '关注'
    },
    actionName1: {
      type: String,
      default: '发送'
    },
    actionName2: {
      type: String,
      default: '阅毕'
    },
    actionName3: {
      type: String,
      default: '报名'
    },
    actionName4: {
      type: String,
      default: '反馈'
    },
    actionName5: {
      type: String,
      default: '退回'
    },
    actionName6: {
      type: String,
      default: '签收'
    },
    actionName7: {
      type: String,
      default: '退回' // 拒收
    },
    actionName8: {
      type: String,
      default: '会签回执' // 会签回执
    },
    actionName9: {
      type: String,
      default: '盖章回执' // 盖章回执
    },
    actionName10: {
      type: String,
      default: '反馈' // 反馈
    },
    actionName11: {
      type: String,
      default: '催办' // 催办
    },
    actionName12: {
      type: String,
      default: '反馈' // 督办反馈
    },
    isShowName: {
      type: Boolean,
      default: true
    },
    statusIcon: {
      // 是否显示状态图标
      type: Boolean,
      default: true
    },
    ydstatusIcon: {
      // 是否显示状态图标
      type: Boolean,
      default: true
    },
    isShowDate: {
      // 是否显示日期
      type: Boolean,
      default: true
    },
    isShowModuleName: {
      // 是否显示模块名称
      type: Boolean,
      default: true
    },
    isShowBtns: {
      // 是否启用按钮操作
      type: Boolean,
      default: true
    },
    isShowTimeout: {
      // 是否启用超时提醒
      type: Boolean,
      default: true
    },
    timeoutColor: {
      type: String,
      default: '#FF0000' // 已超时文字颜色
    },
    isShownoText: {
      type: Boolean,
      default: true
    },
    titleBarStyle: {
      type: String,
      default: 'normal'
    },
    isOpenSpecial: {
      type: Boolean,
      default: false
    },
    isShowVideoTx: {
      type: Boolean,
      default: false
    },
    VideoTxName: {
      type: String,
      default: '视频通讯'
    },
    VideoTxurl: {
      type: String,
      default: ''
    },
    isShowFavoriteBtn: {
      type: Boolean,
      default: true
    },
    isShowFSBtn: {
      type: Boolean,
      default: true
    },
    isShowTHBtn: {
      type: Boolean,
      default: true
    },
    isshowcb: {
      type: Boolean,
      default: false
    },
    isshowfk: {
      type: Boolean,
      default: false
    },
    dateFormatShow: {
      type: Boolean,
      default: true
    },
    isShowAlternatefield: {
      type: Boolean,
      default: false
    },
    AlternatefieldName: {
      type: String,
      default: ''
    },
    isshowbytwo: {
      type: Boolean,
      default: false
    },
    bytwoname: {
      type: String,
      default: ''
    },
    isshowbythree: {
      type: Boolean,
      default: false
    },
    bythreename: {
      type: String,
      default: ''
    },
    fontGgColor: {
      type: String,
      default: ''
    },
    modulecolor: {
      type: String,
      default: ''
    },
    isShowPlusImg: {
      type: Boolean,
      default: false
    },
    PlusOpenType: {
      type: String,
      default: '_blank'
    },
    whNameWidth: {
      type: String,
      default: '170px'
    },
    bytwowidth: {
      type: String,
      default: '170px'
    },
    bythreewidth: {
      type: String,
      default: '170px'
    },
    userNameWidth: {
      type: String,
      default: '90px'
    },
    dateWidth: {
      type: String,
      default: '150px'
    },
    unreadisBold: {
      // 未读是否加粗显示
      type: Boolean,
      default: true
    },
    usernameTextAligin: {
      type: String,
      default: 'right'
    },
    moreShowType: {
      type: String,
      default: 'icon'
    },
    tabclickopen: {
      type: Boolean,
      default: false
    },
    isshowmore: {
      type: Boolean,
      default: true
    },
    bordertype: {
      type: String,
      default: 'square'
    },
    roundsize: {
      type: String,
      default: '4px'
    }
  },
  data () {
    return {
      // 设置是否需要获取设置属性
      isGetCtrlSetInfo: true,
      activeName: 'alldo',
      // activeNewFile: '',
      // activeNewFileUrl: {},
      activeNewAdd: {},
      centerDialogVisible: false,
      tabdata: [],
      height: 600,
      showDialog: false,
      pageSize: 7,
      searchValue: '',
      isShowSearchInput: false,
      isShowTodoBtn: false,
      isShowReadBtn: false,
      toReadIds: [],
      loadedTabName: ',',
      allTabNames: '',
      showCtrlSetDialog: false,
      CtrlSetDialogUrl: '',
      CtrlSetDialogTitle: '设置',
      CtrlSetInfo: {},
      dialogVisibleVideo: false,
      selectTabData: [],
      dialogHeight: 600,
      skin: 'blue',
      settingShow: true,
      arrayItems_todo: [],
      globalFontSize: 'small',
      isWhiteColor: false, // 白色底色需要加margin
      cardTabBgColor: '#FFFFFF',
      marginStr: 0,
      tabslist: {},
      isselectall: false, // 全选状态
      isdatalist: false, // 我的待阅tab
      plusPopupTitle: '全部', // + 号弹窗显示的title
      plusPopupUrl: '', // + 号弹窗地址
      dialogVisiblePlus: false,
      retype: '',
      canRun: true,
      myzzShow: true
    }
  },
  computed: {
    isShowData () {
      return {
        statusIcon: this.statusIcon,
        ydstatusIcon: this.ydstatusIcon,
        isShowDate: this.isShowDate,
        isShowModuleName: this.isShowModuleName,
        isShowBtns: this.isShowBtns,
        isShowTimeout: this.isShowTimeout,
        timeoutColor: this.timeoutColor,
        isShowFavoriteBtn: this.isShowFavoriteBtn,
        isShowFSBtn: this.isShowFSBtn,
        isShowTHBtn: this.isShowTHBtn,
        isshowcb: this.isshowcb,
        isshowfk: this.isshowfk,
        dateFormatShow: this.dateFormatShow,
        isShowAlternatefield: this.isShowAlternatefield,
        AlternatefieldName: this.AlternatefieldName,
        isshowbytwo: this.isshowbytwo,
        bytwoname: this.bytwoname,
        isshowbythree: this.isshowbythree,
        bythreename: this.bythreename
      }
    },
    rightThreeColumn () {
      return {
        whNameWidth: this.whNameWidth,
        userNameWidth: this.userNameWidth,
        dateWidth: this.dateWidth,
        bytwowidth: this.bytwowidth,
        bythreewidth: this.bythreewidth
      }
    },
    getTabsCSS () {
      return [this.titleBarStyle == 'borderbottom' ? 'borderm20' : '', this.isWhiteColor ? 'margin20' : 'otherMargin', this.isShowSearch ? 'tabs-sousuo' : '', this.activeName != 'alldo' && !this.isdatalist ? 'ts-el-tabs-small' : this.isShowTodoBtn || this.isShowReadBtn || this.activeName == 'toread' ? 'ts-el-tabs' : '', this.activeName == 'remote_doc_exchange' && this.tabslist['remote_doc_exchange']['receiveRemoteDoc'] ? 'ts-el-tabs-long' : '', this.activeName == 'toread' && this.isShowReadBtn ? 'ts-el-tabs-long2' : '', this.moreShowType == 'moreone' ? 'morewz' : '']
    }
  },
  watch: {
    titleBarBgColor () {
      this.getWholeStyle()
    }
  },
  methods: {
    goVideoTx () {
      if (!this.VideoTxurl) return
      let targetObj = {}
      switch (this.VideoOpenType) {
        case 'popup':
          this.dialogVisibleVideo = true
          break
        case '_blank':
          window.open(this.dsf.config.webRoot.webPath + this.VideoTxurl, '_blank')
          break
        case 'addtab':
          targetObj = {
            action: this.dsf.config.webRoot.webPath + this.VideoTxurl,
            name: this.VideoTxName,
            target: 'main'
          }
          window.$$iframeCtrl && window.$$iframeCtrl.addTab(targetObj)
          break
      }
    },
    // 去掉首尾逗号
    trimStr (str) {
      return str.replace(/^(,)+|(,)+$/g, '')
    },
    // 接收远程文件
    receiveRemote () {
      let obj = this.tabslist['remote_doc_exchange']
      eval(obj.receiveRemoteDocUrl || '')
    },
    // 我的待阅-全选
    allSelectBtn () {
      this.isselectall = !this.isselectall
      let ary = this.trimStr(this.loadedTabName).split(',')
      ary = Array.from(new Set(ary)) // 去重
      let targetIndex = ary.findIndex((item) => item == 'toread')
      if (this.isselectall) {
        this.$refs.child[targetIndex].selectAll()
      } else {
        this.$refs.child[targetIndex].UnSelectAll()
      }
    },
    goNewFile () {
      this.tabdata.forEach((element) => {
        if (element.tab == this.activeName) {
          this.activeNewAdd = element
        }
      })
      const currObj = this.activeNewAdd

      if (currObj) {
        if (typeof currObj.newFileUrl === 'string') {
          this.newModuleForm(currObj.newFileUrl)
        } else {
          const openUrl = this.dsf.config.webRoot.webPath + currObj.newFileUrl.url
          this.initOpenType(this.PlusOpenType, openUrl)
        }
      }
    },
    initOpenType (type, openUrl) {
      let targetObj = {}
      switch (type) {
        case 'popup':
          this.plusPopupUrl = openUrl
          this.dialogVisiblePlus = true
          break
        case '_blank':
          window.open(openUrl, '_blank')
          break
        case 'addtab':
          targetObj = {
            action: openUrl,
            name: this.plusPopupTitle,
            target: 'main'
          }
          window.$$iframeCtrl && window.$$iframeCtrl.addTab(targetObj)
          break
      }
    },
    newModuleForm (moduleId) {
      let data = {
        moduleId: moduleId
      }
      let that = this
      let urlval = 'ctrl/formControl/getDraftXForm'
      this.$httpServer
        .post(this.dsf.config.webRoot.webPath + urlval, data)
        .then((res) => {
          console.log(res.data)
          const result = res.data
          if (result.type == 'success') {
            let url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?moduleId=' + moduleId
            let len = result.data.org.length
            if (len > 1) {
              let content = '<div class="layui-form layui-inline choose-mult-org " style="padding: 20px 50px;"><div class="layui-input-inline">'
              for (let i = 0; i < len; i++) {
                let d = result.data.org[i]

                let showName = ''
                if (d.unitName) {
                  showName += d.unitName + '-'
                }
                if (d.orgNameLV1) {
                  showName += d.orgNameLV1 + '-'
                }
                if (d.orgNameLV2) {
                  showName += d.orgNameLV2 + '-'
                }
                if (d.orgNameLV3) {
                  showName += d.orgNameLV3 + '-'
                }
                if (d.orgNameLV4) {
                  showName += d.orgNameLV4 + '-'
                }
                if (d.orgNameLV5) {
                  showName += d.orgNameLV5 + '-'
                }
                showName = showName.substring(0, showName.length - 1)

                content += '<input type="radio" name="org" value="' + d.id + '" title="' + showName + '" /><br/>'

                // content += '<input type="radio" name="org" value="' + d.id + '" title="' + showName + "\" checked='checked' /><br/>"
              }
              content += '</div></div><p/>'
              let height = 150 + 42 * len
              top.layer.open({
                type: 1,
                title: '请选择拟稿部门',
                area: ['500px', height + 'px'],
                content: content,
                btn: ['确认', '取消'],
                yes: function (aindex, layero) {
                  let orgId = $(layero).find('input[type=radio]:checked').val()
                  url += '&draftOrgId=' + orgId
                  // simpleWin(this,{"url": url,"isfresh":true})
                  that.initOpenType(that.PlusOpenType, url)
                  top.layer.closeAll()
                  top.layer.close(aindex)
                },
                no: function (aindex, layero) {
                  top.layer.close(aindex)
                },
                success: function () {
                  // 切记此处是 top.layui
                  top.layui.form.render('radio')
                }
              })
            } else {
              top.layer.closeAll()
              // simpleWin(this,{"url": url,"isfresh":true})
              that.initOpenType(that.PlusOpenType, url)
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    searchBlur () {
      let that = this
      setTimeout(function () {
        that.searchValue == '' ? (that.isShowSearchInput = false) : ''
      }, 1000)
    },
    showCtrlSetDialogFun () {
      let that = this
      // 设置面板关闭事件
      window.closeCtrlSetDialog = function () {
        that.showCtrlSetDialog = false
        // 刷新获取设置数据方法
        that.getCtrlSetInfo()
      }
      window.closeDialog = window.closeCtrlSetDialog
      that.showCtrlSetDialog = true
    },
    getWholeStyle () {
      if (this.cardTabBgColor) {
        if (this.cardTabBgColor.toUpperCase() == '#FFFFFF' || this.cardTabBgColor.toUpperCase() == 'FFFFFF') {
          this.isWhiteColor = true
        } else {
          this.isWhiteColor = false
        }
      }
      if (this.titleBarBgColor) {
        if (this.titleBarBgColor.toUpperCase() == '#FFFFFF') {
          this.isWhiteColor = true
        } else {
          this.isWhiteColor = false
        }
      }
      console.log('this.isWhiteColor', this.isWhiteColor)
    },
    getContainboxStyle (isListStyle) {
      let styleObject = {
        height: this.height - 60 + 'px'
      }
      if (this.contentBgType == 0) {
        // 跟随主题变化
        switch (this.skin) {
          case 'blue':
            styleObject['background'] = `rgba(27,95,164,${this.contentBgAlpha / 100}) !important`
            break
          case 'inblue':
            styleObject['background'] = `rgba(0,128,255,${this.contentBgAlpha / 100}) !important`
            break
          case 'green':
            styleObject['background'] = `rgba(24,154,91,${this.contentBgAlpha / 100}) !important`
            break
          case 'ycgreen':
            styleObject['background'] = `rgba(2,106,82,${this.contentBgAlpha / 100}) !important`
            break
          case 'red':
            styleObject['background'] = `rgba(198,47,38,${this.contentBgAlpha / 100}) !important`
            break
          case 'black':
            styleObject['background'] = `rgba(255,211,126,${this.contentBgAlpha / 100}) !important`
            break
          case 'orange':
            styleObject['background'] = `rgba(255,106,0,${this.contentBgAlpha / 100}) !important`
            break
        }
      } else if (this.contentBgType == 1) {
        // 自定义颜色
        styleObject['background'] = this.contentBgColor + (this.contentBgColor.indexOf('important') == -1 ? ' !important' : '')
      }
      return styleObject
    },
    getHoverBarStyle (isListStyle) {
      let styleObject = {}
      if (this.hoverBarBgType == 0) {
        // 跟随主题变化
        switch (this.skin) {
          case 'blue':
            styleObject['background'] = `rgba(27,95,164,${this.hoverBarBgAlpha / 100}) !important`
            break
          case 'inblue':
            styleObject['background'] = `rgba(0,128,255,${this.hoverBarBgAlpha / 100}) !important`
            break
          case 'green':
            styleObject['background'] = `rgba(24,154,91,${this.hoverBarBgAlpha / 100}) !important`
            break
          case 'ycgreen':
            styleObject['background'] = `rgba(2,106,82,${this.hoverBarBgAlpha / 100}) !important`
            break
          case 'red':
            styleObject['background'] = `rgba(198,47,38,${this.hoverBarBgAlpha / 100}) !important`
            break
          case 'black':
            styleObject['background'] = `rgba(255,211,126,${this.hoverBarBgAlpha / 100}) !important`
            break
          case 'orange':
            styleObject['background'] = `rgba(255,106,0,${this.hoverBarBgAlpha / 100}) !important`
            break
        }
      } else if (this.hoverBarBgType == 1) {
        // 自定义颜色
        styleObject['background'] = this.hoverBarBgColor + (this.hoverBarBgColor.indexOf('important') == -1 ? ' !important' : '')
      }
      return styleObject
    },
    getCtrlSetInfo () {
      this.CtrlSetInfo = {}
      let url = this.dsf.config.webRoot.webPath.replace('/', '') + `ctrl/dsfa/rm/componentdeDefinition?pageId=${this.getUrlParam('pageId').split('#')[0]}&componentId=${this.dataId}`
      // let url = this.dsf.config.webRoot.webPath.replace("/", "") + 'ctrl/dsfa/rm/componentdeDefinition?pageId=201029154538r0v3kTdCRNUpDmviVrF&componentId=201030151355yd3GVp62aWLLsuSkTL0'
      let that = this
      window.loadingCount = (window.loadingCount || 0) + 1
      if (window.loadingCount <= 1) {
        window.loadingInstance = this.$Loading.service()
      }
      this.$httpServer
        .get(url)
        .then((res) => {
          if (res && res.data && res.data.data) {
            console.log('设置的接口数据', res)
            var yxArrar = res.data.data['p-sz'] || res.data.data['p-yx'] || []
            // 存在待签收tab则加载
            // yxArrar &&
            var pdres = yxArrar.find((v) => {
              return v.value == 'remote_doc_exchange'
            })
            if (pdres) this.loadOuterJs(dsf.url.getWebUrl('/resource/js/business-common.js'))
            that.selectTabData = yxArrar
            that.loadedTabName = ','
            that.CtrlSetInfo = res.data.data
            that.getDbData()
            if (res.data.data.szsfxs && res.data.data.szsfxs.length > 0) {
              that.settingShow = res.data.data.szsfxs[0].value == '1'
            }
            if (res.data.data.zzsfxs && res.data.data.zzsfxs.length > 0) {
              that.myzzShow = res.data.data.zzsfxs[0].value == '1'
            } else {
              that.myzzShow = false
            }
          }
          window.loadingCount = window.loadingCount - 1
          if (window.loadingCount <= 0) {
            window.loadingInstance.close()
          }
        })
        .catch((err) => {
          console.log(err)
          window.loadingCount = window.loadingCount - 1
          if (window.loadingCount <= 0) {
            window.loadingInstance.close()
          }
        })
    },
    /**
     * 获取到了设置信息返回结果
     */
    CtrlSetInfoCallback (resData) {
      let that = this
      if (resData) {
        console.log('【待办列表】设置的接口数据【待办列表】', resData)
        var yxArrar = resData['p-sz'] || resData['p-yx'] || []
        var pdrestwo =
          (yxArrar &&
            yxArrar.find((v) => {
              return v.value == 'remote_doc_feedback'
            })) ||
          undefined
        if (pdrestwo) this.loadOuterJs(dsf.url.getWebUrl('/resource/js/public.js?v=v1.016.000.20200917_beta'))
        // 存在待签收tab则加载
        var pdres =
          (yxArrar &&
            yxArrar.find((v) => {
              return v.value == 'remote_doc_exchange'
            })) ||
          undefined
        if (pdres) this.loadOuterJs(dsf.url.getWebUrl('/resource/js/business-common.js'))
        that.selectTabData = yxArrar
        that.loadedTabName = ','
        that.CtrlSetInfo = resData
        if (resData.szsfxs && resData.szsfxs.length > 0) {
          that.settingShow = resData.szsfxs[0].value == '1'
        }
        if (resData.zzsfxs && resData.zzsfxs.length > 0) {
          that.myzzShow = resData.zzsfxs[0].value == '1'
        } else {
          that.myzzShow = false
        }
      }
      this.$nextTick(() => {
        setTimeout(() => {
          let elementHeight = $('.dblist-' + that.dataId).parent().parent().outerHeight()
          let marginStr = that.getContainHeight()
          that.marginStr = marginStr
          that.height = that.fixedHeight != 0 ? that.fixedHeight : parseInt(elementHeight) - parseInt(marginStr)
          if (that.fixedHeight != 0) {
            that.pageSize = parseInt((that.fixedHeight - 60) / 44) < 1 ? 1 : parseInt((that.fixedHeight - 60) / 44)
          } else {
            that.pageSize = parseInt((that.height - 60) / 44) < 1 ? 1 : parseInt((that.height - 60) / 44)
          }
        }, 100)
      })
    },
    getTwoWhere (tab) {
      let that = this
      if (that.CtrlSetInfo[tab] && that.CtrlSetInfo[tab].length > 0) {
        return that.CtrlSetInfo[tab]
      } else {
        return []
      }
    },
    getSortType () {
      let that = this
      if (that.CtrlSetInfo.sortType && that.CtrlSetInfo.sortType.length > 0) {
        return that.CtrlSetInfo.sortType[0].value
      } else {
        return 1
      }
    },
    changeBtnStatus (objectArgs) {
      if (this.activeName == 'todo' || this.activeName == 'todoagency') {
        this.isShowTodoBtn = objectArgs.ischeck
        this.arrayItems_todo = objectArgs.arrayItems
      }
      if (this.activeName == 'toread') {
        this.isShowReadBtn = objectArgs.ischeck
        this.isdatalist = objectArgs.datalen > 0 // 批量阅毕-- 没数据后  不再显示全选按钮
        this.toReadIds = objectArgs.arrayIds
      }
    },
    toreadChange (len) {
      this.isdatalist = len > 0
    },
    batchRead () {
      // 阅毕
      let that = this
      if (this.toReadIds.length == 0) {
        return
      }

      MessageBox.confirm('是否确认进行批量阅毕', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirmButtonClass-skin-' + that.skin
      })
        .then(() => {
          console.log('that.toReadIds--', that.toReadIds.join(','))
          DSF.Utils.ajaxRequest(
            that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/shareRead/readedIds',
            {
              distribIds: that.toReadIds.join(',')
            },
            function (result) {
              if (result.type == 'success') {
                that.openSuccess('阅毕成功！')
                that.isShowReadBtn = false
                that.isselectall = false // 把取消全选状态设置为初始状态(全选)
                that.getDbData(that.activeName)
              } else {
                that.openError('阅毕失败！')
              }
            }
          )
        })
        .catch(() => {})
    },
    searchIconClick () {
      this.isShowSearchInput = true
      var that = this
      setTimeout(() => {
        that.$refs.wysearch.focus()
      }, 500)
    },
    replaceAction (action) {
      if (action.indexOf('http') == -1) {
        return this.dsf.config.webRoot.webPath + action
      } else {
        return action
      }
    },
    addTab (name, url) {
      if ((window.$iframeCtrl && window.$iframeCtrl.addTab) || (top.window.$iframeCtrl && top.window.$iframeCtrl.addTab)) {
        let targetObj = {
          action: this.replaceAction(url),
          isTabReload: '-1',
          name: name || '',
          target: 'main'
        }
        if (window.$iframeCtrl) {
          window.$iframeCtrl.addTab(targetObj)
        } else {
          top.window.$iframeCtrl.addTab(targetObj)
        }
      }
    },
    beforeLeave (currentName) {
      let that = this
      let name = '', url = ''
      // let condition = ['doneunify', 'readunify', 'recover', 'to_favorite', 'toremind']
      let condition = ['doneunify', 'readunify', 'recover', 'tosearch']
      if (condition.includes(currentName)) {
        that.tabdata.forEach((element) => {
          if (element.tab == currentName) {
            name = element.show
            url = element.taburl || ''
          }
        })
        if (url) this.addTab(name, url)
        return false
      }
    },
    handleClick (tab, event) {
      let condition = ['doneunify', 'readunify', 'recover', 'tosearch']
      if (condition.includes(tab.name)) return
      // console.log('tab-handle', tab)
      let that = this
      // console.log('that.loadedTabName', that.loadedTabName);
      that.loadedTabName = that.loadedTabName + tab.name + ','
      // console.log('that.loadedTabName', that.loadedTabName);
      that.tabdata.forEach((element) => {
        if (element.tab == this.activeName) {
          this.activeNewAdd = element
          this.plusPopupTitle = element.show
        }
      })
      // 判断是否是第一次点击 第一次点击不再刷新
      let ary = this.trimStr(this.loadedTabName).split(',')
      ary = Array.from(new Set(ary)) // 去重
      let targetIndex = ary.findIndex((item) => item == this.activeName)
      this.$nextTick(() => {
        this.$refs.child[targetIndex] && this.$refs.child[targetIndex].getDbData(true)
      })
    },
    getDbData (selActiveName) {
      if (this.selectTabData.length == 0) {
        return
      }
      let that = this
      that.activeName = selActiveName || this.selectTabData[0].value
      that.plusPopupTitle = this.selectTabData[0].text // 2021/12/06
      that.loadedTabName = that.loadedTabName + that.activeName + ','
      var allTabName = []
      for (let index = 0; index < this.selectTabData.length; index++) {
        const element = this.selectTabData[index]
        allTabName.push(element.value)
      }
      that.allTabNames = allTabName.join(',')

      let url = this.dsf.config.webRoot.webPath + this.countUrl

      url = url + (url.indexOf('?') > -1 ? '&' : '?')
      url = url + `tabTypes=${that.allTabNames}`

      // 2022-01-07
      // window.loadingCount = (window.loadingCount || 0) + 1;
      // if (window.loadingCount <= 1) {
      //     window.loadingInstance = this.$Loading.service()
      // }

      // this.tabdata = [];

      this.$httpServer
        .get(url)
        .then((res) => {
          if (res && res.data && res.data.data) {
            var tabs = res.data.data.tabs
            that.tabslist = tabs
            if (that.countUrlExe) {
              // 如果有扩展接口在扩展接口里面接着获取数据并且合并数据
              that.getExeDbData(tabs)
            } else {
              var allTabData = []
              for (let index = 0; index < that.selectTabData.length; index++) {
                const element = that.selectTabData[index]
                const element1 = tabs[element.value]
                allTabData.push({
                  tab: element.value,
                  show: element.text,
                  num: element1 ? (parseInt(element1.count) > 99 && parseInt(element1.count) < 999 ? '99+' : parseInt(element1.count) > 999 ? '999+' : element1.count) : 0,
                  num1: element1 ? (parseInt(element1.count) > 99 ? 99 : element1.count) : 0,
                  moreUrl: element1 && element1.moreUrl ? element1.moreUrl : '',
                  newFileUrl: element1 && element1.newFileUrl ? element1.newFileUrl : '',
                  target: element1 && element1.target ? element1.target : '',
                  taburl: element1 && element1.url ? element1.url : ''
                })
              }
              that.tabdata = []
              that.$nextTick(() => {
                that.handleTabData(allTabData, selActiveName)
              })
              // that.handleTabData(allTabData, selActiveName);
            }
          }
          // window.loadingCount = window.loadingCount - 1;
          // if (window.loadingCount <= 0) {
          //     window.loadingInstance.close();
          // }
        })
        .catch((err) => {
          console.log(err)
          // window.loadingCount = window.loadingCount - 1;
          // if (window.loadingCount <= 0) {
          //     window.loadingInstance.close();
          // }
        })
    },
    getExeDbData (prevTabs) {
      let that = this

      let url = this.dsf.config.webRoot.webPath + this.countUrlExe

      url = url + (url.indexOf('?') > -1 ? '&' : '?')
      url = url + `tabTypes=${that.allTabNames}`

      // window.loadingCount = (window.loadingCount || 0) + 1;
      // if (window.loadingCount <= 1) {
      //     window.loadingInstance = this.$Loading.service()
      // }

      // this.tabdata = [];

      this.$httpServer
        .get(url)
        .then((res) => {
          if (res && res.data && res.data.data) {
            var tabs = res.data.data.tabs
            var allTabData = []

            for (let index = 0; index < that.selectTabData.length; index++) {
              const element = that.selectTabData[index]
              const element1 = prevTabs[element.value]
              // var tabNum = prevTabs[element.value] ? (parseInt(prevTabs[element.value].count) > 99 ? 99 : prevTabs[element.value].count) : 0;
              // var moreUrl = prevTabs[element.value] && prevTabs[element.value].moreUrl ? prevTabs[element.value].moreUrl : "";
              var tabNum = element1 ? (parseInt(element1.count) > 99 && parseInt(element1.count) < 999 ? '99+' : parseInt(element1.count) > 999 ? '999+' : element1.count) : 0
              var tabNum1 = element1 ? (parseInt(element1.count) > 99 ? 99 : element1.count) : 0
              var moreUrl = element1 && element1.moreUrl ? element1.moreUrl : ''
              var newFileUrl = element1 && element1.newFileUrl ? element1.newFileUrl : ''
              var targetType = element1 && element1.target ? element1.target : ''
              var openurl = element1 && element1.url ? element1.url : ''
              if (tabs[element.value]) {
                const element2 = tabs[element.value]
                tabNum = element2 ? (parseInt(element2.count) > 99 && parseInt(element2.count) < 999 ? '99+' : parseInt(element2.count) > 999 ? '999+' : element2.count) : 0
                tabNum1 = element2 ? (parseInt(element2.count) > 99 ? 99 : element2.count) : 0
                moreUrl = element2 && element2.moreUrl ? element2.moreUrl : ''
                newFileUrl = element2 && element2.newFileUrl ? element2.newFileUrl : ''
                targetType = element2 && element2.target ? element2.target : ''
                openurl = element2 && element2.url ? element2.url : ''
              }
              allTabData.push({
                tab: element.value,
                show: element.text,
                num: tabNum,
                num1: tabNum1,
                moreUrl: moreUrl,
                newFileUrl: newFileUrl,
                target: targetType,
                taburl: openurl
              })
            }
            that.tabdata = []
            that.$nextTick(() => {
              that.handleTabData(allTabData)
            })
            // that.handleTabData(allTabData);
          }
          // window.loadingCount = window.loadingCount - 1;
          // if (window.loadingCount <= 0) {
          //     window.loadingInstance.close();
          // }
        })
        .catch((err) => {
          console.log(err)
          // window.loadingCount = window.loadingCount - 1;
          // if (window.loadingCount <= 0) {
          //     window.loadingInstance.close();
          // }
        })
    },
    handleTabData (tabdata, selActiveName) {
      if (selActiveName) this.activeName = selActiveName
      let that = this
      // 处理标签页无内容时隐藏，默认为否；但至少需要保留一个标签
      let handleData = tabdata
      let ctrlSetInfoData = that.CtrlSetInfo
      // this.activeNewFile = tabdata[0].newFileUrl; //2021-11-04
      this.activeNewAdd = tabdata[0] // 2021-12-06
      console.log('this.activeNewAdd', this.activeNewAdd)
      if (ctrlSetInfoData && ctrlSetInfoData.autoHiddenTab && ctrlSetInfoData.autoHiddenTab.length > 0) {
        const isAuto = ctrlSetInfoData.autoHiddenTab[0].value == '1'
        if (isAuto && handleData && handleData.length > 1) {
          let newHandleData = []
          handleData.map((item, index) => {
            if (item.num > 0) {
              newHandleData.push(item)
            }
          })
          if (newHandleData.length == 0) {
            newHandleData.push(handleData[0])
          }
          that.tabdata = newHandleData
        } else {
          that.tabdata = tabdata
        }
      } else {
        that.tabdata = tabdata
      }

      // 再次检验选中tab是否在tabdata中
      let hasExistsTab = false
      that.tabdata && that.tabdata.forEach((titem) => {
        if (titem.tab == that.activeName) {
          hasExistsTab = true
        }
      })
      if (!hasExistsTab && that.tabdata.length > 0) {
        that.activeName = that.tabdata[0].tab
      }
    },
    goPage () {
      let that = this
      let url = ''
      let name = ''
      switch (this.activeName) {
        case 'todo':
          url = this.dsf.config.webRoot.webPath + 'ctrl/inbox/toInboxlist?isDelay=false'
          break
        case 'todoagency':
          url = this.dsf.config.webRoot.webPath + 'ctrl/inboxagency/agencyList'
          break
        case 'toread':
          url = this.dsf.config.webRoot.webPath + 'ctrl/personalpend/toPendListData'
          break
        case 'tomeet':
          url = this.dsf.config.webRoot.webPath + 'ctrl/list/190906141704UdhBOWQJR6Htt2YIZ1S?moduleId=1909061410230KuRDM8p31ewn6QZAv6'
          break
        case 'topaper':
          url = this.dsf.config.webRoot.webPath + 'ctrl/notepaper/tab'
          break
        case 'dbtask':
          url = this.dsf.config.webRoot.webPath + 'ctrl/list/190325203824Zx1do5DuzGHzZ7wyVtg?moduleId=190323145209SuSc9CTjs9rg88i22T1'
          break
        case 'to_favorite':
          url = this.dsf.config.webRoot.webPath + 'ctrl/myFavorite/index'
          break
        case 'toremind':
          url = this.dsf.config.webRoot.webPath + 'ctrl/remind/index'
          break
        case 'notice':
          url = this.dsf.config.webRoot.webPath + 'ctrl/notice/list?moduleId=180805175628RK7ixI1IyrjDuG4njD5'
          break
        case 'tododelaydb':
          url = this.dsf.config.webRoot.webPath + 'ctrl/inbox/toInboxlist?isDelay=true'
          break
        case 'processed':
          url = this.dsf.config.webRoot.webPath + 'ctrl/personaldeal/toDealList'
          break
        default:
          break
      }
      // 循环查找对应的tab更多
      that.tabdata.map((item) => {
        if (item.tab == that.activeName) {
          name = item.show
          if (item.moreUrl) url = that.dsf.config.webRoot.webPath + item.moreUrl
        }
      })
      // 开启多tab
      if (this.CtrlSetInfo && this.CtrlSetInfo.sortType && this.CtrlSetInfo.sortType.length > 0) {
        if (this.CtrlSetInfo.sortType[0].value) {
          url += url.indexOf('?') > -1 ? '&sortType=' + this.CtrlSetInfo.sortType[0].value : '?sortType=' + this.CtrlSetInfo.sortType[0].value
        }
      }
      if (url) {
        if (this.activeNewAdd.target && this.activeNewAdd.target == '_blank') {
          window.open(url, '_blank')
          return
        }
        if (window.$$iframeCtrl && window.$$iframeCtrl.addTab) {
          let targetObj = {
            action: url,
            name: name || '',
            target: 'main'
          }
          window.$$iframeCtrl.addTab(targetObj)
        } else if (top.window.$$iframeCtrl && top.window.$$iframeCtrl.addTab) {
          let targetObj = {
            action: url,
            name: name || '',
            target: 'main'
          }
          top.window.$$iframeCtrl.addTab(targetObj)
        } else {
          window.open(url, '_blank')
        }
      }
    },
    openSuccess (message) {
      this.$message({
        showClose: true,
        message: message || '操作成功',
        type: 'success'
      })
    },
    openError (message) {
      this.$message({
        showClose: true,
        message: message || '操作失败',
        type: 'error'
      })
    },
    batchSend () {
      window.flowPage = 2
      // 批量办理
      var that = this
      window.top.batchSendType = 1
      this.firstData = {}
      var pks = ''
      var pnIds = ''
      var lastModuleId = ''
      var lastNodeId = ''
      var lastFlowId = ''

      var isCanBatchSend = true

      var checkItems = this.arrayItems_todo

      for (var key in checkItems) {
        pks = pks + ',' + checkItems[key].infoId
        pnIds = pnIds + ',' + checkItems[key].pnid

        if (lastModuleId == '') {
          lastModuleId = checkItems[key].moduleId
        } else if (lastModuleId != checkItems[key].moduleId) {
          isCanBatchSend = false
          break
        }

        if (lastFlowId == '') {
          lastFlowId = checkItems[key].flowId
        } else if (lastFlowId != checkItems[key].flowId) {
          isCanBatchSend = false
          break
        }

        if (lastNodeId == '') {
          lastNodeId = checkItems[key].nodeId
        } else if (lastNodeId != checkItems[key].nodeId) {
          isCanBatchSend = false
          break
        }
      }
      if (Object.keys(this.firstData).length === 0) {
        this.firstData = checkItems[0]
      }

      if (!isCanBatchSend) {
        this.openError('选择的文件必须为同一类型、同一流程和同一环节')
        return
      }

      var validateParam = {
        pk: this.firstData.infoId,
        moduleId: this.firstData.moduleId,
        flowId: this.firstData.flowId,
        nodeId: this.firstData.nodeId,
        pId: this.firstData.pid,
        pnId: this.firstData.pnid,
        validateControls: 'opinion'
      }
      DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/xform/validate', validateParam, function (result) {
        if (result.type != 'success') {
          var config = {
            url: that.dsf.config.webRoot.webPath + 'ctrl/inbox/editOpinion',
            closeBtn: 1,
            area: '800,540',
            title: '请填写意见',
            btn: ['发送', '取消'],
            isfresh: false,
            reloadGrid: false,
            yes: function (index, layero) {
              var opinion = top.window['layui-layer-iframe' + index].getOpinion()
              // 保存意见
              var data = {
                pks: pks,
                pnIds: pnIds,
                opinion: opinion
              }

              DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/inbox/saveOpinion', data, function (res) {
                if (res.type == 'success') {
                  top.layer.close(index)
                  that.sendFlow(checkItems)
                } else {
                  that.openError('意见保存失败')
                }
              })
            },
            callback: function () {
              // alert(1111111111);
            }
          }
          that.openWinView(this, config)
        } else {
          that.sendFlow(checkItems)
        }
      })
    },
    sendFlow (checkItems) {
      var that = this
      if (Object.keys(checkItems).length > 1) {
        window.top.batchSendFlow = 1
      } else {
        window.top.batchSendFlow = 0
      }

      window.top.batchSendFiles = checkItems

      // 第一个文件
      var sendData = {
        sendType: 'SR_SEND',
        pk: this.firstData.infoId,
        bt: this.firstData.bt,
        pId: this.firstData.pid,
        pnId: this.firstData.pnid,
        flowId: this.firstData.flowId,
        nodeId: this.firstData.nodeId,
        moduleId: this.firstData.moduleId,
        moduleName: this.firstData.moduleName,
        nodeName: this.firstData.nodeName,
        agencyType: '0'
      }

      var exInfo = {
        mj: this.firstData.mj,
        mjText: this.firstData.mjText || ''
      }

      sendData.exInfo = JSON.stringify(exInfo)

      if (window.top.batchSendFlow == 1) {
        sendData.disableAutoSend = 1
      }

      that.Flowsend(sendData, function () {
        // 重新加载待办
        that.getDbData(that.activeName)
      })
    },
    Flowsend (data, success) {
      let that = this
      data.bt = data.bt.replace(/\s*/g, '')
      // 发送前
      var result = DSF.Utils.ajaxSyncRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/flow/beforeSend', data)
      if (result.type != 'success') {
        DSF.XForm && DSF.XForm.triggerRemoveDisable && DSF.XForm.triggerRemoveDisable()
        return
      }

      window.top.selectedLines = []
      window.top.SendRequestID = ''
      window.top.sendData = data
      window.top.afterSendSuccess = success

      // window.top.sendData = sendData;
      var sendData = window.top.sendData
      // 批量发送类型，batchSendType: 2根据流程配置发送，其他使用第一个接收人默认发送
      if (window.top.batchSendFlow && window.top.batchSendFlow == 1) {
        if (window.top.batchSendType == 2) {
          sendData.disableAutoSend = -2
        }
      }

      DSF.Utils.ajaxRequestStr(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/flow/sendRequest', sendData, function (result) {
        if (result.type == 'success') {
          var data = result.data
          window.top.ResponseObject = data.ResponseObject[0]
          var SendRequestID = window.top.ResponseObject.SendRequestID
          window.top.SendRequestID = SendRequestID

          if (window.top.ResponseObject && window.top.ResponseObject.NextNodes && window.top.ResponseObject.NextNodes.Line) {
            window.top.selectedLines = window.top.ResponseObject.NextNodes.Line
          } else {
            window.top.selectedLines = []
          }

          that._parseResult()
        } else if (result.type == 'error') {
          that.openError(result.message)
        }
      })
    },
    _parseResult (lines) {
      let that = this
      var Status = window.top.ResponseObject.Status

      if (Status.startsWith('1000')) {
        that.openSuccess('发送成功')
        that._afterSend()
      } else if (Status.startsWith('3000')) {
        that.sendInView()
      } else if (Status.startsWith('4000')) {
        if (window.location.href.indexOf('SR_EXSEND') > 0) {
          window.location.href = window.location.href.replace('SR_EXSEND', 'SELECT_USER')
        } else if (window.top.sendData.sendType == 'SR_EXSEND') {
          window.top.sendData.oldSendType = window.top.sendData.sendType
          window.top.sendData.sendType = 'SR_SEND'
          Flow.sendInView(0)
        } else if (lines && lines.length > 0) {
          // if(window.location.href.indexOf("SR_JUMPSEND") > 0){
          //     init();
          // }else if(window.top && window.top && window.top.flowPage && window.top.flowPage > 1){
          //     if(window.top.flowPage == 2){
          //         init();
          //     }
          // }else{
          //     window.location.href=window.location.href.replace("SR_SEND","SELECT_USER");
          // }
        } else {
          that.sendInView()
        }
      } else if (Status.startsWith('5000')) {
        that.openSuccess('发送成功')
        that._afterSend()
      } else if (Status.startsWith('5100')) {
        that.openSuccess('办理成功')
        that._afterSend()
      } else if (Status.startsWith('6000')) {
        that.openSuccess('办结成功')
        that._afterSend()
      } else if (Status.startsWith('8100')) {
        // _autoProcessingBranch();
        that.sendInView()
      } else if (Status.startsWith('9000')) {
        var errorMessage = '发送失败，请检查后再次发送'
        if (window.top.ResponseObject.ErrorMessage) {
          errorMessage = window.top.ResponseObject.ErrorMessage
        }
        that.openError(errorMessage)
      }
    },
    _afterSend () {
      let that = this
      var data = window.top.sendData
      var success = window.top.afterSendSuccess
      var result = DSF.Utils.ajaxSyncRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/lock/form/unlock', {
        pk: data.pk,
        type: 2,
        pId: data.pId,
        pnId: data.pnId
      })
      if (typeof success === 'function') {
        success()
        window.top.afterSendSuccess = ''
        // success;
      }
    },
    sendInView (isBack) {
      let that = this

      var data = window.top.sendData
      var success = window.top.afterSendSuccess
      var sendUrl = that.dsf.config.webRoot.webPath + 'ctrl/flow/sendIndex'
      DSF.Utils.serverLog('Flow.send()', 'request openWinView,sendUrl=' + sendUrl)

      window.top.flowPage = window.flowPage || 2
      sendUrl += '?flowPage=' + window.flowPage + '&pk=' + data.pk + '&moduleId=' + data.moduleId + '&sendType=' + data.sendType
      /*  var keys = ["pId", "pnId", "flowId", "nextLineId", "successToNodeId", "agencyType", "determineUser"];
              sendUrl += "&" + DSF.Utils.json2Param(data, keys); */

      if (isBack && isBack == 1) {
        window.location.href = sendUrl
        return
      }

      var config = {
        url: sendUrl,
        closeBtn: 0,
        title: '选择发送范围',
        success: function (layero, index) {
          if (typeof window.top.afterOpenSendView === 'function') {
            window.top.afterOpenSendView()
          }
        },
        callback: function () {
          if (typeof success === 'function') {
            success()
          } else {
            /* if(top.openViewWindow && top.openViewWindow.parent){
                            top.openViewWindow.parent.location.reload();
                        } */
          }
        }
      }

      // 获取项目自定义的发送界面大小
      if (typeof window.setSendArea === 'function') {
        var result = window.setSendArea(data.sendType)
      }

      if (data.sendType == 'SR_JUMPSEND') {
        // 跳转，使用web的界面
        config.area = '1000,540'
        if (result) {
          config.area = result
        }
      } else if (data.sendType == 'SR_SEND' || data.sendType == 'SR_ADDITION' || data.sendType == 'SR_COPY' || (data.sendType == 'SR_SPECIAL' && data.nextNodeId != '')) {
        if (window.flowPage == 2) {
          config.area = '1000,540'
          if (result) {
            config.area = result
          }
        } else {
          config.area = '800,540'
          if (result) {
            config.area = result
          }
        }
      } else {
        config.closeBtn = 1
      }

      // console.log(window.top.sendData);

      that.openWinView(this, config)

      DSF.XForm && DSF.XForm.triggerRemoveDisable && DSF.XForm.triggerRemoveDisable()
    },
    openWinView (target, opts) {
      top.openViewModel = target
      top.openViewWindow = window
      top.openViewOpts = opts

      var reloadGrid = !opts || opts['reloadGrid'] !== false

      var maxWidth = $(top.window).width() - 20
      var maxHeight = $(top.window).height() - 20

      var isfresh = opts.isfresh

      var _area = ['auto', 'auto']
      if (opts.area) {
        _area = opts.area.split(',')
        var width = parseInt(_area[0])
        if (width > maxWidth) {
          _area[0] = maxWidth
        }

        var height = parseInt(_area[1])

        if (height > maxHeight) {
          _area[1] = maxHeight
        }
      } else {
        _area[0] = maxWidth - 80
        _area[1] = maxHeight - 80
      }

      _area[0] = _area[0] + 'px;'
      _area[1] = _area[1] + 'px;'

      opts.url = supplyParam(opts.url)

      // 外层top不是DreamWeb系统时，相对路径可能不正确
      if (window !== window.top && opts.url && opts.url.startsWith('../../ctrl')) {
        opts.url = '/DreamWeb/' + opts.url.substring('../../'.length)
      }

      var config = {
        type: 2,
        fixed: false,
        resize: true,
        area: _area,
        success: function (layero, index) {},
        end: function () {
          if (top) {
            var openViewWindow = top.openViewWindow
            if (top.openViewOpts && top.openViewOpts.callback) {
              top.openViewOpts.callback()
            }
            if (top.openViewWindow && isfresh) {
              top.openViewWindow.location.reload()
            }
            if ((opts.reloadGrid == undefined || opts.reloadGrid) && openViewWindow) {
              openViewWindow.closeWinView({
                reloadGrid: reloadGrid
              })
            }
          }
        }
      }

      $.extend(config, opts || {})

      config.title = opts.title === false ? false : opts.title || ' '
      config.content = opts.url || ''
      config.closeBtn = opts.closeBtn === undefined ? 1 : opts.closeBtn
      config.area = _area

      top.openViewIndex = top.layer.open(config)
    },
    // 所有组件必备的统一方法，暴露给外部调用的,type为当前刷新的类型
    refreshComData (type) {
      // notice  ||   notice.
      let typeArr = type.split('.')
      if (this.refreshType === '') this.refreshType = 'inbox,distribt,remind,notice,meeting,collect,remoteDoc,remoteFeedBack'

      var keyArray = this.refreshType.split(',')
      this.allTabNames &&
        this.allTabNames.split(',').forEach((item) => {
          keyArray.push(item)
        })
      console.log('keyArray', keyArray)
      let hasExists = false
      keyArray.forEach((item) => {
        typeArr.forEach((sitem) => {
          if (item == sitem) {
            hasExists = true
          }
        })
      })
      if (!hasExists) {
        return
      }
      console.log('刷新了组件[刷新类型：' + type + ']:' + this.ctrlName + '的内部方法')
      // 短时间内重复触发同一type类型, 节流\防抖处理
      // 切记一定要判断type类型是不是自己的再去刷新组件功能，否则浪费资源去刷新不必要的刷新
      if (!this.canRun) return
      console.log('刷新了组件-------------------')
      this.canRun = false
      this.getDbData(this.activeName)
      setTimeout(() => {
        this.canRun = true
      }, 2000)
    },
    getContainHeight () {
      let marginMap = this.margin.split(' ')
      let subMargin = 0
      switch (marginMap.length) {
        case 1:
          subMargin = parseInt(this.margin) * 2
          break
        case 1:
          subMargin = parseInt(marginMap[0]) * 2
          break
        case 3:
        case 4:
          subMargin = parseInt(marginMap[0]) + parseInt(marginMap[2])
          break
      }
      return subMargin
    },
    resize () {
      this.height = this.fixedHeight != 0 ? this.fixedHeight : parseInt($('.dblist-' + this.dataId).parent().parent().outerHeight()) - parseInt(this.marginStr)
      if (this.fixedHeight != 0) {
        this.pageSize = parseInt((this.fixedHeight - 60) / 44) < 1 ? 1 : parseInt((this.fixedHeight - 60) / 44)
      } else {
        this.pageSize = parseInt((this.height - 60) / 44) < 1 ? 1 : parseInt((this.height - 60) / 44)
      }
    },
    /**
     * 使用统一接口数据
     */
    PageDataInfoCallback (resData) {
      this.getSkinInfoCom(true)
      const _this = this
      if (this.selectTabData.length == 0) {
        return
      }
      this.plusPopupTitle = this.selectTabData[0].text // 2021/12/06
      let that = this
      // if(!selActiveName && this.selectTabData[0].value == 'remote_doc_exchange') this.loadOuterJs(dsf.url.getWebUrl("/resource/js/business-common.js"));
      that.activeName = this.selectTabData[0].value
      that.loadedTabName = that.loadedTabName + that.activeName + ','
      var allTabName = []
      for (let index = 0; index < this.selectTabData.length; index++) {
        const element = this.selectTabData[index]
        allTabName.push(element.value)
      }
      that.allTabNames = allTabName.join(',')

      this.tabdata = []
      // that.activeName = tabs.data[0].tab;
      // that.tabdata = tabs.data;
      if (resData && (resData.getDsfaTabsInfo || resData.getDsfaTabsInfoDB)) {
        var tabs = resData.getDsfaTabsInfoDB ? resData.getDsfaTabsInfoDB.tabs : resData.getDsfaTabsInfo.tabs
        that.tabslist = tabs
        if (that.countUrlExe) {
          // 如果有扩展接口在扩展接口里面接着获取数据并且合并数据
          that.getExeDbData(tabs)
        } else {
          var allTabData = []
          for (let index = 0; index < that.selectTabData.length; index++) {
            const element = that.selectTabData[index]
            const element1 = tabs[element.value]
            allTabData.push({
              tab: element.value,
              show: element.text,
              num: element1 ? (parseInt(element1.count) > 99 && parseInt(element1.count) < 999 ? '99+' : parseInt(element1.count) > 999 ? '999+' : element1.count) : 0,
              num1: element1 ? (parseInt(element1.count) > 99 ? 99 : element1.count) : 0,
              moreUrl: element1 && element1.moreUrl ? element1.moreUrl : '',
              newFileUrl: element1 && element1.newFileUrl ? element1.newFileUrl : '',
              target: element1 && element1.target ? element1.target : '',
              taburl: element1 && element1.url ? element1.url : ''
            })
          }
          that.handleTabData(allTabData)
        }
      }
    }
  },
  created () {},
  mounted () {
    // 引入dreamweb-core.js
    // this.loadOuterJs(dsf.url.getWebUrl('/resource/js/dreamweb-core.js'))
    // this.loadOuterJs(dsf.url.getWebUrl('/resource/js/public.js?v=v1.016.000.20200917_beta'))
    // this.getSkinInfoCom(true);
    // this.getDbData();
    this.getWholeStyle()

    this.dialogHeight = document.body.clientHeight - 200
    this.dialogHeight = this.dialogHeight > 680 ? 680 : this.dialogHeight
    let that = this
    // that.getCtrlSetInfo();
    // 设置面板链接
    that.CtrlSetDialogUrl = this.dsf.config.webRoot.webPath + 'ctrl/dsfa/rm/showComment?commentId=' + this.dataId + '&pageId=' + this.getUrlParam('pageId').split('#')[0]
  },
  destroyed () {}
})
</script>

<style lang="scss">
/* @import "../../style/headcommon.scss"; */
.dblist-v2 {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.07);
  background: #ffffff;
  box-sizing: border-box;
  /* padding: 0 20px; */
  font-family: 'pf';
  position: relative;

  .videotx {
    width: 116px;
    height: 30px;
    background: #f0fffc;
    border: 1px solid #91dac8;
    border-radius: 4px;
  }

  /* 页面宽度开始不足时，自动开始滚动，其中变量是通过scrollable */
  .el-tabs__nav {
    display: flex;
    flex-wrap: nowrap;
  }

  .el-tabs {
    /* 只有设置按钮、设置按钮和更多、设置按钮和更多+搜索、设置按钮和更多以及批量按钮+全选、 接收远程公文+设置按钮+更多  新建按钮+搜索 */
    .el-tabs__nav-wrap {
      padding-right: 46px; /*默认只有一个设置按钮*/
    }
    .el-tabs__nav-wrap.is-scrollable {
      padding-right: 46px; /*默认只有一个设置按钮*/
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: 40px;
      }
      .el-tabs__nav-next {
        right: 34px;
        z-index: 4;
      }
    }

    &.tabs-sousuo {
      .is-scrollable {
        padding-right: 90px;
        .el-tabs__nav-next {
          right: 78px;
        }
      }
    }

    &.ts-el-tabs-small {
      .el-tabs__nav-wrap {
        padding-right: 72px;
      }
      .is-scrollable {
        padding-right: 106px;
        .el-tabs__nav-next {
          right: 86px;
        }
      }

      //更多显示为文字，内容增长
      &.morewz {
        .is-scrollable {
          padding-right: 118px;
          .el-tabs__nav-next {
            right: 100px;
          }
        }
      }
    }

    &.ts-el-tabs {
      .el-tabs__nav-wrap {
        padding-right: 172px;
      }
      .is-scrollable {
        padding-right: 172px;
        .el-tabs__nav-next {
          right: 160px;
        }
      }
      &.tabs-sousuo {
        .is-scrollable {
          padding-right: 182px;
          .el-tabs__nav-next {
            right: 168px;
          }
        }
      }
    }

    &.ts-el-tabs-long {
      .el-tabs__nav-wrap {
        padding-right: 200px;
      }
      .is-scrollable {
        padding-right: 200px;
        .el-tabs__nav-next {
          right: 186px;
        }
      }
    }
    &.ts-el-tabs-long2 {
      .el-tabs__nav-wrap {
        padding-right: 262px;
      }
      .is-scrollable {
        padding-right: 262px;
        .el-tabs__nav-next {
          right: 250px;
        }
      }
      &.tabs-sousuo {
        .is-scrollable {
          padding-right: 290px;
          .el-tabs__nav-next {
            right: 278px;
          }
        }
      }
    }
  }

  .margin20 {
    padding: 0 20px;
    /* .el-tabs__header {

            .el-tabs__item {
                padding: 0;
            }

            .el-tabs__item:not(:nth-child(2)) {
                margin-left: 40px;
            }

            .el-tabs__item.is-active {
                background-color: #fff;

                &>span {
                    background: #FFFFFF;
                    border-radius: 0;
                }
            }
        } */
  }

  .otherMargin {
    .el-tabs__content {
      padding: 0 20px;
    }

    .el-tabs__header {
      .el-tabs__item.is-active {
        background-color: #fff;
        padding: 0 20px;
        & > span {
          background: #ffffff;
          border-radius: 0;
        }
      }
    }
  }

  .el-tabs {
    height: 100%;
    overflow: hidden;
    /* .el-tabs__header {
            .el-tabs__nav-wrap {
                margin-bottom: 0px;

                &::after {
                    background: #CCCCCC !important;
                }

                .el-tabs__nav {
                    outline: none;
                }
            }
        } */
  }

  .platform_card_bts {
    height: 40px;
    .C00040-select {
      height: 32px;
      line-height: 32px;
      input {
        height: 30px;
        line-height: 30px;
      }
    }

    .allselect {
      width: 60px;
      height: 26px;
      line-height: 26px;
      background: #fc6a6a;
      border-radius: 13px;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      font-weight: 400;
      cursor: pointer;
      &.unselect {
        padding: 0 10px;
        width: 80px;
      }
    }
  }

  .video-tx {
    position: absolute;
    top: 5px;
    left: 130px;
    height: 30px;
    padding: 0 9px;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    z-index: 3;
    background: #f0fffc;
    border: 1px solid #91dac8;
    border-radius: 4px;
    cursor: pointer;
    img {
      width: 20px;
      height: 14px;
      margin-right: 6px;
    }
    label {
      cursor: pointer;
      font-size: 18px;
      color: #3eab90;
      line-height: 28px;
    }
  }

  .el-tabs__nav-wrap {
    height: 40px;

    .el-tabs__item {
      height: 40px;
      line-height: 40px;
      outline: none;

      .tab_title {
        height: 30px;
        margin-top: 5px;
      }
    }
  }

  .platform_tab_title_remind_v1 {
    height: 30px;
    top: 5px;

    & > label {
      /* top: 4px;
            top: -2px;
            right: -15px; */
      background: #ec4519;

      &.active {
        /* top: -5px;
                top: -2px;
                right: -10px; */
        border-radius: 10px;
        padding: 0 6px;
        width: auto;
        height: 20px;
        text-align: center;
        white-space: nowrap;
        border: 1px solid #ffffff;
      }
    }
  }

  .containbox {
    width: 100%;
    position: relative;
    // &::-webkit-scrollbar-track-piece {
    //     background-color: #FFFFFF;
    // }

    // &::-webkit-scrollbar {
    //     width: 8px;
    //     height: 9px;
    // }

    // &::-webkit-scrollbar-thumb {
    //     background-color: #ebebeb;
    //     background-clip: padding-box;
    //     min-height: 28px;
    //     border-radius: 4px;
    // }

    // &:hover {
    //     overflow-y: scroll;
    //     overflow-x: hidden;
    // }
  }

  //列表DbContain组件样式
  .dbs-v2 {
    position: static;
  }

  .db-serach-where {
    position: absolute;
    left: 0;
    width: 130px;
    top: 0;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;

    > div {
      width: 100%;
      font-size: 24px;
      letter-spacing: 0.8px;
      font-family: 'pfmd';
      text-align: center;
      display: flex;
      align-items: center;
      background-color: rgba(27, 95, 164, 0.1);
      color: rgba(27, 95, 164, 1);
      position: relative;
      cursor: pointer;
      margin-top: 1px;

      span {
        width: 100%;
        display: block;
        position: relative;
        opacity: 0.8;
      }

      div {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        pointer-events: none;
        transition: all linear 0.2s;
        background-color: #fff;
      }

      &.active {
        background: transparent !important;
      }

      &.active div,
      &:hover div {
        opacity: 1;
      }

      &.active span,
      &:hover span {
        opacity: 1;
      }
    }
  }

  .mainf {
    width: 100%;
    height: 550px;
    box-sizing: border-box;
    padding: 10px;
  }

  .dbsclass-v1 {
    position: relative;
  }

  .dbcontain-v2 {
    width: 100%;
    /* height: 50px;  */
    height: 24px;
    position: relative;
    margin-top: 20px;
    transition: all linear 0.1s;
    cursor: pointer;

    &.isOpenSpecial-true {
      .title-span {
        > span {
          color: #449aeb;
          margin-right: 27px;
        }
      }
    }

    &.otherDbuname-false {
      .datetime {
        margin-left: 0 !important; //待办组件宽度很窄时，间距不需要40px
      }
    }

    &.enableHoverBar-false {
      &:hover {
        .dbnormal {
          .innerBgDiv {
            opacity: 1;
          }

          .dbtitle {
            > span {
              font-weight: bold;
            }

            .nodename {
              font-weight: bold;
              display: inline-block;
            }
          }

          .username {
            font-weight: bold;
          }

          .datetime {
            font-weight: bold;
          }

          .alternatefield {
            font-weight: bold;
          }
        }

        .dbactive {
          display: none;
        }
      }
    }

    &.enableHoverBar-true {
      &:hover {
        height: auto;
        /* & + .enableHoverBar-true {
                    margin-top: 9px;
                } */
        .dbnormal {
          display: none;
        }

        .dbactive {
          display: block;
        }
      }
    }

    .dbnormal {
      width: 100%;
      /* height: 47px; */
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      transition: all linear 0.2s;

      > * {
        z-index: 1;
      }

      .innerBgDiv {
        position: absolute;
        z-index: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        pointer-events: none;
        transition: all linear 0.2s;
        opacity: 0;
      }

      .ischeck {
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -7px;
      }

      .dicon {
        flex-shrink: 0;
      }

      .chaoqi {
        font-size: 12px;
        color: #cb0004;
        font-weight: bold;
        margin-left: 10px;
      }

      .dbtitle {
        flex: 1;
        margin-left: 10px;
        position: relative;
        box-sizing: border-box;
        padding-right: 20px;
        display: flex;
        overflow-x: hidden;
        overflow-y: visible;
        /* height: 45px; */
        align-items: center;

        &.hasCheck {
          padding-left: 30px;
        }

        .status-icon {
          flex-shrink: 0;
        }

        > span {
          font-size: 16px;
          color: #333333 !important;
          font-weight: 600;
          /* flex: 1; 2021-08-05 */
          /* overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis; */
          display: block;
          cursor: pointer;
        }

        > span.title-span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .nodename {
          display: none;
          color: #f7b500 !important;
          padding: 0px;
        }

        label {
          font-size: 12px;
          color: #eb595c;
          margin-left: 10px;
          margin-top: -5px;
          font-family: 'normal';
          cursor: pointer;
          position: absolute;
        }

        .dbicon {
          display: inline-block;
          width: 23px;
          height: 16px;
          background-repeat: no-repeat;
          background-position: center;
          vertical-align: middle;

          &:last-child {
            margin-right: 5px;
          }

          &.db_shoucang {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/shoucang1.png);
            background-size: 100%;
          }

          &.db_yd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/email-yread.png);
            background-size: 100%;
            margin-top: -1px;
            margin-right: 5px;
          }
          &.db_wd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/email-wread.png);
            background-size: 100%;
            margin-top: -2px;
            margin-right: 5px;
          }
          // jsyc start
          &.db_jsycyd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_ggyd.png);
            background-size: 100%;
            margin-top: -1px;
            margin-right: 5px;
          }
          &.db_jsycwd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_ggwd.png);
            background-size: 100%;
            margin-top: -2px;
            margin-right: 5px;
          }
          &.db_jsycyjyd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_yjyd.png);
            background-size: 100%;
            margin-top: -1px;
            margin-right: 5px;
          }
          &.db_jsycyjwd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_yjwd.png);
            background-size: 100%;
            margin-top: -2px;
            margin-right: 5px;
          }
          // jsyc end

          &.db_danger {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_danger.png);
            background-size: 100%;
          }

          &.db_warn {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_warn.png);
            background-size: 100%;
          }

          &.db_tips {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_tips.png);
            background-size: 100%;
          }

          &.db_cui {
            background-image: url(../../public/platform/imgs/v1/db_cui.png);
          }

          &.db_dai {
            background-image: url(../../public/platform/imgs/v1/db_dai.png);
          }

          &.db_huan {
            background-image: url(../../public/platform/imgs/v1/db_huan.png);
          }

          &.db_mi {
            background-image: url(../../public/platform/imgs/v1/db_mi.png);
          }

          &.db_te {
            background-image: url(../../public/platform/imgs/v1/db_te.png);
          }

          &.db_ji {
            background-image: url(../../public/platform/imgs/v1/db_ji.png);
          }

          &.db_tui {
            background-image: url(../../public/platform/imgs/v1/db_tui.png);
          }
          &.db_waiting {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_waiting.png);
          }
          // 2021-09-10 新加5个图标
          &.db_green {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_green.png);
          }
          &.db_yellow {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_yellow.png);
          }
          &.db_red {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_red.png);
          }
          &.db_shandian {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_shandian.png);
          }
          &.db_lingdang {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_lingdang.png);
          }
          &.db_zy {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_zy.png);
          }
          &.db_yy {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_yy.png);
          }
        }
      }

      .username {
        flex-shrink: 0;
        font-size: 14px;
        color: #333333;
        font-weight: 600;
        margin-left: 10px;
        max-width: 100px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .datetime,
      .alternatefield {
        flex-shrink: 0;
        font-size: 14px;
        color: #333333;
        font-weight: 600;
        margin-left: 40px;
        padding-right: 5px;
      }

      .alternatefield {
        text-align: right;
        padding-right: 0;
        margin: 0 30px;
        width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .username {
        text-align: right;
        width: 90px;
        white-space: nowrap;
      }

      .datetime {
        text-align: right;
        width: 150px;
        white-space: nowrap;
      }

      &.isread,
      &.notFontBold {
        // 已读不加粗   手动设置未读不加粗
        .dbtitle {
          > span {
            color: #333333 !important;
            font-weight: 400;
          }

          .nodename {
            color: #f7b500 !important;
          }
        }

        .username {
          font-weight: 400;
        }

        .datetime,
        .alternatefield {
          font-weight: 400;
        }
      }
    }

    .dbactive {
      height: 80px;
      // position: absolute;
      // left: -25px;
      // right: -25px;
      // top: -15px;
      // bottom: -15px;
      position: relative;
      margin-left: -25px;
      margin-right: -25px;
      margin-top: -20px;
      background: #ffffff;
      box-shadow: 0 0 10px #cccccc;
      z-index: 2;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 0 25px;
      transition: all linear 0.5s;
      display: none;

      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        padding: 0px 25px;
        border-radius: 5px;
      }

      .dicon {
        flex-shrink: 0;
        margin-right: 10px;
      }

      .username {
        flex-shrink: 0;
        font-size: 16px;
        color: #333333;
        margin: 0 30px;
        font-family: 'pfmd';
        font-weight: 400;
        max-width: 100px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .datetime,
      .alternatefield {
        flex-shrink: 0;
        font-size: 14px;
        color: #333333;
        margin: 0 30px;
        font-family: 'pfmd';
        font-weight: 400;
      }

      .alternatefield {
        width: 170px;
        text-align: right;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .titles {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        font-weight: 600;

        .title-span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        & > span:first-child {
          font-size: 16px;
          color: #000;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          // font-family: 'pfsb';
          font-family: 'pfmd';
          font-weight: 600;

          & > span {
            margin-right: 10px;
          }

          .iconcontent > i:last-child {
            margin-right: 5px;
          }
        }

        & > span:last-child {
          color: #ec4519;
          cursor: pointer;
          font-family: 'pfsb';
          margin-top: 5px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-weight: 400;
        }

        .dbicon {
          display: inline-block;
          width: 23px;
          height: 16px;
          background-repeat: no-repeat;
          background-position: center;
          vertical-align: middle;

          &.db_shoucang {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/shoucang1.png);
            background-size: 100%;
          }

          &.db_yd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/email-yread.png);
            background-size: 100%;
            margin-top: -1px;
            margin-right: 5px;
          }

          &.db_wd {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/email-wread.png);
            background-size: 100%;
            margin-top: -2px;
            margin-right: 5px;
          }

          // jsyc start
          &.db_jsycyd {
            width: 18px;
            background-image: url(../../public/platform/imgs/v1/db_ggyd.png);
            background-size: 100%;
            margin-top: -1px;
            margin-right: 5px;
          }
          &.db_jsycwd {
            width: 18px;
            background-image: url(../../public/platform/imgs/v1/db_ggwd.png);
            background-size: 100%;
            margin-top: -2px;
            margin-right: 5px;
          }
          &.db_jsycyjyd {
            width: 22px;
            height: 23px;
            background-image: url(../../public/platform/imgs/v1/db_yjyd.png);
            background-size: 100%;
            margin-top: -1px;
            margin-right: 5px;
          }
          &.db_jsycyjwd {
            width: 22px;
            height: 18px;
            background-image: url(../../public/platform/imgs/v1/db_yjwd.png);
            background-size: 100%;
            margin-top: -2px;
            margin-right: 5px;
          }
          // jsyc end

          &.db_danger {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_danger.png);
            background-size: 100%;
          }

          &.db_warn {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_warn.png);
            background-size: 100%;
          }

          &.db_tips {
            width: 16px;
            background-image: url(../../public/platform/imgs/v1/db_tips.png);
            background-size: 100%;
          }

          &.db_cui {
            background-image: url(../../public/platform/imgs/v1/db_cui.png);
          }

          &.db_dai {
            background-image: url(../../public/platform/imgs/v1/db_dai.png);
          }

          &.db_huan {
            background-image: url(../../public/platform/imgs/v1/db_huan.png);
          }

          &.db_mi {
            background-image: url(../../public/platform/imgs/v1/db_mi.png);
          }

          &.db_te {
            background-image: url(../../public/platform/imgs/v1/db_te.png);
          }

          &.db_ji {
            background-image: url(../../public/platform/imgs/v1/db_ji.png);
          }

          &.db_tui {
            background-image: url(../../public/platform/imgs/v1/db_tui.png);
          }
          &.db_waiting {
            cursor: pointer;
            margin-top: -2px;
            background-image: url(../../public/platform/imgs/v1/db_waiting.png);
          }
          // 2021-09-10 新加5个图标
          &.db_green {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_green.png);
          }
          &.db_yellow {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_yellow.png);
          }
          &.db_red {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_red.png);
          }
          &.db_shandian {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_shandian.png);
          }
          &.db_lingdang {
            cursor: pointer;
            background-image: url(../../public/platform/imgs/v1/db_lingdang.png);
          }
        }
      }

      &.isread,
      &.notFontBold {
        .titles {
          & > span:first-child {
            color: #333333 !important;
            font-weight: 400;
          }
        }

        .username {
          font-weight: 400;
        }

        .datetime,
        .alternatefield {
          font-weight: 400;
        }
      }

      .btns {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        font-weight: 400;

        & > p {
          cursor: pointer;
          width: 50px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;

          &.bigwidth {
            width: 60px;
          }

          &::after {
            content: '';
            width: 1px;
            height: 16px;
            position: absolute;
            right: 0;
            top: 17px;
            background: #d6d6d6;
          }

          &:last-child {
            &::after {
              display: none;
            }
          }

          & > span {
            height: 30px;
            display: flex;
            align-items: center;

            i {
              font-size: 20px;
            }

            img, i {
              transform: scale(1);
              transition: all linear 0.2s;
            }

            .iconcb {
              color: #FD7911;
            }
            .iconfk {
              color: #44D7B6;
            }
          }

          & > label {
            color: #666666;
            font-size: 14px;
            line-height: 30px;
            cursor: pointer;
            white-space: nowrap;
          }
        }

        & > p:hover {
          & > span {
            img, i {
              transform: scale(1.2);
              transition: all linear 0.2s;
            }
          }
        }
      }
    }
  }

  &.listDefaultFont-14 {
    .dbcontain-v2 {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 14px;
          }

          label {
            font-size: 12px;
          }
        }

        .username {
          font-size: 14px;
        }

        .datetime {
          font-size: 14px;
        }

        .alternatefield {
          font-size: 14px;
        }
      }
    }
  }

  &.listDefaultFont-16 {
    .dbcontain-v2 {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 16px;
          }

          label {
            font-size: 14px;
          }
        }

        .username {
          font-size: 16px;
        }

        .datetime {
          font-size: 16px;
        }

        .alternatefield {
          font-size: 16px;
        }
      }
    }
  }

  &.listDefaultFont-18 {
    .dbcontain-v2 {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 18px;
          }

          label {
            font-size: 16px;
          }
        }

        .username {
          font-size: 18px;
        }

        .datetime {
          font-size: 18px;
        }

        .alternatefield {
          font-size: 18px;
        }
      }
    }
  }

  &.listDefaultFont-20 {
    .dbcontain-v2 {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 20px;
          }

          label {
            font-size: 18px;
          }
        }

        .username {
          font-size: 20px;
        }

        .datetime {
          font-size: 20px;
        }

        .alternatefield {
          font-size: 20px;
        }
      }
    }
  }

  &.listActiveFont-14 {
    .dbcontain-v2 {
      .dbactive {
        .username {
          font-size: 12px;
        }

        .datetime {
          font-size: 12px;
        }

        .alternatefield {
          font-size: 12px;
        }

        .titles {
          & > span:first-child {
            font-size: 14px;
          }
        }

        .btns {
          & > p {
            & > label {
              font-size: 12px;
            }
          }
        }
      }
    }
  }

  &.listActiveFont-16 {
    .dbcontain-v2 {
      .dbactive {
        .username {
          font-size: 14px;
        }

        .datetime {
          font-size: 14px;
        }

        .alternatefield {
          font-size: 14px;
        }

        .titles {
          & > span:first-child {
            font-size: 16px;
          }
        }

        .btns {
          & > p {
            & > label {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  &.listActiveFont-18 {
    .dbcontain-v2 {
      .dbactive {
        .username {
          font-size: 16px;
        }

        .datetime {
          font-size: 16px;
        }

        .alternatefield {
          font-size: 16px;
        }

        .titles {
          & > span:first-child {
            font-size: 18px;
          }
        }

        .btns {
          & > p {
            & > label {
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  &.listActiveFont-20 {
    .dbcontain-v2 {
      .dbactive {
        .username {
          font-size: 18px;
        }

        .datetime {
          font-size: 18px;
        }

        .alternatefield {
          font-size: 18px;
        }

        .titles {
          & > span:first-child {
            font-size: 20px;
          }
        }

        .btns {
          & > p {
            & > label {
              font-size: 18px;
            }
          }
        }
      }
    }
  }

  &.listActiveFont-14.listHover-true {
    .dbcontain-v2:hover {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 14px;
          }

          label {
            font-size: 12px;
          }
        }

        .username {
          font-size: 14px;
        }

        .datetime {
          font-size: 14px;
        }

        .alternatefield {
          font-size: 14px;
        }
      }
    }
  }

  &.listActiveFont-16.listHover-true {
    .dbcontain-v2:hover {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 16px;
          }

          label {
            font-size: 14px;
          }
        }

        .username {
          font-size: 16px;
        }

        .datetime {
          font-size: 16px;
        }

        .alternatefield {
          font-size: 16px;
        }
      }
    }
  }

  &.listActiveFont-18.listHover-true {
    .dbcontain-v2:hover {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 18px;
          }

          label {
            font-size: 16px;
          }
        }

        .username {
          font-size: 18px;
        }

        .datetime {
          font-size: 18px;
        }

        .alternatefield {
          font-size: 18px;
        }
      }
    }
  }

  &.listActiveFont-20.listHover-true {
    .dbcontain-v2:hover {
      .dbnormal {
        .dbtitle {
          span {
            font-size: 20px;
          }

          label {
            font-size: 18px;
          }
        }

        .username {
          font-size: 20px;
        }

        .datetime {
          font-size: 20px;
        }

        .alternatefield {
          font-size: 20px;
        }
      }
    }
  }

}

.dblist-v2.skin-blue {
  .db-serach-where {
    > div {
      background-color: rgba(27, 95, 164, 0.1);
      color: #1b5fa4;
    }
  }
  .otherMargin {
    .el-tabs__item.is-active {
      border-top: 2px solid #1b5fa4;
      & > span {
        color: #1b5fa4;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }

  // .margin20 {
  //     .el-tabs__nav {
  //         .el-tabs__item {
  //             padding: 0 !important;
  //             margin: 0 20px;
  //             &:nth-child(2) {
  //                 margin-left: 0;
  //             }
  //         }
  //         .el-tabs__item.is-active {
  //             color: #1B5FA4;
  //             border-bottom: 3px solid #1B5FA4;
  //             &>span {
  //                 background: none;
  //             }
  //         }
  //     }
  // }
}

.dblist-v2.skin-inblue {
  .db-serach-where {
    > div {
      background-color: rgba(0, 128, 255, 0.1);
      color: #0080ff;
    }
  }
  .otherMargin {
    .el-tabs__item.is-active {
      border-top: 2px solid #0080ff;
      & > span {
        color: #0080ff;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}

.dblist-v2.skin-green {
  .db-serach-where {
    > div {
      background-color: rgba(24, 154, 91, 0.1);
      color: #189a5b;
    }
  }
  .otherMargin {
    .el-tabs__item.is-active {
      border-top: 2px solid #189a5b;
      & > span {
        color: #189a5b;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}

.dblist-v2.skin-ycgreen {
  .db-serach-where {
    > div {
      background-color: rgba(2, 106, 82, 0.1);
      color: #026a52;
    }
  }
  .otherMargin {
    .el-tabs__item.is-active {
      border-top: 2px solid #026a52;
      & > span {
        color: #026a52;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}

.dblist-v2.skin-red {
  .db-serach-where {
    > div {
      background-color: rgba(198, 47, 38, 0.1);
      color: #c62f26;
    }
  }
  .otherMargin {
    .el-tabs__item.is-active {
      border-top: 2px solid #c62f26;
      & > span {
        color: #c62f26;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}

.dblist-v2.skin-black {
  .db-serach-where {
    > div {
      /* background-color: rgba(198, 47, 38, 0.1); */
      background-color: #333333;
      color: #999999;
    }
  }
  .otherMargin {
    .el-tabs__item.is-active {
      border-top: 2px solid #ffd37e;
      & > span {
        color: #ffd37e;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}
</style>
