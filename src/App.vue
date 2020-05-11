<template>
  <div id="app">
    <div>
      <div id="nav">
        <div class="d-flex justify-content-center">
          <router-link
            v-for="(routerLink, index) in routerLinks"
            :key="index"
            :to="routerLink.link"
          >
            Step {{index}}<br>{{routerLink.name}}
          </router-link>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {},
    data: function () {
      return {
        routerLinks: [
          { name: 'Login Form', link: '/home', },
          { name: 'Obtain Token', link: '/auth', },
          { name: 'Access Spider Bytes', link: '/database', },
        ]
      }
    },
  }
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;
      padding: 1em;

      &.router-link-active {
        color: #42b983;
      }
    }
  }
</style>
