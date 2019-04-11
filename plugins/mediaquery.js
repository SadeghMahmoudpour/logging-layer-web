import MQ from 'vue-match-media/src'
import Vue from 'vue'

Vue.use(MQ)

Vue.options.mq = {
  'xs-min-w': '(min-width: 0)',
  'sm-min-w': '(min-width: 576px)',
  'md-min-w': '(min-width: 768px)',
  'lg-min-w': '(min-width: 992px)',
  'xl-min-w': '(min-width: 1200px)',
  'xs-max-w': '(max-width: 0)',
  'sm-max-w': '(max-width: 576px)',
  'md-max-w': '(max-width: 768px)',
  'lg-max-w': '(max-width: 992px)',
  'xl-max-w': '(max-width: 1200px)',
}