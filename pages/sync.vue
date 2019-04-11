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
    <div>
      <b-button @click="saveLog">ذخیره</b-button>
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
      key: ''
    }
  },
  methods: {
    saveLog: async function() {
      console.log('saveLlog')
      console.log(this.log)
      const data = {
        data: this.log,
        retrievable: true,
        tag: this.tag,
        key: this.key
      }
      try {
        let response = await this.$axios.post('/api/log', data)
        console.log(response)
      } catch (e) {
        console.log(e.message)
      }
    },
    prettyJson: function() {
      console.log('prettyJson')
      try {
        this.log = JSON.stringify(JSON.parse(this.log), undefined, 4)
      } catch (e) {
        console.error(e.message)
      }
    }
  }
}
</script>

<style scoped></style>
