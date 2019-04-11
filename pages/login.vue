<template>
    <div class="row justify-content-center align-items-center mx-auto">
        <div class="col-sm-6 col-lg-4 py-5">
            <div class="p-4 bg-white">
                <div class="mb-3">
                    <form v-if="!$store.state.authUser" @submit.prevent="login({username, password})">
                        <p class="error" v-if="formError">{{ formError }}</p>
                        <p><div class="m-1">نام کاربری </div><b-input type="text" v-model="username" name="username" /></p>
                        <p><div class="m-1">کلمه عبور </div><b-input type="password" v-model="password" name="password" /></p>
                        <b-btn type="submit" class="btn btn-success btn-block rounded-0 text-white">ورود</b-btn>
                    </form>
                    <div v-else>
                        <button @click="logout">خروج</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    layout: 'default',
    auth: false,
    data () {
      return {
        formError: null,
        username: '',
        password: ''
      }
    },

    methods: {
      async login (fields) {
        console.log(fields);
        try {
          await this.$auth.loginWith('local', {
            data: fields
          })
        } catch (e) {
          console.error('خطا هنگام ورود')
          return
        }
        this.$router.replace('/')
      },
      async logout () {
        // try {
        //   await this.$store.dispatch('logout')
        // } catch (e) {
        //   this.formError = e.message
        // }
      }
    }
  }
</script>