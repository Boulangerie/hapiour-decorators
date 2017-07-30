import { bootstrapWithOptions } from '../../lib/hapiour'
import { MyApp } from './app'
import { Container } from 'typedi'

bootstrapWithOptions([MyApp], {
  injector: Container
})
