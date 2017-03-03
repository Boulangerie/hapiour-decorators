import * as _ from 'lodash'
import { Server, IServerConnectionOptions, IRouteConfiguration } from 'hapi'
import { Store } from '../utils/store.class'
import { Module } from './module.class'

export class App implements IApp {

  public static apps: Store<IApp> = new Store<IApp>()
  public static pluginsMapping: Store<any> = new Store<any>()

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
    this.initPlugins((err: any) => {
      this.initRoutes()
      try {
        this.userApp.onInit(err)
      } catch(err) {}
    })

  }

  public start(): void {
    this.server.start(() => {
      try {
        this.userApp.onStart()
      } catch(err) {}
    })
  }

  private initPlugins(callback: (err: any) => any): void {
    let plugins = App.pluginsMapping.get(this.name)
    if (!_.isEmpty(plugins)) {
      this.server.register(plugins, callback)
    } else {
      callback(null)
    }
  }

  private initOptions(): void {
    if (_.isUndefined(this.options.port)) {
      this.options.port = 3000
    }
    this.server.connection(this.options)
  }

  private initRoutes(): void {
    this.server.route(Module.getRoutesWithConfigRecurs(this))
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
  onInit?(err?: any): void
  onStart?(): void
}
