<template>
  <div class="mx-auto text-right my-5">
    <div class="section">
      <h2 class="section-title">لیست پوشه‌ها</h2>
      {{path}}
      <div class="section-content py-2">
        <b-table
          responsive="lg"
          ref="fileTable"
          show-empty
          empty-text="هیچ فایلی موجود نیست"
          striped
          hover
          :items="files"
          :fields="fields"
        >
          <template slot="index" slot-scope="data">
            {{ data.index + 1 }}
          </template>
          <template slot="pathSuffix" slot-scope="data">
            <a v-if="data.item.type==='FILE'" :href="getLink(data.item)">{{ getFileName(data.value) }}</a>
            <a v-else href="#" @click.prevent="updatePath(data.value)">{{ data.value }}</a>
          </template>
          <template slot="length" slot-scope="data">
            {{ data.value + ' بایت' }}
          </template>
          <template slot="length" slot-scope="data">
            {{ data.value + ' بایت' }}
          </template>
          <template slot="delete" slot-scope="data">
            <b-button variant="danger" @click="deleteItem(data.item)">حذف</b-button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import BButton from "bootstrap-vue/src/components/button/button";
export default {
  components: {BButton},
  computed: {
    fields() {
      return [
        {
          key: 'index',
          label: 'شاخص'
        },
        {
          key: 'pathSuffix',
          label: 'نام',
          sortable: 'true'
        },
        {
          key: this.path ? 'length' : 'childrenNum',
          label: this.path ? 'اندازه' : 'تعداد فایل',
          sortable: 'true'
        },
        {
          key: 'delete',
          label: 'حذف'
        }
      ]
    }
  },
  async asyncData({ params, $axios }) {
    const path = params.name ? '/' + params.name : ''
    const reqParams = { path }
    const { data } = await $axios.get('/api/file/list', { params: reqParams })
    return {
      path,
      files: data.FileStatuses.FileStatus,
    }
  },
  methods: {
    getLink(item) {
      if (item.type === 'DIRECTORY') {
        return `/file/${item.pathSuffix}`
      }
      return `http://localhost:50075/webhdfs/v1/logger/logs${ this.path }/${ encodeURI(item.pathSuffix) }?op=OPEN&namenoderpcaddress=namenode:8020&offset=0`
    },
    async updateFiles(path) {
      const params = { path }
      const { data } = await this.$axios.get('/api/file/list', { params })
      this.files = data.FileStatuses.FileStatus
      this.$router.push({ path: `/file${path}` })
    },
    async updatePath(childPath) {
      const path = `${this.path}/${encodeURI(childPath)}`
      await this.updateFiles(path)
      this.path = path
    },
    getFileName(name) {
      const spl = name.split('hdfs.')
      if (spl.length > 1) {
        return spl[1]
      }
      return spl[0]
    },
    async deleteItem(item) {
      const type = item.type === 'DIRECTORY' ? 'پوشه' : 'فایل'
      if (!confirm('از حذف ' + type + ' اطمینان دارید؟')) {
        return
      }
      const path = `${this.path}/${encodeURI(item.pathSuffix)}`
      const params = { path }
      try {
        await this.$axios.delete('/api/file', { params })
        this.updateFiles(this.path)
        const message = type + ' با موفقیت حذف شد'
        this.$toast.success(message)
      } catch (e) {
        this.$toast.error('حذف با مشکل مواجه شد')
      }
    }
  }
}
</script>
