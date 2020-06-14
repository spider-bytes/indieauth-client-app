<template>
  <div class="home">
    <h1>This is the home page</h1>
    <button class="btn btn-primary" v-on:click="authenticate">Authenticate</button>
  </div>
</template>

<script>
import { getDataProvider } from '@/constants'

export default {
  name: 'Home',
  components: {},
  data () {
    return {
      userId: undefined
    }
  },
  mounted () {
    const searchParams = new URLSearchParams(window.location.search)
    const routePath = searchParams.get('route_path')
    if (routePath) {
      const query = {}
      searchParams.forEach((value, key) => {
        if (key !== 'route_path') {
          query[key] = value
        }
      })

      this.$router.replace({ path: routePath, query })
    }

    this.dataProvider = getDataProvider();
  },
  methods: {
    keyPress (e) {
      if (e.key === 'Enter') {
        this.authenticate()
      }
    },
    async authenticate () {
      await this.dataProvider.openLoginForm();
    }
  }
}
</script>
