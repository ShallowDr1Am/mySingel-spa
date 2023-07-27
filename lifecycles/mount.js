import { BOOTSTRAPING, MOUNTED, NOT_MOUNTED } from "../singel-spa/application/app.helpers.js"

export function toMountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_MOUNTED) {
      return app
    }
    return app.mount(app.customProps).then(() => {
      app.status = MOUNTED
      return app
    })
  })
}