/**
 * Created by tai on 8/25/17.
 */
let DATE_FORMAT = 'YYYY-MM-DD'

window.app = new Vue({
  el: '#app',
  data: function () {
    return {
      waiting: false,
      user: {
        username: '',
        email: '',
        profile: {
          name: '',
          gender: '',
          phone: '',
          location: '',
          website: '',
          about: ''
        },
        oldPass: '',
        newPass: ''
      }
    }
  },

  mounted() {
    this.getUser()
  },

  methods: {
    getUser() {
      this.waiting = true
      axios.post('/api/getLoginUser')
        .then((response) => {
          this.waiting = false
          this.user.username = response.data.username;
          this.user.email = response.data.email;
          this.user.profile.name = response.data.profile.name;
          this.user.profile.about = response.data.profile.about;
          this.user.profile.firstname = response.data.profile.firstname;
          this.user.profile.location = response.data.profile.location;
          this.user.profile.lastname = response.data.profile.lastname;
        })
        .catch((error) => {
          this.waiting = false
          console.log(`export error: `, error)
          cancelMsg(error.message)
        })
    },
    updateUser() {
      this.waiting = true
      axios.post('/api/updateUser', { data: this.user })
        .then((response) => {
          this.waiting = false
          let data = response.data
          this.getUser();
          successMsg('User information was updated')
        })
        .catch((error) => {
          this.waiting = false
          console.log(`export error: `, error)
          cancelMsg(error.message)
        })
    },
    updatePassword() {
      this.waiting = true
      axios.post('/api/updatePassword', { data: this.user })
        .then((response) => {
          this.waiting = false
          successMsg('Password was updated')
          this.getUser();
        })
        .catch((error) => {
          this.waiting = false
          if (error.response.data.code = 'inNotMatch') {
            let errms = error.response.data.validation
            cancelMsg(errms)
          }
        })
    },
  }
})
