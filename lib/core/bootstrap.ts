import 'reflect-metadata'
import { Server, RouteConfiguration } from 'hapi'
import { Injector } from './injector.class'
import { IApp, IAppStatic, IModule, IModuleStatic, IModuleConfig, IPlugin, IPluginStatic, IPluginConfiguratorStatic, IInjector, IBootstrapOptions } from './interfaces'
import * as _ from 'lodash'

const DEFAULT_APP_CONFIG = {
  port: 3000
}

const DEFAULT_BOOTSTRAP_OPTIONS = {
  injector: new Injector()
}

export function bootstrapWithOptions(BootstrapedApps: Array<IAppStatic>, options: IBootstrapOptions = DEFAULT_BOOTSTRAP_OPTIONS): Array<IApp> {
  const apps: Array<IApp> = []
  for (const BootstrapedApp of BootstrapedApps) {
    const server: Server = new Server()
    const app: IApp = new BootstrapedApp(server)

    server.connection(_.extend(Reflect.getMetadata('hapiour:config', BootstrapedApp), DEFAULT_APP_CONFIG))
    _.invoke(app, 'onInit')
    const plugins: Array<IPlugin> = getPluginsRecurs(options.injector, Reflect.getMetadata('hapiour:plugins', BootstrapedApp))
    const routes: Array<RouteConfiguration> = getRoutesWithConfigRecurs(options.injector, BootstrapedApp)
    if (_.isEmpty(plugins)) {
      _.invoke(app, 'onRegister')
      server.route(routes)
      server.start((err: any) => {
        if (err) {
          throw new Error(err)
        }
        _.invoke(app, 'onStart')
      })
    } else {
      server.register(plugins, (registerErr: any) => {
        if (registerErr) {
          throw new Error(registerErr)
        }
        _.invoke(app, 'onRegister')
        server.route(routes)
        server.start((startErr: any) => {
          if (startErr) {
            throw new Error(startErr)
          }
          _.invoke(app, 'onStart')
        })
      })
    }
    apps.push(app)
  }
  return apps
}

function getPluginsRecurs(injector: IInjector, Plugins: Array<IPluginStatic | IPlugin | IPluginConfiguratorStatic>): Array<IPlugin> {
  let plugins: Array<IPlugin> = []
  if (_.isArray(Plugins)) {
    for (const Plugin of Plugins) {
      if (Plugin instanceof Array) {
        plugins = _.concat(plugins, getPluginsRecurs(injector, Plugin))
      } else if (Plugin['register']) {
        plugins.push(<IPlugin>Plugin)
      } else {
        const plugin: IPlugin = injector.get<IPlugin>(<IPluginStatic>Plugin)
        if (Reflect.hasMetadata('hapiour:register', Plugin)) {
          plugin.register = Reflect.getMetadata('hapiour:register', Plugin)
        } else if (Reflect.hasMetadata('hapiour:attributes', Plugin)) {
          plugin.register = plugin.register.bind(plugin)
          plugin.register.attributes = Reflect.getMetadata('hapiour:attributes', Plugin)
        }
        plugins.push(plugin)
      }
    }
  }
  return plugins
}

function getRoutesWithConfigRecurs(injector: IInjector, item: IAppStatic | IModuleStatic, parent?: IAppStatic | IModuleStatic): Array<RouteConfiguration> {
  let routes: Array<RouteConfiguration> = []
  if (Reflect.hasMetadata('hapiour:modules', item)) {
    const modules: Array<IModuleStatic> = Reflect.getMetadata('hapiour:modules', item)
    const parentConfig: IModuleConfig = (parent) ? Reflect.getMetadata('hapiour:config', parent) : {}
    for (const Mod of modules) {
      const config: IModuleConfig = Reflect.getMetadata('hapiour:config', Mod)
      let modRoutes: Array<RouteConfiguration> = _.cloneDeep(Reflect.getMetadata('hapiour:routes', Mod))
      const mod: IModule = injector.get<IModule>(Mod)
      modRoutes = _.each(modRoutes, (route: RouteConfiguration) => {
        route.path = _.get(parentConfig, 'basePath', '') + config.basePath + route.path
        route.handler = (<Function>route.handler).bind(mod)
      })
      routes = _.concat(routes, modRoutes, getRoutesWithConfigRecurs(injector, Mod, item))
    }
  }
  return routes
}

export function bootstrap(...BootstrapedApps: Array<IAppStatic>): Array<IApp> {
  return bootstrapWithOptions(BootstrapedApps)
}
