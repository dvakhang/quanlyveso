let vCustomer = (function () {
  const SAVE_CUSTOMER_API = '/api/saveCustomer'
  return {
    template: `
      <div class="card">
        <form id="customer" class="form-horizontal">
          <div class="card-content">
            <div class="row">
              <div class="col-md-6">
                <div class="row">
                  <label class="col-sm-2 label-on-left">Domain</label>
                  <div class="col-sm-10">
                    <div :class="['form-group', 'label-floating', {'has-error' : isNotValidDomain }]">
                      <label class="control-label"></label>
                      <input type="text" v-model="customer.domain" name="domain" :disabled="!newDomain" class="form-control" tabindex="1" />
                      <span class="help-block">{{errors.domain.msg}}</span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <label class="col-sm-2 label-on-left">Company</label>
                  <div class="col-sm-10">
                    <div class="form-group label-floating">
                      <label class="control-label"></label>
                      <input type="text" v-model="customer.company" name="company" class="form-control" required="true" tabindex="3"/>
                      <span class="help-block">{{errors.company.msg}}</span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <label class="col-sm-2 label-on-left">Website</label>
                  <div class="col-sm-10">
                    <div class="form-group label-floating">
                      <label class="control-label"></label>
                      <input type="text" v-model="customer.website" name="website" class="form-control" tabindex="6"/>
                      <span class="help-block">{{errors.website.msg}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="row">
                  <label class="col-sm-2 label-on-left">Represent</label>
                  <div class="col-sm-10">
                    <div class="form-group label-floating">
                      <label class="control-label"></label>
                      <input type="text" v-model="customer.name" name="name" class="form-control" tabindex="2"/>
                      <span class="help-block">{{errors.name.msg}}</span>
                    </div>
                  </div>
                </div>
                <div class="row">
                <label class="col-sm-2 label-on-left">Phone</label>
                  <div class="col-sm-5">
                    <div class="form-group label-floating">
                      <label class="control-label"></label>
                      <input type="text" placeholder="Phone 1" v-model="customer.phone" name="phone" number="true" class="form-control" tabindex="4"/>
                    </div>
                  </div>
                  <div class="col-sm-5">
                  <div class="form-group label-floating">
                    <label class="control-label"></label>
                    <input type="text" placeholder="Phone 2" v-model="customer.phone2" name="phone2" number="true" class="form-control" tabindex="5"/>
                  </div>
                </div>
                </div>
                <div class="row">
                  <label class="col-sm-2 label-on-left">Email</label>
                  <div class="col-sm-5">
                    <div class="form-group label-floating">
                      <label class="control-label"></label>
                      <input type="text" placeholder="Email 1" v-model="customer.email" name="email" class="form-control" tabindex="7"/>
                      <span class="help-block">{{errors.email.msg}}</span>
                    </div>
                  </div>
                  <div class="col-sm-5">
                  <div class="form-group label-floating">
                    <label class="control-label"></label>
                    <input type="text" placeholder="Email 2" v-model="customer.email2" name="email2" class="form-control" tabindex="8"/>
                    <span class="help-block">{{errors.email.msg}}</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="row">
                  <label class="col-sm-2 label-on-left">Remark</label>
                  <div class="col-sm-10">
                    <div class="form-group label-floating">
                      <label class="control-label"></label>
                      <textarea type="text" v-model="customer.remark" name="remark" rows="5" class="form-control" tabindex="9"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="row">
                  <label class="col-sm-2 label-on-left">Price</label>
                  <div class="col-sm-10">
                    <div class="form-group label-floating">
                      <label class="control-label"></label>
                      <input type="text" onkeypress='return event.charCode >= 48 && event.charCode <= 57' v-model="customer.price" name="price" number="true" class="form-control" tabindex="10"/>
                      <span class="help-block">{{errors.price.msg}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <button type="button" @click="metSaveCustomer" class="btn btn-success btn-fill">Save</button>
          </div>
        </form>
      </div>
    `,

    props: {
      newDomain: Boolean,
      domainType: String,
      customer: {
        type: Object,
        default: () => {
          return {
            domain: '',
            company: '',
            website: '',
            name: '',
            phone: '',
            phone2: '',
            email: '',
            email2: '',
            remark: '',
            price: 0,
            type: ''
          }
        }
      },
    },

    data() {
      return {
        errors: {
          domain: { msg: '' },
          company: { msg: '' },
          website: { msg: '' },
          name: { msg: '' },
          phone: { msg: '' },
          email: { msg: '' },
          price: { msg: '' },
        }
      }
    },

    computed: {
      isNotValidDomain() {
        if (/[a-zA-Z0-9\-]+(\.(com\.vn|com|net|vn))/.test(this.customer.domain)) {
          this.errors.domain.msg = ''
          return false
        }
        this.errors.domain.msg = `Domain should be valid`
        return true
      }
    },

    mounted() {
      this.$form = $('#customer').validate({
        errorPlacement: function (error, element) {
          $(element).parent('div').addClass('has-error')
          window.app.isFormValid = false
        }
      })

    },


    methods: {
      // metSaveCustomer(){
      //   if(this.newDomain){
      //     let opts = {
      //       type: 'ALL'
      //     }
      //     axios.post('/api/getDistributeDomains', { opts })
      //     .then((response) => {
      //       let dDomains = response.data
      //       console.log('All Domains: ', dDomains)
      //       let dup = false
      //       let domain = {}
      //       dDomains.forEach(function(d) {
      //         if(d.domain == this.customer.domain){
      //             dup = true
      //             domain = d
      //         }
      //       }, this);
      //       if(dup){
      //         warningMsg('This domain was created by ' + domain.saler.username)
      //       }
      //       else{
      //         this.metUpdateCustomer()
      //       }
      //     })
      //   }
      //   else{
      //     this.metUpdateCustomer()
      //   }

      // },

      metSaveCustomer() {
        this.customer.type = this.domainType
        this.customer.newDomain = this.newDomain
        axios.post(SAVE_CUSTOMER_API, this.customer)
          .then((response) => {
            let c = response.data
            if (c) {
              this.customer._id = c._id
              this.newDomain = false
              successMsg(`Customer was saved!`)
            }
          })
          .catch(function (error) {
            let msg = error.message
            if (error.response.status === 422) {
              const { errors } = error.response.data
              this.bindErrors(errors)
              _.forIn(errors, (val, key) => {
                $(`#customer input[name=${key}]`).parent('div').addClass('has-error')
              })
            } else {
              warningMsg(error.response.data.message)
            }
          }.bind(this))
      },

      bindErrors(errors) {
        _.assign(this.errors, errors)
      }
    },
  }
}())
