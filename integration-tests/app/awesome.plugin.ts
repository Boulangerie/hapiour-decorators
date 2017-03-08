import { Plugin, IPlugin, IPluginOptions } from '../../lib/hapiour'
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
