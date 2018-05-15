let vAddagent = (function () {
    const SAVE_AGENT_API = '/api/saveAgent'
    return {
        template: `
        <div class="card">
          <form id="agent" class="form-horizontal">
            <div class="card-content">
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <label class="col-sm-4 label-on-left">Mã Đại Lý</label>
                    <div class="col-sm-8">
                      <div :class="['form-group', 'label-floating']">
                        <label class="control-label"></label>
                        <input type="text" v-model="agent.code" name="code" :disabled="!editAgent" class="form-control" tabindex="1" />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-4 label-on-left">Tên Đại Lý</label>
                    <div class="col-sm-8">
                      <div class="form-group label-floating">
                        <label class="control-label"></label>
                        <input type="text" v-model="agent.name" name="name" class="form-control" required="true" tabindex="3"/>
                        <span class="help-block">{{errors.name.msg}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-4 label-on-left">Website</label>
                    <div class="col-sm-8">
                      <div class="form-group label-floating">
                        <label class="control-label"></label>
                        <input type="text" v-model="agent.website" name="website" class="form-control" tabindex="6"/>
                        <span class="help-block">{{errors.website.msg}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <label class="col-sm-4 label-on-left">Người đại diện</label>
                    <div class="col-sm-8">
                      <div class="form-group label-floating">
                        <label class="control-label"></label>
                        <input type="text" v-model="agent.represent" name="represent" class="form-control" tabindex="2"/>
                        <span class="help-block">{{errors.name.msg}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                        <label class="col-sm-4 label-on-left">Phone</label>
                        <div class="col-sm-8">
                        <div class="form-group label-floating">
                            <label class="control-label"></label>
                            <input type="text" placeholder="Phone" v-model="agent.phone" name="phone" number="true" class="form-control" tabindex="4"/>
                        </div>
                        </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-4 label-on-left">Email</label>
                    <div class="col-sm-8">
                      <div class="form-group label-floating">
                        <label class="control-label"></label>
                        <input type="text" placeholder="Email" v-model="agent.email" name="email" class="form-control" tabindex="7"/>
                        <span class="help-block">{{errors.email.msg}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <label class="col-sm-4 label-on-left">Remark</label>
                    <div class="col-sm-8">
                      <div class="form-group label-floating">
                        <label class="control-label"></label>
                        <textarea type="text" v-model="agent.remark" name="remark" rows="5" class="form-control" tabindex="9"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer text-center">
              <button type="button" @click="metSaveAgent" class="btn btn-success btn-fill">Save</button>
            </div>
          </form>
        </div>
      `,

        props: {
            agent: {
                type: Object,
                default: () => {
                    return {
                        code: '',
                        name: '',
                        address: '',
                        email: '',
                        phone: '',
                        website: '',
                        remark: '',
                        represent: '',
                        parrent: ''
                    }
                }
            },
            editAgent: false
        },

        data() {
            return {
                errors: {
                    code: { msg: '' },
                    name: { msg: '' },
                    website: { msg: '' },
                    represent: { msg: '' },
                    phone: { msg: '' },
                    email: { msg: '' },
                    address: { msg: '' },
                }
            }
        },

        computed: {
            
        },

        mounted() {
            this.$form = $('#agent').validate({
                errorPlacement: function (error, element) {
                    $(element).parent('div').addClass('has-error')
                    window.app.isFormValid = false
                }
            })

        },


        methods: {

            metSaveAgent() {
                axios.post(SAVE_AGENT_API, this.agent)
                    .then((response) => {
                        let c = response.data
                        if (c) {
                            this.agent._id = c._id
                            this.newAgent = false
                            successMsg(`Save was successfully!`)
                        }
                    })
                    .catch(function (error) {
                        let msg = error.message
                        if (error.response.status === 422) {
                            const { errors } = error.response.data
                            this.bindErrors(errors)
                            _.forIn(errors, (val, key) => {
                                $(`#agent input[name=${key}]`).parent('div').addClass('has-error')
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
