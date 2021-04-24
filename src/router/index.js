import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: function(to, from, next) {

      const user = JSON.parse(localStorage.getItem('user'))     
      console.log('user',user) 
      if(user != null) {
        next()
      } else {
        next('/')
      }
    }
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
