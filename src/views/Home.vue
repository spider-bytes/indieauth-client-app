<template>
  <div class="home">
    <h1>This is the home page</h1>
    <div class="row">
      <div class="col-4 offset-4">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">User ID</span>
          </div>
          <input v-model="userId" v-on:keydown="keyPress" type="text" class="form-control" placeholder="https://username.example.com" aria-label="Username" aria-describedby="basic-addon1">
        </div>
      </div>
    </div>
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
