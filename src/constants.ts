const authOptions = {
  clientId: 'http://localhost:8080/',
  redirectUri: 'http://localhost:8080/#/auth',
  secret: 'topSecretString'
}

export function getAuthOptions () {
  return Object.assign({}, authOptions)
}
