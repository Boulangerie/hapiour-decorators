import * as _ from 'lodash'
import { IRouteConfiguration } from 'hapi'
import { Store } from '../utils/store.class'
import { IApp } from './app.class'

export class Module implements IModule {

  public static modules: Store<IModule> = new Store<IModule>()
  public static configs: Store<IModuleConfig> = new Store<IModuleConfig>()
  public static routes: Store<IRouteConfiguration> = new Store<IRouteConfiguration>()
  public static modulesMapping: Store<string> = new Store<string>()

  public static getRoutesWithConfigRecurs(item: IApp|IModule, parent?: IModule): Array<IRouteConfiguration> {
    let routes: Array<IRouteConfiguration> = []
    let parentConfig: IModuleConfig = <IModuleConfig>{}
    if (Module.modules.has(item.name)) {
      parentConfig = Module.configs.get(item.name)
    }
    for (let mappedName of Module.modulesMapping.getAll(item.name)) {
      let routesWithConfig = _.map(Module.routes.getAll(mappedName), (route: IRouteConfiguration) => {
        let config: IModuleConfig = Module.configs.get(mappedName)
        route.path = _.get(parentConfig, 'basePath', '') + config.basePath + route.path
        return route
      })
      let mod = Module.modules.get(mappedName)
      routes = _.concat(routes, routesWithConfig, Module.getRoutesWithConfigRecurs(mod, item))
    }
    return routes
  }

  public name: string

  public constructor(name: string) {
    this.name = name
  }

}

export interface IModule {
  name: string
}

export interface IModuleConfig {
  basePath: string
}
