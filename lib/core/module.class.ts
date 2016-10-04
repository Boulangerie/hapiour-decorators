import * as _ from 'lodash'
import {IRouteConfiguration} from 'hapi'
import {Store} from '../utils/store.class'

export class Module implements IModule {

  public static modules: Store<IModule> = new Store<IModule>()
  public static routes: Store<IRouteConfiguration> = new Store<IRouteConfiguration>()

  public name: string

  public constructor(name: string) {
    this.name = name
  }

}

export interface IModule {
  name: string
}

export interface IModuleConfig {
  basePath: string
}
