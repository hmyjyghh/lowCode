import control from "./control";
import schema from 'async-validator';

export default {
  mixins: [control],
  provide() {
    return{
      $page:this
    } 
  },
  props: {
    name: {
      type: String,
      default: ""
    },
    serial: {
      type: Number,
      default: 0
    },
    view: {
      type: Boolean,
      default: true
    },
    context: {
      type: Object,
      default () {
        return {
          B: "",
          M: ""
        };
      }
    },
    clientVersion: {
      type: String,
      default: "2.0"
    },
    title: {
      type: String,
      default: ""
    },
    //页头，页脚宽度
    headfootwidth: {
      type: String,
      default: "same"
    },
    fit: {
      type: String,
      default: "1"
    },
    //页头页脚与主干间隙
    topBottom: {
      type: String,
      default: ""
    },
    //左右两侧与主干间隔
    leftRight: {
      type: String,
      default: ""
    },
    //左右两侧视图宽度
    viewSplit: {
      type: String,
      default: "0px,0px"
    },
    //页面宽度
    pageWidth: {
      type: String,
      default: ""
    },
    //是否显示页头
    hasHeader: {
      type: Boolean,
      default: true
    },
    //是否显示页脚
    hasFooter: {
      type: Boolean,
      default: true
    },
    //页面权限
    pagePrivilege: {
      type: Array,
      default () {
        return [];
      }
    },
    pageType: {
      type: String,
      default: "other"
    },
    xssConfig: {
      type: Object,
      default () {
        return {
          allow: false
        };
      }
    },
    customCss: {
      type: String,
      default: ""
    },
    //页脚是否固定
    footFixed:{
      type:Boolean,
      default:true
    },
    dresolution: {
      type: Number,
      default: 1920
    },
    bresolution: {
      type: Number,
      default: 1440
    },
    defaulturl: {
      type: String,
      default: ""
    },
    boundurl: {
      type: String,
      default: ""
    },
    selfCommonJsFile: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      $serialNum: this.serial,
      postFields: [],
    };
  },
  computed: {
    nameSpace() {
      return this.context.B + "." + this.context.M;
    }
  },
  destroyed() {},
  mounted() {},
  created() {
    if (!this.isDesign && this.pageType == 'form') {
      this.$on("form.addValidateField", (evt) => {
        let target = evt.target;
        console.time("加入")
        // this.addValidateFiled(target);
        console.timeEnd("加入")
      });
      this.$on("form.removeValidateField", (evt) => {
        let target = evt.target;
        // this.removeVaildateFiled(target);
      })
    }
  },
  methods: {
    getSerial() {
      let num = ++this.$data.$serialNum;
      this.$emit("update:serial", num);
      return num;
    },
    formSave() {
      if (this.isDesign) {
        return;
      }

    }
  },
  design: {
    isMask: false
  }
};