<template>
  <div class="gridone ds-control ds-no-padding" :style="getHeaderBarStyle()" @dragover.prevent @drop.stop="handleDrop">
    <slot></slot>
    <div :style="getWholeHeight()">
      <div class="grid-l" :style="{width: lWidth + '%'}">
        <div v-for="(item,index) in rowNO" :key="index" :style="getHeightStyle(index)">
          <div class="slotys" slot-name="dbslot" v-if="index==0">
            <slot name="dbslot"></slot>
          </div>
          <div v-for="(m,n) in columnNO" :key="n" style="width: 50%;height: 100%;" v-else>
            <div class="slotys" :slot-name="'slot'+n">
              <slot :name="'slot'+n"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="grid-r" :style="{width: rWidth + '%'}" v-show="isShow || isShowLayout">
        <div :style="{width: childWidth + '%'}" v-show="isShow">
          <div v-for="(m,n) in rowNO1" :key="n" :style="getHeightStyleC(n)">
            <div class="slotys" :slot-name="'slot-c'+n">
              <slot :name="'slot-c'+n"></slot>
            </div>
          </div>
        </div>
        <div :style="{width: childWidth + '%'}" v-show="isShowLayout">
          <div v-for="(m,n) in rowNO2" :key="n" :style="getHeightStyleR(n)">
            <div class="slotys" :slot-name="'slot-r'+n">
              <slot :name="'slot-r'+n"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Gridone",
  components: {},
  data() {
    return {
      skin: "blue",
      isShow: true,
      isShowLayout: true,
      rowNO: 2,
      rowNO1: 2,
      rowNO2: 2,
      columnNO: 2,
      propHeight1: "5/5",
      propHeight2: "5/5",
      lWidth: 50,
      rWidth: 50,
      childWidth: 50
    };
  },
  props: {
    //基础属性
    isAbsolute: {
      type: Boolean,
      default: true
    },
    positionStr: {
      type: String,
      default: "0px 0px 0px 0px"
    },
    propHeight: {
      type: String,
      default: "7/3"
    },
    zIndexNumber: {
      type: Number,
      default: 98
    },
    subHeight: {
      type: Number,
      default: 0
    },
    splitWidth: {
      type: Number,
      default: 1100
    },
    splitWidth1: {
      type: Number,
      default: 1400
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "dbslot",
            controls: []
          },
          {
            name: "slot0",
            controls: []
          },
          {
            name: "slot1",
            controls: []
          },
          {
            name: "slot-c0",
            controls: []
          },
          {
            name: "slot-c1",
            controls: []
          },
          {
            name: "slot-r0",
            controls: []
          },
          {
            name: "slot-r1",
            controls: []
          }
        ];
      }
    }
  },
  computed: {
    ...mapState({
      menuIsCollapse: state => state.menuIsCollapse
    })
  },
  watch: {},
  methods: {
    // 组件被放入container回调
    handleDrop (e) {
      this.$emit('drop', e, this)
    },
    getWholeHeight() {
      let styleObject = {};
      // let marginStr = parseInt(this.positionStr.split(' ')[0]) + parseInt(this.positionStr.split(' ')[2]) + 'px';
      let marginStr =
        parseInt(this.positionStr.split(" ")[0]) +
        parseInt(this.positionStr.split(" ")[2]) +
        parseInt(this.subHeight) +
        "px";
      styleObject["height"] = `calc(100vh - ${marginStr})`;
      return styleObject;
    },
    getHeaderBarStyle() {
      let styleObject = {
        top: this.positionStr.split(" ")[0],
        right: this.positionStr.split(" ")[1],
        bottom: this.positionStr.split(" ")[2],
        left: this.positionStr.split(" ")[3]
      };
      styleObject["position"] = this.isAbsolute ? "absolute" : "relative";
      styleObject["z-index"] = this.zIndexNumber;
      return styleObject;
    },
    getHeightStyle(index) {
      let styleObj = {};
      let hegList = this.propHeight.split("/");
      styleObj["height"] = hegList[index] * 10 + "%";
      if (index > 0) styleObj["display"] = "flex";
      return styleObj;
    },
    getHeightStyleC(index) {
      let styleObj = {};
      let hegList = this.propHeight1.split("/");
      styleObj["height"] = hegList[index] * 10 + "%";
      return styleObj;
    },
    getHeightStyleR(index) {
      let styleObj = {};
      let hegList = this.propHeight2.split("/");
      styleObj["height"] = hegList[index] * 10 + "%";
      return styleObj;
    },
    resizeAuto() {
      let bodyWidth = document.body.clientWidth;
      this.isShow = bodyWidth > this.splitWidth;
      this.isShowLayout = bodyWidth > this.splitWidth1 && this.rightTwoIsShow;

      if (this.isShow && this.isShowLayout) {
        this.lWidth = 50;
        this.rWidth = 50;
        this.childWidth = 50;
      }
      if (
        (this.isShow && !this.isShowLayout) ||
        (!this.isShow && this.isShowLayout)
      ) {
        this.lWidth = 66.66;
        this.rWidth = 33.33;
        this.childWidth = 100;
      }
      if (!this.isShow && !this.isShowLayout) {
        this.lWidth = 100;
        this.rWidth = 0;
        this.childWidth = 0;
      }
    }
  },
  created() {},
  mounted() {},
  destroyed() {}
};
</script>

<style scoped>
.slotys {
  width: 100%;
  height: 100%;
  border: 1px dashed #7fcdfd;
}
.gridone * {
  box-sizing: border-box;
}

.gridone > div {
  display: flex;
}
.grid-l {
}

.grid-r {
  /* background-color: #ffffff; */
  display: flex;
}

.grid-r > div {
  /* width: 50%; */
  display: flex;
  flex-direction: column;
}
</style>