/**
 * Created by tin on 8/25/17.
 */
let DATE_FORMAT = 'DD/MM/YYYY'
window.app = new Vue({
  el: '#app',
  data: function() {
    return {
      waiting: false,
      columns: [{
          title: 'ID',
          data: '_id',
          visible: false
        },
        {
          title: 'Họ & Tên',
          data: 'profile.name'
        },
        {
          title: 'Email',
          data: 'email'
        },
        {
          title: 'Role',
          data: 'role'
        },
        {
          title: 'Giới Tính',
          data: 'profile.gender'
        },
        {
          title: 'Số Điện Thoại',
          data: 'profile.phone'
        },
        {
          title: 'Địa Chỉ',
          data: 'profile.location'
        },
        {
          title: 'Website',
          data: 'profile.website'
        },
      ],
      selectedAll: false,
      selectedIDs: [],
      totalCount: 0,
      user: {
        _id: '',
        username: '',
        password: '',
        email: '',
        profile: {
          name: '',
          gender: 'Male',
          phone: '',
          location: '',
          website: ''
        },
        role: 'USER',
        activeFlag: true,
        domains: []
      },
      roles: [],
      optionsRadios: '',
      isNewUser: false,
      moveDomainToUser: false,
      users: [],
      showMoveDomains: false,
    }
  },

  computed: {
    isAdmin() {
      return this.user.username === 'admin' || this.user.isAdmin || this.user.role === 'ADMIN'
    },

    options() {
      let opts = {
        iDisplayLength: 1000,
        columns: this.columns,
        data: this.users,
      }
      return opts
    },
  },

  components: {
    Modal,
  },

  mounted() {
    this.metGetRoles()
    // this.initDatatable()
    this.getUsers()
  },

  methods: {
    getUsers() {
      this.waiting = true
      axios.post('/api/users', { search: '' })
        .then((response) => {
          this.waiting = false
          this.users = response.data
          initDatatable(this.options, this.onRowClick)
        })
    },

    onRowClick(index, user) {
      this.user = _.cloneDeep(user)
      this.user.password = ""
      this.isNewUser = false
      this.showMoveDomains = this.user.role === "SALE"
    },

    onFromDateChange(val) {
      console.log(`onFromDateChange: `, val)
    },

    onSelectAllChange() {
      let rows = this.$datatable.rows({
        'search': 'applied'
      }).nodes()
      $('input[type="checkbox"]', rows).prop('checked', this.selectedAll)
    },

    clearAll() {
      confirmDelete((done) => {
        this.waiting = true
        axios
          .delete('/api/dbresult')
          .then(() => {
            this.waiting = false
            successMsg('All data were removed success fully')
            this.$datatable.ajax.reload(null, false)
            done()
          })
          .catch((err) => {
            this.waiting = false
            swal(
              'Cancelled',
              `Error occurred: ${err.message}`,
              'error'
            )
          })
      })
    },

    deleteSelected() {
      this.selectedIDs = []
      this.$datatable.$('input[type="checkbox"]').each((idx, elm) => {
        // If checkbox doesn't exist in DOM
        if ($(elm).prop('checked')) {
          this.selectedIDs.push($(elm).prop('value'))
        }
      })
      if (this.selectedIDs.length > 0) {
        confirmDelete((done) => {
          this.waiting = true
          axios
            .post('/api/dbresult-delete', {
              ids: this.selectedIDs
            })
            .then(() => {
              this.waiting = false
              this.$datatable.ajax.reload(null, false)
              done()
            })
            .catch((err) => {
              this.waiting = false
              swal(
                'Cancelled',
                `Error occurred: ${err.message}`,
                'error'
              )
            })
        })
      } else {
        warningMsg(`Please select domain to delete`)
      }
    },

    deleteUser() {
      window.location.href = `/user/${this.user._id}/moveDomains`
    },

    finalDeleteUser() {
      confirmDelete((done) => {
        let params = {
          user: this.user
        }
      })
    },

    onCloseDeleteUser() {
      this.moveDomainToUser = false
      $('.modal-backdrop').remove()
    },

    metClearFrom() {
      $("#username").removeAttr("style")
      this.isNewUser = true
      Object.keys(this.user).forEach(k => {
        if (k === 'profile') {
          Object.keys(this.user[k]).forEach(pk => {
            this.user[k][pk] = ''
            if (pk === 'gender') {
              this.user[k][pk] = 'Male'
            }
          })
        } else {
          if (k != 'domains')
            this.user[k] = ''
        }
      })
      this.user.activeFlag = true
    },

    metSaveUser() {
      confirmSave((done) => {
        this.waiting = true
        axios
          .post('/api/users-add', this.user)
          .then(() => {
            this.waiting = false
            this.isNewUser = false
            this.getUsers()
            done(`User was saved!!`)
          })
          .catch((err) => {
            this.waiting = false
            let mess = ''
            if (err.response.data.code == 'DuplicateKey') {
              mess = `Duplicate UserName of Email`
            } else if (err.response.data.code = 'validate') {
              let errda = err.response.data.validation
              errda.forEach((c) => {
                mess += `${c.msg} <br>`
              });
            } else {
              mess = err.response.data.message
            }
            swal(
              `${mess}`,
              `Save Failed !`,
            )
          })
      })
    },

    metDisableUser() {
      this.user.activeFlag = false
      this.metSaveUser()
    },

    metEnableUser() {
      this.user.activeFlag = true
      this.metSaveUser()
    },

    metGetRoles() {
      this.waiting = true
      axios.get('/api/roles').then((response) => {
        this.waiting = false
        this.roles = response.data
      })
    },

    showMoveDomains() {

    }
  }
})
