<template>
  <div class="ds-control ds-page page-init-ghh" :class="getCss" :style="pageStyle">
    <!--页头-->
    <div class="ds-page-head">
      <div ref="head" class="head-inner" :slot-name="slots[1].name">
        <slot :name="slots[1].name"></slot>
      </div>
    </div>
    <div class="ds-page-content" :style="pageContentStyle">
      <div class="ds-page-left" :style="leftStyle" :slot-name="slots[3].name">
        <slot :name="slots[3].name"></slot>
      </div>
      <div class="ds-page-center" :slot-name="slots[0].name">
        <slot :name="slots[0].name">
        </slot>
      </div>
      <div class="ds-page-right" :style="rightStyle" :slot-name="slots[4].name">
        <slot :name="slots[4].name"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import view from '@/mixins/view'
// import schema from 'async-validator';
// import container from '_platform/dsf/pc/bhc/container/container';

import control from '@/mixins/control'
export default dsf.component({
  name: 'DsfPage',
  ctrlCaption: '页面',
  //   mixins: [view],
  mixins: [control, view],
  data () {
    return {
      headHeight: 0,
      footHeight: 0,
      centerHeight: 'auto',
      headerStyle: {},
      footerStyle: {},
      leftAndRIghtStyle: {},
      containerHeight: 0,
      containerWidth: 0
    }
  },
  props: {
    slots: {
      type: Array,
      default () {
        return [{
          name: 'center',
          controls: []
        },
        {
          name: 'head',
          controls: []
        },
        {
          name: 'foot',
          controls: []
        },
        {
          name: 'left',
          controls: []
        },
        {
          name: 'right',
          controls: []
        }
        ]
      }
    }
  },
  beforeCreate () {
    // console.time("加载页面");
  },
  computed: {
    // leftViewWidth () {
    //   let views = this.viewSplit.split(',')
    //   let leftWidth = views[0] ? parseInt(views[0]) : 0
    //   return leftWidth
    // },
    // rightViewWidth () {
    //   let views = this.viewSplit.split(',')
    //   let rightWidth = views[1] ? parseInt(views[1]) : 0
    //   return rightWidth
    // },
    // leftViewShow () {
    //   let w = parseFloat(this.leftViewWidth)
    //   return w !== 0
    // },
    // rightViewShow () {
    //   let w = parseFloat(this.rightViewWidth)
    //   return w !== 0
    // },

    // splitWidth () {
    //   if (this.leftRight == 'split-small') {
    //     return 5
    //   } else if (this.leftRight == 'split-medium') {
    //     return 10
    //   } else if (this.leftRight == 'split-big') {
    //     return 15
    //   } else {
    //     return 0
    //   }
    // },
    // splitWidthHorizontal () {
    //   if (this.topBottom == 'split-small') {
    //     return 5
    //   } else if (this.topBottom == 'split-medium') {
    //     return 10
    //   } else if (this.topBottom == 'split-big') {
    //     return 15
    //   } else {
    //     return 0
    //   }
    // },
    getCss () {
      return [
        ...this.$getClass(),
        this.fit == '1' ? 'fit' : ''
      ]
    },
    pageStyle () {
      var headHeight = this.headHeight
      var footHeight = this.footHeight
      if (!this.isDesign) {
        headHeight = headHeight + this.splitWidthHorizontal
        footHeight = footHeight + this.splitWidthHorizontal
      }
      // var leftWidth = this.leftViewWidth > 0 ? this.leftViewWidth + this.splitWidth : 0;
      // var rightWidth = this.rightViewWidth > 0 ? this.rightViewWidth + this.splitWidth : 0
      return {
        'padding-top': headHeight + 'px',
        'padding-bottom': footHeight + 'px'
        // "padding-left": leftWidth + "px",
        // "padding-right": rightWidth + "px",
      }
    },
    pageContentStyle () {
      var leftWidth = this.leftViewWidth
      var rightWidth = this.rightViewWidth
      if (!this.isDesign) {
        leftWidth = leftWidth > 0 ? leftWidth + this.splitWidth : 0
        rightWidth = rightWidth > 0 ? rightWidth + this.splitWidth : 0
      }
      return {
        'padding-left': leftWidth + 'px',
        'padding-right': rightWidth + 'px',
        'width': this.isDesign ? 'auto' : (this.pageWidth == '100%' || !this.pageWidth ? 'auto' : this.pageWidth),
        'margin': 'auto'
      }
    },
    leftStyle () {
      let style = {}
      var headHeight = this.headHeight
      var footHeight = this.footHeight
      var leftWidth = this.leftViewWidth
      return {
        'width': leftWidth + 'px',
        'bottom': '0px',
        'top': '0px',
        'left': '0px'
      }
    },
    rightStyle () {
      let style = {}
      var headHeight = this.headHeight
      var footHeight = this.footHeight
      var rightWidth = this.rightViewWidth
      return {
        'width': rightWidth + 'px',
        'bottom': '0px',
        'top': '0px',
        'right': '0px'
      }
    }
  },
  created () {},
  destroyed () {},
  mounted () {
    // console.timeEnd("加载页面");
    if (this.isDesign) {
      this.watchCenterHeight()
      this.resize()
    }

    if (this.selfCommonJsFile) {
      this.loadOuterJs(dsf.url.getWebUrl(this.selfCommonJsFile))
    }

    // if(!this.isDesign) {
    //     if(this.defaulturl && this.boundurl) {
    //         if(document.documentElement.clientWidth <= this.bresolution) { // 1440 1920
    //             if(window.location.href.indexOf(this.boundurl) == -1) {
    //                 window.location.href = this.boundurl
    //             }
    //         }else {
    //             if(window.location.href.indexOf(this.defaulturl) == -1) {
    //                 window.location.href = this.defaulturl
    //             }
    //         }
    //     }
    // }
  },
  updated () {},
  methods: {
    resize: _.throttle(function () {
      // console.log('resize', window.location.href);
      this.setContainerSize()
      this.setCenterHeight()
      if (!this.isDesign) {
        if (this.defaulturl && this.boundurl) {
          if (document.documentElement.clientWidth <= this.bresolution) {
            if (window.location.href.indexOf(this.boundurl) == -1) {
              window.location.href = this.boundurl
            }
          } else {
            if (window.location.href.indexOf(this.defaulturl) == -1) {
              window.location.href = this.defaulturl
            }
          }
        }
      }
    }, 500),
    watchCenterHeight () {
      // this.resize();
      window.setTimeout(this.watchCenterHeight, 1000)
    },
    setCenterHeight () {
      let head = this.$refs.head ? this.$refs.head : null
      let foot = this.$refs.foot ? this.$refs.foot : null
      this.headHeight = head ? $(head).outerHeight() : 0
      this.footHeight = foot ? $(foot).outerHeight() : 0
    },
    // 设置左右区域高度
    setleftAndRightStyle () {
      if (this.$el) {
        let style = {}
        let height = this.containerHeight - this.headHeight - this.footHeight
        style.height = height + 'px'
        style['margin-top'] = this.headHeight + 'px'
        this.leftAndRIghtStyle = style
      }
    },
    // 设置容器高度
    setContainerSize () {
      if (this.$el) {
        let container = $(this.$el.parentNode)
        this.containerHeight = container.innerHeight()
        this.containerWidth = container.innerWidth()
      }
    },
    gotoPreview () {
      let isDrag = null
      window.setTimeout(() => {
        isDrag = this.$refs.eleDesgin.dataset.flag
        if (isDrag === 'true') {
          let previewUrl = `${dsf.url.getWebPath('~/designer.html#/pc/page?B=' + this.context.B + '&M=' + this.context.M + '&pname=' + this.name + '&title=' + this.title)}`
          window.open(previewUrl)
        }
      }, 100)
    }
  },
  directives: {
    drag: { // 拖拽指令
      inserted: function (el) {
        el.onmousedown = function (ev) {
          el.setAttribute('data-flag', false)
          var sX = ev.clientX - el.offsetLeft
          var sY = ev.clientY - el.offsetTop
          document.onmousemove = function (ev) {
            var eX = ev.clientX - sX
            var eY = ev.clientY - sY
            el.style.left = eX + 'px'
            el.style.top = eY + 'px'
            el.onclick = function () {
              return false
            }
          }
          document.onmouseup = function (event) {
            document.onmousemove = null
            document.onmouseup = null
            window.setTimeout(function () {
              el.onclick = function () {
                el.setAttribute('data-flag', true)
                return true
              }
            }, 100)
          }
        }
      }
    }
  }
})
</script>
