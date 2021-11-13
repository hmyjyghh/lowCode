<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item v-for="(group, $index) in data" :key="$index" :title="group.name" :name="group.name">
      <div>
        <DsfDesignerProperty v-for="(item, $idx) in group.attributes" :key="item.bindControlAttr||'' + $idx" :a="item.bindControlAttr + $idx" :desc="item.desc" :data="item" :owner="owner" :bind="getBind(item)">
        </DsfDesignerProperty>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
export default {
  name: "DsfDesignerProperties",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    owner: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeName: ""
    };
  },
  watch: {
    data: {
      handler(v) {
        this.activeName = v[0] ? v[0].name : "";
      }
    }
  },
  methods: {
    getBind(item) {
      let attrExpress = item.bindControlAttr || "";
      let attrLevel = attrExpress.split(".");
      if (attrLevel.length == 1) {
        return {
          data: this.owner,
          key: attrLevel[0] || ""
        };
      } else {
        let arr = attrLevel.slice(0, attrLevel.length - 1);
        let obj = this.owner;
        let c = arr.shift();
        while (c) {
          if (dsf.isDef(obj[c])) {
            obj = obj[c];
            c = arr.shift();
          } else {
            obj = null;
            break;
          }
        }
        if (!obj) {
          obj = this.owner;
        }
        return {
          data: obj,
          key: attrLevel[attrLevel.length - 1]
        };
      }
    },
    show(express) {
      if (express) {
        console.log('express', express);
        return this.$eval(express, this.owner)
      }
      return true;
    }
  }
};
</script>