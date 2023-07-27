// 对用户的路径切换 进行劫持，重新调用reroute方法，进行计算应用的加载

import { reroute } from "./reroute.js"

function urlRoute() {
  reroute(arguments)
}

window.addEventListener('hashChange', urlRoute)

window.addEventListener('popstate', urlRoute) // 浏览器历史切换的时候会执行


// 应用中可能也包含addEventListener

const capturedEventListeners = {
  hashchange: [],
  popstate: []
}

const listeningTo = ['hashChange', 'popState']
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = function (eventName, callback) {
  if (listeningTo.includes(eventName) && !capturedEventListeners[eventName].some(listener => listener === callback)) {
    capturedEventListeners[eventName].push(callback)
  }
  return originalAddEventListener.apply(this, arguments)
}