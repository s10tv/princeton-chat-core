import { HTTP } from 'meteor/http'
import { Meteor } from 'meteor/meteor'

export default class UnsplashService {
  constructor () {
    this.key = Meteor.settings.public.unsplashKey || '3b28c5415d07e18260e66e9d5bc3f2434c2aa64bed071d52e8c62c3da800612e'
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

export const UnsplashDefaultCoverPhotos = [{
  'url': 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=b8fe9965ce34f0bdb257b2d27268db53',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=93554fdd92a1a53e9dd8509a9b75ae53',
    'regular': 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=b8fe9965ce34f0bdb257b2d27268db53',
    'small': 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=4b065e0db1c668794a3b060d89eb5733',
    'thumb': 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=3b91e903d6edc8b87da40cd8d051c53f'
  },
  'id': 'NbXjZomyNEM'
}, {
  'url': 'https://images.unsplash.com/photo-1432139438709-ee8369449944?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=9e937f00fe7e99ed0b06102be476c98c',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1432139438709-ee8369449944?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=d5a8975312e7ac0195b1d728614c470e',
    'regular': 'https://images.unsplash.com/photo-1432139438709-ee8369449944?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=9e937f00fe7e99ed0b06102be476c98c',
    'small': 'https://images.unsplash.com/photo-1432139438709-ee8369449944?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=578aaf601cee0306e54dac607063edd0',
    'thumb': 'https://images.unsplash.com/photo-1432139438709-ee8369449944?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=32e962a4a92e4eee53fa58ff722614c3'
  },
  'id': 'wiTWDYLURr8'
}, {
  'url': 'https://images.unsplash.com/photo-1453831362806-3d5577f014a4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=a66d195cf88523bb351e921b6e61aadc',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1453831362806-3d5577f014a4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=b77fd9ceb330af47cea0627d0ef37612',
    'regular': 'https://images.unsplash.com/photo-1453831362806-3d5577f014a4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=a66d195cf88523bb351e921b6e61aadc',
    'small': 'https://images.unsplash.com/photo-1453831362806-3d5577f014a4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=acd7eaf9897dffd29814cf59f207fb85',
    'thumb': 'https://images.unsplash.com/photo-1453831362806-3d5577f014a4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=fb255ceeaa5a0477601759a5a5a8f621'
  },
  'id': 'Pt_YmiYm7a4'
}, {
  'url': 'https://images.unsplash.com/photo-1453763947087-76c944eaed1f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=b2c207bd3b99b4142982d4221ac046b2',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1453763947087-76c944eaed1f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=2db28ee59e8e63fdd23aa69db95d9ab4',
    'regular': 'https://images.unsplash.com/photo-1453763947087-76c944eaed1f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=b2c207bd3b99b4142982d4221ac046b2',
    'small': 'https://images.unsplash.com/photo-1453763947087-76c944eaed1f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=758a9d19452a0c3a2c5cd8e72fdb31e0',
    'thumb': 'https://images.unsplash.com/photo-1453763947087-76c944eaed1f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=fee72926e23fa7af842b1f99c77f07c9'
  },
  'id': 'Bm-lpw4AUhE'
}, {
  'url': 'https://images.unsplash.com/photo-1454471560658-abce7ddba75c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=fb7b2ab3f4a2688f4cdd4a08244b2cc1',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1454471560658-abce7ddba75c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=a74096b8ddb20bdc00f5c13f3bb355c1',
    'regular': 'https://images.unsplash.com/photo-1454471560658-abce7ddba75c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=fb7b2ab3f4a2688f4cdd4a08244b2cc1',
    'small': 'https://images.unsplash.com/photo-1454471560658-abce7ddba75c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=5084adffd90fef4769c0526639b9656d',
    'thumb': 'https://images.unsplash.com/photo-1454471560658-abce7ddba75c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=b9c90b94c9da518217997b1a3ae641bf'
  },
  'id': 'LhAGg4Cwu6w'
}, {
  'url': 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=a4274272998d1a08bbbf554ead8c7a52',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=9bd244971b9cb52a8418cf2f66fce464',
    'regular': 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=a4274272998d1a08bbbf554ead8c7a52',
    'small': 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=26086f719971460d3adfdc55696fa655',
    'thumb': 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=9e6dd5944da05dbc12d2a24c57fb12af'
  },
  'id': 'y3aP9oo9Pjc'
}, {
  'url': 'https://images.unsplash.com/photo-1427025635812-0a30f21071e4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=1b6028e4dd8626b0df4629849d85f451',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1427025635812-0a30f21071e4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=4cc3196c14ac3cc807dcfc255b838785',
    'regular': 'https://images.unsplash.com/photo-1427025635812-0a30f21071e4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=1b6028e4dd8626b0df4629849d85f451',
    'small': 'https://images.unsplash.com/photo-1427025635812-0a30f21071e4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=8b9924d0f4703d644f05158e3c7ab0e2',
    'thumb': 'https://images.unsplash.com/photo-1427025635812-0a30f21071e4?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=c67b8edf3adcff923157cbd0e42a7ed5'
  },
  'id': 'Py0QLFEAagY'
}, {
  'url': 'https://images.unsplash.com/photo-1429012178110-d7a734a56176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=060e77f7bbbcde89c3910c0321f14e81',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1429012178110-d7a734a56176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=f8fa219b5d9cd54f2b0ebd955d9a2bf9',
    'regular': 'https://images.unsplash.com/photo-1429012178110-d7a734a56176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=060e77f7bbbcde89c3910c0321f14e81',
    'small': 'https://images.unsplash.com/photo-1429012178110-d7a734a56176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=fabda506814e343b321c8c259dfa1d1f',
    'thumb': 'https://images.unsplash.com/photo-1429012178110-d7a734a56176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=d95f15f606df8885443c00967f4db0c9'
  },
  'id': 'l5I9L6hu64A'
}, {
  'url': 'https://images.unsplash.com/photo-1430163393927-3dab9af7ea38?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=b3a07159da0b18fc00a7948fc497d94a',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1430163393927-3dab9af7ea38?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=39d0f19d6c35644708e8f4368620aba7',
    'regular': 'https://images.unsplash.com/photo-1430163393927-3dab9af7ea38?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=b3a07159da0b18fc00a7948fc497d94a',
    'small': 'https://images.unsplash.com/photo-1430163393927-3dab9af7ea38?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=8c4a5820c1f3397c018f71dbd0531d95',
    'thumb': 'https://images.unsplash.com/photo-1430163393927-3dab9af7ea38?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=9bf962da459f392a9d53e007dd656c83'
  },
  'id': 'TTrJMhrkoeY'
}, {
  'url': 'https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=5fdbe7e885e1b5d667393a83cf167aed',
  'urls': {
    'full': 'https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=10c6e7de2acb2838e44c017f6af44bbb',
    'regular': 'https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=5fdbe7e885e1b5d667393a83cf167aed',
    'small': 'https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=400&fit=max&s=e7dc82a4c4732d05ee6964b5bfb2eb18',
    'thumb': 'https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=200&fit=max&s=14043713fd84ad349df40c919ce04ba9'
  },
  'id': 'auIbTAcSH6E'
}]

export const GenericCoverPhoto = {
  url: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?crop=entropy&dpr=2&fit=crop&fm=jpg&h=825&ixjsv=2.1.0&ixlib=rb-0.3.5&q=50&w=1450'
}
