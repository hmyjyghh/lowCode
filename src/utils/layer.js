import client from './client'

export default {
  pc: {},
  mobile: {},
  openWindow () {
    let args = Array.prototype.slice.call(arguments)
    return proxyFunction.apply(this, ['openWindow', ...args])
  },
  openDialog () {
    let args = Array.prototype.slice.call(arguments)
    return proxyFunction.apply(this, ['openDialog', ...args])
  },
  message () {
    let args = Array.prototype.slice.call(arguments)
    return proxyFunction.apply(this, ['message', ...args])
  },
  loading () {
    let args = Array.prototype.slice.call(arguments)
    return proxyFunction.apply(this, ['loading', ...args])
  },
  closeLoading () {
    let args = Array.prototype.slice.call(arguments)
    return proxyFunction.apply(this, ['closeLoading', ...args])
  },
  alert () {
    let args = Array.prototype.slice.call(arguments)
    return proxyFunction.apply(this, ['alert', ...args])
  },
  confirm: function () {
    let args = Array.prototype.slice.call(arguments)
    return proxyFunction.apply(this, ['confirm', ...args])
  }
}

function proxyFunction () {
  let args = Array.prototype.slice.call(arguments)
  let key = ''
  if (client.PC()) {
    key = 'pc'
  } else if (client.Mobile()) {
    key = 'mobile'
  }
  let fnName = args[0]
  if (key && dsf.layer[key][fnName]) {
    return dsf.layer[key][fnName].apply(this, args.slice(1))
  }
  return null
}
