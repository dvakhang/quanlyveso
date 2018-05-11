let DATE_FORMAT = 'YYYY-MM-DD'
window.app = new Vue({
  el: '#app',
  data: () => {
    return {
      waiting: false,
      agents1: [],
      agents2: [],
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
          data: 'remark',
          title: 'Ghi chú',
          orderable: false,
        }
      ],
      me: {},
      selectedAgent: {},
      selectedAgent2: {}
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

    getAgent2(agent) {
      this.agents2 = [{
        name: 'test'
      }]
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

    },

    metShowEditAgent() {

    },

    metDeleteAgent() {

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

    metShowAgent2Modal(insert) {
      this.showCustomerModal = true
      if (!insert) {
        this.customer = this.selectedCustomer
        this.customer.domain = this.selectedDomain.domain
      } else {
        this.customer = {
          domain: this.selectedDomain.domain,
          company: '',
          website: '',
          name: '',
          phone: '',
          phone2: '',
          email: '',
          email2: '',
          remark: '',
          price: ''
        }
      }
    },
  }
});