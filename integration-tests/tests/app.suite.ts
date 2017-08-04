import { expect, should } from 'chai'
import { Server } from 'hapi'
import { Bootstrap } from '../shared/bootstrap'
import { Requester } from '../shared/requester'
import { Container } from 'typedi'

let requester: Requester

describe('App', () => {

  before(() => {
    requester = new Requester('http://127.0.0.1:3000')
    Bootstrap.start()
  })

  after(async () => {
    return Bootstrap.stop()
  })

  it('should have hapi server setted', () => {
    expect(Bootstrap.app).to.have.property('server').and.to.be.an.instanceOf(Server)
  })

  it('should have awesome plugin loaded', (done) => {
    setTimeout(() => {
      expect(Bootstrap.app).to.have.property('server').and.to.have.property('isBeerAwesome')
      done()
    }, 50)
  })

  describe('Beer module', () => {

    const takeABeer: any = {
      'url': '/beer',
      'method': 'GET'
    }
    const countBeers: any = {
      'url': '/beer/count',
      'method': 'GET'
    }
    const resetCount: any = {
      'url': '/beer/count',
      'method': 'DELETE'
    }

    it('should provide some beer', async () => {
      let takeABeerRes
      try {
        takeABeerRes = await requester.request(takeABeer)
      } catch (err) {
        should().not.exist(err)
      }
      expect(takeABeerRes).to.have.property('statusCode').and.equal(200)
      expect(takeABeerRes).to.have.property('body').and.to.have.property('data').equal('Hey! Take this beer !')
    })

    it('should count beers', async () => {
      let countBeersRes
      try {
        await requester.request(takeABeer)
        countBeersRes = await requester.request(countBeers)
      } catch (err) {
        should().not.exist(err)
      }
      expect(countBeersRes).to.have.property('statusCode').and.equal(200)
      expect(countBeersRes).to.have.property('body').and.to.have.property('data').equal(2)
    })

    it('should reset count', async () => {
      let resetCountRes
      let countBeersRes
      try {
        resetCountRes = await requester.request(resetCount)
        countBeersRes = await requester.request(countBeers)
      } catch (err) {
        should().not.exist(err)
      }
      expect(resetCountRes).to.have.property('statusCode').and.equal(200)
      expect(resetCountRes).to.have.property('body').and.to.have.property('data').equal('Done')
      expect(countBeersRes).to.have.property('body').and.to.have.property('data').equal(0)
    })

  })

  describe('Plugins', () => {

    const isHealthy: any = {
      'url': '/health',
      'method': 'GET'
    }

    it('should be healthy', async () => {
      let isHealthyRes
      try {
        isHealthyRes = await requester.request(isHealthy)
      } catch (err) {
        should().not.exist(err)
      }
      expect(isHealthyRes).to.have.property('statusCode').and.equal(200)
    })

  })

})

describe('App with Dependency Injection', () => {

  before(() => {
    requester = new Requester('http://127.0.0.1:3000')
    Bootstrap.start({injector: Container})
  })

  after(async () => {
    return Bootstrap.stop()
  })

  it('should have hapi server setted', () => {
    expect(Bootstrap.app).to.have.property('server').and.to.be.an.instanceOf(Server)
  })

  it('should have awesome plugin loaded', (done) => {
    setTimeout(() => {
      expect(Bootstrap.app).to.have.property('server').and.to.have.property('isBeerAwesome')
      done()
    }, 50)
  })

  describe('Beer module', () => {

    const isDependyInjected: any = {
      'url': '/beer/di',
      'method': 'GET'
    }

    it('should be up with injected class', async () => {
      let isDependyInjectedRes
      try {
        isDependyInjectedRes = await requester.request(isDependyInjected)
      } catch (err) {
        should().not.exist(err)
      }
      expect(isDependyInjectedRes).to.have.property('statusCode').and.equal(200)
      expect(isDependyInjectedRes).to.have.property('body').and.to.have.property('data').equal(true)
    })

  })

})
