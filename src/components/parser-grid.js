import Gridone from './gridone'

// 做逻辑层处理
export default {
  name: 'GRidone',
  components: {
    Gridone
  },

  render (h, section, children) {
    const _this = this
    const _propsOn = {
      nativeOn: {
        click: e => {
          e.stopPropagation()
          _this.$emit('pickType', 'Gridone')
        }
      }
    }
    return (
      <Gridone
        { ..._propsOn }
      ></Gridone>
    )
  }
}
