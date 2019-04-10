<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider :trigger="null" collapsible v-model="collapsed">
      <!-- Logo -->

      <!-- Menu -->
      <Menu></Menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', }">
        <div class="middle-box text-center">
          <h1>404</h1>
          <h3 class="font-bold">Страница не найдена</h3>
          <div
            class="error-desc"
          >Страница, которую Вы ищете, не может быть найдена.
          Возможно, Вы допустили опечатку при вводе адреса.</div>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import System from './System';
import Menu from './Menu';

export default {
  name: 'PageNotFound',
  components: {
    System,
    Menu,
  },
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  float: left;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.middle-box {
  max-width: 400px;
  z-index: 100;
  margin: 0 auto;
  padding-top: 40px;
}

.middle-box h1 {
  font-size: 170px;
  margin-bottom: 0;
}

.font-bold {
  font-weight: 600;
}
</style>
