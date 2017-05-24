[![Build Status](https://travis-ci.org/Boulangerie/hapiour-decorators.svg?branch=master)](https://travis-ci.org/Boulangerie/hapiour-decorators)
[![npm version](https://img.shields.io/npm/v/hapiour-decorators.svg)](https://www.npmjs.com/package/hapiour-decorators)
[![npm downloads](https://img.shields.io/npm/dm/hapiour-decorators.svg?style=flat-square)](http://npm-stat.com/charts.html?package=hapiour-decorators&from=2016-10-01)
[![dependencies](https://david-dm.org/Boulangerie/hapiour-decorators.svg)](https://david-dm.org/Boulangerie/hapiour-decorators)
[![npm devDependencies](https://img.shields.io/david/dev/Boulangerie/hapiour-decorators.svg)](https://david-dm.org/Boulangerie/hapiour-decorators)
[![npm license](https://img.shields.io/npm/l/hapiour-decorators.svg)](https://www.npmjs.org/package/hapiour-decorators)

# hapiour-decorators

Typescript decorators for Hapi

# Install

```bash
npm install -g typescript
npm install --save hapi
npm install --save hapiour-decorators
```

# Example

## Files
```
src/
  -> main.ts
  -> app.ts
  -> beer.module.ts
  -> awesome.plugin.ts
  -> health.plugin.ts
```

## Declare your app
### src/app.ts
```js
import { Server } from 'hapi'
import { App, IApp, Inject, Plugins } from 'hapiour-decorators'
import { Beer } from './beer.module'
import { AwesomePlugin } from './awesome.plugin'
import { HealthPluginConfigurator } from './health.plugin'

@App({
  port: 3000
})
@Inject([Beer])
@Plugins([AwesomePlugin, HealthPluginConfigurator])
export class MyApp implements IApp {

  public server: Server

  public constructor(server: Server) {
    this.server = server
  }

  public onInit(): void {
    console.log('Server init done')
  }

  public onRegister(): void {
    // server decorated by the AwesomePlugin
    if (this.server['isBeerAwesome']) {
      console.log('Beer is awesome')
    }
  }

  public onStart(): void {
    console.log('Server running at:', this.server.info.uri)
  }

}
```

## Declare a module
### src/beer.module.ts
```js
import { Route, Module } from 'hapiour-decorators'
import { Request, ReplyNoContinue } from 'hapi'

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
  public getABeer(request: Request, reply: ReplyNoContinue) {
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
  public getCount(request: Request, reply: ReplyNoContinue) {
    reply({
      'data': this.beerCount
    })
  }

  @Route({
    method: 'DELETE',
    path: '/count',
    config: {}
  })
  public resetCount(request: Request, reply: ReplyNoContinue) {
    this.beerCount = 0
    reply({
      'data': 'Done'
    })
  }

}
```

## Declare and configure a plugin
### src/health.plugin.ts
```js
import { PluginConfigurator, IPluginConfigurator, IPluginOptions } from 'hapiour-decorators'
import { Server } from 'hapi'
import * as alive from 'hapi-alive'

@PluginConfigurator(alive)
export class HealthPluginConfigurator implements IPluginConfigurator {

  public options: IPluginOptions

  public constructor() {
    this.options = {
      path: '/health',
      tags: ['health', 'monitor'],
      healthCheck: this.healthCheck
    }
  }

  private healthCheck(server: Server, callback: () => void): void {
    callback()
  }

}
```

## Create a plugin
### src/awesome.plugin.ts
```js
import { Plugin, IPlugin, IPluginOptions } from 'hapiour-decorators'
import { Server } from 'hapi'

@Plugin({
  name: 'Awesome',
  version: '0.1.0'
})
export class AwesomePlugin implements IPlugin {

  public constructor() {
  }

  public register(server: Server, options: IPluginOptions, next: () => void): void {
    server.decorate('server', 'isBeerAwesome', () => {
      return true
    })
    next()
  }

}
```

## Bootstrap your app
### src/main.ts
```js
import { bootstrap } from 'hapiour-decorators'
import { MyApp } from './app'

bootstrap(MyApp)
```

## API
### Decorators
#### Class Decorators
- `@App(config: Hapi.IServerConnectionOptions)` : Declare a new App (correspond to a new Hapi.Server instance).
- `@Module(config: IModuleConfig)` : Declare a new Module (class containing routes).
- `@Inject(modules: Array<Module>)` : Assign an array of modules to an App or a Module.
- `@Plugins(plugins: Array<IPlugin|IPluginConfigurator>)` : Assign an array of plugins to an App.
- `@Plugin(attributes: {'name': String, 'version': String})` : Declare a new plugin.
- `@PluginConfigurator(plugin: IPlugin)` : Declare and configure a plugin.

#### Method decorators
- `@Route(config: Hapi.IRouteConfiguration)` : Declare a new Route inside a Module. The target method will become the route handler.

### Interfaces

#### IApp
- `constructor(server: Hapi.Server)` : App will be constructed with Hapi server instance as first argument.
- `onInit()`: Method called when Hapi server initialization is done.
- `onRegister()`: Method called when Hapi plugin registration is done.
- `onStart()`: Method called when Hapi server is started.

#### IModuleConfig
- `basePath: string` : Base path applied to all contained routes in the module.

#### IPlugin
- `register(server: Server, options: IPluginOptions, next: () => void): void` : Plugin core function to be registered into Hapi.

#### IPluginConfigurator
- `options: IPluginOptions` : Options used to configure a given plugin.

### Methods
- `bootstrap(...apps: Array<IApp>): Array<IApp>` : Bootstrap your apps. Return an array of bootstraped apps.
