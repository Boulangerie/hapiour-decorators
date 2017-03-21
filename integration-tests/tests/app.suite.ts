import { expect } from 'chai'
import { Server } from 'hapi'
import { Bootstrap } from '../shared/bootstrap'
import { Requester } from '../shared/requester'

var requester: Requester

describe('App', () => {

  before(() => {
    requester = new Requester('http://127.0.0.1:3000')
    Bootstrap.start()
  })

  after((done) => {
    Bootstrap
      .stop()
      .then(() => {
        done()
      })
  })

  it('should have hapi server setted', () => {
    expect(Bootstrap.app).to.have.property('server').and.to.be.an.instanceOf(Server)
  })

  it('should have awesome plugin loaded', (done) => {
    setTimeout(() => {
      expect(Bootstrap.app).to.have.property('server').and.to.have.property('isBeerAwesome')
      done()
    }, 1000)
  })

  describe('Beer module', () => {

    var takeABeer: any = {
      'url': '/beer',
      'method': 'GET'
    }
    var countBeers: any = {
      'url': '/beer/count',
      'method': 'GET'
    }
    var resetCount: any = {
      'url': '/beer/count',
      'method': 'DELETE'
    }

    it('should provide some beer', (done) => {
      requester
        .request(takeABeer)
        .then((res) => {
          expect(res).to.have.property('statusCode').and.equal(200)
          expect(res).to.have.property('body').and.to.have.property('data').equal('Hey! Take this beer !')
          done()
        })
    })

    it('should count beers', (done) => {
      requester
        .request(countBeers)
        .then((res) => {
          expect(res).to.have.property('statusCode').and.equal(200)
          expect(res).to.have.property('body').and.to.have.property('data').equal(1)
          requester.request(takeABeer)
          requester
            .request(countBeers)
            .then((res) => {
              expect(res).to.have.property('body').and.to.have.property('data').equal(2)
              done()
            })
        })
    })

    it('should reset count', (done) => {
      requester
        .request(resetCount)
        .then((res) => {
          expect(res).to.have.property('statusCode').and.equal(200)
          expect(res).to.have.property('body').and.to.have.property('data').equal('Done')
          requester
            .request(countBeers)
            .then((res) => {
              expect(res).to.have.property('body').and.to.have.property('data').equal(0)
              done()
            })
        })
    })

  })

  describe('Plugins', () => {

    var isHealthy: any = {
      'url': '/health',
      'method': 'GET'
    }

    it('should be healthy', (done) => {
      requester
        .request(isHealthy)
        .then((res) => {
          expect(res).to.have.property('statusCode').and.equal(200)
          done()
        })
    })

  })

})

