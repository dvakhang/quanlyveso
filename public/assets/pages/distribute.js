
window.app = new Vue({
    el: '#app',
    data: () => {
        return {
            types: [{ name: 'Phân phối', value: 'PP' }, { name: 'Trả vé', value: 'TV' }],
            distribute: {
                type: 'PP',
                block: 0,
                agent: '',
                quantity: 0
            },
            agents: [],
            agent: '',
            waiting: false,
            basicColumns: [
                {
                    data: 'agent.name',
                    title: 'Tên đại lý',
                    orderable: false,
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
                    if (this.distributes.length > 0) {
                        initDatatable(this.options, this.onRowClick, '#datatables')
                    }else{
                        this.distributes = []
                    }
                })
        },

        onRowClick(index, dtbute) {
            if (dtbute) {
                this.allowEditAndDeleteDistribute = true
                this.distribute = dtbute
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
        }
    }
})
