import {App, IApp} from './app.class'

export function bootstrap(...BootstrapedApps: Array<IApp>): void {
  for (let BootstrapedApp of BootstrapedApps) {
    let app: IApp = App.apps.get(BootstrapedApp.name)
    app.start()
  }
}
