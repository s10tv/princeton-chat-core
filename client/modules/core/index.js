import methodStubs from './configs/method_stubs'
import actions from './actions'
import routes from './routes.jsx'
import {formConfig as settingsFormConfig} from './containers/settings.js'

export default {
  formConfigs: [settingsFormConfig],
  routes,
  actions,
  load (context) {
    methodStubs(context)
  }
}
