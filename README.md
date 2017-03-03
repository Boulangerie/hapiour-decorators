[![Build Status](https://travis-ci.org/teads/hapiour.svg?branch=master)](https://travis-ci.org/teads/hapiour)
[![npm version](https://img.shields.io/npm/v/hapiour.svg)](https://www.npmjs.com/package/hapiour)
[![npm downloads](https://img.shields.io/npm/dm/hapiour.svg?style=flat-square)](http://npm-stat.com/charts.html?package=hapiour&from=2016-10-01)
[![dependencies](https://david-dm.org/teads/hapiour.svg)](https://david-dm.org/teads/hapiour)
[![npm devDependencies](https://img.shields.io/david/dev/teads/hapiour.svg)](https://david-dm.org/teads/hapiour)
[![npm license](https://img.shields.io/npm/l/hapiour.svg)](https://www.npmjs.org/package/hapiour)

# hapiour

Typescript decorators for Hapi

# Install

```bash
npm install -g typescript
npm install --save hapi
npm install --save hapiour
```

# Example

## Files
```
src/
  -> main.ts
  -> app.ts
  -> beer.module.ts
  -> greetings.plugin.ts
```

## Declare your app
### src/app.ts
```js
import { Server } from 'hapi'
import { App, IApp, Inject, Plugins } from 'hapiour'
import { Beer } from './beer.module'
import { GreetingsPlugin } from './greetings.plugin'

@App({
  port: 3000
})
@Inject([Beer])
@Plugins([GreetingsPlugin])
export class MyApp implements IApp {

  private server: Server

  public constructor(server: Server) {
    this.server = server
  }

  public onPluginInit(err: any, done: () => void) {
    if (err) {
      console.log('Init error', err)
    }
    console.log('Plugin init')
    done()
  }

  public onInit(): void {
    console.log('Server init done')
  }

  public onStart(): void {
    console.log('Server running at:', this.server.info.uri)
  }

}
```

## Declare a module
### src/beer.module.ts
```js
import { Route, Module } from 'hapiour'
import { Request, IReply } from 'hapi'

@Module({
  basePath: '/beer'
})
export class Beer {

  private beerCount: number

  public constructor() {
    this.beerCount = 0
  }

  @Route({
    method: 'GET',
    path: '',
    config: {}
  })
  public getABeer(request: Request, reply: IReply) {
    this.beerCount++
    reply({
      'data': 'Hey! Take this beer !'
    })
  }

  @Route({
    method: 'GET',
    path: '/count',
    config: {}
  })
  public getCount(request: Request, reply: IReply) {
    reply({
      'data': this.beerCount
    })
  }

  @Route({
    method: 'DELETE',
    path: '/count',
    config: {}
  })
  public resetCount(request: Request, reply: IReply) {
    this.beerCount = 0
    reply({
      'data': 'Done'
    })
  }

}
```

## Declare a plugin
### src/greetings.plugin.ts
```js
import { Server } from 'hapi'

interface IRegister {
  (server: Server, options: any, next: any): void
  attributes?: any
}

class GreetingsPluginFactory {

  public register: IRegister

  public constructor() {
    this.register = (server: Server, options: any, next: any) => {
      console.log('Hey ! Welcome here young beer addict !')
      next()
    }

    this.register.attributes = {
      name: 'GreetingsPlugin',
      version: '0.1.0'
    }
  }

}

export const GreetingsPlugin = new GreetingsPluginFactory()
```

## Bootstrap your app
### src/main.ts
```js
import { bootstrap } from 'hapiour'
import { MyApp } from './app'

bootstrap(MyApp)
```

## API
### Decorators
#### Class Decorators
- `@App(config: Hapi.IServerConnectionOptions)` : Declare a new App (correspond to a new Hapi.Server instance).
- `@Module(config: IModuleConfig)` : Declare a new Module (class containing routes).
- `@Inject(modules: Array<Module>)` : Assign an array of modules to an App or a Module.
- `@Plugins(plugins: Array<Plugin>)` : Assign an array of plugins to an App.

#### Method decorators
- `@Route(config: Hapi.IRouteConfiguration)` : Declare a new Route inside a Module. The target method will become the route handler.

### Interfaces

#### IApp
- `constructor(server: Hapi.Server)` : App will be constructed with Hapi server instance as first argument.
- `onPluginInit(err: any, done: () => void)`: Method called when Hapi plugin registration is done. If this method is defined, you must call done() to continue server initialization.
- `onInit()`: Method called when Hapi server initialization is done.
- `onStart()`: Method called when Hapi server is started.

#### IModuleConfig
- `basePath: string` : Base path applied to all contained routes in the module.

### Methods
- `bootstrap(...apps: Array<IApp>)` : Bootstrap your apps.
