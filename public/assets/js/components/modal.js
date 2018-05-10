let Modal = (function() {
  return {
    template: `
      <transition name="modal">
        <div class="modal fade in" tabindex="-1" role="dialog" style="display:block" v-if="selfOpened">
          <div :class="['modal-dialog', 'modal-'+ size]">
            <div class="modal-content">

              <div v-if="header" class="modal-header">
                <slot name="header">
                  default header
                </slot>
              </div>

              <div class="modal-body">
                <slot name="body">
                  default body
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <button type="button" class="btn btn-danger btn-simple" @click="onClose">Close</button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
    `,

    props: {
      opened: Boolean,
      size: String,
      header: {
        type: Boolean,
        default: true
      },
    },

    methods: {
      onClose() {
        this.$emit('close')
        $('.modal-backdrop').remove()
      }
    },

    watch: {
      opened(val) {
        console.log(`watch opened: `, val)
      }
    },

    computed: {
      selfOpened() {
        if (this.opened) {
          $('body').append(`<div class="modal-backdrop fade in"></div>`)
          this.$nextTick(() => {
            $('.modal').removeClass('hidden')
          })
        } else {
          $('.modal-backdrop').remove()
          $('.modal').addClass('hidden')
        }
        return this.opened
      }
    }
  }
}());
