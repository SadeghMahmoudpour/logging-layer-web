<template>
  <div class="mx-auto text-right">
    <div class="section create-section mb-4 mt-5">
      <h2 class="section-title">ایجاد کارفرما</h2>
      <div class="section-content row py-2">
        <div class="col-lg-4 col-md-6 col-sm-8">
          <b-form-group
            id="fieldset-create"
            description="نام کارفرما را وارد کنید"
            label="نام کارفرما"
            label-for="input-create"
            :invalid-feedback="invalidFeedback"
            :valid-feedback="validFeedback"
            :state="state"
          >
            <b-form-input
              @change="firstClicked"
              id="input-create"
              v-model="new_client"
              :state="state"
              trim
              @keyup.enter.native="addClient"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-lg-2 col-md-4 col-sm-4">
          <div class="row h-100 justify-content-center align-items-center">
            <b-button size="lg" variant="success" @click="addClient">ایجاد</b-button>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">لیست کارفرماها</h2>
      <div class="section-content py-2">
        <b-table
          responsive="lg"
          ref="clTable"
          show-empty
          empty-text="هیچ کارفرمایی ثبت نشده"
          striped
          hover
          :items="provider"
          :current-page="currentPage"
          :per-page="perPage"
          :fields="fields"
        >
          <template slot="index" slot-scope="data">
            {{ (currentPage - 1) * perPage + data.index + 1 }}
          </template>

          <template slot="key" slot-scope="data">
            <span>
              <b-button
                variant="info"
                size="sm"
                @click="copyKey(data.item.key)"
              >
                <fa-icon icon="copy" />
              </b-button>
            </span>
            <span class="d-none d-lg-inline">{{ data.item.key }}</span>
          </template>

          <template slot="action" slot-scope="data">
            <b-button
              :variant="data.item.active ? 'warning' : 'success'"
              @click="changeStatus(data.item.id, data.item.active)"
            >
              {{ data.item.active ? 'غیرفعال' : 'فعال' }}
            </b-button>
          </template>

          <template slot="delete" slot-scope="data">
            <b-button
              :disabled="!data.item.deletable"
              :class="data.item.deletable ? '' : 'disabled-btn'"
              variant="danger"
              @click="deleteClient(data.item.id)"
            >حذف</b-button>
          </template>
        </b-table>
        <div class="row justify-content-center">
          <b-pagination
            v-model="currentPage"
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
import BTable from 'bootstrap-vue/src/components/table/table'
export default {
  components: { BTable },
  layout: 'default',
  computed: {
    state() {
      if (!this.clicked) {
        return null
      } else if (
        this.new_client.length > 1 &&
        this.invalidNames.indexOf(this.new_client) < 0
      ) {
        return 'valid'
      }
      return 'invalid'
    },
    invalidFeedback() {
      if (this.state === 'invalid') {
        if (this.invalidNames.indexOf(this.new_client) >= 0) {
          return 'کارفرما با این نام قبلاً ثبت شده است'
        }
        return 'نام نامعتبر است'
      }
      return ''
    },
    validFeedback() {
      return this.state === 'valid' ? 'نام معتبر است' : ''
    }
  },
  data() {
    return {
      new_client: '',
      clicked: false,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      invalidNames: [],
      fields: [
        {
          key: 'index',
          label: 'شاخص'
        },
        {
          key: 'name',
          label: 'کارفرما',
          sortable: true
        },
        {
          key: 'key',
          label: 'کلید'
        },
        {
          key: 'action',
          label: 'تغییر وضعیت'
        },
        {
          key: 'delete',
          label: 'حذف'
        }
      ]
    }
  },
  methods: {
    async changeStatus(clientId, currentStatus) {
      console.log('deleteClient', clientId, currentStatus)
      const url = currentStatus
        ? '/api/admin/client/deactive'
        : '/api/admin/client/active'
      const params = { clientId }
      try {
        await this.$axios.put(url, params)
        const statusName = currentStatus ? 'غیرفعال' : 'فعال'
        this.$toast.success(`کارفرما با موفقیت ${statusName} شد`)
        this.$refs.clTable.refresh()
      } catch (e) {}
    },
    async addClient () {
      console.log('addClient')
      const params = {
        name: this.new_client
      }
      try {
        let { data } = await this.$axios.post('/api/admin/client', params)
        this.$toast.success('کارفرما با موفقیت ساخته شد')
        this.$refs.clTable.refresh()
        this.clicked = false
        this.new_client = ''
      } catch ({ response }) {
        if (response && response.data && response.data.statusCode === 400) {
          this.$toast.error(response.data.message)
          this.invalidNames.push(this.new_client)
        }
      }
    },
    async deleteClient(clientId) {
      if (!confirm('از حذف کارفرما اطمینان دارید؟')) {
        return
      }
      const params = { clientId }
      try {
        await this.$axios.delete('/api/admin/client', { params })
        this.$toast.success('کارفرما با موفقیت حذف شد')
        this.$refs.clTable.refresh()
      } catch (e) {}
    },
    firstClicked() {
      this.clicked = true
    },
    async provider(ctx) {
      console.log(ctx)
      const params = {
        sortBy: ctx.sortBy || 'active',
        sortOrder: ctx.sortDesc ? 'asc' : 'desc',
        skip: (ctx.currentPage - 1) * ctx.perPage,
        limit: ctx.perPage
      }
      let { data } = await this.$axios.get('/api/admin/client/list', { params })
      this.totalRows = data.count

      return data.clients
    },
    async copyKey(key) {
      await this.$copyText(key)
      this.$toast.success('کلید با موفقیت کپی شد')
    }
  }
}
</script>
<style scoped>
.disabled-btn {
  cursor: not-allowed;
}
</style>