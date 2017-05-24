import { Server, RouteConfiguration } from 'hapi'

export type IPluginOptions = Object

export interface IRegister {
  (server: Server, options: IPluginOptions, next: () => void): void
  attributes?: any
}

export interface IPlugin {
  register: IRegister
}

export interface IPluginStatic {
  new(): IPlugin
}

export interface IPluginConfigurator {
  options: IPluginOptions
}

export interface IPluginConfiguratorStatic {
  new(): IPluginConfigurator
}

export interface IAppConfig {
  port: number
}

export interface IAppStatic {
  new(server: Server): IApp
}

export interface IApp {
  onInit?(): void
  onRegister?(): void
  onStart?(): void
}

export interface IModuleStatic {
  new(): IModule
}

export interface IModule {

}

export interface IModuleConfig {
  basePath: string
}
