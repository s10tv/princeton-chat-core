Template.link_services.rendered = () => {
  Session.set('type', undefined);
}

Template.myphotos.helpers({
  services: () => {
    const flattenedServices = [];
    if (Meteor.user().services) {
      _.each(Meteor.user().services, (service, key) => {
        const s = _.clone(service)
        s.serviceName = key;
        flattenedServices.push(s)
      })
    }
    return flattenedServices
  },

  renderPhoto: function () {
    switch (this.serviceName) {
      case 'facebook':
        return `https://graph.facebook.com/${this.id}/picture?type=large`;
      case 'instagram':
        return this.profile_picture;
    }
  }
})

Template.myphotos.events({
  // 'click .avatar-service': (event) => {
  //   event.preventDefault();
  //   const serviceName = $(event.target).closest('.avatar').data('service')
  //   if (confirm('change this to avtar?')) {
  //     Meteor.call('avatar/update', serviceName)
  //   }
  // }
})

Template.link_services.helpers({
  facebookid: () => {
    return (Meteor.user().services.facebook != undefined) ? 'facebook-linked' : 'facebook';
  },
  isFacebookLinked: () => {
    return (Meteor.user().services.facebook != undefined) ? 'linked' : '';
  },
  instagramId: () => {
    return (Meteor.user().services.instagram != undefined) ? 'instagram-linked' : 'instagram';
  },
  isInstagramLinked: () => {
    return (Meteor.user().services.instagram != undefined) ? 'linked' : '';
  },
})

Template.link_services.events({
  'click #facebook': (event) => {
    event.preventDefault();
    Meteor.linkWithFacebook({}, (err) => {
      if (err) {
        console.log(err);
      }

      Meteor.call('avatar/update', 'facebook');
    });
  },

  'click #instagram': (event) => {
    event.preventDefault();
    Meteor.linkWithInstagram({}, (err) => {
      if (err) {
        console.log(err);
      }

      Meteor.call('avatar/update', 'instagram');
    });
  },

  'click .linked': (event) => {
    event.preventDefault();
    const service = $(event.target).data('service');

    if (confirm ('sure?')) {
      switch (service) {
        case 'facebook':
          Meteor.call('_accounts/unlink/service', 'facebook');
          return;

        case 'instagram':
          Meteor.call('_accounts/unlink/service', 'instagram');
      }
    }
  },
})
