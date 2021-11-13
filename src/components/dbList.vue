<template>
<div class="dblist-v2 parentboxv2" :class="'skin-'+skin+` controlStyle-${controlStyle}`" :style="{'margin':margin,height:(height==0?300:height)+'px','background':cardTabBgColor?cardTabBgColor:titleBarBgColor}">

    <div class="platform_card_bts" :class="'bts-'+controlStyle">
        <div class="addbtn" v-show="activeName=='remote_doc_exchange'&&tabslist['remote_doc_exchange']['receiveRemoteDoc']" @click="receiveRemote()">接收远程公文</div>
        <div class="C00040-select" v-show="isShowSearchInput" style="margin-top: 0px;width:150px;float: right;margin-right:0px">
            <input ref="wysearch" type="text" style="width:150px;padding: 0 35px 0 10px;" @blur="searchBlur()" @keyup.enter="getDbData(activeName)" v-model="searchValue" placeholder="请输入关键词">
        </div>
        <div class="addbtn" v-if="isShowTodoBtn && (activeName=='todo' || activeName=='todoagency') && openBatchOperate" v-show="!isShowSearchInput" @click="batchSend()">批量办理</div>
        <div class="allselect" :class="{'unselect':isselectall}" v-show="activeName=='toread' && isdatalist" @click="allSelectBtn()">{{isselectall ? '取消全选' : '全选'}}</div>
        <div class="addbtn redbtn" style="margin-left:10px" v-if="isShowReadBtn && activeName=='toread'" v-show="!isShowSearchInput" @click="batchRead">批量阅毕</div>
    </div>

    <div class="video-tx" v-if="isShowVideoTx" @click="goVideoTx()">
        <label>视频通讯</label>
    </div>

    <el-tabs :class="getTabsCSS" v-model="activeName" @tab-click="handleClick">

        <el-tab-pane :name="item.tab" v-for="(item,index) in tabdata" :key="index">
            <span class="platform_tab_title_remind_v1" :class="'tabnum-'+(item.num1==99 ? '3' : item.num1>9 ? '2' : '1')" slot="label">
                {{item.show}}
                <label v-show="item.num1>0" :class="activeName==item.tab?'active':(remindShowType==1?'active':'')">{{activeName==item.tab?item.num:(remindShowType==1?item.num:'')}}</label>
            </span>
            <div class="containbox" :style="getContainboxStyle()">

            </div>
        </el-tab-pane>
    </el-tabs>

</div>
</template>

<script>
import {
    MessageBox,
    Message
} from 'element-ui';
export default {
    ctrlCaption: '待办列表V2',
    name: 'DBList',
    components: {
      
    },
    props: {
        margin: {
            type: String,
            default: "20px",
        },
        countUrl: {
            type: String,
            default: "ctrl/officeInfo/getDsfaTabsInfo",
        },
        listUrl: {
            type: String,
            default: "ctrl/officeInfo/getDsfaTabsData",
        },
        countUrlExe: {
            type: String,
            default: "",
        },
        listUrlExe: {
            type: String,
            default: "",
        },
        subHeight: {
            type: Number,
            default: 360,
        },
        fixedHeight: {
            type: Number,
            default: 0,
        },
        isShowSearch: {
            type: Boolean,
            default: false
        },
        controlStyle: {
            type: String,
            default: "dreamweb"
        },
        listDefaultFontSize: {
            type: Number,
            default: 16,
        },
        listActiveFontSize: {
            type: Number,
            default: 16,
        },
        contentBgType: {
            type: Number,
            default: 0,
        },
        contentBgAlpha: {
            type: Number,
            default: 0,
        },
        contentBgColor: {
            type: String,
            default: "",
        },
        titleBarBgColor: {
            type: String,
            default: "",
        },
        enableHoverBar: {
            type: Boolean,
            default: true
        },
        hoverBarBgType: {
            type: Number,
            default: 0,
        },
        hoverBarBgAlpha: {
            type: Number,
            default: 0,
        },
        hoverBarBgColor: {
            type: String,
            default: "",
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
            default: 0,
        },
        refreshType: {
            type: String,
            default: ""
        },
        VideoOpenType: {
            type: String,
            default: "popup"
        },
        actionName0: {
            type: String,
            default: "关注",
        },
        actionName1: {
            type: String,
            default: "发送",
        },
        actionName2: {
            type: String,
            default: "阅毕",
        },
        actionName3: {
            type: String,
            default: "报名",
        },
        actionName4: {
            type: String,
            default: "反馈",
        },
        actionName5: {
            type: String,
            default: "退回",
        },
        actionName6: {
            type: String,
            default: "签收",
        },
        actionName7: {
            type: String,
            default: "退回", //拒收
        },
        actionName8: {
            type: String,
            default: "会签回执", //会签回执
        },
        actionName9: {
            type: String,
            default: "盖章回执", //盖章回执
        },
        actionName10: {
            type: String,
            default: "反馈", //反馈
        },
        isShowName: {
            type: Boolean,
            default: true
        },
        statusIcon: { //是否显示状态图标
            type: Boolean,
            default: true
        },
        isShowDate: { //是否显示日期
            type: Boolean,
            default: true
        },
        isShowModuleName: { //是否显示模块名称
            type: Boolean,
            default: true
        },
        isShowBtns: { //是否启用按钮操作
            type: Boolean,
            default: true
        },
        isShowTimeout: { //是否启用超时提醒
            type: Boolean,
            default: true
        },
        timeoutColor: {
            type: String,
            default: "#FF0000", //已超时文字颜色
        },
        isShownoText: {
            type: Boolean,
            default: true
        },
        titleBarStyle: {
            type: String,
            default: "normal"
        },
        isOpenSpecial: {
            type: Boolean,
            default: false
        },
        isShowVideoTx: {
            type: Boolean,
            default: false,
        },
        VideoTxurl: {
            type: String,
            default: ''
        },
        isShowFavoriteBtn: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            //设置是否需要获取设置属性
            isGetCtrlSetInfo: true,
            activeName: 'alldo',
            activeNewFile: '',
            activeNewFileUrl: {},
            centerDialogVisible: false,
            tabdata: [],
            height: 600,
            showDialog: false,
            pageSize: 7,
            searchValue: "",
            isShowSearchInput: false,
            isShowTodoBtn: false,
            isShowReadBtn: false,
            toReadIds: [],
            loadedTabName: ",",
            allTabNames: "",
            showCtrlSetDialog: false,
            CtrlSetDialogUrl: "",
            CtrlSetDialogTitle: "设置",
            CtrlSetInfo: {},
            dialogVisibleVideo: false,
            selectTabData: [],
            dialogHeight: 600,
            skin: 'blue',
            settingShow: true,
            arrayItems_todo: [],
            globalFontSize: "small",
            isWhiteColor: false, //白色底色需要加margin
            cardTabBgColor: '#FFFFFF',
            marginStr: 0,
            tabslist: {},
            isselectall: false, //全选状态
            isdatalist: false, //我的待阅tab  
        };
    },
    computed: {
        isShowData() {
            return {
                statusIcon: this.statusIcon,
                isShowDate: this.isShowDate,
                isShowModuleName: this.isShowModuleName,
                isShowBtns: this.isShowBtns,
                isShowTimeout: this.isShowTimeout,
                timeoutColor: this.timeoutColor,
                isShowFavoriteBtn: this.isShowFavoriteBtn
            }
        },
        getTabsCSS() {
            return [
                this.titleBarStyle == 'borderbottom' ? 'borderm20' : '',
                this.isWhiteColor ? 'margin20' : 'otherMargin',
                this.isShowSearch ? 'tabs-sousuo' : '',
                (this.activeName != 'alldo' && !this.isdatalist) ? 'ts-el-tabs-small' : (this.isShowTodoBtn || this.isShowReadBtn || this.activeName == 'toread') ? 'ts-el-tabs' : '',
                this.activeName == 'remote_doc_exchange' && this.tabslist['remote_doc_exchange']['receiveRemoteDoc'] ? 'ts-el-tabs-long' : '',
                this.activeName == 'toread' && this.isShowReadBtn ? 'ts-el-tabs-long2' : '',
            ];
        },
    },
    watch: {
        titleBarBgColor() {
            this.getWholeStyle();
        }
    },
    methods: {
        goVideoTx() {
          if (!this.VideoTxurl) return;
        },
        //去掉首尾逗号
        trimStr(str) {
            return str.replace(/^(,)+|(,)+$/g, "");
        },
        // 接收远程文件
        receiveRemote() {
            let obj = this.tabslist["remote_doc_exchange"];
            eval(obj.receiveRemoteDocUrl || "")
        },
        //我的待阅-全选
        allSelectBtn() {
            this.isselectall = !this.isselectall;
            let ary = this.trimStr(this.loadedTabName).split(",");
            let targetIndex = ary.findIndex(item => item == 'toread');
            if (this.isselectall) {
                this.$refs.child[targetIndex].selectAll();
            } else {
                this.$refs.child[targetIndex].UnSelectAll();
            }
        },
        goNewFile() {
            this.tabdata.forEach(element => {
                if (element.tab == this.activeName) {
                    console.log("-------element", element)
                    if (typeof element.newFileUrl == 'string') {
                        this.activeNewFile = element.newFileUrl;
                    } else {
                        this.activeNewFileUrl = element.newFileUrl; //newFileUrl:{url:xxxx}
                    }
                }
            })
            if (this.activeNewFile) {
                top.window.newModuleForm(this.activeNewFile)
                return;
            }

            if (this.activeNewFileUrl && this.activeNewFileUrl.url) {
                window.open(this.dsf.config.webRoot.webPath + this.activeNewFile.url);
                return;
            }

        },
        searchBlur() {
            let that = this;
            setTimeout(function () {
                that.searchValue == '' ? that.isShowSearchInput = false : ''
            }, 1000)
        },
        showCtrlSetDialogFun() {
            let that = this;
            //设置面板关闭事件
            window.closeCtrlSetDialog = function () {
                that.showCtrlSetDialog = false;
                //刷新获取设置数据方法
                that.getCtrlSetInfo();
            }
            window.closeDialog = window.closeCtrlSetDialog;
            that.showCtrlSetDialog = true;
        },
        getWholeStyle() {
            if (this.cardTabBgColor) {
                if (this.cardTabBgColor.toUpperCase() == '#FFFFFF' || this.cardTabBgColor.toUpperCase() == 'FFFFFF') {
                    this.isWhiteColor = true;
                } else {
                    this.isWhiteColor = false;
                }
            }
            if (this.titleBarBgColor) {
                if (this.titleBarBgColor.toUpperCase() == '#FFFFFF') {
                    this.isWhiteColor = true;
                } else {
                    this.isWhiteColor = false;
                }
            }
            console.log("this.isWhiteColor", this.isWhiteColor)
        },
        getContainboxStyle(isListStyle) {
            let styleObject = {
                'height': (this.height - 60) + 'px'
            };
            if (this.contentBgType == 0) {
                //跟随主题变化
                switch (this.skin) {
                    case "blue":
                        styleObject["background"] = `rgba(27,95,164,${this.contentBgAlpha/100}) !important`;
                        break;
                    case "inblue":
                        styleObject["background"] = `rgba(0,128,255,${this.contentBgAlpha/100}) !important`;
                        break;
                    case "green":
                        styleObject["background"] = `rgba(24,154,91,${this.contentBgAlpha/100}) !important`;
                        break;
                    case "ycgreen":
                        styleObject["background"] = `rgba(2,106,82,${this.contentBgAlpha/100}) !important`;
                        break;
                    case "red":
                        styleObject["background"] = `rgba(198,47,38,${this.contentBgAlpha/100}) !important`;
                        break;
                    case "black":
                        styleObject["background"] = `rgba(255,211,126,${this.contentBgAlpha/100}) !important`;
                        break;
                    case "orange":
                        styleObject["background"] = `rgba(255,106,0,${this.contentBgAlpha/100}) !important`;
                        break;
                }
            } else if (this.contentBgType == 1) {
                //自定义颜色
                styleObject["background"] = this.contentBgColor + (this.contentBgColor.indexOf("important") == -1 ? " !important" : "");
            }
            return styleObject;
        },
        getHoverBarStyle(isListStyle) {
            let styleObject = {};
            if (this.hoverBarBgType == 0) {
                //跟随主题变化
                switch (this.skin) {
                    case "blue":
                        styleObject["background"] = `rgba(27,95,164,${this.hoverBarBgAlpha/100}) !important`;
                        break;
                    case "inblue":
                        styleObject["background"] = `rgba(0,128,255,${this.hoverBarBgAlpha/100}) !important`;
                        break;
                    case "green":
                        styleObject["background"] = `rgba(24,154,91,${this.hoverBarBgAlpha/100}) !important`;
                        break;
                    case "ycgreen":
                        styleObject["background"] = `rgba(2,106,82,${this.hoverBarBgAlpha/100}) !important`;
                        break;
                    case "red":
                        styleObject["background"] = `rgba(198,47,38,${this.hoverBarBgAlpha/100}) !important`;
                        break;
                    case "black":
                        styleObject["background"] = `rgba(255,211,126,${this.hoverBarBgAlpha/100}) !important`;
                        break;
                    case "orange":
                        styleObject["background"] = `rgba(255,106,0,${this.hoverBarBgAlpha/100}) !important`;
                        break;
                }
            } else if (this.hoverBarBgType == 1) {
                //自定义颜色
                styleObject["background"] = this.hoverBarBgColor + (this.hoverBarBgColor.indexOf("important") == -1 ? " !important" : "");
            }
            return styleObject;
        },
        getCtrlSetInfo() {
            this.CtrlSetInfo = {};
            let url = this.dsf.config.webRoot.webPath.replace("/", "") + `ctrl/dsfa/rm/componentdeDefinition?pageId=${this.getUrlParam("pageId").split("#")[0]}&componentId=${this.dataId}`;
            // let url = this.dsf.config.webRoot.webPath.replace("/", "") + 'ctrl/dsfa/rm/componentdeDefinition?pageId=201029154538r0v3kTdCRNUpDmviVrF&componentId=201030151355yd3GVp62aWLLsuSkTL0'
            let that = this
            window.loadingCount = (window.loadingCount || 0) + 1;
            if (window.loadingCount <= 1) {
                window.loadingInstance = this.$Loading.service()
            }
            this.$httpServer.get(url)
                .then(res => {
                    if (res && res.data && res.data.data) {
                        console.log("设置的接口数据", res);
                        var yxArrar = res.data.data["p-sz"] || res.data.data["p-yx"] || [];
                        // 存在待签收tab则加载
                        // yxArrar && 
                        var pdres = yxArrar.find((v) => {
                            return v.value == 'remote_doc_exchange';
                        });
                        if (pdres) this.loadOuterJs(dsf.url.getWebUrl("/resource/js/business-common.js"));
                        that.selectTabData = yxArrar;
                        that.loadedTabName = ",";
                        that.CtrlSetInfo = res.data.data;
                        that.getDbData();
                        if (res.data.data.szsfxs && res.data.data.szsfxs.length > 0) {
                            that.settingShow = res.data.data.szsfxs[0].value == "1" ? true : false
                        }
                    }
                    window.loadingCount = window.loadingCount - 1;
                    if (window.loadingCount <= 0) {
                        window.loadingInstance.close();
                    }
                })
                .catch(err => {
                    console.log(err)
                    window.loadingCount = window.loadingCount - 1;
                    if (window.loadingCount <= 0) {
                        window.loadingInstance.close();
                    }
                })
        },
        /**
         * 获取到了设置信息返回结果
         */
        CtrlSetInfoCallback(resData) {
            let that = this
            if (resData) {
                console.log("【待办列表】设置的接口数据【待办列表】", resData);
                var yxArrar = resData["p-sz"] || resData["p-yx"] || [];
                var pdrestwo = yxArrar && yxArrar.find((v) => {
                    return v.value == 'remote_doc_feedback'
                }) || undefined;
                if (pdrestwo) this.loadOuterJs(dsf.url.getWebUrl("/resource/js/public.js?v=v1.016.000.20200917_beta"));
                // 存在待签收tab则加载
                var pdres = yxArrar && yxArrar.find((v) => {
                    return v.value == 'remote_doc_exchange'
                }) || undefined;
                if (pdres) this.loadOuterJs(dsf.url.getWebUrl("/resource/js/business-common.js"));
                that.selectTabData = yxArrar;
                that.loadedTabName = ",";
                that.CtrlSetInfo = resData;
                // that.getDbData();
                if (resData.szsfxs && resData.szsfxs.length > 0) {
                    that.settingShow = resData.szsfxs[0].value == "1" ? true : false
                }
            }
            this.$nextTick(() => {
                setTimeout(() => {
                    let elementHeight = $(".dblist-" + that.dataId).parent().parent().outerHeight();
                    let marginStr = that.getContainHeight();
                    that.marginStr = marginStr;
                    that.height = parseInt(elementHeight) - parseInt(marginStr);
                    console.log('dblist-v2-this.height', that.height);
                    that.pageSize = parseInt((that.height - 60) / 44) < 1 ? 1 : parseInt((that.height - 60) / 44);
                    console.log('dblist-v2-this.pageSize', that.pageSize);
                }, 100);
            });
        },
        getTwoWhere(tab) {
            let that = this;
            if (that.CtrlSetInfo[tab] && that.CtrlSetInfo[tab].length > 0) {
                return that.CtrlSetInfo[tab];
            } else {
                return [];
            }
        },
        getSortType() {
            let that = this;
            if (that.CtrlSetInfo.sortType && that.CtrlSetInfo.sortType.length > 0) {
                return that.CtrlSetInfo.sortType[0].value;
            } else {
                return 1;
            }
        },
        changeBtnStatus(objectArgs) {
            if (this.activeName == 'todo' || this.activeName == 'todoagency') {
                this.isShowTodoBtn = objectArgs.ischeck;
                this.arrayItems_todo = objectArgs.arrayItems;
            }
            if (this.activeName == 'toread') {
                this.isShowReadBtn = objectArgs.ischeck;
                this.isdatalist = objectArgs.ischeck; //批量阅毕-- 没数据后  不再显示全选按钮
                this.toReadIds = objectArgs.arrayIds;
            }
        },
        toreadChange(len) {
            this.isdatalist = len > 0 ? true : false;
        },
        batchRead() {
            //阅毕
            let that = this;
            if (this.toReadIds.length == 0) {
                return;
            }

            MessageBox.confirm('是否确认进行批量阅毕', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: "confirmButtonClass-skin-" + that.skin
            }).then(() => {
                console.log('that.toReadIds--', that.toReadIds.join(","));
                DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/shareRead/readedIds", {
                    distribIds: that.toReadIds.join(",")
                }, function (result) {
                    if (result.type == "success") {
                        that.openSuccess("阅毕成功！");
                        that.isShowReadBtn = false;
                        that.isselectall = false; //把取消全选状态设置为初始状态(全选)
                        that.getDbData();
                    } else {
                        that.openError("阅毕失败！");
                    }
                });
            }).catch(() => {

            });
        },
        searchIconClick() {
            this.isShowSearchInput = true;
            var that = this;
            setTimeout(() => {
                that.$refs.wysearch.focus();
            }, 500);
        },
        handleClick(tab, event) {
            var that = this;
            that.loadedTabName = that.loadedTabName + tab.name + ",";
            that.tabdata.forEach(element => {
                if (element.tab == this.activeName) {
                    this.activeNewFile = element.newFileUrl;
                }
            })
        },
        getDbData(selActiveName) {
            console.log('selActiveName-----dbList-v2', selActiveName);
            if (this.selectTabData.length == 0) {
                return;
            }
            let that = this;
            that.activeName = selActiveName || this.selectTabData[0].value;
            that.loadedTabName = that.loadedTabName + that.activeName + ",";
            var allTabName = [];
            for (let index = 0; index < this.selectTabData.length; index++) {
                const element = this.selectTabData[index];
                allTabName.push(element.value);
            }
            that.allTabNames = allTabName.join(",");

            let url = this.dsf.config.webRoot.webPath + this.countUrl

            url = url + (url.indexOf("?") > -1 ? "&" : "?");
            url = url + `tabTypes=${that.allTabNames}`;

            window.loadingCount = (window.loadingCount || 0) + 1;
            if (window.loadingCount <= 1) {
                window.loadingInstance = this.$Loading.service()
            }
            this.tabdata = [];
            // that.activeName = tabs.data[0].tab;
            // that.tabdata = tabs.data;

            this.$httpServer.get(url)
                .then(res => {
                    if (res && res.data && res.data.data) {
                        var tabs = res.data.data.tabs;
                        that.tabslist = tabs;
                        if (that.countUrlExe) {
                            //如果有扩展接口在扩展接口里面接着获取数据并且合并数据
                            that.getExeDbData(tabs)
                        } else {
                            var allTabData = [];
                            for (let index = 0; index < that.selectTabData.length; index++) {
                                const element = that.selectTabData[index];
                                const element1 = tabs[element.value];
                                allTabData.push({
                                    tab: element.value,
                                    show: element.text,
                                    num: element1 ? ((parseInt(element1.count) > 99 && parseInt(element1.count) < 999) ? '99+' : (parseInt(element1.count) > 999) ? '999+' : element1.count) : 0,
                                    num1: element1 ? (parseInt(element1.count) > 99 ? 99 : element1.count) : 0,
                                    moreUrl: element1 && element1.moreUrl ? element1.moreUrl : "",
                                    newFileUrl: element1 && element1.newFileUrl ? element1.newFileUrl : ""
                                });
                            }
                            that.handleTabData(allTabData, selActiveName);
                        }
                    }
                    window.loadingCount = window.loadingCount - 1;
                    if (window.loadingCount <= 0) {
                        window.loadingInstance.close();
                    }
                })
                .catch(err => {
                    console.log(err)
                    window.loadingCount = window.loadingCount - 1;
                    if (window.loadingCount <= 0) {
                        window.loadingInstance.close();
                    }
                })
        },
        getExeDbData(prevTabs) {
            let that = this

            let url = this.dsf.config.webRoot.webPath + this.countUrlExe

            url = url + (url.indexOf("?") > -1 ? "&" : "?");
            url = url + `tabTypes=${that.allTabNames}`;

            window.loadingCount = (window.loadingCount || 0) + 1;
            if (window.loadingCount <= 1) {
                window.loadingInstance = this.$Loading.service()
            }
            this.tabdata = [];

            this.$httpServer.get(url)
                .then(res => {
                    if (res && res.data && res.data.data) {
                        var tabs = res.data.data.tabs;
                        var allTabData = [];

                        for (let index = 0; index < that.selectTabData.length; index++) {
                            const element = that.selectTabData[index];
                            const element1 = prevTabs[element.value];
                            // var tabNum = prevTabs[element.value] ? (parseInt(prevTabs[element.value].count) > 99 ? 99 : prevTabs[element.value].count) : 0;
                            // var moreUrl = prevTabs[element.value] && prevTabs[element.value].moreUrl ? prevTabs[element.value].moreUrl : "";
                            var tabNum = element1 ? ((parseInt(element1.count) > 99 && parseInt(element1.count) < 999) ? '99+' : (parseInt(element1.count) > 999) ? '999+' : element1.count) : 0;
                            var tabNum1 = element1 ? (parseInt(element1.count) > 99 ? 99 : element1.count) : 0;
                            var moreUrl = element1 && element1.moreUrl ? element1.moreUrl : "";
                            var newFileUrl = element1 && element1.newFileUrl ? element1.newFileUrl : "";
                            if (tabs[element.value]) {
                                const element2 = tabs[element.value];
                                tabNum = element2 ? ((parseInt(element2.count) > 99 && parseInt(element2.count) < 999) ? '99+' : (parseInt(element2.count) > 999) ? '999+' : element2.count) : 0;
                                tabNum1 = element2 ? (parseInt(element2.count) > 99 ? 99 : element2.count) : 0;
                                moreUrl = element2 && element2.moreUrl ? element2.moreUrl : "";
                                newFileUrl = element2 && element2.newFileUrl ? element2.newFileUrl : "";
                            }
                            allTabData.push({
                                tab: element.value,
                                show: element.text,
                                num: tabNum,
                                num1: tabNum1,
                                moreUrl: moreUrl,
                                newFileUrl: newFileUrl
                            });
                        }
                        that.handleTabData(allTabData);
                    }
                    window.loadingCount = window.loadingCount - 1;
                    if (window.loadingCount <= 0) {
                        window.loadingInstance.close();
                    }
                })
                .catch(err => {
                    console.log(err)
                    window.loadingCount = window.loadingCount - 1;
                    if (window.loadingCount <= 0) {
                        window.loadingInstance.close();
                    }
                })
        },
        handleTabData(tabdata, selActiveName) {
            if (selActiveName) this.activeName = selActiveName;
            let that = this;
            //处理标签页无内容时隐藏，默认为否；但至少需要保留一个标签
            let handleData = tabdata;
            let ctrlSetInfoData = that.CtrlSetInfo;
            this.activeNewFile = tabdata[0].newFileUrl; //2021-11-04
            if (ctrlSetInfoData && ctrlSetInfoData.autoHiddenTab && ctrlSetInfoData.autoHiddenTab.length > 0) {
                const isAuto = ctrlSetInfoData.autoHiddenTab[0].value == "1" ? true : false
                if (isAuto && handleData && handleData.length > 1) {
                    let newHandleData = [];
                    handleData.map((item, index) => {
                        if (item.num > 0) {
                            newHandleData.push(item)
                        }
                    });
                    if (newHandleData.length == 0) {
                        newHandleData.push(handleData[0])
                    }
                    that.tabdata = newHandleData;
                } else {
                    that.tabdata = tabdata;
                }
            } else {
                that.tabdata = tabdata;
            }
        },
        goPage() {
            let that = this;
            let url = "";
            let name = "";
            switch (this.activeName) {
                case "todo":
                    url = this.dsf.config.webRoot.webPath + "ctrl/inbox/toInboxlist?isDelay=false"
                    break;
                case "todoagency":
                    url = this.dsf.config.webRoot.webPath + "ctrl/inboxagency/agencyList"
                    break;
                case "toread":
                    url = this.dsf.config.webRoot.webPath + "ctrl/personalpend/toPendListData"
                    break;
                case "tomeet":
                    url = this.dsf.config.webRoot.webPath + "ctrl/list/190906141704UdhBOWQJR6Htt2YIZ1S?moduleId=1909061410230KuRDM8p31ewn6QZAv6"
                    break;
                case "topaper":
                    url = this.dsf.config.webRoot.webPath + "ctrl/notepaper/tab"
                    break;
                case "dbtask":
                    url = this.dsf.config.webRoot.webPath + "ctrl/list/190325203824Zx1do5DuzGHzZ7wyVtg?moduleId=190323145209SuSc9CTjs9rg88i22T1"
                    break;
                case "to_favorite":
                    url = this.dsf.config.webRoot.webPath + "ctrl/myFavorite/index"
                    break;
                case "toremind":
                    url = this.dsf.config.webRoot.webPath + "ctrl/remind/index"
                    break;
                case "notice":
                    url = this.dsf.config.webRoot.webPath + "ctrl/notice/list?moduleId=180805175628RK7ixI1IyrjDuG4njD5"
                    break;
                case "tododelaydb":
                    url = this.dsf.config.webRoot.webPath + "ctrl/inbox/toInboxlist?isDelay=true"
                    break;
                default:
                    break;
            }
            //循环查找对应的tab更多
            that.tabdata.map(item => {
                // if (item.tab == that.activeName && item.moreUrl) {
                //     url = that.dsf.config.webRoot.webPath + item.moreUrl;
                //     name = item.tab;
                // }
                if (item.tab == that.activeName) {
                    name = item.show;
                    if (item.moreUrl) url = that.dsf.config.webRoot.webPath + item.moreUrl;
                }
            })
            // if (url) {
            //     window.open(url, "_self")
            // }
            // 开启多tab
            url += url.indexOf("?") > -1 ? "&sortType=" + this.CtrlSetInfo.sortType[0].value : "?sortType=" + this.CtrlSetInfo.sortType[0].value;
            if (url) {
                console.log("window.$iframeCtrl-dbList-v2", window.$iframeCtrl, top.window.$iframeCtrl)
                if (window.$iframeCtrl && window.$iframeCtrl.addTab) {
                    let targetObj = {
                        action: url,
                        name: name || "",
                        target: "main"
                    }
                    window.$iframeCtrl.addTab(targetObj);
                } else if (top.window.$iframeCtrl && top.window.$iframeCtrl.addTab) {
                    let targetObj = {
                        action: url,
                        name: name || "",
                        target: "main"
                    }
                    top.window.$iframeCtrl.addTab(targetObj);
                } else {
                    window.open(url, "_blank")
                }
            }

        },
        openSuccess(message) {
            this.$message({
                showClose: true,
                message: message || '操作成功',
                type: 'success'
            });
        },
        openError(message) {
            this.$message({
                showClose: true,
                message: message || '操作失败',
                type: 'error'
            });
        },
        batchSend() {
            window.flowPage = 2;
            //批量办理
            var that = this;
            window.top.batchSendType = 1;
            this.firstData = {};
            var pks = "";
            var pnIds = "";
            var lastModuleId = "";
            var lastNodeId = "";
            var lastFlowId = "";

            var isCanBatchSend = true;

            var checkItems = this.arrayItems_todo;

            for (var key in checkItems) {
                pks = pks + "," + checkItems[key].infoId;
                pnIds = pnIds + "," + checkItems[key].pnid;

                if (lastModuleId == "") {
                    lastModuleId = checkItems[key].moduleId;
                } else if (lastModuleId != checkItems[key].moduleId) {
                    isCanBatchSend = false;
                    break;
                }

                if (lastFlowId == "") {
                    lastFlowId = checkItems[key].flowId;
                } else if (lastFlowId != checkItems[key].flowId) {
                    isCanBatchSend = false;
                    break;
                }

                if (lastNodeId == "") {
                    lastNodeId = checkItems[key].nodeId;
                } else if (lastNodeId != checkItems[key].nodeId) {
                    isCanBatchSend = false;
                    break;
                }
            }
            if (Object.keys(this.firstData).length === 0) {
                this.firstData = checkItems[0];
            }

            if (!isCanBatchSend) {
                this.openError("选择的文件必须为同一类型、同一流程和同一环节");
                return;
            }

            var validateParam = {
                pk: this.firstData.infoId,
                moduleId: this.firstData.moduleId,
                flowId: this.firstData.flowId,
                nodeId: this.firstData.nodeId,
                pId: this.firstData.pid,
                pnId: this.firstData.pnid,
                validateControls: "opinion"
            };
            DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/xform/validate", validateParam, function (result) {
                if (result.type != "success") {
                    var config = {
                        "url": that.dsf.config.webRoot.webPath + "ctrl/inbox/editOpinion",
                        "closeBtn": 1,
                        "area": "800,540",
                        "title": "请填写意见",
                        "btn": ['发送', '取消'],
                        "isfresh": false,
                        "reloadGrid": false,
                        "yes": function (index, layero) {
                            var opinion = top.window["layui-layer-iframe" + index].getOpinion();
                            //保存意见
                            var data = {
                                pks: pks,
                                pnIds: pnIds,
                                opinion: opinion
                            }

                            DSF.Utils.ajaxRequest(that.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/inbox/saveOpinion", data, function (res) {
                                if ("success" == res.type) {
                                    top.layer.close(index);
                                    that.sendFlow(checkItems);
                                } else {
                                    that.openError("意见保存失败");
                                }
                            })
                        },
                        "callback": function () {
                            //alert(1111111111);
                        }
                    }
                    that.openWinView(this, config);
                } else {
                    that.sendFlow(checkItems)
                }
            });

        },
        sendFlow(checkItems) {
            debugger;
            var that = this;
            if (Object.keys(checkItems).length > 1) {
                window.top.batchSendFlow = 1;
            } else {
                window.top.batchSendFlow = 0;
            }

            window.top.batchSendFiles = checkItems;

            //第一个文件
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
                agencyType: "0"
            }

            var exInfo = {
                mj: this.firstData.mj,
                mjText: this.firstData.mjText || ''
            }

            sendData.exInfo = JSON.stringify(exInfo);

            if (window.top.batchSendFlow == 1) {
                sendData.disableAutoSend = 1;
            }

            that.Flowsend(sendData, function () {
                //重新加载待办
                that.getDbData();
            });
        },
        Flowsend(data, success) {
            let that = this;
            data.bt = data.bt.replace(/\s*/g, "");
            //发送前
            var result = DSF.Utils.ajaxSyncRequest(that.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/flow/beforeSend", data);
            if ("success" != result.type) {
                DSF.XForm && DSF.XForm.triggerRemoveDisable && DSF.XForm.triggerRemoveDisable();
                return;
            }

            window.top.selectedLines = [];
            window.top.SendRequestID = "";
            window.top.sendData = data;
            window.top.afterSendSuccess = success;

            // window.top.sendData = sendData;
            var sendData = window.top.sendData;
            //批量发送类型，batchSendType: 2根据流程配置发送，其他使用第一个接收人默认发送
            if (window.top.batchSendFlow && window.top.batchSendFlow == 1) {
                if (window.top.batchSendType == 2) {
                    sendData.disableAutoSend = -2;
                }
            }

            DSF.Utils.ajaxRequestStr(that.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/flow/sendRequest", sendData, function (result) {
                if (result.type == "success") {
                    var data = result.data;
                    window.top.ResponseObject = data.ResponseObject[0];
                    var SendRequestID = window.top.ResponseObject.SendRequestID;
                    window.top.SendRequestID = SendRequestID;

                    if (window.top.ResponseObject && window.top.ResponseObject.NextNodes && window.top.ResponseObject.NextNodes.Line) {
                        window.top.selectedLines = window.top.ResponseObject.NextNodes.Line;
                    } else {
                        window.top.selectedLines = [];
                    }

                    that._parseResult();
                } else if (result.type == "error") {
                    that.openError(result.message)
                }
            });
        },
        _parseResult(lines) {
            let that = this;
            var Status = window.top.ResponseObject.Status;

            if (Status.startsWith("1000")) {
                that.openSuccess("发送成功");
                that._afterSend();
            } else if (Status.startsWith("3000")) {
                that.sendInView();
            } else if (Status.startsWith("4000")) {
                if (window.location.href.indexOf("SR_EXSEND") > 0) {
                    window.location.href = window.location.href.replace("SR_EXSEND", "SELECT_USER");
                } else if (window.top.sendData.sendType == "SR_EXSEND") {
                    window.top.sendData.oldSendType = window.top.sendData.sendType;
                    window.top.sendData.sendType = "SR_SEND";
                    Flow.sendInView(0);
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
                    that.sendInView();
                }
            } else if (Status.startsWith("5000")) {
                that.openSuccess("发送成功");
                that._afterSend();
            } else if (Status.startsWith("5100")) {
                that.openSuccess("办理成功");
                that._afterSend();
            } else if (Status.startsWith("6000")) {
                that.openSuccess("办结成功");
                that._afterSend();
            } else if (Status.startsWith("8100")) {
                //_autoProcessingBranch();
                that.sendInView();
            } else if (Status.startsWith("9000")) {
                var errorMessage = "发送失败，请检查后再次发送";
                if (window.top.ResponseObject.ErrorMessage) {
                    errorMessage = window.top.ResponseObject.ErrorMessage;
                }
                that.openError(errorMessage);
                return;
            }
        },
        _afterSend() {
            let that = this;
            var data = window.top.sendData;
            var success = window.top.afterSendSuccess;
            var result = DSF.Utils.ajaxSyncRequest(that.dsf.config.webRoot.webPath.replace("/", "") + "ctrl/lock/form/unlock", {
                "pk": data.pk,
                "type": 2,
                "pId": data.pId,
                "pnId": data.pnId
            });
            if (typeof success == "function") {
                success();
                window.top.afterSendSuccess = "";
                // success;
            }
        },
        sendInView(isBack) {
            let that = this;

            var data = window.top.sendData;
            var success = window.top.afterSendSuccess;
            var sendUrl = that.dsf.config.webRoot.webPath + "ctrl/flow/sendIndex";
            DSF.Utils.serverLog("Flow.send()", "request openWinView,sendUrl=" + sendUrl);

            window.top.flowPage = window.flowPage || 2;
            sendUrl += "?flowPage=" + window.flowPage + "&pk=" + data.pk + "&moduleId=" + data.moduleId + "&sendType=" + data.sendType;
            /*  var keys = ["pId", "pnId", "flowId", "nextLineId", "successToNodeId", "agencyType", "determineUser"];
              sendUrl += "&" + DSF.Utils.json2Param(data, keys);*/

            if (isBack && isBack == 1) {
                window.location.href = sendUrl;
                return;
            }

            var config = {
                "url": sendUrl,
                "closeBtn": 0,
                "title": "选择发送范围",
                "success": function (layero, index) {
                    if (typeof window.top.afterOpenSendView == "function") {
                        window.top.afterOpenSendView();
                    }
                },
                "callback": function () {
                    if (typeof success == "function") {
                        success();
                    } else {
                        /*if(top.openViewWindow && top.openViewWindow.parent){
                            top.openViewWindow.parent.location.reload();
                        }*/
                    }
                }
            }

            //获取项目自定义的发送界面大小
            if (typeof (window.setSendArea) == "function") {
                var result = window.setSendArea(data.sendType);
            }

            if (data.sendType == "SR_JUMPSEND") {
                //跳转，使用web的界面
                config.area = "1000,540";
                if (result) {
                    config.area = result;
                }
            } else if (data.sendType == "SR_SEND" || data.sendType == "SR_ADDITION" || data.sendType == "SR_COPY" || (data.sendType == "SR_SPECIAL" && data.nextNodeId != "")) {
                if (window.flowPage == 2) {
                    config.area = "1000,540"
                    if (result) {
                        config.area = result;
                    }
                } else {
                    config.area = "800,540"
                    if (result) {
                        config.area = result;
                    }

                }

            } else {
                config.closeBtn = 1;
            }

            //console.log(window.top.sendData);

            that.openWinView(this, config);

            DSF.XForm && DSF.XForm.triggerRemoveDisable && DSF.XForm.triggerRemoveDisable();

        },
        openWinView(target, opts) {
            top.openViewModel = target;
            top.openViewWindow = window;
            top.openViewOpts = opts;

            var reloadGrid = !opts || opts["reloadGrid"] !== false;

            var maxWidth = $(top.window).width() - 20;
            var maxHeight = $(top.window).height() - 20;

            var isfresh = opts.isfresh;

            var _area = ["auto", "auto"];
            if (opts.area) {
                _area = opts.area.split(',');
                var width = parseInt(_area[0]);
                if (width > maxWidth) {
                    _area[0] = maxWidth;
                }

                var height = parseInt(_area[1]);

                if (height > maxHeight) {
                    _area[1] = maxHeight;
                }
            } else {
                _area[0] = maxWidth - 80;
                _area[1] = maxHeight - 80;
            }

            _area[0] = _area[0] + "px;"
            _area[1] = _area[1] + "px;"

            opts.url = supplyParam(opts.url);

            //外层top不是DreamWeb系统时，相对路径可能不正确
            if (window !== window.top && opts.url && opts.url.startsWith("../../ctrl")) {
                opts.url = "/DreamWeb/" + opts.url.substring("../../".length);
            }

            var config = {
                type: 2,
                fixed: false,
                resize: true,
                area: _area,
                success: function (layero, index) {},
                end: function () {
                    if (top) {
                        var openViewWindow = top.openViewWindow;
                        if (top.openViewOpts && top.openViewOpts.callback) {
                            top.openViewOpts.callback();
                        }
                        if (top.openViewWindow && isfresh) {
                            top.openViewWindow.location.reload();
                        }
                        if ((opts.reloadGrid == undefined || opts.reloadGrid) && openViewWindow) {
                            openViewWindow.closeWinView({
                                reloadGrid: reloadGrid
                            });
                        }
                    }
                }
            };

            $.extend(config, opts || {});

            config.title = opts.title === false ? false : opts.title || " ";
            config.content = opts.url || "";
            config.closeBtn = opts.closeBtn === undefined ? 1 : opts.closeBtn;
            config.area = _area;

            top.openViewIndex = top.layer.open(config);
        },
        //所有组件必备的统一方法，暴露给外部调用的,type为当前刷新的类型
        refreshComData(type) {
            //notice  ||   notice.
            let typeArr = type.split(".");
            let types = typeArr[0];

            let configrefreshType = this.refreshType;
            console.log("configrefreshType", configrefreshType)

            // if(types!='inbox'&&types!='distribt'&&types!='remind'&&types!='notice'&&types!='meeting'&&types!='collect'){
            //     return null;
            // }
            // if(typeArr.length > 1 && this.allTabNames.indexOf(typeArr[1]) == "-1"){
            //      return null
            // };

            // // 2021-09-27
            // if(configrefreshType&&configrefreshType.indexOf(types) == "-1"){
            //      return null
            // };

            var keyArray = ["inbox", "distribt", "remind", "notice", "meeting", "collect"];
            configrefreshType && configrefreshType.split(",").forEach(item => {
                keyArray.push(item)
            });
            this.allTabNames && this.allTabNames.split(",").forEach(item => {
                keyArray.push(item)
            });
            let hasExists = false;
            keyArray.forEach(item => {
                typeArr.forEach(sitem => {
                    if (item == sitem) {
                        hasExists = true;
                    }
                })
            })
            if (!hasExists) {
                return;
            }
            console.log("刷新了组件[刷新类型：" + type + "]:" + this.ctrlName + "的内部方法");
            //切记一定要判断type类型是不是自己的再去刷新组件功能，否则浪费资源去刷新不必要的刷新
            this.getDbData(this.activeName);
        },
        getContainHeight() {
            let marginMap = this.margin.split(' ');
            let subMargin = 0;
            switch (marginMap.length) {
                case 1:
                    subMargin = parseInt(this.margin) * 2;
                    break;
                case 1:
                    subMargin = parseInt(marginMap[0]) * 2;
                    break;
                case 3:
                case 4:
                    subMargin = parseInt(marginMap[0]) + parseInt(marginMap[2]);
                    break;
            }
            return subMargin;
        },
        resize() {
            this.height = parseInt($(".dblist-v2").parent().parent().outerHeight()) - parseInt(this.marginStr);
        },
        /**
         * 使用统一接口数据
         */
        PageDataInfoCallback(resData) {
            console.log(resData)
            this.getSkinInfoCom(true);
            const _this = this;
            if (this.selectTabData.length == 0) {
                return;
            }
            let that = this;
            // if(!selActiveName && this.selectTabData[0].value == 'remote_doc_exchange') this.loadOuterJs(dsf.url.getWebUrl("/resource/js/business-common.js"));
            that.activeName = this.selectTabData[0].value;
            that.loadedTabName = that.loadedTabName + that.activeName + ",";
            var allTabName = [];
            for (let index = 0; index < this.selectTabData.length; index++) {
                const element = this.selectTabData[index];
                allTabName.push(element.value);
            }
            that.allTabNames = allTabName.join(",");

            this.tabdata = [];
            // that.activeName = tabs.data[0].tab;
            // that.tabdata = tabs.data;
            if (resData && resData.getDsfaTabsInfo) {
                var tabs = resData.getDsfaTabsInfo.tabs;
                that.tabslist = tabs;
                if (that.countUrlExe) {
                    //如果有扩展接口在扩展接口里面接着获取数据并且合并数据
                    that.getExeDbData(tabs)
                } else {
                    var allTabData = [];
                    for (let index = 0; index < that.selectTabData.length; index++) {
                        const element = that.selectTabData[index];
                        const element1 = tabs[element.value];
                        allTabData.push({
                            tab: element.value,
                            show: element.text,
                            num: element1 ? ((parseInt(element1.count) > 99 && parseInt(element1.count) < 999) ? '99+' : (parseInt(element1.count) > 999) ? '999+' : element1.count) : 0,
                            num1: element1 ? (parseInt(element1.count) > 99 ? 99 : element1.count) : 0,
                            moreUrl: element1 && element1.moreUrl ? element1.moreUrl : "",
                            newFileUrl: element1 && element1.newFileUrl ? element1.newFileUrl : ""
                        });
                    }
                    that.handleTabData(allTabData);
                }
            }
        }
    },
    created() {},
    mounted() {
        console.log('openBatchOperate', this.openBatchOperate);
        this.getWholeStyle();

        this.dialogHeight = document.body.clientHeight - 200;
        this.dialogHeight = this.dialogHeight > 680 ? 680 : this.dialogHeight;
        let that = this;
    },
    destroyed() {},
};
</script>

<style lang="scss">
/* @import "../../style/headcommon.scss"; */
.dblist-v2 {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.07);
    background: #FFFFFF;
    box-sizing: border-box;
    /* padding: 0 20px; */
    font-family: 'pf';
    position: relative;

    .videotx {
        width: 116px;
        height: 30px;
        background: #F0FFFC;
        border: 1px solid #91DAC8;
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
            padding-right: 46px;
            /*默认只有一个设置按钮*/
        }

        .el-tabs__nav-wrap.is-scrollable {
            padding-right: 46px;

            /*默认只有一个设置按钮*/
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

            /* &.tabs-sousuo {

            } */
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

                &>span {
                    background: #FFFFFF;
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
            background: #FC6A6A;
            border-radius: 13px;
            font-size: 14px;
            color: #FFFFFF;
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
        background: #F0FFFC;
        border: 1px solid #91DAC8;
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
            color: #3EAB90;
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

        &>label {
            /* top: 4px;
            top: -2px;
            right: -15px; */
            background: #EC4519;

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

        >div {
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
                transition: all linear .2s;
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
        cursor: pointer;
        margin-top: 20px;

        &.isOpenSpecial-true {
            .title-span {
                >span {
                    color: #449AEB;
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
                        >span {
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
                }

                .dbactive {
                    display: none;
                }
            }
        }

        &.enableHoverBar-true {

            &:hover {

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

            >* {
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
                transition: all linear .2s;
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
                color: #CB0004;
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

                >span {
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

                >span.title-span {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .nodename {
                    display: none;
                    color: #F7B500 !important;
                    padding: 0px
                }

                label {
                    font-size: 12px;
                    color: #EB595C;
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

                }
            }

            // .isread {
            //     span {
            //         color: #333333 !important;
            //         font-weight: 400;
            //     }
            // }

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

            .datetime {
                flex-shrink: 0;
                font-size: 14px;
                color: #333333;
                font-weight: 600;
                margin-left: 40px;
                padding-right: 5px;
            }

            &.isread {
                .dbtitle {
                    >span {
                        color: #333333 !important;
                        font-weight: 400;
                    }

                    .nodename {
                        color: #F7B500 !important;
                    }
                }

                .username {
                    font-weight: 400;
                }

                .datetime {
                    font-weight: 400;
                }
            }
        }

        .dbactive {
            height: 80px;
            position: absolute;
            left: -25px;
            right: -25px;
            top: -15px;
            bottom: -15px;
            /* top: -28px;
            bottom: -28px; */
            background: #FFFFFF;
            box-shadow: 0 0 10px #cccccc;
            z-index: 2;
            border-radius: 5px;
            box-sizing: border-box;
            padding: 0 25px;
            transition: all linear .5s;
            display: none;

            >div {
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

            .datetime {
                flex-shrink: 0;
                font-size: 14px;
                color: #333333;
                margin: 0 30px;
                font-family: 'pfmd';
                font-weight: 400;
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

                &>span:first-child {
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

                    &>span {
                        margin-right: 10px;
                    }

                    .iconcontent>i:last-child {
                        margin-right: 5px;
                    }
                }

                &>span:last-child {
                    color: #EC4519;
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
                }
            }

            .btns {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                font-weight: 400;

                &>p {
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

                    &>span {
                        height: 30px;
                        display: flex;
                        align-items: center;

                        img {
                            transform: scale(1);
                            transition: all linear .2s;
                        }
                    }

                    &>label {
                        color: #666666;
                        font-size: 14px;
                        line-height: 30px;
                        cursor: pointer;
                        white-space: nowrap;
                    }
                }

                &>p:hover {
                    &>span {
                        img {
                            transform: scale(1.2);
                            transition: all linear .2s;
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

                .titles {
                    &>span:first-child {
                        font-size: 14px;
                    }
                }

                .btns {

                    &>p {
                        &>label {
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

                .titles {
                    &>span:first-child {
                        font-size: 16px;
                    }
                }

                .btns {
                    &>p {
                        &>label {
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

                .titles {
                    &>span:first-child {
                        font-size: 18px;
                    }
                }

                .btns {

                    &>p {
                        &>label {
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

                .titles {
                    &>span:first-child {
                        font-size: 20px;
                    }
                }

                .btns {
                    &>p {
                        &>label {
                            font-size: 18px;
                        }
                    }
                }

            }
        }
    }
}

.dblist-v2.skin-blue {
    .db-serach-where {
        >div {
            background-color: rgba(27, 95, 164, 0.1);
            color: #1B5FA4;
        }
    }

    .otherMargin {
        .el-tabs__item.is-active {
            border-top: 2px solid #1B5FA4;

            &>span {
                color: #1B5FA4;
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
        >div {
            background-color: rgba(0, 128, 255, 0.1);
            color: #0080FF;
        }
    }

    .otherMargin {
        .el-tabs__item.is-active {
            border-top: 2px solid #0080FF;

            &>span {
                color: #0080FF;
            }
        }

        .el-tabs__nav-wrap::after {
            height: 0;
        }
    }
}

.dblist-v2.skin-green {
    .db-serach-where {
        >div {
            background-color: rgba(24, 154, 91, 0.1);
            color: #189a5b;
        }
    }

    .otherMargin {
        .el-tabs__item.is-active {
            border-top: 2px solid #189a5b;

            &>span {
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
        >div {
            background-color: rgba(2, 106, 82, 0.1);
            color: #026A52;
        }
    }

    .otherMargin {
        .el-tabs__item.is-active {
            border-top: 2px solid #026A52;

            &>span {
                color: #026A52;
            }
        }

        .el-tabs__nav-wrap::after {
            height: 0;
        }
    }
}

.dblist-v2.skin-red {
    .db-serach-where {
        >div {
            background-color: rgba(198, 47, 38, 0.1);
            color: #c62f26;
        }
    }

    .otherMargin {
        .el-tabs__item.is-active {
            border-top: 2px solid #c62f26;

            &>span {
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
        >div {
            /* background-color: rgba(198, 47, 38, 0.1); */
            background-color: #333333;
            color: #999999;
        }
    }

    .otherMargin {
        .el-tabs__item.is-active {
            border-top: 2px solid #FFD37E;

            &>span {
                color: #FFD37E;
            }
        }

        .el-tabs__nav-wrap::after {
            height: 0;
        }
    }
}
</style>
