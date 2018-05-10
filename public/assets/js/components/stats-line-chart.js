let StatsLineChart = (function() {
  let DATE_FORMAT = 'YYYY-MM-DD'
  return {
    template: `
      <div class="card">
        <div :data-background-color="headerColor" class="card-header card-header-icon"><i :class="['fa', 'fa-2x', 'fa-' + icon]"></i></div>
        <div class="card-content">
          <h4 class="card-title">
            {{title}}
            <small> 
              - From
              <input :id="chartId + 'From'" type="text" style="width:0px;margin:0;padding:0;border:none" :value="fromDt" class="datepicker" />
              <span class="text-info" @click="fromDtClick">{{fromDt}} </span>
            </small>
            <small>
              to
              <input :id="chartId + 'To'" type="text" style="width:0px;margin:0;padding:0;border:none" :value="toDt" class="datepicker" />
              <span class="text-info" @click="toDtClick">{{toDt}}</span>
            </small>
          </h4>
        </div>
        <div :id="chartId" class="ct-chart"></div>
      </div>
    `,

    props: {
      chartId: String,
      title: String,
      uri: String,
      headerColor: {
        type: String,
        default: 'blue'
      },
      icon: {
        type: String,
        default: 'timeline'
      },
      legend: {
        type: Boolean,
        default: true,
      },
      type: String, // {D|P|S|I|C}
    },

    data() {
      return {
        from: '',
        to: '',
        chart: null,
        chartData: {
          labels: [],
          seriers: [],
          colors: [],
          max: 0,
        }
      }
    },

    computed: {
      fromDt() {
        return moment(this.from).format(DATE_FORMAT)
      },

      toDt() {
        return moment(this.to).format(DATE_FORMAT)
      },

      dates() {
        let dates = []
        let diff = this.to.diff(this.from, 'days')
        dates.push(`${this.from.format("YYYY-MM-DD")}`)
        for (let i = 1; i <= diff; i++) {
          let nextDay = moment(this.from).add(i, 'days')
          dates.push(`${nextDay.format("YYYY-MM-DD")}`)
        }
        return dates
      },

      options() {
        const opts = {
          data: this.chartData,
          options: {
            lineSmooth: Chartist.Interpolation.cardinal({
              tension: 10
            }),
            axisY: {
              showGrid: true,
              offset: 40
            },
            axisX: {
              showGrid: true,
            },
            low: 0,
            high: this.chartData.max,
            showPoint: true,
            height: '300px',
            fullWidth: true,
          },
        }
        if (this.legend) {
          opts.options.plugins = [
            Chartist.plugins.legend({
              legendNames: this.chartData.legendNames,
            })
          ]
        }
        return opts
      }
    },

    created() {
      this.from = moment().add(-30, "days")
      this.to = moment()
    },

    mounted() {
      this.initDate()
      this.getChartData().then(() => {
        if (this.chart) {
          this.chart.update(this.chartData)
        } else {
          this.initChart()
        }
      })
    },

    methods: {
      initChart() {
        this.chart = new Chartist.Line(`#${this.chartId}`, this.options.data, this.options.options)
        md.startAnimationForLineChart(this.chart)
        return this.chart
      },

      getChartData() {
        if (!this.uri || !this.type) return Promise.resolve([])
        return axios.post(this.uri, { type: this.type, dates: this.dates })
          .then((response) => {
            // console.log(`getChartData [${this.type}] > `, response.data)
            this.chartData = response.data
            return this.chartData
          })
          .catch((error) => {
            console.log(`error: `, error)
          })
      },

      fromDtClick() {
        $(`#${this.chartId}From`).show().focus()
      },

      toDtClick() {
        $(`#${this.chartId}To`).show().focus()
      },

      emitDateChange() {
        if (!!this.uri) {
          this.getChartData().then(() => {
            if (this.chart) {
              this.chart.update(this.chartData)
            } else {
              this.initChart()
            }
          })
        }
        this.$emit('onDateChange', {
          from: this.from,
          to: this.to,
          dates: this.dates,
        })
      },

      initDate() {
        $('.datepicker').datetimepicker({
          format: DATE_FORMAT,
          icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove',
            inline: true
          }
        }).on('dp.change', (ev) => {
          if (ev.currentTarget.id == `${this.chartId}From`) {
            let fromDt = ev.date.format(DATE_FORMAT)
            this.from = moment(fromDt, DATE_FORMAT)
            this.emitDateChange()
          } else if (ev.currentTarget.id == `${this.chartId}To`) {
            let toDt = ev.date.format(DATE_FORMAT)
            this.to = moment(toDt, DATE_FORMAT)
            this.emitDateChange()
          }
        })
      }
    },
  }
}());
