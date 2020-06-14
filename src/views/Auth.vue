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
import qs from 'querystring'
import { DataProvider } from '@spider-bytes/dataprovider-client/lib-esm'
import { CLIENT_ID, REDIRECT_URI, SCOPES } from '@/constants'
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
      this.dataProvider = new DataProvider(
        SCOPES,
        CLIENT_ID,
        REDIRECT_URI,
        sessionStorage,
        'spider-bytes.'
      );

      const query = this.$route.query;
      this.stateStr = query.state;
      this.code = query.code

      await this.dataProvider.obtainAccessToken(this.code, this.stateStr);
      this.token = this.dataProvider.accessToken;

      const response = await fetch(this.dataProvider.tokenEndpoint, { headers: { Authorization: 'Bearer ' + this.token } })
      const contentType = response.headers.get('Content-Type')
      if (contentType.startsWith('application/json')) {
        this.tokenVerification = await response.json()
      } else {
        this.tokenVerification = qs.parse(await response.text())
      }
      sessionStorage.setItem('spider-bytes.userId', this.tokenVerification.me);
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
