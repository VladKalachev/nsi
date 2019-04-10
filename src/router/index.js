import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Edit from '@/components/Edit';
import PageNotFound from '@/components/PageNotFound';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/card/:name',
      name: 'Card',
      component: Card
    },
    {
      path: '/editdict/:name',
      name: 'Edit',
      component: Edit
    },
    { path: '*', component: PageNotFound },
  ]
});
