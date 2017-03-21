import { PluginConfigurator, IPluginConfigurator, IPluginOptions } from '../../lib/hapiour'
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
