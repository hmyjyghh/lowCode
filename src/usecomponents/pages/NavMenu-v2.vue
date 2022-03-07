<template>
  <fragment>
    <component
      :is="(value.children&&value.children.length>0)?'el-submenu':'el-menu-item'"
      v-for="(value) in navList"
      :key="value.id"
      :popper-class="'self-popup self-popup-'+pkin+` menuDefaultFont-${fontsize}`+` self-popup-${compareType}`"
      :popper-append-to-body="true"
      :show-timeout="timeOut"
      class="menu-item"
      :class="'skinType-'+skinType"
      :style="getStyleObject()"
      :index="value.id+'--'+value.action"
    >
      <template v-if="value.children&&value.children.length>0" slot="title">
        <a style="display: inline-block;width: 100%;" :title="value.menuName" @click="itemClickFun(value)">
          <i v-if="getIconFontClassName(value.menuName)!=''" :class="getIconFontClassName(value.menuName, value.icon)+' menuOrientation-'+menuOrientation"></i>
          <span class="platform-menu-font-span">{{ value.menuName }}</span>
          <i class="menu-iremind corner-marker" :data-did="value.id" :data-url="value.badgeAction">{{ getNumberCount(value) }}</i>
        </a>
      </template>
      <template v-if="!value.children||(value.children&&value.children.length==0)">
        <a style="display: inline-block;width: 100%;" :title="value.menuName" @click="itemClickFun(value)">
          <i v-if="getIconFontClassName(value.menuName)!=''" :class="getIconFontClassName(value.menuName, value.icon)+' menuOrientation-'+menuOrientation"></i>
          <span class="platform-menu-font-span">{{ value.menuName }}</span>
          <i class="menu-iremind corner-marker" :data-did="value.id" :data-url="value.badgeAction">{{ getNumberCount(value) }}</i>
        </a>
      </template>
      <template v-if="value.children&&value.children.length>0">
        <div class="temp-menu">
          <nav-menu-v2
            :nav-list="value.children"
            :ischildren="true"
            :pkin="pkin"
            :skin="skin"
            :skin-type="skinType"
            :menu-orientation="menuOrientation"
            :menu-icon-type="menuIconType"
            :fontsize="fontsize"
            :compare-type="compareType"
          ></nav-menu-v2>
        </div>
      </template>
    </component>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
export default {
    name: 'NavMenuV2',
    components: { Fragment },
    props: {
        navList: {
            type: Array,
            default: () => []
        },
        ischildren: {
            type: Boolean,
            default: false,
        },
        skin:{
            type:String,
            default:"white"
        },
        pkin: {
            type:String,
            default:"blue"
        },
        isTransparent: {
            type: Boolean,
            default: false,
        },
        skinType: {
            type: String,
            default: "dark",
        },
        menuOrientation:{
            type: String,
            default: "vertical",
        },
        minLiWidth:{
            type: String,
            default: "auto",
        },
        menuIconType: {
            type: String,
            default: "hollow",
        },
        fontsize: {
            type: Number,
            default: 14
        },
        menuShow: {
            type: String,
            default: "0",
        },
        timeOut: {
            type: Number,
            default: 300,
        },
		compareType: {
		    type: Boolean,
		    default: false,
		},
    },
    data() {
        return {
            globalFontSize: "small"
        }
    },
    mounted() {
        // $("ul[role='menu']").parent().addClass("addscrollauto");  
    },
    methods: {
        itemClickFun(item){
            if(item.script){
                switch(item.script){
                    case 'newFile':
                        this.openWyj();
                        break;
                    case 'remind':
                        item.link = this.replaceAction("../../ctrl/remind/index");
                        window.$$iframeCtrl.addTab(item);
                        break;
                }
                return;
            }
            if(item.action.indexOf('javascript') == 0)
            {
                eval(this.replaceAction(item.action).replace("javascript:",""));
            }else{
                window.$$iframeCtrl.addTab(item);
            }
        },
        getNumberCount(value){
            if(value&&value.remindNumber){
                if(value.remindNumber=="0"){
                    return "";
                }else if(value.remindNumber=="100"){
                    return "99+";
                }else{
                    return value.remindNumber;
                }
            }
        },
        getStyleObject(){
            let styleObject = {'min-width':this.minLiWidth};
            if(this.isTransparent){
                styleObject.background = "transparent";
            }
            return styleObject
        },
        replaceAction(action) {
            if (action.indexOf("../../") == 0) {
                return dsf.url.getWebUrl(action.replace("../../", ""));
            } else {
                return action;
            }
        },
        getIconFontClassName(name, icon) {
            var result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-guanliyupeizhi-":"menu-icon-xitongguanli");
            switch (name) {
                case "我的首页":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-shouyekongxin":"menu-icon-shouye1-copy");
                    break;
                case "办公中心":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-bangongzhongxin":"menu-icon-bangongzhongxin-xuanzhong");
                    break;
                case "公文管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-gongwen123":"menu-icon-gongwen");
                    break;
                case "会议管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-huiyi":"menu-icon-m3-meeting-fill");
                    break;
                case "督办管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-duban":"menu-icon-duban1");
                    break;
                case "行政事务":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-hangzhengshiwu":"menu-icon-shu");
                    break;
                case "日程管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-calendar":"menu-icon-richeng");
                    break;
                case "个人中心":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-geren":"menu-icon-gerenzhongxin");
                    break;
                case "组织机构管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-zuzhijigou":"menu-icon-zuzhijigou1");
                    break;
                case "系统管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-guanliyupeizhi-":"menu-icon-xitongguanli");
                    break;
                case "监控中心":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-jiankongzhongxin":"menu-icon-jiankongzhongxin1");
                    break;
                case "收文":
                case "收文管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-shouwenguanli":"menu-icon-shouwen");
                    break;
                case "发文":
                case "发文管理":
                    result = "gzticonfont "+(this.menuIconType=="hollow"?"menu-icon-fawen":"menu-icon-fawen1");
                    break;
            }
            if (this.ischildren || this.menuShow == "1") {
                result = "";
            }
            if (!this.ischildren && icon && this.menuShow == "2") { //一级菜单图标，使用菜单设置图标  dreamweb平台-菜单管理中维护的
                let iconTag = icon.substr(0, 4);
                result = iconTag == "icon" ? "iconfont "+ icon : "s-menu-icon "+ icon;
            }
            return result;
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-iremind {
    position: absolute;
    right: 16px;
    top: 50%;
    color: #ffffff;
    font-style: normal;
    background: #EC4519;
    font-size: 12px;
    border-radius: 9px;
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    display: none;
    text-align: center;
    padding: 0px 5px;
    margin-top: -9px;
    &.nonumber{
        padding: 0px;
        border-radius: 4px;
        min-width: 8px;
        width: 8px;
        height: 8px;
        /* after add */
        right: 23px;
    }
}


.skin-red {
    .menu-iremind {
        background: #FFA02C !important;
    }
}

.el-menu:not(.el-menu--collapse) .menu-item.el-submenu>.el-submenu__title>a>.menu-iremind{
    /* right: 42px; */
    right: 36px;
    margin-top: -10px;
}

.skinType-dark{
    &.menu-item {
        a {
            color: #FFFFFF !important;
        }
    }
    &.menu-item.is-active>a{
        color: rgb(255, 208, 75) !important;
    }
}

.menuOrientation-vertical{
    /* 2021-07-08 */
    margin-right:10px
}
.menuOrientation-horizontal{
    margin-right:10px;
    font-size: 20px;
}

.skin-inblue{
    .menuOrientation-horizontal{
        color: #0080FF;
    }
    .skinType-dark{
        .menuOrientation-horizontal{
            color: #FFFFFF;
        }
    }
}
.skin-blue{
    .menuOrientation-horizontal{
        color: #1B5FA4;
    }
    .skinType-dark{
        .menuOrientation-horizontal{
            color: #FFFFFF;
        }
    }
}
.skin-green{
    .menuOrientation-horizontal{
        color: #189a5b;
    }
    .skinType-dark{
        .menuOrientation-horizontal{
            color: #FFFFFF;
        }
    }
}
.skin-red{
    .menuOrientation-horizontal{
        color: #c62f26;
    }
    .skinType-dark{
        .menuOrientation-horizontal{
            color: #FFFFFF;
        }
    }
}
.skin-ycgreen{
    .menuOrientation-horizontal{
        color: #026A52;
    }
    .skinType-dark{
        .menuOrientation-horizontal{
            color: #FFFFFF;
        }
    }
}

.ds-designer .designer-ctrl-proxy {
    overflow: visible !important;
}
</style>
