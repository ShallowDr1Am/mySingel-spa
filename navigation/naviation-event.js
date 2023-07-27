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
  // 有要监听的函数事件，函数不能重复
  if (listeningTo.includes(eventName) && !capturedEventListeners[eventName].some(listener => listener === callback)) {
    capturedEventListeners[eventName].push(callback)
    return
  }
  return originalAddEventListener.apply(this, arguments)
}

window.removeEventListener = function (eventName, callback) {
  // 有要监听的函数事件，函数不能重复
  if (listeningTo.includes(eventName)) {
    capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(fn => fn !== callback)
    return
  }
  return originalRemoveEventListener.apply(this, arguments)
}


export function callCaptureEventListeners(e) {
  if (e) {
    const eventType = e[0].type
    if (listeningTo.includes(listeningTo)) {
      capturedEventListeners[eventType].forEach(listener => {
        listener.apply(this, e)
      });
    }
  }
}