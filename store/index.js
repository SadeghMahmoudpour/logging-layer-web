export default {
  state () {
    return {
      rtl: true,
      theme: 'white',
      aside: false
    }
  },

  getters: {
    dir (state) {
      return state.rtl ? 'rtl' : 'ltr'
    },
    hasPermission: state => role => {
      return state.auth && state.auth.user.roleNames && (state.auth.user.roleNames.includes(role) || state.auth.user.roleNames.includes('admin'))
    },
  },

  mutations: {
    toggleRTL(state, rtl) { // eslint-disable-line
      state.rtl = !state.rtl
    },
    toggleTheme (state) {
      if (state.theme === 'white') {
        state.theme = 'dark'
      } else {
        state.theme = 'white'
      }
    },
    toggleAside (state) {
      state.aside = !state.aside
    }
  },
}