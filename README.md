# IndieAuth Client App
***IndieAuth Client App*** is a tool (single page app) for testing IndieAuth users and endpoints.
You can submit a user URL, login at your authentication endpoint and see the verification response.
This VueJS app doesn't need a backend. Some endpoints are proxied to the current origin for preventing CORS issues.
With `yarn serve` the dev-server of VueJS proxies the endpoints.

Proxied Endpoints:
* https://indieauth.com/auth
* https://tokens.indieauth.com/token 

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```
