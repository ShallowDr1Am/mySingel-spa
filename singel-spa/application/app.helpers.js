import { apps } from "./app.js"

// app 状态
export const NOT_LOADED = 'NOT_LOADED' // 没有被加载
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE' // 路径匹配了，正在加载资源
export const LOAD_ERROR = 'LOAD_ERROR'

// 启动的过程
export const NOT_BOOTSRAPED = 'NOT_BOOTSTRAPED' // 资源加载完毕了 需要启动 此时还没有启动
export const BOOTSTRAPING = 'BOOTSTRAPING'// 启动中
export const NOT_MOUNTED = 'NOT_MOUNTED' // 没有被挂载

// 挂载流程
export const MOUNTING = 'MOUNTING' // 正在挂载
export const MOUNTED = 'MONTED'// 挂载完成 

// 卸载流程
export const UNMOUNTING = 'UNMOUNTING' // 卸载中



// 应用是否正在被激活
export function isActive(app) {
  return app.status === MOUNTED // 此应用正在被激活
}

// 应用是否被激活
export function shouldBeActive(app) {
  return app.activeWhen(window.location)
}

export function getAppChanges() {
  const appsToLoad = []
  const appsToMount = []
  const appsToUnmount = []
  // console.log(apps)
  apps.forEach((app) => {
    let appShouldBeActive = shouldBeActive(app)
    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        // 标记当前路径下 哪些应用要加载
        if (appShouldBeActive) {
          appsToLoad.push(app)
        }
        break
      case NOT_BOOTSRAPED:
      case BOOTSTRAPING:
      case NOT_MOUNTED:
        // 那些应用要被挂在
        if (appShouldBeActive) {
          appsToMount.push(app)
        }
        break
      case MOUNTED:
        // 哪些要被卸载
        if (!appShouldBeActive) {
          appsToUnmount.push(app)
        }
        break
      default:
        break;
    }
  })

  return [appsToLoad, appsToMount, appsToUnmount]
}