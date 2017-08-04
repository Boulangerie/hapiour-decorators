import { Service } from 'typedi'

@Service()
export class InjectedService {

  public isInjected() {
    return true
  }

}
