import randomColor from 'randomcolor'

export default class AvatarService {
  static generateRandPrincetonAvatarSrc () {
    const NUM_AVATARS = 8
    const randNumber = Math.floor((Math.random() * NUM_AVATARS) + 1)

    return `/images/avatars/princeton${randNumber}.png`
  }

  static generateDefaultAvatarForAudience (audience) {
    switch (audience) {
      case 'princeton':
        return this.generateRandPrincetonAvatarSrc()

      case 's10':
        return '/images/avatar-placeholder.png'

      default:
        return '/images/avatar-placeholder.png'
    }
  }

  static generateRandomColorForDefaultAvatar () {
    return randomColor({luminosity: 'dark'})
  }
}
