import { Server } from 'hapi'
import { App, IApp, Inject, Plugins } from '../../lib/hapiour'
import { Beer } from './beer.module'
import { GreetingsPlugin } from './greetings.plugin'

@App({
  port: 3000
})
@Inject([Beer])
@Plugins([GreetingsPlugin])
export class MyApp implements IApp {

  public server: Server

  public constructor(server: Server) {
    this.server = server
  }

  public onInit(err: any): void {
    console.log('Server init')
    if (err) {
      console.log('Init error', err)
    }
  }

  public onStart(): void {
    console.log('Server running at:', this.server.info.uri)
  }

}
