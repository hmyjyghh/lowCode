import DBList from './dbList'

// 做逻辑层处理
export default {
  name: 'Dblist',
  components: {
    DBList
  },

  render (h, section, children) {
    const _this = this
    const _propsOn = {
      nativeOn: {
        click: e => {
          e.stopPropagation()
          _this.$emit('pickType', 'DBList')
        }
      }
    }
    return (
      <DBList
        { ..._propsOn }
      ></DBList>
    )
  }
}
