// parses mimetypes and returns fonticon strings
export default class ContentTypeService {
  static iconForType (contentType) {
    if (/^image/.test(contentType)) {
      return 'insert_photo'
    }

    return 'insert_drive_file'
  }
}
