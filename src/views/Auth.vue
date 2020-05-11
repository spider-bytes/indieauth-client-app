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
  </div>
</template>

<script>
import IndieAuth from 'indieauth-helper'
import qs from 'querystring'
import { getAuthOptions } from '@/constants'
import { fixEndpoints } from '@/util/endpoint.util'
import { cleanCurrentUrl } from '@/util/url.util'

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
    cleanCurrentUrl()

    try {
      const auth = new IndieAuth(getAuthOptions())

      const query = this.$route.query;
      this.stateStr = query.state;
      if (this.stateStr) {
        this.state = auth.validateState(this.stateStr)
        if (!this.state) {
          console.warn('throw error')
        }

        auth.options.me = this.state.me
      } else {
        auth.options.me = sessionStorage.getItem('step1.userId')
      }
      await auth.getRelsFromUrl(auth.options.me)
      auth.options = fixEndpoints(auth.options)

      this.code = query.code || sessionStorage.getItem('step2.code')
      sessionStorage.setItem('step2.code', this.code)
      this.codeVerification = await auth.verifyCode(this.code)

      this.token = await auth.getToken(this.code)
      sessionStorage.setItem('step2.token', this.token)
      const response = await fetch(auth.options.tokenEndpoint, { headers: { Authorization: 'Bearer ' + this.token } })
      const contentType = response.headers.get('Content-Type')
      if (contentType.startsWith('application/json')) {
        this.tokenVerification = await response.json()
      } else {
        this.tokenVerification = qs.parse(await response.text())
      }
      sessionStorage.setItem('step1.userId', this.tokenVerification.me);
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
