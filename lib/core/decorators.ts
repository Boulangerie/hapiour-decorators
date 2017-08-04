import 'reflect-metadata'
import { RouteConfiguration, ServerConnectionOptions } from 'hapi'
import { IPlugin, IPluginStatic, IPluginConfiguratorStatic, IModule, IModuleConfig } from './interfaces'

export function AppDecorator(config: ServerConnectionOptions): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    Reflect.defineMetadata('hapiour:config', config, target)

  }
}

export function InjectDecorator(Modules: Array<IModule>): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    Reflect.defineMetadata('hapiour:modules', Modules, target)

  }
}

export function PluginsDecorator(Plugins: Array<IPluginStatic|IPlugin|IPluginConfiguratorStatic>): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    Reflect.defineMetadata('hapiour:plugins', Plugins, target)

  }
}

export function PluginDecorator(attributes: any): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    Reflect.defineMetadata('hapiour:attributes', attributes, target)

  }
}

export function PluginConfiguratorDecorator(Plugin: any): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    Reflect.defineMetadata('hapiour:register', Plugin, target)

  }
}

export function ModuleDecorator(config: IModuleConfig): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    Reflect.defineMetadata('hapiour:config', config, target)

  }
}

export function RouteDecorator(config: RouteConfiguration): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

    let routes: Array<RouteConfiguration> = []
    if (Reflect.hasMetadata('hapiour:routes', target.constructor)) {
      routes = Reflect.getMetadata('hapiour:routes', target.constructor)
    }
    config.handler = descriptor.value
    routes.push(config)
    Reflect.defineMetadata('hapiour:routes', routes, target.constructor)

  }
}
