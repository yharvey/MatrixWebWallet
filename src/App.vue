<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  created: function () {
    this.$router.push('/')
  }
}
</script>

<style>
body {
  margin:auto;
}
#app {
  font-family: Open Sans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background: #f2f4f8;
  min-width: 960px;
}
</style>
