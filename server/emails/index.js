import princetonEmails from './princeton'
import pedEmails from './ped'

let emails = {}
switch (process.env.AUDIENCE) {
  case 'ped':
    emails = pedEmails
    break
  case 'princeton': // fallthrough intentional
  default:
    emails = princetonEmails
}

export default emails
