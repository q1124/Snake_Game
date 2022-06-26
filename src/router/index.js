import Vue from 'vue'
import Router from 'vue-router'
import Snake from '../views/index.vue'

Vue.use(Router)


export default new Router({
  mode: 'hash',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Snake',
      component: Snake
    }
  ]
})
