import Vue from 'vue';
import Router from 'vue-router';
import ContactsList from "@/components/ContactsList";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: ContactsList,
    },
    {
      path: '/contact/:id',
      component: () => import('./components/ContactInfo.vue'),
    },
  ]
})
