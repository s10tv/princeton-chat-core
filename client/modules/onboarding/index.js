import methodStubs from './configs/method_stubs'
import actions from './actions'
import routes from './routes.jsx'
import {formConfig as homeForm} from './containers/home'

export default {
  formConfigs: [homeForm],
  routes,
  actions,
  load(context) {
    methodStubs(context)
  }
}
