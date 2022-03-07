<template>
  <!-- <div style="height:100%;margin-top:1px;min-width:100%"> -->
  <div style="height:100%;min-width:100%">
    <div v-if="twoWhere.length>0" class="db-serach-where">
      <!--左侧筛选功能-->
      <div v-for="(item,index) in twoWhere" :key="index" :class="{'active':item.value==whereActiveKey}" @click="changeWhereKey(item)">
        <span>{{ item.text }}</span>
      </div>
    </div>
    <div v-infinite-scroll="loadMoreData" class="dbs-v2 scroll-load" infinite-scroll-disabled="disabled" infinite-scroll-distance="10" :class="{'dbsclass-v2':(!dbdata||(dbdata&&dbdata.length==0))&&loadingEnd}" :style="getContentStyle()">
      <div v-for="(item, index) in dbdata" :key="index" class="dbcontain-v2" :class="`enableHoverBar-${enableHoverBar} isOpenSpecial-${isOpenSpecial} otherDbuname-${isShowName}`">
        <div class="dbnormal" :class="{'isread':item.isRead||(item.readStatus&&item.readStatus==2), 'notFontBold': !unreadisBold}">
          <el-checkbox v-if="openBatchDispose" v-show="dbinfo.tab=='todo'||dbinfo.tab=='todoagency'||dbinfo.tab=='toread'" v-model="item.ischeck" class="ischeck" @change="isCheck"></el-checkbox>
          <p class="dbtitle" :class="{'hasCheck':(dbinfo.tab=='todo'||dbinfo.tab=='todoagency'||dbinfo.tab=='toread')&&openBatchDispose}" @click="openToDo(item.titleUrl,item)">
            <span v-if="showData.statusIcon" class="status-icon">
              <i v-if="item.isFavorite=='1'" v-show="dbinfo.tab=='alldo'||dbinfo.tab=='todo'||dbinfo.tab=='toread'" class="dbicon db_shoucang"></i>
              <i v-if="(item.isRead||(item.readStatus&&item.readStatus==2)) && showData.ydstatusIcon" class="dbicon db_yd"></i>
              <i v-if="(!item.isRead&&(!item.readStatus&&!item.readStatus!=2)) && showData.ydstatusIcon" class="dbicon db_wd"></i>
              <i v-if="item.isShowGg == 1" class="dbicon db_jsycyd"></i>
              <i v-if="item.isShowGg == 0" class="dbicon db_jsycwd"></i>
              <i v-if="item.isShowEnvelope && item.isShowEnvelope == '1'" class="dbicon db_jsycyjyd"></i>
              <i v-if="item.isShowEnvelope && item.isShowEnvelope == '0'" class="dbicon db_jsycyjwd"></i>
              <i v-if="item.warningLevelStr=='warn'||item.warningLevelStr=='danger'" class="dbicon db_danger"></i>
              <i v-if="item.warningLevelStr=='early-warn'" class="dbicon db_warn"></i>
              <i v-if="item.isCb=='1'" class="dbicon db_cui"></i>
              <i v-if="item.urgeLevel=='3'||item.urgeLevel=='4'" class="dbicon db_te"></i>
              <i v-if="item.urgeLevel=='1'||item.urgeLevel=='2'" class="dbicon db_ji"></i>
              <i v-if="item.agencyType>0" class="dbicon db_dai"></i>
              <i v-if="item.return" class="dbicon db_tui"></i>
              <i v-if="item.tipContent" class="dbicon db_tips" :title="item.tipContent"></i>
              <i v-if="item.itemType=='tododelay'" class="dbicon db_huan"></i>
              <i v-if="item.scretLevel>0" class="dbicon db_mi"></i>
              <i v-if="item.gatherText&&item.gatherText!=''" class="dbicon db_waiting" @click.stop="openTodoGather(item)"></i>
              <i v-if="item.lightType=='green'" class="dbicon db_green"></i>
              <i v-if="item.lightType=='yellow'" class="dbicon db_yellow"></i>
              <i v-if="item.lightType=='red'" class="dbicon db_red"></i>
              <i v-if="item.isLightning>0" class="dbicon db_shandian" :title="'催办'+item.isLightning+'次'"></i>
              <i v-if="item.isBell=='1'" class="dbicon db_lingdang"></i>
              <!-- <i v-if="item.infoType==1 || item.infoType==2" class="gzticonfont menu-icon-yibanyuejian" :class="{'redC': item.infoType==1}"></i> -->
              <i v-if="item.infoType==1" class="dbicon db_zy"></i>
              <i v-if="item.infoType==2" class="dbicon db_yy"></i>
            </span>
            <span class="title-span" :style="rebuildColor(item)">
              <span v-if="isShowNodeName" class="nodename" :style="rebuildColor(item)">{{ item.nodeName }}</span>
              <span v-if="showData.isShowModuleName && item.moduleName" v-show="!isOpenSpecial" :style="rebuildColor(item, 'module', true)">[{{ item.moduleName||item.noticeTypeText }}]</span>
              <span v-if="showData.isShowModuleName && item.moduleName" v-show="isOpenSpecial" :style="rebuildColor(item, 'module', true)">【{{ item.moduleName||item.noticeTypeText }}】</span>
              {{ reconvert(item.title||item.bt) }}
            </span>
          </p>
          <span v-if="showData.isshowbythree && showData.bythreename&&item[showData.bythreename]" class="alternatefield" :style="rebuildColor(item, 'bythree')">{{ item[showData.bythreename] || '' }}</span>
          <span v-if="showData.isshowbytwo && showData.bytwoname&&item[showData.bytwoname]" class="alternatefield" :style="rebuildColor(item, 'bytwo')">{{ item[showData.bytwoname] || '' }}</span>
          <span v-if="showData.isShowAlternatefield && showData.AlternatefieldName&&item[showData.AlternatefieldName]" class="alternatefield" :style="rebuildColor(item, 'wh')">{{ item[showData.AlternatefieldName] || '' }}</span>
          <span v-if="isShowName" class="username" :style="rebuildColor(item, 'username')">{{ item.leftUserName||item.publishDeptText }}</span>
          <span v-if="showData.isShowDate && showData.dateFormatShow" class="datetime" :style="rebuildColor(item, 'datetime')">{{ item.arrivalTime||item.startTime }}</span>
          <span v-if="showData.isShowDate && !showData.dateFormatShow" class="datetime" :style="rebuildColor(item, 'datetime')">{{ (item.arrivalTime ? item.arrivalTime.split(" ")[0] : "")||(item.startTime ? item.startTime.split(" ")[0] : "") }}</span>
          <div class="innerBgDiv" :style="listStyle()"></div>
        </div>
        <div v-if="enableHoverBar" class="dbactive" :class="{'isread':item.isRead||(item.readStatus&&item.readStatus==2), 'notFontBold': !unreadisBold}">
          <div :style="listStyle()">
            <el-checkbox v-if="openBatchDispose" v-show="dbinfo.tab=='todo'||dbinfo.tab=='todoagency'||dbinfo.tab=='toread'" v-model="item.ischeck" style="margin-right:20px" @change="isCheck"></el-checkbox>
            <p class="titles" @click="openToDo(item.titleUrl,item)">
              <span>
                <span v-if="showData.statusIcon">
                  <label class="iconcontent">
                    <i v-if="item.isFavorite=='1'" v-show="dbinfo.tab=='alldo'||dbinfo.tab=='todo'||dbinfo.tab=='toread'" class="dbicon db_shoucang"></i>
                    <i v-if="(item.isRead||(item.readStatus&&item.readStatus==2)) && showData.ydstatusIcon" class="dbicon db_yd"></i>
                    <i v-if="(!item.isRead&&(!item.readStatus&&!item.readStatus!=2)) && showData.ydstatusIcon" class="dbicon db_wd"></i>
                    <i v-if="item.isShowGg == 1" class="dbicon db_jsycyd"></i>
                    <i v-if="item.isShowGg == 0" class="dbicon db_jsycwd"></i>
                    <i v-if="item.isShowEnvelope && item.isShowEnvelope == '1'" class="dbicon db_jsycyjyd"></i>
                    <i v-if="item.isShowEnvelope && item.isShowEnvelope == '0'" class="dbicon db_jsycyjwd"></i>
                    <i v-if="item.warningLevelStr=='warn'||item.warningLevelStr=='danger'" class="dbicon db_danger"></i>
                    <i v-if="item.warningLevelStr=='early-warn'" class="dbicon db_warn"></i>
                    <i v-if="item.isCb=='1'" class="dbicon db_cui"></i>
                    <i v-if="item.urgeLevel=='3'||item.urgeLevel=='4'" class="dbicon db_te"></i>
                    <i v-if="item.urgeLevel=='1'||item.urgeLevel=='2'" class="dbicon db_ji"></i>
                    <i v-if="item.agencyType>0" class="dbicon db_dai"></i>
                    <i v-if="item.return" class="dbicon db_tui"></i>
                    <i v-if="item.tipContent" class="dbicon db_tips" :title="item.tipContent"></i>
                    <i v-if="item.itemType=='tododelay'" class="dbicon db_huan"></i>
                    <i v-if="item.scretLevel>0" class="dbicon db_mi"></i>
                    <i v-if="item.gatherText&&item.gatherText!=''" class="dbicon db_waiting" @click.stop="openTodoGather(item)"></i>
                    <i v-if="item.lightType=='green'" class="dbicon db_green"></i>
                    <i v-if="item.lightType=='yellow'" class="dbicon db_yellow"></i>
                    <i v-if="item.lightType=='red'" class="dbicon db_red"></i>
                    <i v-if="item.isLightning>0" class="dbicon db_shandian" :title="'催办'+item.isLightning+'次'"></i>
                    <i v-if="item.isBell=='1'" class="dbicon db_lingdang"></i>
                    <!-- <i v-if="item.infoType==1 || item.infoType==2" class="gzticonfont menu-icon-yibanyuejian" :class="{'redC': item.infoType==1}"></i> -->
                    <i v-if="item.infoType==1" class="dbicon db_zy"></i>
                    <i v-if="item.infoType==2" class="dbicon db_yy"></i>
                  </label>
                </span>
                <span v-if="isShowNodeName" style="color:#F7B500;padding:0px" :style="rebuildColor(item)">{{ item.nodeName }}</span>
                <span class="title-span" :style="rebuildColor(item)">
                  <!-- <span v-if="showData.isShowModuleName">[{{item.moduleName||item.noticeTypeText}}]</span>  -->
                  <span v-if="showData.isShowModuleName && item.moduleName" v-show="!isOpenSpecial" :style="rebuildColor(item, 'module', true)">[{{ item.moduleName||item.noticeTypeText }}]</span>
                  <span v-if="showData.isShowModuleName && item.moduleName" v-show="isOpenSpecial" :style="rebuildColor(item, 'module', true)">【{{ item.moduleName||item.noticeTypeText }}】</span>
                  {{ reconvert(item.title||item.bt) }}
                </span>
                <!-- showData.isShowTimeout 待办配置是否显示   item.showTimeoutWarning：超期是否需要提醒 -->
                <span v-if="showData.isShowTimeout && item.showTimeoutWarning" class="istimeout">
                  <span v-if="item.timeout" :style="{color: showData.timeoutColor}">已超时{{ item.dayDiff }}天</span>
                  <span v-else>剩{{ item.dayDiff }}天超时</span>
                </span>
              </span>

              <span>
                <span>{{ item.return?'退回原因：'+item.lastOpinion:item.lastOpinion }}</span>
                <span v-if="item.agencyType>0">{{ item.agencyInfo }}</span>
              </span>
            </p>
            <!-- <span class="username" v-if="isShowName">{{item.leftUserName||item.publishDeptText}}</span>
                        <span class="datetime">{{item.arrivalTime||item.startTime}}</span> -->
            <span v-if="showData.isshowbythree && showData.bythreename&&item[showData.bythreename]" class="alternatefield" :style="rebuildColor(item, 'bythree')">{{ item[showData.bythreename] || '' }}</span>
            <span v-if="showData.isshowbytwo && showData.bytwoname&&item[showData.bytwoname]" class="alternatefield" :style="rebuildColor(item, 'bytwo')">{{ item[showData.bytwoname] || '' }}</span>
            <span v-if="showData.isShowAlternatefield && showData.AlternatefieldName&&item[showData.AlternatefieldName]" class="alternatefield" :style="rebuildColor(item, 'wh')">{{ item[showData.AlternatefieldName] || '' }}</span>
            <div v-if="showData.isShowBtns" class="btns" :data-other="showData.isShowFavoriteBtn">
              <p v-if="item.isFavorite!=undefined && showData.isShowFavoriteBtn" @click="todoAction(0,item)">
                <span v-show="item.isFavorite!='1'"><img src="../../public/platform/imgs/v1/shoucang.png" alt="" srcset=""></span>
                <span v-show="item.isFavorite=='1'"><img src="../../public/platform/imgs/v1/shoucang1.png" alt="" srcset=""></span>
                <label>{{ item.isFavorite=='1'?'已':'' }}{{ actionName.actionName0 }}</label>
              </p>
              <p v-if="(item.itemType=='todo'||item.itemType=='todoagency')&&item.couldAgree&&showData.isShowFSBtn" @click="todoAction(1,item)">
                <span><img src="../../public/platform/imgs/v1/fasong.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName1 }}</label>
              </p>
              <p v-if="item.itemType=='toread'" @click="todoAction(2,item)">
                <span><img src="../../public/platform/imgs/v1/yuebi.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName2 }}</label>
              </p>
              <p v-if="(item.itemType=='tomeet'||item.moduleId=='190121161348OthBI4s3sEhvfuDJ5FD') && isShowBaoMing" @click="todoAction(3,item)">
                <span><img src="../../public/platform/imgs/v1/baoming.png" alt="" srcset=""></span>
                <label>{{ item.status=='1'?'已':'' }}{{ actionName.actionName3 }}</label>
              </p>
              <p v-if="item.itemType=='dbtask'" @click="openToDo(item.titleUrl,item)">
                <span><img src="../../public/platform/imgs/v1/fankui.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName4 }}</label>
              </p>
              <!-- <p @click="todoAction(5,item)" v-if="(item.itemType=='todo'||item.itemType=='todoagency')&&item.moduleId!='190121161348OthBI4s3sEhvfuDJ5FD'">
                                <span><img src="../../public/platform/imgs/v1/tuihui.png" alt="" srcset=""></span>
                                <label>{{actionName.actionName5}}</label>
                            </p> -->
              <!-- 待办，nodeType为0代表拟稿节点，不显示退回按钮 -->
              <p v-if="item.itemType=='todo'&&item.moduleId!='190121161348OthBI4s3sEhvfuDJ5FD'&&item.nodeType!='0'&&showData.isShowTHBtn" @click="todoAction(5,item)">
                <span><img src="../../public/platform/imgs/v1/tuihui.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName5 }}</label>
              </p>
              <p v-if="item.itemType=='todoagency'&&item.moduleId!='190121161348OthBI4s3sEhvfuDJ5FD'&&showData.isShowTHBtn" @click="todoAction(5,item)">
                <span><img src="../../public/platform/imgs/v1/tuihui.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName5 }}</label>
              </p>
              <!-- 签收、拒签（退回） -->
              <p v-if="item.couldSendBack&&item.itemType=='remote_doc_exchange'" @click="todoAction(6,item)">
                <span><img src="../../public/platform/imgs/v1/qianshou.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName6 }}</label>
              </p>
              <p v-if="item.couldAgree&&item.itemType=='remote_doc_exchange'" @click="todoAction(7,item)">
                <span><img src="../../public/platform/imgs/v1/tuihui.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName7 }}</label>
              </p>
              <!-- 待反馈 -->
              <p v-if="item.couldAgree&&item.itemType=='remote_doc_feedback'" class="bigwidth" @click="todoAction(8,item)">
                <span><img src="../../public/platform/imgs/v1/qianshou.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName8 }}</label>
              </p>
              <p v-if="item.showSealFeedBack&&item.itemType=='remote_doc_feedback'" class="bigwidth" @click="todoAction(9,item)">
                <span><img src="../../public/platform/imgs/v1/tuihui.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName9 }}</label>
              </p>
              <p v-if="item.couldSendBack&&item.itemType=='remote_doc_feedback'" @click="todoAction(10,item)">
                <span><img src="../../public/platform/imgs/v1/tuihui.png" alt="" srcset=""></span>
                <label>{{ actionName.actionName10 }}</label>
              </p>
              <!-- 催办 -->
              <p v-if="showData.isshowcb&&item.isdbcb" @click="todoAction(11,item)">
                <span><i class="gzticonfont menu-icon-renwucuiban iconcb"></i></span>
                <label>{{ actionName.actionName11 }}</label>
              </p>
              <!-- 反馈 -->
              <p v-if="showData.isshowfk&&item.isdbfk" @click="todoAction(12,item)">
                <span><i class="gzticonfont menu-icon-fankui iconfk"></i></span>
                <label>{{ actionName.actionName12 }}</label>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dbdata&&dbdata.length>0" class="loading-info">
        <p v-if="!loadingEnd">加载中...</p>
        <!--pageIndex > 1 第一页的时候不显示  没有更多了 -->
        <p v-if="noMore && isShownoText && pageIndex > 1" class="no-More">没有更多了</p>
      </div>
      <div v-if="!dbdata||(dbdata&&dbdata.length==0)" class="nodedate">
        <i class="gzticonfont menu-icon-zanwushuju"></i>
        <span>暂无数据</span>
      </div>
      <el-dialog :title="win_title" width="700px" :visible.sync="showDialog" :append-to-body="true" :before-close="closeRefresh">
        <div class="mainf" :style="{'height':dialogHeg+'px'}">
          <iframe :src="win_url" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>
        </div>
      </el-dialog>
      <el-dialog title="请输入退回原因" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :append-to-body="true">
        <el-input v-model="backdesc" class="backdesc" type="textarea"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmBack">确 定</el-button>
          <el-button @click="cancelBack">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {
  mapState,
  mapMutations
} from 'vuex'
import {
  MessageBox,
  Message
} from 'element-ui'
export default {
  name: 'Dbcontainv2',
  components: {},
  props: {
    listUrl: {
      type: String,
      default: 'ctrl/officeInfo/getDsfaTabsData'
    },
    listUrlExe: {
      type: String,
      default: ''
    },
    dbinfo: {
      type: Object
    },
    pageSize: {
      type: Number
    },
    searchValue: {
      default: '',
      type: String
    },
    allTabs: {
      default: '',
      type: String
    },
    skin: {
      default: 'blue',
      type: String
    },
    sortType: {
      type: String,
      default: '1'
    },
    listActiveStyle: {
      default: function () {
        return {}
      },
      type: Object
    },
    twoWhere: {
      type: Array,
      default () {
        return []
      }
    },
    enableHoverBar: {
      type: Boolean,
      default: true
    },
    isShowBaoMing: {
      type: Boolean,
      default: true
    },
    openBatchDispose: {
      type: Boolean,
      default: true
    },
    isShowNodeName: {
      type: Boolean,
      default: true
    },
    actionName: {
      default: function () {
        return {
          'actionName0': '关注',
          'actionName1': '发送',
          'actionName2': '阅毕',
          'actionName3': '报名',
          'actionName4': '反馈',
          'actionName5': '退回',
          'actionName6': '签收',
          'actionName7': '退回',
          'actionName8': '会签回执',
          'actionName9': '盖章回执',
          'actionName10': '反馈',
          'actionName11': '催办',
          'actionName12': '反馈'
        }
      },
      type: Object
    },
    isShowName: {
      type: Boolean,
      default: true
    },
    isOpenSpecial: {
      type: Boolean,
      default: false
    },
    showData: {
      default: function () {
        return {
          statusIcon: true,
          ydstatusIcon: true,
          isShowDate: true,
          isShowModuleName: true,
          isShowBtns: true,
          isShowFavoriteBtn: true,
          isShowFSBtn: true,
          isShowTHBtn: true
        }
      },
      type: Object
    },
    isShownoText: {
      type: Boolean,
      default: true
    },
    dialogHeg: {
      type: Number,
      default: 600
    },
    fontGgColor: {
      type: String,
      default: ''
    },
    modulecolor: {
      type: String,
      default: ''
    },
    rightThreeColumn: {
      default: function () {
        return {
          whNameWidth: '',
          userNameWidth: '',
          dateWidth: '',
          bytwowidth: '',
          bythreewidth: ''
        }
      },
      type: Object
    },
    unreadisBold: {
      type: Boolean,
      default: true
    },
    usernameTextAligin: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      dbdata: [],
      win_title: '',
      win_url: '',
      showDialog: false,
      whereActiveKey: '',
      loadingEnd: false,
      lastDataCount: -1,
      pageIndex: 1,
      dbObj: {}, // 行点击对象
      dialogVisible: false, // 退回弹框
      backObj: {}, // 退回item
      backdesc: '' // 退回原因
    }
  },
  computed: {
    ...mapState({
      loadingIndex: state => state.loadingIndex,
      loadingCount: state => state.loadingCount
    }),
    noMore () {
      return this.lastDataCount < this.pageSize && this.lastDataCount > -1
    },
    disabled () {
      return !this.loadingEnd || this.noMore
    }
  },
  watch: {},
  methods: {
    ...mapMutations({
      UPDATE_LOADING_INDEX: 'UPDATE_LOADING_INDEX',
      UPDATE_LOADING_COUNT: 'UPDATE_LOADING_COUNT'
    }),
    rebuildColor (item, selfBol, bol) { // selfBol 是重新设置右侧自定义字段、用户名、日期宽度
      if (!this.fontGgColor && !selfBol && !item.btColor && !this.modulecolor) return
      let styleObject = {}
      if (this.fontGgColor) {
        const colorArr = this.fontGgColor.split(',')
        if ((item.readStatus && item.readStatus == 1) || (!item.readStatus && !item.isRead)) { // 未读
          styleObject['color'] = `${colorArr[0]} !important`
        } else {
          if (colorArr[1]) styleObject['color'] = `${colorArr[1]} !important`
        }
      }

      if (this.modulecolor && selfBol == 'module') { // 模块名称颜色
        styleObject['color'] = `${this.modulecolor} !important`
      }

      if (item.btColor) {
        const resultC = '#' + item.btColor
        styleObject['color'] = `${resultC} !important`
      }

      if (selfBol && !bol) {
        switch (selfBol) {
          case 'wh':
            styleObject['width'] = `${this.rightThreeColumn.whNameWidth} !important`
            break
          case 'username':
            styleObject['width'] = `${this.rightThreeColumn.userNameWidth} !important`
            styleObject['text-align'] = this.usernameTextAligin == 'left' ? 'left' : 'right'
            break
          case 'datetime':
            styleObject['width'] = `${this.rightThreeColumn.dateWidth} !important`
            break
          case 'bytwo':
            styleObject['width'] = `${this.rightThreeColumn.bytwowidth} !important`
            break
          case 'bythree':
            styleObject['width'] = `${this.rightThreeColumn.bythreewidth} !important`
            break
        }
      }

      return styleObject
    },
    selectAll () {
      this.dbdata.forEach(item => {
        this.$set(item, 'ischeck', true)
      })
      this.isCheck()
    },
    UnSelectAll () {
      this.dbdata.forEach(item => {
        this.$set(item, 'ischeck', false)
      })
      this.isCheck()
    },
    cancelBack () {
      this.dialogVisible = false
      this.backdesc = '' // 清空输入框
    },
    confirmBack () {
      let moduleId = this.backObj.moduleId
      let pk = this.backObj.id // pk---id
      let text = this.backdesc
      this.dialogVisible = false
      this.backdesc = '' // 清空输入框
      RemoteDocExchange.rejectIndex(moduleId, pk, text)
    },
    openTodoGather (item) {
      let id = item.id.split('_')[1]
      // openWinView(obj, {"url": "../../ctrl/flow/gatherShowIndex?pnId=" + item.pnId});
      let url = '../../ctrl/flow/gatherShowIndex?pnId=' + id
      window.open(url.replace('../../', this.dsf.config.webRoot.webPath), '_blank')
    },
    loadMoreData () {
      if (!this.loadingEnd) {
        return
      }
      console.log('触发加载')
      this.pageIndex = this.pageIndex + 1
      this.getDbData()
    },
    listStyle () {
      return this.listActiveStyle
    },
    getContentStyle () {
      let styleObject = {}
      if (this.twoWhere.length > 0) {
        styleObject['margin-left'] = '150px'
      }
      return styleObject
    },
    changeWhereKey (item) {
      this.whereActiveKey = item.value
      this.getDbData()
    },
    isCheck () {
      var ischeck = false
      var arrayIds = []
      var arrayItems = []
      for (let index = 0; index < this.dbdata.length; index++) {
        const element = this.dbdata[index]
        if (element.ischeck) {
          ischeck = true
          // break;
          element.pid = element.pid || element.id.split('_')[0]
          element.pnid = element.pnid || (element.id.indexOf('_') > 0 ? element.id.split('_')[1] : '')
          element.bt = this.reconvert(element.title)
          // arrayIds.push(element.infoId || element.id);
          arrayIds.push(element.id)
          arrayItems.push(element)
        }
      }
      this.$emit('changeBtnStatus', {
        arrayIds: arrayIds,
        ischeck: ischeck,
        arrayItems: arrayItems,
        datalen: this.dbdata.length
      })
    },
    reconvert (str) {
      if (!str) {
        return ''
      }
      str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, '$2')), 16)))
      })
      str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, '$2'), 16))
      })
      str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, '$2')))
      })
      str = str.replace(/(&)(\w{1,6});/gi, function ($0) {
        var rtnStr = ''
        switch ($0) {
          case '&ldquo;':
            rtnStr = '“'
            break
          case '&rdquo;':
            rtnStr = '”'
            break
          default:
            rtnStr = ''
            break
        }
        return rtnStr
      })

      return str
    },
    additionalParam (url) {
      if (url) {
        let finalurl = url.replace('../../', this.dsf.config.webRoot.webPath)
        var spliceR = url.indexOf('?') > -1 ? '&' : '?'
        if (finalurl.indexOf('ddtab') == -1) {
          finalurl = finalurl + spliceR + 'ddtab=true'
        }
        return finalurl
      }

      return ''
    },
    openTodoAjax (obj, mid, istrue, url) {
      let me = this
      if (top.window.simpleWin) {
        top.window.simpleWin(1, {
          url: me.additionalParam(url),
          'name': me.reconvert(this.dbObj.title || this.dbObj.bt) || ''
        })
      } else {
        window.open(me.additionalParam(url), url.replace('../../', this.dsf.config.webRoot.webPath))
      }
    },
    openRemind (id, url) {
      let me = this
      if (top.window.simpleWin) {
        top.window.simpleWin(1, {
          url: url.replace('../../', this.dsf.config.webRoot.webPath),
          'name': me.reconvert(this.dbObj.title || this.dbObj.bt) || ''
        })
      } else {
        window.open(url.replace('../../', this.dsf.config.webRoot.webPath), url.replace('../../', this.dsf.config.webRoot.webPath))
      }
    },
    openToDo (str, item) {
      let me = this
      console.log('点击的待办对象', item)
      this.dbObj = {...item}
      if (item && item.itemType == 'toremind') {
        this.$alert(item.title, {
          confirmButtonText: '确定',
          callback: action => {
            DSF.Utils.ajaxRequest(this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/remind/read', {
              ids: item.id
            }, function (result) {
              if (result.type == 'success') {
                me.$emit('reloadDBInfo', me.dbinfo.tab)
              }
            })
          }
        })
        return
      } else if (item && item.itemType == 'notice' && !item.titleOut && !item.url) {
        this.openNotice(item.id, item.noticeId, item.readStatus)
      }
      if (item.titleTarget && item.titleTarget == '_blank') {
        window.open(me.additionalParam(item.url), item.url.replace('../../', this.dsf.config.webRoot.webPath))
      } else if (item.url) {
        if (top.window.simpleWin) {
          top.window.simpleWin(1, {
            url: me.additionalParam(item.url),
            'name': me.reconvert(item.title || item.bt) || ''
          })
        } else {
          window.open(me.additionalParam(item.url), item.url.replace('../../', this.dsf.config.webRoot.webPath))
        }
      } else {
        item.titleOut && this.outFn(item.titleOut, item) || eval('this.' + str)
      }
    },
    outFn (titleOut, item) {
      try {
        window[titleOut].call(this, item)
      } catch (error) {
        console.log('error', error)
      }
    },
    OpenWindow (url, title) {
      let that = this
      window.closeDialog = function () {
        // console.log($(".el-dialog__wrapper").length)
        that.showDialog = false
        that.$emit('reloadDBInfo', that.dbinfo.tab)
      }
      this.win_title = title
      this.win_url = url
      this.showDialog = true
    },
    openShare (obj, id, moduleId, did, dfid, readEnd, readSta) {
      var me = this
      var url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?pk=' + id + '&moduleId=' + moduleId + '&distribId=' + did + '&fdistribId=' + dfid
      if (readEnd == 1) {
        url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?pk=' + id + '&moduleId=' + moduleId + '&distribId=0&fdistribId=0'
        DSF.Utils.ajaxRequest(this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/shareRead/readed', {
          infoIds: id,
          distribIds: did
        }, function (result) {
          if (result.type == 'success') {
            window.open(me.additionalParam(url), '_blank')
          }
        })
      } else {
        if (readSta != 2) {
          var changeVal = this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/officeInfo/changeRead' // 已读
          var changedata = {
            pk: did
          }
          DSF.Utils.ajaxRequest(changeVal, changedata, function (result) {
            // if (obj) {
            //     $(obj).parent().removeClass("font-weight");
            // }
          })
        }
        window.open(me.additionalParam(url), '_blank')
      }
    },
    openMeetingtz (id, formid, moduleid, tztype) {
      console.log(111)
      var url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?listId=' + formid + '&moduleId=' + moduleid + '&pk=' + id + '&method=info&noRela=1'
      if (tztype == '1') {
        url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?listId=' + formid + '&moduleId=' + moduleid + '&pk=' + id + '&method=chooseMember&noRela=1&validateByList=1'
      } else if (tztype == '2') {
        url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?listId=' + formid + '&moduleId=' + moduleid + '&pk=' + id + '&method=reportMember&noRela=1&validateByList=1'
      }
      window.open(this.additionalParam(url), '_blank')
      // this.OpenWindow(url, "待阅")
    },
    closeRefresh (done) {
      this.$emit('reloadDBInfo', this.dbinfo.tab)
      done()
    },
    handleClose (done) {
      done()
    },
    openNotice (pk, noticeId, read) {
      let that = this
      if (read == 1 && this.isShowBaoMing) this.markRead(pk, noticeId)
      let bodyHeight = document.body.clientHeight - 300
      var url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?listId=1808061608052gwg6wWGsNdiXr1yOCx&moduleId=180805175628RK7ixI1IyrjDuG4njD5&method=view&pk=' + noticeId
      this.OpenWindow(this.additionalParam(url), '查看')
    },
    openPaper (id, userName) {
      var me = this
      var url = this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/notepaper/markRead' // 已读
      var data = {
        notePaperId: id,
        moduleId: '180725205942uc2zjrqnTt5sg7ReWmV'
      }
      DSF.Utils.ajaxRequest(url, data, function (result) {
        // me.$emit("reloadDBInfo", me.dbinfo.tab);
      })

      // let bodyHeight = document.body.clientHeight - 300
      var url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?listId=1807271502471mZfA8mah6Q3fprnIVz&method=inbox&moduleId=180725205942uc2zjrqnTt5sg7ReWmV&pk=' + id
      // console.log(url)
      // //window.open(url, "_blank")
      // this.OpenWindow(url, 800, bodyHeight, "查看")

      let that = this
      var openUrl = this.additionalParam(url)

      var config = {
        'url': openUrl,
        'title': '',
        'success': function (layero, index) {
          me.$emit('reloadDBInfo', me.dbinfo.tab)
        },
        'callback': function () {
          me.$emit('reloadDBInfo', me.dbinfo.tab)
        }
      }

      config.area = '1000,' + ($(top.window).height() - 90)

      this.openWinViewTopLayer(this, config)
    },
    markRead (pk, noticeId) { // 标记已读
      let that = this
      var url = this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/notice/markRead' // 已读
      var data = {
        'pks': pk,
        'moduleId': '180805175628RK7ixI1IyrjDuG4njD5',
        'noticeId': noticeId
      }
      DSF.Utils.ajaxRequest(url, data, function (result) {
        if (result.type == 'success') {
          // that.$emit("reloadDBInfo");
        }
      })
    },
    openDBTaskInfo (masterId, id) {
      var moduleId = '190323160728t7fGwtjvQyVf8pQATUC'
      var url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/form?listId=190328103127HaPchz97HN6WfDHYZlq&moduleId=' + moduleId + '&method=feedback&validateByList=1&pk=' + id + '&fkId=' + id
      window.open(this.additionalParam(url), '_blank')
    },
    getDbData (selfbol) {
      let that = this
      that.loadingEnd = false
      let source = this.dbinfo.source || ''
      if (this.dbinfo.source == 'null') {
        source = ''
      }
      if (selfbol) { // 点击tab页，刷新，从第一页开始加载
        this.pageIndex = 1
        this.dbdata = []
      }
      // let url = this.dsf.config.webRoot.webPath+`ctrl/officeInfo/data?portalPattern=dsfa&type=2&tabType=${this.dbinfo.tab}&tabSource=${source}&start=0&page=${this.pageSize}&portletId=180125135446xxm4S1Fepm593xbbMco&bt=`+this.searchValue
      let url = this.dsf.config.webRoot.webPath + this.listUrl
      url = url + (url.indexOf('?') > -1 ? '&' : '?')
      url = url + `alldoTypes=${this.allTabs}&tabTypes=${this.dbinfo.tab}&start=${(this.pageIndex - 1) * this.pageSize}&page=${this.pageSize}&bt=${this.searchValue}&listType=${this.whereActiveKey}&sortType=${this.sortType}`
      // 加载中
      window.loadingCount = (window.loadingCount || 0) + 1
      if (window.loadingCount <= 1) {
        window.loadingInstance = this.$Loading.service()
      }
      this.$httpServer.get(url)
        .then(res => {
          if (that.listUrlExe) {
            var datalist = []
            if (res && res.data && res.data.data.tabs) {
              console.log('待办列表数据~存在扩展接口输出', res.data.data.tabs[that.dbinfo.tab].data)
              datalist = res.data.data.tabs[that.dbinfo.tab].data
              if (that.dbinfo.tab == 'toread') that.$emit('toreadChange', datalist.length)
            }
            that.getExeDbData(datalist)
          } else {
            // that.dbdata = []
            if (res && res.data && res.data.data.tabs) {
              console.log('待办列表数据~', res.data.data.tabs[that.dbinfo.tab].data)
              let resData = res.data.data.tabs[that.dbinfo.tab].data
              resData.map(item => {
                // that.dbdata.push(item)
                if (!that.dbdata.find(sitem => sitem.id == item.id)) {
                  that.dbdata.push(item)
                }
              })
              // that.dbdata = that.dbdata.concat(resData)
              if (that.dbinfo.tab == 'toread') that.$emit('toreadChange', that.dbdata.length)
              that.lastDataCount = resData.length
            } else {
              that.lastDataCount = 0
              if (that.dbinfo.tab == 'toread') that.$emit('toreadChange', 0)
            }
            that.loadingEnd = true
          }
          window.loadingCount = window.loadingCount - 1
          if (window.loadingCount <= 0) {
            window.loadingInstance.close()
          }
        })
        .catch(err => {
          console.log(err)
          // 这里应该加载失败提示
          window.loadingCount = window.loadingCount - 1
          if (window.loadingCount <= 0) {
            window.loadingInstance.close()
          }
        })
    },
    getExeDbData (prevDbdata) {
      let that = this
      // let url = this.dsf.config.webRoot.webPath+`ctrl/officeInfo/data?portalPattern=dsfa&type=2&tabType=${this.dbinfo.tab}&tabSource=${source}&start=0&page=${this.pageSize}&portletId=180125135446xxm4S1Fepm593xbbMco&bt=`+this.searchValue
      let url = this.dsf.config.webRoot.webPath + this.listUrlExe
      url = url + (url.indexOf('?') > -1 ? '&' : '?')
      url = url + `alldoTypes=${this.allTabs}&tabTypes=${this.dbinfo.tab}&start=${(this.pageIndex - 1) * this.pageSize}&page=${this.pageSize}&bt=${this.searchValue}&listType=${this.whereActiveKey}&sortType=${this.sortType}`
      // 加载中
      window.loadingCount = (window.loadingCount || 0) + 1
      if (window.loadingCount <= 1) {
        window.loadingInstance = this.$Loading.service()
      }
      this.$httpServer.get(url)
        .then(res => {
          // that.dbdata = []
          if (res && res.data && res.data.data.tabs) {
            if (!res.data.data.tabs[that.dbinfo.tab]) {
              prevDbdata.map(item => {
                that.dbdata.push(item)
              })
              that.lastDataCount = prevDbdata.length
            } else {
              console.log('扩展接口列表数据返回', res.data.data.tabs[that.dbinfo.tab].data)
              let resData = res.data.data.tabs[that.dbinfo.tab].data

              // 如果扩展接口没有这个数据就data返回空或者不返还data，如果返回空数组无法辨别是否扩展接口里面的数据（所以扩展接口必须是没有不能返回数组）
              if (resData == undefined || resData == '') {
                prevDbdata.map(item => {
                  that.dbdata.push(item)
                })
                that.lastDataCount = prevDbdata.length
              } else {
                if (that.dbinfo.tab == 'toread' && resData.length > 0) that.$emit('toreadChange', resData.length)

                resData.map(item => {
                  if (!that.dbdata.find(sitem => sitem.id == item.id)) {
                    that.dbdata.push(item)
                  }
                })
                that.lastDataCount = resData.length
              }
            }
          } else {
            that.lastDataCount = prevDbdata.length
            if (that.dbinfo.tab == 'toread') that.$emit('toreadChange', datalist.length)
            prevDbdata.map(item => {
              that.dbdata.push(item)
            })
          }
          that.loadingEnd = true

          window.loadingCount = window.loadingCount - 1
          if (window.loadingCount <= 0) {
            window.loadingInstance.close()
          }
        })
        .catch(err => {
          console.log(err)

          window.loadingCount = window.loadingCount - 1
          if (window.loadingCount <= 0) {
            window.loadingInstance.close()
          }
        })
    },
    todoAction (key, item) {
      console.log('↓↓↓↓↓↓↓↓↓↓ 点击按钮【' + key + '】的item数据 ↓↓↓↓↓↓↓↓↓↓')
      console.log(item)
      this.dbObj = {...item}
      switch (key) {
        case 0: // 关注
          this.actionKey0(item)
          break
        case 1: // 发送
          this.actionKey1(item)
          break
        case 2: // 阅毕
          this.actionKey2(item)
          break
        case 3: // 报名
          this.actionKey3(item)
          break
        case 4: // 反馈
          this.actionKey4(item)
          break
        case 5: // 退回
          this.actionKey5(item)
          break
        case 6: // 签收
          this.openToDoSelf(item.sendBackUrl || '')
          break
        case 7: // 拒签--退回
          this.backObj = {...item}
          this.dialogVisible = true
          break
        case 8: // 会签回执
          this.openToDoSelf(item.agreeUrl || '')
          break
        case 9: // 盖章回执
          this.openToDoSelf(item.sealFeedBackBtnUrl || '')
          break
        case 10: // 反馈
          this.openToDoSelf(item.sendBackUrl || '')
          break
        case 11: // 催办
          this.cbFn(item.dbcbUrl || '', item)
          break
        case 12: // 督办反馈
          this.cbFn(item.dbfkUrl || '', item)
          break
      }
    },
    cbFn (titleOut, item) {
      try {
        window[titleOut].call(this, item)
      } catch (error) {
        console.log('error', error)
      }
    },
    openToDoSelf (str) {
      eval(str)
    },
    openToDoSelf1 (str) {
      // eval(str)
      this.dialogVisible = true
    },
    actionKey0 (item) {
      let that = this
      // 关注
      DSF.Utils.ajaxRequest(this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/favorite/enshrine', {
        'infoId': item.infoId,
        'type': item.isFavorite == 1 ? '-1' : '1'
      }, function (result) {
        if (result.type == 'success') {
          // that.getDbData();

          // 2021-06-01 注释了以下2行
          // that.openSuccess(item.isFavorite == 1 ? "取消关注成功！" : "关注成功！");
          // item.isFavorite = item.isFavorite == "1" ? -1 : 1;
          let message = item.isFavorite == 1 ? '取消关注成功！' : '关注成功！'
          that.$message({
            showClose: true,
            message: message,
            type: 'success',
            duration: 1500,
            onClose: function () {
              item.isFavorite = item.isFavorite == '1' ? -1 : 1
              that.$emit('reloadDBInfo', that.dbinfo.tab)
            }
          })
          // DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace("/","")+"ctrl/officeInfo/changeTodoFavorite", {
          //     todoId: item.id,
          //     state:item.isFavorite==1?"-1":"1",
          //     moduleId:item.moduleId
          // }, function (result) {
          //     if(result.type == "success"){
          //         that.getDbData();
          //         that.openSuccess(item.isFavorite==1?"取消关注成功！":"关注成功！");
          //     }
          // });
        }
      })
    },
    actionKey1 (item) {
      // 发送
      debugger
      window.flowPage = 2
      let that = this
      var todoUrl = this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/officeInfo/getTodo'
      var todoData = {
        todoId: item.id
      }

      DSF.Utils.ajaxRequest(todoUrl, todoData, function (result) {
        if (result.type == 'success') {
          var sendType = 'SR_SEND'
          var pid = result.data.pid
          var pnid = result.data.pnid
          var flowId = result.data.flowId
          var nodeId = result.data.nodeId
          var nodeName = result.data.nodeName
          var agencyUserId = ''
          var mj = ''
          that.flowSendOld(sendType, item.infoId, item.title, pid, pnid, flowId, nodeId, '', '', item.moduleId, item.moduleName, item.nodeName, item.id, item.agencyType, agencyUserId, mj, item.titleUrl)
        }
      })
    },
    flowSendOld (sendType, pk, bt, pid, pnid, flowId, nodeId, nextLineId, direction, moduleId, moduleName, nodeName, todoId, agencyType, agencyUserId, mj, titleUrl) {
      let that = this
      var sendData = {
        sendType: sendType,
        pk: pk,
        bt: bt,
        pId: pid,
        pnId: pnid,
        todoId: todoId,
        flowId: flowId,
        nodeId: nodeId,
        nextLineId: '',
        direction: '',
        moduleId: moduleId,
        moduleName: moduleName,
        agencyType: agencyType,
        determineUser: agencyUserId,
        userId: agencyUserId,
        hasReceive: true
      }

      var exInfoObj = {
        mj: mj
      }
      sendData.exInfo = JSON.stringify(exInfoObj)

      var validateParam = {
        pk: pk,
        moduleId: moduleId,
        flowId: flowId,
        nodeId: nodeId,
        pId: pid,
        pnId: pnid
      }

      var lockMsg = ''
      DSF.Utils.ajaxSyncRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/officeInfo/checkLock', {
        pk: pk
      }, function (result) {
        if (result.type == 'success') {
          var isExe = result.data.isExe
          if (isExe && isExe == 1) {
            lockMsg = ''
          } else {
            lockMsg = '该文件正在被他人处理,如需处理请稍后重试'
          }
        }
      })

      if (lockMsg && lockMsg != null && lockMsg != null) {
        that.openError(lockMsg)
        return false
      }
      DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/xform/validate', validateParam, function (result) {
        if (result.type == 'success') {
          DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/opinionSignCheck/controlCheck', {
            todoId: todoId,
            nodeName: nodeName,
            pk: pk
          }, function (result) {
            if (result.type == 'success') {
              var checkVal = result.data.checkVal
              if (result.data.checkVal == 1) {
                MessageBox.confirm('当前环节未签名，是否自动签名？', '提示', {
                  confirmButtonText: '自动签名',
                  cancelButtonText: '不签名',
                  type: 'warning',
                  confirmButtonClass: 'confirmButtonClass-skin-' + that.skin
                }).then(() => {
                  DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/opinionSignCheck/todoUpdSign', {
                    pid: pid,
                    pnid: pnid,
                    isSign: 1,
                    pk: pk
                  }, function (result) {
                    if (result.type == 'success') {
                      that.Flowsend(sendData, function () {
                        // 重新加载待办
                        that.$emit('reloadDBInfo')
                      })
                    }
                  })
                }).catch(() => {
                  DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/opinionSignCheck/todoUpdSign', {
                    pid: pid,
                    pnid: pnid,
                    isSign: 0,
                    pk: pk
                  }, function (result) {
                    if (result.type == 'success') {
                      that.Flowsend(sendData, function () {
                        // 重新加载待办
                        that.$emit('reloadDBInfo')
                      })
                    }
                  })
                })
              } else {
                that.Flowsend(sendData, function () {
                  // 重新加载待办
                  that.$emit('reloadDBInfo')
                })
              }
            } else {
              that.openError(result.message)
            }
          })
        } else {
          MessageBox.confirm(result.message + '，是否打开表单处理？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirmButtonClass-skin-' + that.skin
          }).then(() => {
            // 点击打开表单
            that.openToDo(titleUrl, that.dbObj) // -this.dbObj--
          }).catch(() => {})
        }
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
        'pk': data.pk,
        'type': 2,
        'pId': data.pId,
        'pnId': data.pnId
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

      window.top.flowPage = window.flowPage
      sendUrl += '?flowPage=' + window.flowPage + '&pk=' + data.pk + '&moduleId=' + data.moduleId + '&sendType=' + data.sendType
      /*  var keys = ["pId", "pnId", "flowId", "nextLineId", "successToNodeId", "agencyType", "determineUser"];
                  sendUrl += "&" + DSF.Utils.json2Param(data, keys); */

      if (isBack && isBack == 1) {
        window.location.href = sendUrl
        return
      }

      var config = {
        'url': sendUrl,
        'closeBtn': 0,
        'title': '选择发送范围',
        'success': function (layero, index) {
          if (typeof window.top.afterOpenSendView === 'function') {
            window.top.afterOpenSendView()
          }
        },
        'callback': function () {
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
      if (typeof (window.setSendArea) === 'function') {
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
        opts.url = this.dsf.config.webRoot.webPath + opts.url.substring('../../'.length)
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
    actionKey2 (item) {
      // 阅毕
      let that = this

      MessageBox.confirm('是否确认阅毕', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirmButtonClass-skin-' + that.skin
      }).then(() => {
        DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/shareRead/readedIds', {
          distribIds: item.id
        }, function (result) {
          if (result.type == 'success') {
            that.openSuccess('阅毕成功！')
            // that.getDbData();
            that.$emit('reloadDBInfo', that.dbinfo.tab)
          } else {
            that.openError('阅毕失败！')
          }
        })
      }).catch(() => {

      })
    },
    actionKey3 (item) {
      // 报名
      var pk = item.infoId
      var hylx = 0 // 0个人   1部门   2单位
      var nodeId = item.nodeId
      if (nodeId != 11) {
        var result = DSF.Utils.ajaxSyncRequest(this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/meetingApply/getHytzToType', {
          pk: pk
        })
        hylx = result.message
      }
      var url = ''
      // url = DSF.getURLRoot() + "ctrl/formControl/form?moduleId=190813144418OyeMDrjBj1ytos8cARM&fid="+pk;
      if (hylx == 1) {
        url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/sysForm?moduleId=190813144418OyeMDrjBj1ytos8cARM&formId=2008281640301T3Rmfp4Zgg9W0fE7WX&nodeId=12&fid=' + pk + '&hylx=' + hylx
      } else if (hylx == 2) {
        url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/sysForm?moduleId=190813144418OyeMDrjBj1ytos8cARM&formId=200909203004SmGVh5JEaQhQu0qk5np&nodeId=12&fid=' + pk + '&hylx=' + hylx
      } else {
        url = this.dsf.config.webRoot.webPath + 'ctrl/formControl/sysForm?moduleId=190813144418OyeMDrjBj1ytos8cARM&formId=190813144549zioVr5C0aPAnLMU1Hu7&nodeId=11&fid=' + pk
      }
      var result = DSF.Utils.ajaxSyncRequest(this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/meeting/getCurUserInfoId', {
        pk: pk
      })
      if (result.type == 'success') {
        url = url + '&pk=' + result.message
      }
      this.openWinView(this, {
        type: 2,
        title: '报名会议',
        shadeClose: false, // 点击遮罩关闭层
        resize: false,
        area: '1050,550',
        url: url
      })
    },
    actionKey4 (item) {
      // 反馈
    },
    actionKey5 (item) {
      // 退回
      this.flowSendBack(item.infoId, item.id)
    },
    flowSendBack (pk, todoId) {
      var me = this
      var todoUrl = this.dsf.config.webRoot.webPath.replace('/', '') + 'ctrl/officeInfo/getTodo'
      var todoData = {
        todoId: todoId
      }

      DSF.Utils.ajaxRequest(todoUrl, todoData, function (result) {
        console.log('退回-result', result, result.data)
        if (result.type == 'success') {
          // var pid = result.data.pid;
          // var pnid = result.data.pnid;
          // var flowId = result.data.flowId;
          // me.flowSendBackOld(flowId, pid, pnid, pk);
          me.flowSendBackOld(result.data)
        }
      })
    },
    flowSendBackOld (data) {
      var me = this
      // var data = {
      //     flowId: flowId,
      //     pId: pid,
      //     pnId: pnid,
      //     pk: pk
      // }
      me.FlowsendBack(data, function () {
        // 重新加载待办
        me.$emit('reloadDBInfo', me.dbinfo.tab)
      })
    },
    FlowsendBack (data, success) {
      let that = this
      let { infoId, moduleId, pnid, pid, flowId } = data

      // var confirmText = "是否确定退回？";
      // MessageBox.confirm(confirmText, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     confirmButtonClass: "confirmButtonClass-skin-" + that.skin
      // })
      // .then(() => {
      //     sendBackRange(infoId,moduleId,pnid,pid,flowId);
      // })
      // .catch((err) => {
      //     console.log('err',err);
      // });

      sendBackRange(infoId, moduleId, pnid, pid, flowId)

      // DSF.Utils.ajaxRequest(this.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/flowhandle/getStopBack", data, function (result) {
      //     if (result.type == "success") {
      //         var stopback = result.message;
      //         if (stopback == 1) {
      //             that.openError("该文件禁止退回！");
      //         } else {
      //             var confirmText = "是否确定退回？";
      //             MessageBox.confirm(confirmText, '提示', {
      //                 confirmButtonText: '确定',
      //                 cancelButtonText: '取消',
      //                 type: 'warning',
      //                 confirmButtonClass: "confirmButtonClass-skin-" + that.skin
      //             }).then(() => {
      //                 DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/flow/getSendBackUrl", data, function (result) {
      //                     if (result.type == "success") {
      //                         //打开流程引擎提供的退回界面
      //                         that.openWinView(that, {
      //                             "url": result.data.url,
      //                             title: false,
      //                             "area": "680,500",
      //                             "callback": function () {
      //                                 // try {
      //                                 //     opener.location.reload();
      //                                 //     window.opener.parent.onWebSocketMessage();
      //                                 // } catch (e) {
      //                                 // }
      //                                 if (typeof success == "function") {
      //                                     success();
      //                                 } else {
      //                                     //location.reload();
      //                                 }
      //                             }
      //                         });
      //                     } else {
      //                         that.openError(result.message);
      //                     }
      //                 });
      //             }).catch(() => {});
      //         }
      //     } else {
      //         that.openError("操作失败：" + result.message);
      //     }
      // });
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
    }
  },
  created () {},
  mounted () {
    this.getDbData()
    let that = this
    // 设置面板关闭事件
    window.closeCtrlSetDialog = function () {
      that.showCtrlSetDialog = false
    }
    // 设置面板链接
    that.CtrlSetDialogUrl = this.dsf.config.webRoot.webPath + 'ctrl/dsfa/rm/showComment?commentId=' + this.dataId + '&pageId=' + this.getUrlParam('pageId').split('#')[0]
  },
  destroyed () {}
}
</script>

    <style lang="scss">
    .backdesc {
        padding: 50px;
        height: 200px;
        box-sizing: border-box;
        .el-textarea__inner {
            height: 100px;
        }
    }
    .dblist-v2 {

        .dbs-v2.scroll-load {
            height: 100%;
            margin-left: -20px;
            /* margin-right: -20px; */
            margin-right: -10px;
            overflow-y: auto;
            overflow-x: hidden;

            &::-webkit-scrollbar-track-piece {
                background-color: transparent;
            }

            &::-webkit-scrollbar {
                width: 8px;
                height: 9px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #ebebeb;
                background-clip: padding-box;
                min-height: 28px;
                border-radius: 4px;
            }

            .dbcontain-v2 {
                padding: 0px 20px;
                box-sizing: border-box;

                .dbactive>div {
                    padding: 0 25px 0 35px;
                }
            }

            .loading-info {
                text-align: center;
            }
        }
    }
    </style>
