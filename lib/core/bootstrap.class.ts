import 'reflect-metadata'
import { Server, RouteConfiguration } from 'hapi'
import { IApp, IAppStatic, IAppConfig, IModule, IModuleStatic, IModuleConfig, IPlugin, IPluginStatic, IPluginConfigurator, IPluginConfiguratorStatic, IRegister } from './interfaces'
import * as _ from 'lodash'

const DEFAULT_APP_CONFIG = {
  port: 3000
}

export function bootstrap(...BootstrapedApps: Array<IAppStatic>): Array<IApp> {
  let apps: Array<IApp> = []
  for (let BootstrapedApp of BootstrapedApps) {
    const server: Server = new Server()
    const app: IApp = new BootstrapedApp(server)

    server.connection(_.extend(Reflect.getMetadata('hapiour:config', BootstrapedApp), DEFAULT_APP_CONFIG))
    try {app.onInit()} catch(err) {}
    server.register(getPluginsRecurs(Reflect.getMetadata('hapiour:plugins', BootstrapedApp)), (err: any) => {
      try {app.onRegister()} catch(err) {}
      server.route(getRoutesWithConfigRecurs(BootstrapedApp))
      server.start((err: any) => {
        try {app.onStart()} catch(err) {}
      })
    })
    apps.push(app)
  }
  return apps
}

function getPluginsRecurs(Plugins: Array<IPluginStatic|IPlugin|IPluginConfiguratorStatic|Array<IPluginStatic|IPlugin|IPluginConfiguratorStatic>>): Array<IPlugin> {
  let plugins: Array<IPlugin> = []
  for (let Plugin of Plugins) {
    if (Plugin instanceof Array) {
      plugins = _.concat(plugins, getPluginsRecurs(Plugin))
    } else if (Plugin['register']) {
      plugins.push(<IPlugin>Plugin)
    } else {
      let plugin: IPlugin = new (<IPluginStatic>Plugin)()
      if (Reflect.hasMetadata('hapiour:register', Plugin)) {
        plugin.register = Reflect.getMetadata('hapiour:register', Plugin)
      } else if (Reflect.hasMetadata('hapiour:attributes', Plugin)) {
        plugin.register = plugin.register.bind(plugin)
        plugin.register.attributes = Reflect.getMetadata('hapiour:attributes', Plugin)
      }
      plugins.push(plugin)
    }
  }
  return plugins
}

function getRoutesWithConfigRecurs(item: IAppStatic|IModuleStatic, parent?: IAppStatic|IModuleStatic): Array<RouteConfiguration> {
  let routes: Array<RouteConfiguration> = []
  if (Reflect.hasMetadata('hapiour:modules', item)) {
    let modules: Array<IModuleStatic> = Reflect.getMetadata('hapiour:modules', item)
    let parentConfig: IModuleConfig = (parent) ? Reflect.getMetadata('hapiour:config', parent): {}
    for (let Mod of modules) {
      let config: IModuleConfig = Reflect.getMetadata('hapiour:config', Mod)
      let modRoutes: Array<RouteConfiguration> = _.cloneDeep(Reflect.getMetadata('hapiour:routes', Mod))
      let mod: IModule = new Mod()
      modRoutes = _.each(modRoutes, (route: RouteConfiguration) => {
        route.path = _.get(parentConfig, 'basePath', '') + config.basePath + route.path
        route.handler = (<Function>route.handler).bind(mod)
      })
      routes = _.concat(routes, modRoutes, getRoutesWithConfigRecurs(Mod, item))
    }
  }
  return routes
}
