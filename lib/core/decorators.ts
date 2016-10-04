import * as _ from 'lodash'
import {IRouteConfiguration, IReply, Request, IServerConnectionOptions} from 'hapi'
import {App, IApp, IUserApp} from './app.class'
import {Module, IModule, IModuleConfig} from './module.class'
import {Store} from '../utils/store.class'

export function AppDecorator(config: IServerConnectionOptions): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // create and store app instance
    let app: IApp = new App(target.name, _.clone(config), target)
    App.apps.add(app, app.name)

    console.log('4 App', app.name + ' registered')
  }
}

export function ModulesDecorator(Modules: Array<any>): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // make relation between App and Modules
    for (let Mod of Modules) {
      App.modulesToApp.add(Mod.name, target.name)
      console.log('3 Module', Mod.name + ' linked to App ' + target.name)
    }
  }
}

export function ModuleDecorator(config: IModuleConfig): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // get referenced routes and update path
    let userMod: any = new target()
    for (let route of Module.routes.getAll(target.name)) {
      route.path = config.basePath + route.path
      route.handler = (<Function>route.handler).bind(userMod)
    }

    // create and store module instance
    let mod: IModule = new Module(target.name)
    Module.modules.add(mod, mod.name)

    console.log('2 Module', mod.name + ' registered')
  }
}

export function RouteDecorator(config: IRouteConfiguration): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    // update handler and store route
    let route: IRouteConfiguration = _.clone(config)
    route.handler = descriptor.value
    Module.routes.add(route, target.constructor.name)

    console.log('1 Route', target.constructor.name + '.' + propertyKey + ' registered')
  }
}
