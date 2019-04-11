<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info" class="nav-bar">
      <b-nav-toggle target="nav__collapse" />
      <b-collapse is-nav id="nav__collapse" class="navbar__content">
        <b-navbar-nav>
          <b-nav-item href="/admin">مدیریت کارفرماها</b-nav-item>
          <b-nav-item href="/logs">مجموعه‌ها</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="mr-auto"></b-navbar-nav>
        <b-navbar-nav>
          <div class="text-white">
            <b-btn
              variant="primary"
              class="d-flex flex-row align-items-center justify-content-center navbar__button navbar__button--exit px-4"
              @click="logout"
            >
              <fa-icon icon="power-off" />
              <span>خروج</span>
            </b-btn>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>
