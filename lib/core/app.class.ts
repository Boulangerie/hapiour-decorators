import * as _ from 'lodash'
import {Server, IServerConnectionOptions, IRouteConfiguration} from 'hapi'
import {Store} from '../utils/store.class'
import {Module, IModule} from './module.class'

export class App implements IApp {

  public static apps: Store<IApp> = new Store<IApp>()
  public static modulesToApp: Store<string> = new Store<string>()

  private server: Server
  private options: IServerConnectionOptions
  private userApp: IUserApp

  public name: string

  public constructor(name: string, options: IServerConnectionOptions, userAppStatic: IUserAppStatic) {
    this.name = name
    this.options = options
    this.server = new Server()
    this.userApp = new userAppStatic(this.server)

    this.initOptions()
    this.initRoutes()

    this.userApp.onInit()
  }

  public start(): void {
    this.server.start(() => {
      this.userApp.onStart()
    })
  }

  private initOptions(): void {
    if (_.isUndefined(this.options.port)) {
      this.options.port = 3000
    }
    this.server.connection(this.options)
  }

  private initRoutes(): void {
    for (let moduleName of App.modulesToApp.getAll(this.name)) {
      this.server.route(Module.routes.getAll(moduleName))
    }
  }

}

interface IConfig {
  port: number
}

export interface IApp {
  name: string
  start(): void
}

export interface IUserAppStatic {
  new(server: Server): IUserApp
}

export interface IUserApp {
  onInit?(): void
  onStart?(): void
}
