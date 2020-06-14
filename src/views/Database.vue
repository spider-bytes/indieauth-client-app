<template>
  <div class="about">
    <h1>This is the database management</h1>
    <div class="row">
      <div class="col-2">UserId:</div>
      <div class="col-10">{{userId}}</div>
    </div>
    <div class="row">
      <div class="col-2">UserId (Base64):</div>
      <div class="col-10">{{userIdBase64}}</div>
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
    <div class="row">
      <div class="col-2">Filesystem Database:</div>
      <div class="col-10">{{filesystemDatabaseRequested ? (filesystemDatabase ? filesystemDatabase : 'not found') : '-'}}</div>
    </div>
    <div class="row">
      <div class="col-2">Database List:</div>
      <div class="col-10">
        <form class="form-inline my-2">
          <div class="form-group mx-2">
            <label for="exampleInput1" class="mr-2">Scope:</label>
            <input type="text" class="form-control" id="exampleInput1" placeholder="example-scope" v-model="createDatabaseScope">
          </div>
          <div class="form-check mx-2">
            <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="createDatabaseIsFilesystem">
            <label class="form-check-label" for="exampleCheck1">Is Filesystem?</label>
          </div>
          <button class="btn btn-primary btn-sm mx-2" @click="createDatabase">Create Database</button>
        </form>
        <br>
        <ul v-if="dbList && dbList.length > 0">
          <li v-for="db of dbList" :key="db.databaseId">
            <div>
              <div>
                DatabaseId: {{db.databaseId}}
                <button class="btn btn-primary btn-sm m-2" @click="deleteDatabase(db.databaseId)"
                        :disabled="db.accessRole !== 'OWNER'">Delete
                </button>
                <br>
              </div>
              <div>Role: {{db.accessRole}}</div>
              <div>Users:</div>
              <ul>
                <li v-for="user of db.users" :key="user.userId"
                    v-bind:class="{'user-you': user.userId === userIdBase64}">
                  <div>UserId: {{user.userId}}</div>
                  <div>
                    Role: {{user.accessRole}}
                    <span v-if="user.userId !== userIdBase64">
                        <button class="btn btn-danger btn-sm m-2"
                                :disabled="user.accessRole === null || db.accessRole !== 'OWNER'"
                                @click="manageAccess(db.databaseId, user.userId, null)">none</button>
                        <button class="btn btn-success btn-sm m-2"
                                :disabled="user.accessRole === 'READER' || db.accessRole !== 'OWNER'"
                                @click="manageAccess(db.databaseId, user.userId, 'READER')">READER</button>
                        <button class="btn btn-success btn-sm m-2"
                                :disabled="user.accessRole === 'WRITER' || db.accessRole !== 'OWNER'"
                                @click="manageAccess(db.databaseId, user.userId, 'WRITER')">WRITER</button>
                        <button class="btn btn-success btn-sm m-2"
                                :disabled="user.accessRole === 'OWNER' || db.accessRole !== 'OWNER'"
                                @click="manageAccess(db.databaseId, user.userId, 'OWNER')">OWNER</button>
                      </span>
                  </div>
                </li>
                <li v-if="db.accessRole === 'OWNER'">
                  <input v-model="userUrl">
                  <button class="btn btn-success btn-sm m-2"
                          @click="manageAccess(db.databaseId, base64Encode(userUrl), 'READER')">READER</button>
                  <button class="btn btn-success btn-sm m-2"
                          @click="manageAccess(db.databaseId, base64Encode(userUrl), 'WRITER')">WRITER</button>
                  <button class="btn btn-success btn-sm m-2"
                          @click="manageAccess(db.databaseId, base64Encode(userUrl), 'OWNER')">OWNER</button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <span v-if="!(dbList && dbList.length > 0)"> - </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDataProvider } from '@/constants';

  export default {
    name: 'Database',
    components: {},
    data: function () {
      return {
        userId: this.userId,
        userIdBase64: this.userIdBase64,
        userToken: this.userToken,
        spiderBytesAddress: this.spiderBytesAddress,
        databaseToken: this.databaseToken,
        dbList: this.dbList,
        userUrl: this.userUrl,
        filesystemDatabase: this.filesystemDatabase,
        filesystemDatabaseRequested: this.filesystemDatabaseRequested,
        createDatabaseScope: this.createDatabaseScope,
        createDatabaseIsFilesystem: this.createDatabaseIsFilesystem,
      }
    },
    methods: {
      createUserTokenHeaders: function () {
        return {
          Authorization: 'Bearer ' + this.userToken,
          'IndieAuth-UserId': this.userId,
          'Content-Type': 'application/json',
        };
      },
      createDatabaseTokenHeaders: function () {
        return {
          Authorization: 'Bearer ' + this.databaseToken,
          'Content-Type': 'application/json',
        };
      },
      fetchDatabaseList: async function () {
        this.dbList = (await this.rootServer.listDatabases()).databases

        this.filesystemDatabase = (await this.rootServer.getFilesystemDatabaseId()).databaseId
        this.filesystemDatabaseRequested = true
      },
      createDatabase: async function () {
        const isFilesystem = !!this.createDatabaseIsFilesystem;
        await this.rootServer.createDatabase({
          createDatabaseBody: {
            scope: this.createDatabaseScope,
            isFilesystem,
          }
        });
        await this.fetchDatabaseList();
      },
      deleteDatabase: async function (databaseId) {
        await this.rootServer.deleteDatabase({ databaseId });
        await this.fetchDatabaseList();
      },
      manageAccess: async function (dbId, userId, role) {
        await this.rootServer.setAccessToDatabase({
          databaseId: dbId,
          userId: userId,
          manageAccessBody: { role }
        });
        await this.fetchDatabaseList();
      },
      base64Encode(plainText) {
        return btoa(plainText);
      }
    },
    async mounted() {
      this.dataProvider = getDataProvider();

      this.rootServer = await this.dataProvider.getRootNode();
      await this.rootServer.initSession();

      await this.fetchDatabaseList();
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

  .user-you {
    color: gray;
  }
</style>
