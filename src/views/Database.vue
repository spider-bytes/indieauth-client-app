<template>
  <div class="about">
    <h1>This is the database management</h1>
    <div class="row">
      <div class="col-2">UserId:</div>
      <div class="col-10">{{userId}}</div>
    </div>
    <div class="row">
      <div class="col-2">Token:</div>
      <div class="col-10">{{token}}</div>
    </div>
    <div class="row">
      <div class="col-2">Spider-Bytes Address:</div>
      <div class="col-10">{{spiderBytesAddress}}</div>
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
      token: this.token,
      spiderBytesAddress: this.spiderBytesAddress,
    }
  },
  async mounted () {
    this.userId = sessionStorage.getItem('step1.userId');
    this.token = sessionStorage.getItem('step2.token');

    const auth = new IndieAuth(getAuthOptions());
    const rels = await auth.getRelsFromUrl(this.userId, ['spider-bytes']);
    this.spiderBytesAddress = rels['spider-bytes'];

    // await fetch();
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
