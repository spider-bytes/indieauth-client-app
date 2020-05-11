<template>
  <div class="about">
    <h1>This is the database management</h1>
    <div class="row">
      <div class="col-2">Token:</div>
      <div class="col-10">{{token}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Database',
  components: {},
  data: function () {
    return {
      token: this.token,
    }
  },
  async mounted () {
    this.token = sessionStorage.getItem('step2.token');
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
