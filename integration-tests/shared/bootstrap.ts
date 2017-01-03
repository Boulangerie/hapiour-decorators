import * as Promise from 'bluebird'
import { Server } from 'hapi'
import { IApp, App } from '../../lib/core/app.class'
import { bootstrap } from '../../lib/hapiour'
import { MyApp } from '../app/app'


export class Bootstrap {

  public static app: ITestedApp = App.apps.get('MyApp')

  public static start(): void {
    bootstrap(MyApp)
  }

  public static stop(): Promise<void> {
    return <Promise<void>>this.app.server.stop()
  }

}

export interface ITestedApp extends IApp {
  server?: Server
}
