import { BOOTSTRAPING, NOT_BOOTSRAPED, NOT_MOUNTED } from "../singel-spa/application/app.helpers.js"

export function toBootstrapPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_BOOTSRAPED) {
      return app
    }
    app.status = BOOTSTRAPING
    return app.bootstrap(app.customProps).then(() => {
      app.status = NOT_MOUNTED
      return app
    })
  })
}