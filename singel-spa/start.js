import { reroute } from "../navigation/reroute.js"

export let started = false //默认没有调用start方法
export function start() {
  started = true // 启动
  reroute()
}