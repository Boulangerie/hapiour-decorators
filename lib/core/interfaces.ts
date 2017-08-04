import { Server } from 'hapi'

export type IPluginOptions = Object

export interface IStatic<T> {
  new(...args: Array<any>): T
}

export interface IInjector {
  get<T>(Dependency: IStatic<T>): T
}

export interface IRegister {
  (server: Server, options: IPluginOptions, next: () => void): void
  attributes?: any
}

export interface IPlugin {
  register: IRegister
}

export interface IPluginStatic extends IStatic<IPlugin> {
  new(): IPlugin
}

export interface IPluginConfigurator {
  options: IPluginOptions
}

export interface IPluginConfiguratorStatic extends IStatic<IPluginConfigurator> {
  new(): IPluginConfigurator
}

export interface IAppConfig {
  port: number
}

export interface IAppStatic extends IStatic<IApp> {
  new(server: Server): IApp
}

export interface IApp {
  onInit?(): void
  onRegister?(): void
  onStart?(): void
}

export interface IModuleStatic extends IStatic<IModule> {
  new(): IModule
}

export interface IModule {

}

export interface IModuleConfig {
  basePath: string
}

export interface IBootstrapOptions {
  injector?: IInjector
}
