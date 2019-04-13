<template>
  <div class="mx-auto text-right">
    <div class="section mb-4 mt-5">
      <h2 class="section-title">استخراج اسناد</h2>
      <div class="section-content row py-2">
        <div class="col-4">
          <span>از تاریخ:</span>
          <date-picker v-model="date_from"></date-picker>
        </div>
        <div class="col-4">
          <span> تا تاریخ:</span>
          <date-picker v-model="date_to"></date-picker>
        </div>
        <div class="col">
          <div class="row justify-content-around align-items-end h-100">
            <b-button
              variant="success"
              size="lg"
              @click="updatePage(1)"
              :disabled="sortQueryState === 'invalid' || filterQueryState === 'invalid'"
            >اعمال</b-button>
            <b-button variant="success" size="lg" @click="exportLogs">استخراج</b-button>
          </div>
        </div>
      </div>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-1 variant="outline-primary">کوئری فیلتر و ترتیب</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <div class="row" dir="ltr">
                <div class="col-6">
                  <b-form-group
                    description="کوئری فیلتر مدنظر را وارد کنید"
                    label="فیلتر"
                    label-for="filterQueryInput"
                    :invalid-feedback="filterInvalidFeedback"
                    :state="filterQueryState"
                  >
                    <b-form-textarea
                      id="filterQueryInput"
                      type="textarea"
                      v-model="filterQuery"
                      :state="filterQueryState"
                      trim
                      rows="5"
                      max-rows="10"
                    ></b-form-textarea>
                  </b-form-group>
                </div>
                <div class="col-6">
                  <b-form-group
                    description="کوئری ترتیب مدنظر را وارد کنید"
                    label="ترتیب"
                    label-for="sortQueryInput"
                    :invalid-feedback="sortInvalidFeedback"
                    :state="sortQueryState"
                  >
                    <b-form-textarea
                      id="filterQueryInput"
                      type="textarea"
                      v-model="sortQuery"
                      :state="sortQueryState"
                      trim
                      rows="5"
                      max-rows="10"
                    ></b-form-textarea>
                  </b-form-group>
                </div>
              </div>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <div class="section mb-4 mt-5">
      <h2 class="section-title">لیست اسناد</h2>
      <div class="section-content py-2">
        <div dir="ltr" class="text-left">
          <div v-for="item in items" :key="item.id" class="my-2">
            <json-viewer :value="item" :expand-depth="1"></json-viewer>
          </div>
        </div>
        <div class="row justify-content-center">
          <b-pagination
            v-model="currentPage"
            @change="updatePage"
            :total-rows="totalRows"
            :per-page="perPage"
            class="my-0"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import BFormTextarea from "bootstrap-vue/src/components/form-textarea/form-textarea";
export default {
  layout: 'default',
  async asyncData({ params, $axios }) {
    const perPage = 5
    const queryParams = {
      collection: params.name,
      skip: 0,
      limit: perPage
    }
    const { data } = await $axios.get('/api/log', { params: queryParams })

    return {
      collection: params.name,
      items: data.items,
      date_from: '',
      date_to: '',
      filterQuery: '',
      sortQuery: '',
      currentPage: 1,
      perPage: perPage,
      totalRows: data.count
    }
  },
  components: {
    BFormTextarea,
    datePicker: VuePersianDatetimePicker
  },
  computed: {
    filterQueryState() {
      return !this.filterQuery ? null : this.isValidJson(this.filterQuery) ? 'valid' : 'invalid'
    },
    filterInvalidFeedback() {
      if (this.filterQueryState === 'invalid') {
        return 'کوئری وارد شده صحیح نیست'
      }
      return ''
    },
    sortQueryState() {
      return !this.sortQuery ? null : this.isValidJson(this.sortQuery) ? 'valid' : 'invalid'
    },
    sortInvalidFeedback() {
      if (this.sortQueryState === 'invalid') {
        return 'کوئری وارد شده صحیح نیست'
      }
      return ''
    }
  },
  methods: {
    async exportLogs() {
      const params = {
        collection: this.collection,
        skip: 0,
        limit: 9999
      }
      if (this.date_from) {
        params.dateFrom = this.$moment(this.date_from, 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss')
      }
      if (this.date_to) {
        params.dateTo = this.$moment(this.date_to, 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss')
      }
      const { data } = await this.$axios.get('/api/log', { params })
      console.log(data)
      this.download(
        JSON.stringify({
          logs: data.items
        },undefined, 4)
      )
    },
    async updatePage(page) {
      this.currentPage = page
      const params = {
        collection: this.collection,
        skip: (page - 1) * this.perPage,
        limit: this.perPage
      }
      if (this.date_from) {
        params.dateFrom = this.$moment(this.date_from, 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss')
      }
      if (this.date_to) {
        params.dateTo = this.$moment(this.date_to, 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss')
      }
      if (this.filterQueryState) {
        params.filterQuery = this.filterQuery
      }
      if (this.sortQueryState) {
        params.sortQuery = this.sortQuery
      }
      const { data } = await this.$axios.get('/api/log', { params })
      this.items = data.items
      console.log(data)
      this.totalRows = data.count
    },
    isValidJson(jsonString) {
      try {
        JSON.parse(jsonString)
        return true
      } catch (e) {}
      return false
    },
    download(text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', this.collection+'.json');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
}
</script>

<style scoped>
.disabled.btn {
  cursor: not-allowed;
}
</style>
