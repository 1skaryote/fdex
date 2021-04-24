import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { library } from '../node_modules/@fortawesome/fontawesome-svg-core' //'@fortawesome/fontawesome-svg-core'
import { fas } from '../node_modules/@fortawesome/free-solid-svg-icons' //'@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '../node_modules/@fortawesome/vue-fontawesome' //'@fortawesome/vue-fontawesome'

library.add(fas)
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
  customIconPacks: {
    fas: {
      size: {
        default: 'lg',
        "is-small": '1x',
        "is-medium": '2x',
        "is-large": '3x'
      },
      iconPrefix: ''
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
