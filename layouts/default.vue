<template>
  <div id="main-div" dir="rtl">
    <nav-bar />
    <div class="container" role="main">
      <nuxt />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/layout/nav-bar'

export default {
  head: {
    bodyAttrs: {
      dir: 'rtl'
    }
  },
  components: {
    NavBar
  }
}
</script>

<style>
</style>
