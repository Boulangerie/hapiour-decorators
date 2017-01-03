import { Bootstrap } from '../shared/bootstrap'
import { expect } from 'chai'
import { Requester } from '../shared/requester'

var requester: Requester
var takeABeer: any = {
  'url': '',
  'method': 'GET'
}
var countBeers: any = {
  'url': '/count',
  'method': 'GET'
}
var resetCount: any = {
  'url': '/count',
  'method': 'DELETE'
}

describe('Beer module', () => {

  before(() => {
    requester = new Requester('http://127.0.0.1:3000/beer')
    Bootstrap.start()
  })

  after((done) => {
    Bootstrap
      .stop()
      .then(() => {
        done()
      })
  })

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
