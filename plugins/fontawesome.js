import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import fontawesome from '@fortawesome/fontawesome'
import regularIcons from '@fortawesome/fontawesome-free-regular'
import solidIcons from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(regularIcons)
fontawesome.library.add(solidIcons)

Vue.component('fa-icon', FontAwesomeIcon)