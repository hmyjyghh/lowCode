<template>
  <div class="property-item">
    <div class="property-item-name">
      {{ data.text }}

      <!-- <DsfIcon v-if="desc" style="margin-left: 5px; cursor: pointer;" name="bangzhuzhongxin" @click.native="showHelp"></DsfIcon> -->
      <el-dialog :visible.sync="showHeplerMark" :title="data.text" :append-to-body="true" :width="'500px'">
        <div style="max-height: 500px; min-height: 300px; overflow: auto;">
          <span style="display: inline-block; line-height: 1.5em;" v-html="desc"></span>
        </div>
      </el-dialog>
    </div>
    <!--输入项-->
    <el-input v-if="data.showType == 'text'" v-model="dataValue" :attrdata="data" :disabled="inputDisabled" placeholder="请输入" @change="dataValueChange" />
    <!--数字输入项-->
    <el-input-number
      v-if="data.showType == 'number'"
      v-model="dataValue"
      :attrdata="data"
      :controls="config.controls"
      :size="config.size"
      :step="config.step"
      :step-strictly="config.stepStrictly || false"
      :min="config.min"
      :max="config.max"
      :precision="config.precision"
      style="width: 100%;"
      @change="dataValueChange"
    />

    <!--布尔值-->
    <el-radio-group v-else-if="data.showType == 'boolean'" v-model="dataValue" :attrdata="data" @change="dataValueChange">
      <el-radio :label="true">
        是
      </el-radio>
      <el-radio :label="false">
        否
      </el-radio>
    </el-radio-group>

    <!--多选-->
    <el-checkbox-group v-else-if="data.showType == 'checkbox'" v-model="dataValueArray" :attrdata="data" @change="dataValueChange">
      <el-checkbox v-for="(option, $index) in data.dictionary" :key="$index" :label="option.value">
        {{ option.text }}
      </el-checkbox>
    </el-checkbox-group>

    <!--下拉框-->
    <el-select v-else-if="data.showType == 'select'" v-model="dataValue" :attrdata="data" placeholder="请选择" @change="dataValueChange">
      <el-option v-for="(option, $index) in data.dictionary" :key="$index" :label="option.text" :value="option.value"></el-option>
    </el-select>

  </div>
</template>
<script>
// import DsfDesignerDialog from "./dsfDesignerDialog";
// import DsfRangeSelect from "./dsfRangeSelect";
export default {
  name: 'DsfDesignerProperty',
  components: {
    // DsfDesignerDialog,
    // DsfRangeSelect,
  },
  props: {
    // 属性配置json中的数据项目
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    // 所属组件的的属性对象
    bind: {
      type: Object,
      default () {
        return {}
      }
    },
    // 所属组件本身示例
    owner: {
      type: Object,
      default () {
        return {}
      }
    },
    // 备注
    desc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showHeplerMark: false,
      dataValue: this.convertFromDataType(this.bind.data[this.bind.key])
    }
  },
  computed: {
    config () {
      let config = this.data.config
      return config || {}
    },
    dataValueArray: {
      get () {
        return this.dataValue || []
      },
      set (v) {
        this.dataValue = v
      }
    },
    inputDisabled () {
      if (this.config.disabled) {
        return true
      } else {
        if (this.data.bindControlAttr == 'caption') {
          // 业务组件因为名称规范要求不许修改caption
          if (this.owner.isBusiness) {
            return true
          }
        }
      }
      return false
    }
  },
  created () {
    this.$watch(
      function () {
        return this.bind.data[this.bind.key]
      },
      {
        handler (v) {
          this.dataValue = this.convertFromDataType(v)
        }
      }
    )
  },
  methods: {
    dataValueChange (value) {
      let v = value
      if (v !== undefined && this.bind.key) {
        this.bind.data[this.bind.key] = this.convertToDataType(value, this.data.splitChart)// this.convertToDataType(v,this.data.splitChart);
      }
      this.$nextTick(() => {
        if (this.data.changeExecFunction) {
          let fnName = this.data.changeExecFunction
          let caller = this.owner[fnName]
          caller && caller.call(this.owner)
        }
      })
    },
    showHelp () {
      this.showHeplerMark = true
    },
    convertFromDataType (v) {
      let val = v
      if (dsf.isDef(v)) {
        if (this.data.showType == 'text') {
          if (this.data && this.data && this.data.dataType) {
            if (this.data.dataType == 'Number[]' || this.data.dataType == 'String[]') {
              if (dsf.type(v) == 'array') {
                val = v.join(this.data.splitChart || ',')
              }
            } else if (this.data.dataType == 'Number') {
              val = v.toString()
            }
          }
        } else if (this.data.showType == 'timePicker') {
          if (Array.isArray(v)) {
            const now = dsf.date.format(new Date(), 'yyyy/mm/dd ')
            val = [
              new Date(now + v[0]),
              new Date(now + v[1])
            ]
          }
        }
      }
      return val
    },
    convertToDataType (v) {
      let val = v
      if (dsf.isDef(v)) {
        if (this.data.showType == 'text' && dsf.type(v) == 'string') {
          if (this.data.dataType == 'Number[]') {
            val = v.split(this.data.splitChart || ',')
            val = _.map(val, (el) => {
              return parseFloat(el)
            })
          } else if (this.data.dataType == 'String[]') {
            val = v.split(this.data.splitChart || ',')
          } else if (this.data.dataType == 'Number') {
            val = parseFloat(val)
          }
        } else if (this.data.showType == 'timePicker') {
          if (Array.isArray(v)) {
            val = [
              dsf.date.format(v[0], 'hh:ii:ss'),
              dsf.date.format(v[1], 'hh:ii:ss')
            ]
          }
        }
      }
      return val
    }
  }
}
</script>
