import { toBootstrapPromise } from "../lifecycles/bootstrap.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toMountPromise } from "../lifecycles/mount.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import { getAppChanges, shouldBeActive } from "../singel-spa/application/app.helpers.js";
import { started } from "../singel-spa/start.js";
import './naviation-event.js'


// 后续路径变化需重新计算哪些应用被加载
export function reroute() {
  // 获取app对应的状态 进行分类
  const [appsToLoad, appsToMount, appsToUnmount] = getAppChanges()
  // 加载完毕后 需要去挂载的应用

  if (started) {
    // 用户调用了start方法,需要处理当前应用
    return performAppChange()
  }

  // 先拿到应用去加载 ->
  return loadApps()
  function loadApps() {
    // 应用的加载
    return Promise.all(appsToLoad.map(toLoadPromise))
  }

  function performAppChange() {
    // 将不需要的应用卸载,返回一个卸载的promise
    const unMountAllPromises = Promise.all(appsToUnmount.map(toUnmountPromise))

    // 加载需要的应用 -> 启动对应的应用-> 卸载之前的 ->挂载对应的应用

    // 加载需要的应用(可能这个应用在注册的时候已经被加载)
    const loadMountPromises = Promise.all(appsToLoad.map(app => toLoadPromise(app).then(app => {
      // 当应用加载完毕后，需要启动和挂载，但是要保证挂载钱，先卸载掉之前的应用
      tryBootstrapAndMount(app, unMountAllPromises) // 这里是保证卸载
    })))

    // const MountPromises = Promise.all(appsToMount.map(app => tryBootstrapAndMount(app, unMountAllPromises)))

    function tryBootstrapAndMount(app, unMountAllPromises) {
      if (shouldBeActive(app)) {
        // 保证卸载完毕,只有全部卸载完成，才会进入下一步
        return toBootstrapPromise(app).then(app => unMountAllPromises.then(() => toMountPromise(app)))
      }
    }
  }
}