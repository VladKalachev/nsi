<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

/* .ant-layout.ant-layout-has-sider {
  height: 100%;
} */

.ant-layout {
  height: 100%;
}

.ant-layout-content {
  min-height: initial !important;
}
</style>
