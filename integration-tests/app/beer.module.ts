import { Route, Module } from '../../lib/hapiour'
import { Request, ReplyNoContinue } from 'hapi'
import { InjectedService } from './injected.service'

@Module({
  basePath: '/beer'
})
export class Beer {

  private beerCount: number
  private injectedService: InjectedService

  public constructor(injectedService: InjectedService) {
    this.beerCount = 0
    this.injectedService = injectedService
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
    method: 'GET',
    path: '/di',
    config: {}
  })
  public getInjectedService(request: Request, reply: ReplyNoContinue) {
    reply({
      'data': this.injectedService.isInjected()
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
