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
