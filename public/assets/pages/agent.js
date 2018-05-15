let DATE_FORMAT = 'YYYY-MM-DD'
window.app = new Vue({
  el: '#app',
  data: () => {
    return {
      waiting: false,
      agents1: [],
      agents2: [],
      agent: {
        code: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        website: '',
        remark: '',
        represent: '',
        parrent: ''
      },
      agentType: '',
      allowModify: false,
      allowEditAndDeleteDomain: false,
      allowEditAndDelete: false,
      basicColumns: [{
        data: 'code',
        title: 'Mã Đại Lý',
        orderable: false,
      },
      {
        data: 'name',
        title: 'Tên Đại Lý',
        orderable: false,
      },
      {
        data: 'address',
        title: 'Địa chỉ',
        orderable: false,
      },
      {
        data: 'phone',
        title: 'SĐT',
        orderable: false,
      },
      {
        data: 'remark',
        title: 'Ghi chú',
        orderable: false,
      }
      ],
      me: {},
      selectedAgent: {},
      selectedAgent2: {},
      showAgentModal: false,
      showAddAgent: false,
      editAgent: false
    }
  },

  computed: {
    options() {
      let opts = {
        iDisplayLength: 100,
        columns: this.basicColumns,
        data: this.agents1,
      }
      return opts
    },

    showContacts() {
      return this.agents2.length > 0
    },

    showControlButtons() {
      return this.allowModify
    }
  },

  components: {
    Modal,
    vAddagent,
  },

  mounted() {
    getMe().then((me) => {
      this.me = me
    })

    this.getAgent1Domains()
  },

  methods: {
    getAgent1Domains() {
      this.waiting = true
      axios.post('/api/agents1')
        .then((response) => {
          this.waiting = false
          this.agents1 = response.data
          initDatatable(this.options, this.onRowClick, '#datatables')
        })
    },

    onRowClick(index, agent) {
      if (agent) {
        this.allowEditAndDeleteDomain = true
        this.selectedAgent = agent
        this.getAgent2(agent)
        if (index !== -1) {
          this.allowModify = true
        }
      }
    },

    metShowEditAgent() {
      this.editAgent = true
      this.showAgentModal = true
      this.agent = this.selectedAgent
    },

    getAgent2(agent) {
      this.waiting = true
      this.allowEditAndDelete = false
      axios.post('/api/agents2', {
        parrent: this.selectedAgent.code
      }).then((response) => {
        this.waiting = false
        this.agents2 = response.data
      })
    },

    onRowDblClick(index, domain) {
      this.onRowClick(index, domain)
      let $pc = $("#panel-customer")
      if ($pc.hasClass("off")) {
        $pc.removeClass("off")
      }
      if ($pc.hasClass("open")) {
        $pc.removeClass("open")
      }

      $pc.addClass("open")
    },

    metAddAgent() {
      this.editAgent = false
      this.showAddAgent = true
      this.agent = {
        code: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        website: '',
        remark: '',
        represent: '',
        parrent: '0'
      }
    },

    metDeleteAgent() {
      confirmDelete((done) => {
        let params = {
          code: this.selectedAgent.code,
        }
        this.waiting = true
        axios.delete('/api/deleteAgent', {
          params: params
        })
          .then(() => {
            this.waiting = false
            this.getAgent1Domains()
            done()
          })
          .catch((error) => {
            this.waiting = false
            errorMsg(error.message)
          })
      })
    },

    metDeleteAgent2() {
      confirmDelete((done) => {
        let params = {
          code: this.selectedAgent2.code,
        }
        this.waiting = true
        axios.delete('/api/deleteAgent', {
          params: params
        })
          .then(() => {
            this.waiting = false
            this.getAgent1Domains()
            done()
          })
          .catch((error) => {
            this.waiting = false
            errorMsg(error.message)
          })
      })
    },

    closeAgent2() {
      let $pc = $("#panel-customer")
      $pc.removeClass("open").addClass("off")
    },

    saveRemark() {

    },

    onAgent2Select(agent) {
      this.selectedAgent2 = agent
      $('.customers tbody tr.selected').removeClass('selected')
      $(`.${agent._id}`).addClass('selected')
      this.allowEditAndDelete = true
    },

    metShowAgentModal(insert) {
      if (!insert) {
        this.showAgentModal = true
        this.agent = this.selectedAgent2
        this.editAgent = true
      } else {
        this.showAddAgent = true
        this.editAgent = false
        this.agent = {
          code: '',
          name: '',
          address: '',
          email: '',
          phone: '',
          website: '',
          remark: '',
          represent: '',
          parrent: this.selectedAgent.code
        }
      }
    },

    onAgentModalClose() {
      this.showAgentModal = false
      this.showAddAgent = false
      this.getAgent1Domains()
    },

    onCloseAddAgent() {
      this.showAgentModal = false
      this.showAddAgent = false
      this.getAgent1Domains()
    }
  }
});