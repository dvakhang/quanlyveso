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
        {
          data: 'block',
          title: 'Số cây',
          orderable: false,
        },
        {
          data: 'quantity',
          title: 'Số lượng vé',
          orderable: false,
        },
      ],
      distributes: [],
      allowEditAndDeleteDistribute: false

    }
  },

  mounted() {
    this.getAgentCombo()
    this.getDistribute()
  },

  computed: {
    options() {
      let opts = {
        iDisplayLength: 100,
        columns: this.basicColumns,
        data: this.distributes,
      }
      return opts
    },
  },

  methods: {
    getAgentCombo() {
      this.waiting = true
      axios.post('/api/agents1')
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
      this.getDistribute()
    },

    metNewDistribute() {
      this.allowEditAndDeleteDistribute = false
      this.distribute = {
        _id: '',
        type: 'PP',
        block: 0,
        agent: '',
        quantity: 0
      }
    },
  }
})