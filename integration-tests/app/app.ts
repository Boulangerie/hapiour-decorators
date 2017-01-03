import { Server } from 'hapi'
import { App, IApp, Inject } from '../../lib/hapiour'
import { Beer } from './beer.module'

@App({
  port: 3000
})
@Inject([Beer])
export class MyApp implements IApp {

  public server: Server

  public constructor(server: Server) {
    this.server = server
  }

  public onInit(): void {
    console.log('Server init')
  }

  public onStart(): void {
    console.log('Server running at:', this.server.info.uri)
  }

}
