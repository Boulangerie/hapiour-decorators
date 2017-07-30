import { AppDecorator, InjectDecorator, PluginsDecorator, PluginDecorator, PluginConfiguratorDecorator, ModuleDecorator, RouteDecorator } from './core/decorators'
import { IApp, IModule, IPlugin, IPluginConfigurator, IPluginOptions, IBootstrapOptions, IInjector } from './core/interfaces'
import { bootstrap, bootstrapWithOptions } from './core/bootstrap'

export { bootstrap, bootstrapWithOptions, AppDecorator as App, InjectDecorator as Inject, PluginsDecorator as Plugins, PluginDecorator as Plugin, PluginConfiguratorDecorator as PluginConfigurator, ModuleDecorator as Module, RouteDecorator as Route, IApp, IModule, IPlugin, IPluginConfigurator, IPluginOptions, IBootstrapOptions, IInjector }
