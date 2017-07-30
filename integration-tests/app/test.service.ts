import { Service } from "typedi";

@Service()
export class TestService {
  test() {
    return 'Tested IoC!'
  }
}



