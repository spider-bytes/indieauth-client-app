<template>
  <div class="about">
    <h1>This is the database management</h1>
    <div class="row">
      <div class="col-2">UserId:</div>
      <div class="col-10">{{userId}}</div>
    </div>
    <div class="row">
      <div class="col-2">User Token:</div>
      <div class="col-10">{{userToken}}</div>
    </div>
    <div class="row">
      <div class="col-2">Spider-Bytes Address:</div>
      <div class="col-10">{{spiderBytesAddress}}</div>
    </div>
    <div class="row">
      <div class="col-2">Database Token:</div>
      <div class="col-10">{{databaseToken}}</div>
    </div>
  </div>
</template>

<script>
import IndieAuth from 'indieauth-helper';
import { getAuthOptions } from '@/constants';

export default {
  name: 'Database',
  components: {},
  data: function () {
    return {
      userId: this.userId,
      userToken: this.userToken,
      spiderBytesAddress: this.spiderBytesAddress,
      databaseToken: this.databaseToken,
    }
  },
  async mounted () {
    this.userId = sessionStorage.getItem('step1.userId');
    this.userToken = sessionStorage.getItem('step2.token');

    const auth = new IndieAuth(getAuthOptions());
    const rels = await auth.getRelsFromUrl(this.userId, ['spider-bytes']);
    this.spiderBytesAddress = rels['spider-bytes'].replace(/\/$/g, '');

    const response = await fetch(this.spiderBytesAddress + '/database-session', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.userToken,
        'IndieAuth-UserId': this.userId,
      }
    });
    const databaseSessionBody = await response.json();
    this.databaseToken = databaseSessionBody.token;
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
