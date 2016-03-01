import filepicker from 'filepicker-js'

export const imageOptions = {
  mimetype: 'image/*',
  maxSize: 2 * 1024 * 1024, // 2 MB limit
  services: ['FACEBOOK', 'BOX', 'COMPUTER', 'INSTAGRAM', 'URL', 'GOOGLE_DRIVE', 'WEBCAM',
    'DROPBOX', 'GMAIL', 'CONVERT'],
  imageMin: [200, 200],
  imageMax: [1024, 1024],
  cropForce: true,
  cropRatio: 1,
  cropMax: [1024, 1024],
  cropMin: [200, 200],
  conversions: ['crop', 'rotate']
}

export default class FilePickerService {
  static chooseImage (onSuccess) {
    filepicker.pick(imageOptions, (success) => {
      onSuccess(success.url)
    })
  }
}
