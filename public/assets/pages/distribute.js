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
        quantity: 0
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
      createDateColumn: {
        data: 'createdDt',
        title: 'Ngày tạo',
        orderable: false,
        sortable: true,
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
        return this.basicColumns.concat([this.createDateColumn]).concat([this.distributeColumn]).concat([this.quanlityColumn])
      } else {
        return this.basicColumns.concat([this.createDateColumn]).concat([this.quanlityColumn])
      }
    },

    options() {
      let opts = {
        iDisplayLength: 100,
        columns: this.columns,
        data: this.distributes,
        columnDefs: [{
          orderable: false, 
          targets: [ 0 ] ,
          sortable: false,
        }]
      }
      return opts
    },
  },

  methods: {
    getAgentCombo() {
      this.waiting = true
      axios.post('/api/getAgentsCombo')
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
        })
    },

    metChangeType() {
      if (this.distribute.type == 'PP') {
        this.distributeType = true
      } else {
        this.distributeType = false
      }
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

    metDeleteDistribute(){
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