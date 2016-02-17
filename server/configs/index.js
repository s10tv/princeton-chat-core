import settings from './settings'
import migrations from './migrations'

export const audience = process.env.AUDIENCE || 'princeton'

export default function (context) {
  settings(context)
  migrations(context)
}
