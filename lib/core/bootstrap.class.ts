import {App, IApp} from './app.class'

export function bootstrap(...BootstrapedApps: Array<any>): void {
  for (let BootstrapedApp of BootstrapedApps) {
    let app: IApp = App.apps.get(BootstrapedApp.name)
    app.start()
    console.log('5 bootstrap', app.name + ' started')
  }
}
