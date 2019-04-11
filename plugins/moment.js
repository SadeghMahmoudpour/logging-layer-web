import moment from 'moment-jalaali'

moment.loadPersian({ dialect: 'persian-modern' })

export default function (ctx, inject) {
  inject('moment', moment)
}