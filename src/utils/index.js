import requireJS from './require'
import './repair'
import utils from './utils'
import url from './url'
import http from './http'
import base64 from './base64'
import md5 from './md5'
import date from './date'
import config from './config'
import flexble from './flexble'
import component from './component'
import array from './array'
import designer from './designer'
import client from './client'
import layer from './layer'
import math from './math'
import express from './express'

import $ from 'jquery'
import _ from 'lodash'

// console.log(jsBeautify)
let global = window || global

let dsf = {
//   init,
  ...utils,
  url,
  http,
  base64,
  md5,
  flexble,
  date,
  config,
  ...component,
  array,
  global,
  ...requireJS,
  designer,
  client,
  layer,
  math,
  express
}

// if (cookies) {
//   dsf.mix(dsf, { 'cookies': cookies })
// }

// 如果window对象存在则表示在客户端运行，否则使用node的global对象作为全局对象
if (global) {
  global.dsf = dsf
  global._ = global.lodash = _
  global.$ = global.jquery = $
}

export default dsf
