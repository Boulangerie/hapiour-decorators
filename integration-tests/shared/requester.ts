import * as _ from 'lodash'
import * as Promise from 'bluebird'
import * as Request from 'request'
import * as winston from 'winston'

export class Requester {

  private baseUrl: string
  private defaultConfig: any
  private logger: any

  public constructor(baseUrl: string, headers?: any) {
    this.baseUrl = baseUrl
    this.defaultConfig = {
      'headers': _.extend({}, headers),
      'json': true,
      'simple': true,
      'qs': {}
    }
    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          'level': 'debug'
        })
      ]
    })
  }

  public request(config: any): Promise<any> {
    let options = this.getConfig(config)
    return Promise
      .fromCallback((callback) => {
        Request(options, callback)
      })
      .then((res) => {
        this.logger.log('silly', JSON.stringify(options, null, 2))
        this.logger.log('silly', JSON.stringify(res, null, 2))
        return res.toJSON()
      })
      .catch((error) => {
        this.logger.error(this.parseError(error))
        this.logger.debug(JSON.stringify(options))
      })
  }

  private getConfig(options: any): any {
    let config = _.merge({}, this.defaultConfig, {
      'method': options.method || 'GET',
      'url': this.baseUrl,
      'headers': options.headers
    })
    if (!_.isEmpty(options.url)) {
      config.url += _.clone(options.url)
    }
    if (!_.isEmpty(options.data)) {
      config.body = _.clone(options.data)
    }
    if (!_.isEmpty(options.filter)) {
      config.qs.filter = JSON.stringify(options.filter)
    }
    if (!_.isEmpty(options.include)) {
      config.qs.include = _.clone(options.include)
    }
    return config
  }

  private parseError(error: any): any {
    return error
  }
}
