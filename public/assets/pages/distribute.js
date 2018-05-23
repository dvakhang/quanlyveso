window.app = new Vue({
  el: '#app',
  data: () => {
    return {
      types: [{ name: 'Phân phối', value: 'PP' }, { name: 'Trả vé', value: 'TV' }],
      distribute: {
        _id: '',
        type: 'PP',
        block: 0,
        agent: '',
        quantity: 0,
        place: ''
      },
      agents: [],
      agent: '',
      waiting: false,
      basicColumns: [{
          data: 'agent',
          title: 'Tên đại lý',
          orderable: false,
          render(data) {
            if (data) {
              return data.name
            }
          }
        },
        {
          data: 'createdDt',
          title: 'Ngày tạo',
          orderable: false,
          sortable: true,
        },
        {
          data: 'agent',
          title: 'Người đại diện',
          orderable: false,
          render(data) {
            if (data) {
              return data.represent
            }
          }
        },
        {
          data: 'agent',
          title: 'Số điện thoại',
          orderable: false,
          render(data) {
            if (data) {
              return data.phone
            }
          }
        }
      ],
      distributeColumn: {
        data: 'block',
        title: 'Số cây',
        orderable: false,
      },
      quanlityColumn: {
        data: 'quantity',
        title: 'Số lượng vé',
        orderable: false
      },
      placeColumn: {
        data: 'place',
        title: 'Điểm trả vé',
        orderable: false,
        render(data) {
          if (data) {
            return data
          }else{
            return ""
          }
        }
      },
      distributes: [],
      allowEditAndDeleteDistribute: false,
      distributeType: true

    }
  },

  mounted() {
    this.getAgentCombo()
    this.getDistribute()
  },

  computed: {
    columns() {
      if (this.distributeType) {
        return this.basicColumns.concat([this.distributeColumn]).concat([this.quanlityColumn])
      } else {
        return this.basicColumns.concat([this.quanlityColumn]).concat([this.placeColumn])
      }
    },

    options() {
      let opts = {
        iDisplayLength: 100,
        columns: this.columns,
        data: this.distributes,
        columnDefs: [{
          orderable: false,
          targets: [0],
          sortable: false,
        }]
      }
      return opts
    },
  },

  methods: {
    getAgentCombo() {
      this.waiting = true
      let URL = ''
      if (this.distribute.type == 'PP') {
        URL = '/api/agents1'
      } else {
        URL = '/api/getAgents2Combo'
      }
      axios.post(URL)
        .then((response) => {
          this.waiting = false
          this.agents = response.data
        })
    },

    getDistribute() {
      this.waiting = true
      axios.post('/api/getDistribute', {
          type: this.distribute.type
        })
        .then((response) => {
          this.waiting = false
          this.distributes = response.data
          initDatatable(this.options, this.onRowClick)
        })
    },

    onRowClick(index, dtbute) {
      if (dtbute) {
        this.allowEditAndDeleteDistribute = true
        this.distribute = _.cloneDeep(dtbute)
        this.distribute.agent = this.distribute.agent._id
      }
    },

    metSaveDistribute() {
      this.waiting = true
      axios.post('/api/saveDistribute', {
          distribute: this.distribute
        })
        .then((response) => {
          this.waiting = false
          this.getDistribute()
        }).catch((err) => {
          this.waiting = false
          let mess = ''
          if (err.response.data.code = 'validate') {
            let errda = err.response.data.validation
            mess += `${errda} <br>`
          } else {
            mess = err.response.data.message
          }
          swal(
            `${mess}`,
            `Save Failed !`,
          )
        })
    },

    metChangeType() {
      if (this.distribute.type == 'PP') {
        this.distributeType = true
      } else {
        this.distributeType = false
      }
      this.getAgentCombo()
      this.getDistribute()
    },

    metNewDistribute() {
      this.allowEditAndDeleteDistribute = false
      this.distribute = {
        _id: '',
        type: this.distribute.type,
        block: 0,
        agent: '',
        quantity: 0
      }
    },

    metDeleteDistribute() {
      confirmDelete((done) => {
        let params = {
          id: this.distribute._id,
        }
        this.waiting = true
        axios.delete('/api/deleteDistribute', {
            params: params
          })
          .then(() => {
            this.waiting = false
            this.getDistribute()
            done()
          })
          .catch((error) => {
            this.waiting = false
            errorMsg(error.message)
          })
      })
    }
  }
})