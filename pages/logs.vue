<template>
  <div class="mx-auto text-right">
    <div v-if="chartWidth" class="section create-section mb-4 mt-5">
      <div class="section-title">
        <h2>نمودار مقایسه مجموعه‌ها</h2>
        <div class="row">
          <div class="col-lg-6 col-md-12">
            <div class="row">
              <div class="col-md-2 col-sm-4 my-1">نمودار</div>
              <div class="col-md-4 col-sm-8 my-1">
                <b-form-select v-model="chartType" :options="chartTypePptions"></b-form-select>
              </div>
              <div class="col-md-2 col-sm-4 my-1">براساس</div>
              <div class="col-md-4 col-sm-8 my-1">
                <b-form-select v-model="chartValue" :options="chartValueOptions"></b-form-select>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-12">
            <div class="row">
              <div class="col-md-2 col-sm-4 my-1">از تاریخ</div>
              <div class="col-md-4 col-sm-8 my-1">
                <date-picker v-model="dateFrom" @change="updateList"></date-picker>
              </div>
              <div class="col-md-2 col-sm-4 my-1">تا تاریخ</div>
              <div class="col-md-4 col-sm-8 my-1">
                <date-picker v-model="dateTo" @change="updateList"></date-picker>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section-content row w-100 py-2 justify-content-center">
        <line-chart
          v-if="chartType === 'line'"
          :data="chartData"
          :options="lineChartOptions"
          :width="chartWidth"
        />
        <pie-chart
          v-else-if="chartType === 'pie'"
          :data="chartData"
          :options="pieChartOptions"
          :width="chartWidth"
        />
        <bar-chart
          v-else-if="chartType === 'bar'"
          :data="chartData"
          :options="lineChartOptions"
          :width="chartWidth"
        />
      </div>
    </div>

    <div class="section create-section mb-4 mt-5">
      <h2 class="section-title">لیست مجموعه‌ها</h2>
      <div class="section-content row py-2">
        <b-table
          show-empty
          responsive
          empty-text="هیچ کارفرمایی ثبت نشده"
          striped
          hover
          :items="provider"
          :fields="fields"
          ref="clTable"
        >
          <template slot="name" slot-scope="data">
            <nuxt-link :to="'/log/' + data.value">{{ data.value }}</nuxt-link>
          </template>
          <template slot="timeChart" slot-scope="row">
            <b-button size="sm" :ref="'toggleDetails_'+row.item.name" @click="fetchTimeSerieData(row)" class="mr-2">
              {{ row.detailsShowing ? 'عدم‌نمایش' : 'نمایش'}}
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-card>
              <line-chart
                :data="getTimeChartData(row.item)"
                :options="lineChartOptions"
                :width="chartWidth"
              />
            </b-card>
          </template>
          <template slot="delete" slot-scope="data">
            <b-button variant="danger" @click="deleteCollection(data.item)">حذف</b-button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '~/components/charts/lineChart'
import PieChart from '~/components/charts/pieChart'
import BarChart from '~/components/charts/barChart'
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
export default {
  layout: 'default',
  components: {
    LineChart,
    PieChart,
    BarChart,
    datePicker: VuePersianDatetimePicker
  },
  computed: {
    chartWidth() {
      return screen.width > 990 ? 800 : screen.width > 767 ? 600 : screen.width > 575 ? 400 : screen.width > 450 ? 300 : 0
    },
    chartSize() {
      return this.chartWidth >= 800 ? 25 : this.chartWidth >= 600 ? 20 : this.chartWidth >= 400 ? 15 : this.chartWidth >= 300 ? 10 : 0
    },
    chartData() {
      const selectedItems = this.items.slice(0, this.chartSize)
      return {
        labels: selectedItems.map(item => item.name),
        datasets: [
          {
            label: 'label',
            fill: false,
            borderColor: 'blue',
            data: selectedItems.map(item => item[this.chartValue]),
            borderWidth: 1
          }
        ]
      }
    },
    lineChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              offset: true
            }
          ],
          yAxes: [
            {
              gridLines: {
                borderDash: [4, 4],
                display: true
              }
            }
          ]
        }
      }
    },
    pieChartOptions() {
      return {
        responsive: true,
        legend: false,
        elements: {
          arc: {
            backgroundColor: this.colorize.bind(null, false, false),
            hoverBackgroundColor: this.hoverColorize
          }
        }
      }
    },
    fields() {
      return [
        {
          key: 'name',
          label: 'نام',
          sortable: true
        },
        {
          key: 'docsNum',
          label: 'تعداد داکیومنت',
          sortable: true
        },
        {
          key: 'size',
          label: 'حجم مصرفی',
          sortable: true
        },
        {
          key: 'timeChart',
          label: (this.dateFrom || this.dateTo) ? 'نمودار زمانی' : 'نمودار زمانی ماه اخیر'
        },
        {
          key: 'delete',
          label: 'حذف'
        }
      ]
    }
  },
  async asyncData({ $axios }) {
    let { data } = await $axios.get('/api/log/list')
    const items = data.map(collection => {
      return {
        name: collection.name,
        docsNum: collection.stats.count,
        avgObjSize: collection.stats.avgObjSize,
        size: collection.stats.size
      }
    })
    const stats = {}
    data.forEach(collection => {
      stats[collection.name] = collection.stats
    })
    return {
      stats,
      items,
      chartType: 'bar',
      chartValue: 'size',
      dateFrom: '',
      dateTo: '',
      timeSeries: {},
      chartValueOptions: [
        {
          value: 'size',
          text: 'حجم مصرفی'
        },
        {
          value: 'docsNum',
          text: 'تعداد داکیومنت'
        }
      ],
      chartTypePptions: [
        {
          value: 'line',
          text: 'خطی'
        },
        {
          value: 'pie',
          text: 'دایره‌ای'
        },
        {
          value: 'bar',
          text: 'ستونی'
        }
      ],
      colors: [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
      ]
    }
  },
  methods: {
    async updateList() {
      console.log('updateList')
      const dateFrom = this.dateFrom ? this.$moment(this.dateFrom, 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss') : null
      const dateTo = this.dateTo ? this.$moment(this.dateTo, 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss') : null
      const params = {
        dateFrom,
        dateTo
      }
      const { data } = await this.$axios.get('/api/log/list', { params })
      this.items = data.map(item => {
        return {
          name: item.name,
          docsNum: item.stats.count,
          avgObjSize: item.stats.avgObjSize,
          size: item.stats.count * item.stats.avgObjSize
        }
      })
      this.$refs.clTable.refresh()
    },
    provider(ctx) {
      console.log(ctx)
      let res = this.items
      if (ctx.sortBy) {
        res = res.sort((a, b) => {
          if (ctx.sortDesc) {
            return a[ctx.sortBy] > b[ctx.sortBy] ? 1 : -1
          }
          return b[ctx.sortBy] > a[ctx.sortBy] ? 1 : -1
        })
      }
      return this.transformTable(res)
    },
    transformTable(items) {
      return items.map(item => {
        return Object.assign({}, item, {
          avgObjSize: item.avgObjSize + ' بایت',
          size: item.size + ' بایت'
        })
      })
    },
    hoverColorize(ctx) {
      return this.colorize(false, true, ctx)
    },
    colorize(opaque, hover, ctx) {
      const v = ctx.dataset.data[ctx.dataIndex]
      const c = this.color(Math.floor(Math.random() * 100 ))

      const opacity = hover
        ? 1 - Math.abs(v / 150) - 0.2
        : 1 - Math.abs(v / 150)

      return opaque ? c : this.transparentize(c, opacity)
    },
    transparentize(color, opacity) {
      const alpha = opacity === undefined ? 0.5 : 1 - opacity
      return Color(color)
        .alpha(alpha)
        .rgbString()
    },
    color(index) {
      return this.colors[index % this.colors.length]
    },
    async fetchTimeSerieData(row) {
      const item = row.item
      console.log(item)
      if (item._showDetails) {
        row.toggleDetails()
        return
      }
      const params = {
        collection: item.name
      }
      const { data } = await this.$axios.get('/api/log/timeSeries', { params })
      this.timeSeries[item.name] = data.result
      row.toggleDetails()
    },
    getTimeChartData(item) {
      return {
        labels: Object.keys(this.timeSeries[item.name]),
        datasets: [
          {
            label: 'label',
            fill: false,
            borderColor: 'blue',
            data: Object.values(this.timeSeries[item.name]),
            borderWidth: 1
          }
        ]
      }
    },
    async deleteCollection(item) {
      if (!confirm('از حذف مجموعه ' + item.name + 'اطمینان دارید؟')) {
        return
      }
      const params = {
        collection: item.name
      }
      try {
        await this.$axios.delete('api/log/collection', { params })
        this.updateList()
        this.$toast.success('مجموعه ' + item.name + ' با موفقیت حذف شد')
      } catch (e) {
        this.$toast.error('حذف با مشکل مواجه شد')
      }
    }
  }
}
</script>