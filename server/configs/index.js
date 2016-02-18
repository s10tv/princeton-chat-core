import settings from './settings'
import migrations from './migrations'

export default function (context) {
  settings(context)
  migrations(context)
}
