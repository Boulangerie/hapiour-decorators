import 'reflect-metadata'
import { Server } from 'hapi'
import { bootstrap, IApp, bootstrapWithOptions, IInjector } from '../../lib/hapiour'
import { MyApp } from '../app/app'

class BootstrapFactory {

  public app: ITestedApp

  public start(options?: any): void {
    if (options) {
      this.app = bootstrapWithOptions([MyApp], options)[0]
    } else {
      this.app = bootstrap(MyApp)[0]
    }
  }

  public stop(): Promise<Error> {
    return this.app.server.stop()
  }

}

export const Bootstrap = new BootstrapFactory()

export interface ITestedApp extends IApp {
  server?: Server
}
