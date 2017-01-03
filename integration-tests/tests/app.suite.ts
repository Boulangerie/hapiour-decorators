import { expect } from 'chai'
import { Server } from 'hapi'
import { Bootstrap } from '../shared/bootstrap'

describe('App', () => {

  before(() => {
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

  it('should call init function', () => {

  })

  it('should call start function', () => {

  })

})
