import 'reflect-metadata'
import * as Promise from 'bluebird'
import { Server } from 'hapi'
import { bootstrap, IApp } from '../../lib/hapiour'
import { MyApp } from '../app/app'


class BootstrapFactory {

  public app: ITestedApp

  public constructor() {
  }

  public start(): void {
    this.app = bootstrap(MyApp)[0]
  }

  public stop(): Promise<void> {
    return <Promise<void>>this.app.server.stop()
  }

}

export const Bootstrap = new BootstrapFactory()

export interface ITestedApp extends IApp {
  server?: Server
}
