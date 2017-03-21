import { AppDecorator, InjectDecorator, PluginsDecorator, PluginDecorator, PluginConfiguratorDecorator, ModuleDecorator, RouteDecorator } from './core/decorators'
import { IApp, IModule, IPlugin, IPluginConfigurator, IPluginOptions } from './core/interfaces'
import { bootstrap } from './core/bootstrap.class'

export { bootstrap, AppDecorator as App, InjectDecorator as Inject, PluginsDecorator as Plugins, PluginDecorator as Plugin, PluginConfiguratorDecorator as PluginConfigurator, ModuleDecorator as Module, RouteDecorator as Route, IApp, IModule, IPlugin, IPluginConfigurator, IPluginOptions }
