const authOptions = {
  clientId: 'http://localhost:8080/',
  redirectUri: 'http://localhost:8080?route_path=/auth',
  secret: 'topSecretString'
}

export function getAuthOptions () {
  return Object.assign({}, authOptions)
}
