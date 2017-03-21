import { Server } from 'hapi'
import { App, IApp, Inject, Plugins } from '../../lib/hapiour'
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
    if (this.server['isBeerAwesome']) {
      console.log('Beer is awesome')
    }
  }

  public onStart(): void {
    console.log('Server running at:', this.server.info.uri)
  }

}
