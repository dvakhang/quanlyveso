window.app = new Vue({
    el: '#app',
    data: () => {
        return {
            waiting: false,
            settingData: {
                BLOCK_DEFINE: ''
            }
        }
    },

    mounted(){
        this.getSetting()
    },

    methods: {
        metSaveSetting() {
            if (this.isValidForm()) {
                this.waiting = true
                axios.post('/api/metSaveSetting', { data: this.settingData })
                    .then((response) => {
                        this.waiting = false
                        successMsg(`Update Sucessfully`)
                    })
                    .catch((error) => {
                        this.waiting = false
                        console.log(`export error: `, error)
                        cancelMsg(error.message)
                    })
            }
        },

        isValidForm() {
            if (this.settingData.BLOCK_DEFINE) {
                return true;
            }
            return false;
        },

        getSetting() {
            this.waiting = true
            axios.get('/api/getSetting')
              .then((response) => {
                this.waiting = false
                this.settingData = response.data;
              })
              .catch((error) => {
                this.waiting = false
                console.log(`getSetting error: `, error)
              })
          },
    }
});