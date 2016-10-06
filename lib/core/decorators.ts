import * as _ from 'lodash'
import {IRouteConfiguration, IReply, Request, IServerConnectionOptions} from 'hapi'
import {App, IApp, IUserApp} from './app.class'
import {Module, IModule, IModuleConfig} from './module.class'
import {Store} from '../utils/store.class'

export function AppDecorator(config: IServerConnectionOptions): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // create and store app instance
    let app: IApp = new App(target.name, _.clone(config), target)
    App.apps.add(app.name, app)
  }
}

export function ModulesDecorator(Modules: Array<any>): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // make relation between App/Module and Modules
    for (let Mod of Modules) {
      Module.modulesMapping.add(target.name, Mod.name)
    }
  }
}

export function ModuleDecorator(config: IModuleConfig): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // get referenced routes and update path
    let userMod: any = new target()
    for (let route of Module.routes.getAll(target.name)) {
      route.handler = (<Function>route.handler).bind(userMod)
    }

    // create and store module instance
    let mod: IModule = new Module(target.name)
    Module.modules.add(mod.name, mod)

    // store module config
    Module.configs.add(mod.name, config)
  }
}

export function RouteDecorator(config: IRouteConfiguration): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // update handler and store route
    let route: IRouteConfiguration = _.clone(config)
    route.handler = descriptor.value
    Module.routes.add(target.constructor.name, route)
  }
}
