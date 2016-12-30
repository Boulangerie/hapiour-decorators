import { AppDecorator, InjectDecorator, ModuleDecorator, RouteDecorator } from './core/decorators'
import { IUserApp } from './core/app.class'
import { bootstrap } from './core/bootstrap.class'

export { bootstrap, AppDecorator as App, InjectDecorator as Inject, ModuleDecorator as Module, RouteDecorator as Route, IUserApp as IApp }
