import { IInjector, IStatic } from './interfaces'

export class Injector implements IInjector {

  public get<T>(Dependency: IStatic<T> | T): T {
    if (Dependency instanceof Function) {
      return new Dependency()
    }
    return Dependency
  }

}
