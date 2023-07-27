import { reroute } from "../../navigation/reroute.js"
import { NOT_LOADED } from "./app.helpers.js"

export const apps = []
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  const registration = {
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED,
  }
  apps.push(registration)
  // 我们需要给每个引用添加对应的状态变化

  // 未加载-> 加载 -> 挂载 -> 卸载

  // 需要检查哪些应用要被加载，还有哪些应用要被移除

  reroute() // 重写路由
}