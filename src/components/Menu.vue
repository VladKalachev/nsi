<template>
  <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
    <a-menu-item key="1">
      <router-link to="/">
        <a-icon type="user"/>
        <span>Справочники</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: "Menu"
};
</script>

