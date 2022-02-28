<template>
  <div class="hello ds-designer">
    <div class="header">顶栏</div>
    <div class="main-content">
      <el-row>
        <el-col :span="4">
          <!-- 物料堆 -->
          <div class="component-stack block">
            <div class="component-title">物料堆</div>
            <ul>
              <li
                v-for="(item, index) in stacks"
                :key="index"
                class="component-item"
                :draggable="true"
                @drag="handleDrag(item)"
              >{{ item.name }}</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="16">
          <!-- 主舞台 -->
          <div class="stage block" @dragover.prevent @drop="handleDrop">
            <render-engine
              ref="engine"
              :jsonSchema="currentJson"
              :addNode="selectedType"
              @pickType="handlePickType"
            ></render-engine>
          </div>
        </el-col>
        <el-col :span="4">
          <!-- 配置面板 -->
          <div class="config-panel block">
            <div class="component-title">
              <span>配置面板</span>
              <config-panel :currentPickType="currentPickType" :data="attributesGroup"></config-panel>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import { components } from "../components";
// import { cards } from "../card";
// import jsonData from "../config/pd_attributes/DBList.json";
import engine from "../fragments/renderEngine";
import configPanel from "../fragments/configPanel";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      // 需要加到配置系统中的组件
      stacks: [
        // {
        //   ctrlType: "CButton",
        //   name: "按钮"
        // },
        // {
        //   ctrlType: "CInput",
        //   name: "输入框"
        // },
        // {
        //   ctrlType: "CButton",
        //   name: "按钮2"
        // },
        {
          ctrlType: "Dblist",
          name: "待办列表"
        },
        // {
        //   ctrlType: "GRidone",
        //   name: "Grid布局"
        // }
      ],
      components: [],
      // 数据库拿到的协议
      // jsonSchema: {
      //   page: {
      //     type: "GRidone",
      //     children: [
      //       {
      //         type: "CButton"
      //       },
      //       {
      //         type: "Container",
      //         children: [
      //           {
      //             type: "CInput"
      //           },
      //           {
      //             type: "CButton"
      //           },
      //           {
      //             type: "Dblist"
      //           }
      //         ]
      //       },
      //       {
      //         type: "GRidone",
      //         children: [
      //           {
      //             type: "Dblist"
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // },
      jsonSchema: {
        page: {
          type: "Container",
          children: [
            {
              type: "CButton"
            },
            {
              type: "Container",
              children: [
                {
                  type: "CInput"
                },
                {
                  type: "CButton"
                },
                {
                  type: "Dblist"
                }
              ]
            },
            // {
            //   type: "GRidone",
            //   children: [
            //     {
            //       type: "Dblist"
            //     }
            //   ]
            // }
          ]
        }
      },
      // 当前操作的数组
      currentJson: {},
      // 物料堆中，当前拾取类型
      selectedType: "",
      // 舞台中，当前选中类型
      currentPickType: "",
      attributesGroup: []
    };
  },
  methods: {
    // 拾取被配置节点
    handleDrag(item) {
      this.selectedType = item.ctrlType;
    },
    // 放手
    handleDrop() {
      const _type = this.selectedType;

      this.components.push(_type);
    },
    // 用户点击选中的节点
    handlePickType(type) {
      console.log('77777777', type);
      this.currentPickType = type;
      this.$http
          .get("../static/pd_attributes/" + type + ".json")
          .then(res => {
            if(res && res.data) {
              this.attributesGroup = res.data;
            }
          })
          .catch(error => {
            console.log('error', error);
          })
    }
  },
  created() {
    this.currentJson = this.jsonSchema;
  },
  components: {
    // ...components,
    // ...cards,
    renderEngine: engine,
    configPanel: configPanel
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.block {
  position: relative;
  border: 1px solid var(--lightBg);
  height: 100vh;
}

.header {
  padding: 10px;
}

/* 物料堆 */
.component-stack, .header {
  text-align: center;
}

.component-title {
  height: 32px;
  line-height: 32px;
}
.component-title span {
  display: block;
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.component-item {
  border: 1px solid var(--mainLine);
  margin: 2px 20px;
  padding: 10px 0;
  border-radius: 18px;
}
</style>
