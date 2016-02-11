import { HTTP } from 'meteor/http'
import { Meteor } from 'meteor/meteor'

export default class UnsplashService {
  constructor () {
    this.key = Meteor.settings.public.unsplash || '3b28c5415d07e18260e66e9d5bc3f2434c2aa64bed071d52e8c62c3da800612e'
  }

  /**
   * @return [{ url }]
   */
  random () {
    return new Promise((resolve, reject) => {
      HTTP.call(
        'GET',
        `https://api.unsplash.com/photos/?client_id=${this.key}`,
        {},
        (err, photos) => {
          if (err) {
            return reject(err)
          }

          const data = photos.data || []
          return resolve(data.map(this.__procssPhoto))
        })
    })
  }

  /**
   * @return: [{ url }]
   */
  search (query) {
    return new Promise((resolve, reject) => {
      HTTP.call(
        'GET',
        `https://api.unsplash.com/photos/search/?client_id=${this.key}&query=${query}`,
        {},
        (err, photos) => {
          if (err) {
            return reject(err)
          }

          const data = photos.data || []
          return resolve(data.map(this.__procssPhoto))
        })
    })
  }

  /*
  Sample Schema:
  { id: 'oeOhCDP4TJw',
    width: 1667,
    height: 2500,
    color: '#DDD9E1',
    user:
     { id: 'SAzWwBIHQeI',
       username: 'currentcoast',
       name: 'Joshua Davis',
       profile_image: [Object],
       links: [Object] },
    urls:
     { full: 'https://images.unsplash.com/photo-1455132612941-4117e70e4290?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=144787c3970909a2d2417fd4d06f6f62',
       regular: 'https://images.unsplash.com/photo-1455132612941-4117e70e4290?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=1770b00bbd6060322ce3eac9180adb99',
       small: 'https://images.unsplash.com/photo-1455132612941-4117e70e4290?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=6ea09d59243c97fc5f868f149da3d85d',
       thumb: 'https://images.unsplash.com/photo-1455132612941-4117e70e4290?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=cd8e8a2fadefb787f99cc8c3361f31c3' },
    categories: [ [Object], [Object] ],
    links:
     { self: 'https://api.unsplash.com/photos/oeOhCDP4TJw',
       html: 'http://unsplash.com/photos/oeOhCDP4TJw',
       download: 'http://unsplash.com/photos/oeOhCDP4TJw/download' } },
   */
  __procssPhoto (photo) {
    const url = photo.urls.regular || photo.urls.small || photo.urls.full

    return {
      url,
      urls: photo.urls,
      id: photo.id
    }
  }
}
