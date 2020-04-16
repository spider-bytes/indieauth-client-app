<template>
  <div class="about">
    <h1>This is the auth callback page</h1>
    <div class="row">
      <div class="col-2">State:</div>
      <div class="col-10">{{stateStr}}</div>
    </div>
    <div class="row">
      <div class="col-2"></div>
      <div class="col-10">{{JSON.stringify(state)}}</div>
    </div>
    <div class="row">
      <div class="col-2">Code:</div>
      <div class="col-10">{{code}}</div>
    </div>
    <div class="row">
      <div class="col-2">Code Verification:</div>
      <div class="col-10">{{codeVerification}}</div>
    </div>
    <div class="row">
      <div class="col-2">Token:</div>
      <div class="col-10">{{token}}</div>
    </div>
    <div class="row">
      <div class="col-2">Token Verification:</div>
      <div class="col-10">{{JSON.stringify(tokenVerification)}}</div>
    </div>
    <div class="row">
      <div class="col-2 offset-6">
        <router-link :to="{path: '/', params: {}}">Try Again</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import IndieAuth from 'indieauth-helper'
import qs from 'querystring'
import { getAuthOptions } from '@/constants'
import { fixEndpoints } from '@/util/endpoint.util'

export default {
  name: 'Auth',
  components: {},
  data: function () {
    return {
      stateStr: this.stateStr,
      state: this.state,
      code: this.code,
      codeVerification: this.codeVerification,
      token: this.token,
      tokenVerification: this.tokenVerification
    }
  },
  async mounted () {
    try {
      const auth = new IndieAuth(getAuthOptions())

      const searchQuery = window.location.href.split('?').slice(1).join('?')
      const searchParams = new URLSearchParams(searchQuery)
      this.stateStr = searchParams.get('state')
      if (this.stateStr) {
        this.state = auth.validateState(this.stateStr)
        if (!this.state) {
          console.warn('throw error')
        }

        auth.options.me = this.state.me
      } else {
        auth.options.me = sessionStorage.getItem('auth.me')
      }
      await auth.getRelsFromUrl(auth.options.me)
      auth.options = fixEndpoints(auth.options)

      this.code = searchParams.get('code')
      this.codeVerification = await auth.verifyCode(this.code)

      this.token = await auth.getToken(this.code)
      const response = await fetch(auth.options.tokenEndpoint, { headers: { Authorization: 'Bearer ' + this.token } })
      const contentType = response.headers.get('Content-Type')
      if (contentType.startsWith('application/json')) {
        this.tokenVerification = await response.json()
      } else {
        this.tokenVerification = qs.parse(await response.text())
      }
    } catch (err) {
      console.error('error', err)
    }
  }
}
</script>
<style>
  .about {
    padding-left: 3em;
    padding-right: 3em;
  }

  .row {
    text-align: left;
  }
</style>
