import 'reflect-metadata'
import { Server } from 'hapi'
import { bootstrap, IApp, bootstrapWithContainer } from '../../lib/hapiour'
import { MyApp } from '../app/app'


export class BootstrapFactory {

  public app: ITestedApp

  public constructor(private container = undefined) {
  }

  public start(): void {
    if (this.container) {
      this.app = bootstrapWithContainer(this.container, MyApp)[0]
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
