import { Route, Module } from '../../lib/hapiour'
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
