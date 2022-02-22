import utils from './utils'
import express from './express'

// console.log(jsBeautify)
let global = window || global

let dsf = {
  ...utils,
  express
}

// 如果window对象存在则表示在客户端运行，否则使用node的global对象作为全局对象
if (global) {
  global.dsf = dsf
}

export default dsf
