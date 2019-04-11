<template>
  <div class="py-5">
    <b-row class="py-2">
      <div class="col-2">کلید کارفرما:</div>
      <div class="col">
        <b-form-input v-model="key" />
      </div>
    </b-row>
    <b-row class="py-2">
      <div class="col-2">برچسب:</div>
      <div class="col">
        <b-form-input v-model="tag" />
      </div>
    </b-row>
    <b-row class="py-2">
      <div class="col-2">داده:</div>
      <div class="col">
        <b-form-textarea v-model="log" id="textarea" dir="ltr" placeholder="Enter something..." rows="10" @change="prettyJson" />
      </div>
    </b-row>
    <div class="row my-3" dir="ltr">
      <b-form-checkbox
        id="checkbox-1"
        v-model="retrievavle"
        name="checkbox-1"
      >
        ذخیره سازی در مانگو برای استفاده مستقیم
      </b-form-checkbox>
    </div>
    <div>
      <b-button variant="success" @click="saveLog">ذخیره</b-button>
    </div>
  </div>
</template>

<script>
import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
import BRow from "bootstrap-vue/src/components/layout/row";
import BCol from "bootstrap-vue/src/components/layout/col";
export default {
  components: {BCol, BRow, BFormInput},
  data() {
    return {
      log: '',
      tag: '',
      key: '',
      retrievavle: true
    }
  },
  methods: {
    saveLog: async function() {
      console.log('saveLlog')
      console.log(this.log)
      const data = {
        data: this.log,
        retrievable: this.retrievavle,
        tag: this.tag,
        key: this.key
      }
      try {
        let response = await this.$axios.post('/api/log', data)
        console.log(response)
        this.$toast.success('داده با موفقیت ثبت شپ')
      } catch ({ response }) {
        console.log(response.data.statusCode)
        if (response && response.data && response.data.statusCode === 401) {
          this.$toast.error(response.data.message)
        }
      }
    },
    prettyJson: function() {
      console.log('prettyJson')
      try {
        this.log = JSON.stringify(JSON.parse(this.log), undefined, 4)
      } catch (e) {
        this.$toast.error('فرمت داده باید JSON باشد')
      }
    }
  }
}
</script>

<style scoped></style>
