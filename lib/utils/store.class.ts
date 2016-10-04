import * as _ from 'lodash'

export class Store<T> {

  private store: Map<string, T>

  public constructor() {
    this.store = {}
  }

  public add(item: T, key: string): void {
    if (!_.isArray(this.store[key])) {
      this.store[key] = []
    }
    this.store[key].push(item)
  }

  public get(key: string): T {
    return <T>_.first(this.store[key])
  }

  public getAll(key?: string): Array<T> {
    if (key === undefined) {
      return <Array<T>>_.values(this.store)
    } else {
      return <Array<T>>_.toArray(this.store[key])
    }
  }

  public getMap(): Map<string, T> {
    return this.store
  }

}
