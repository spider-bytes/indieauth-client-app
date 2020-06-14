export const SCOPES = ['spider-bytes:demo-scope1', 'spider-bytes:demo-scope2', 'spider-bytes:db'];
export const CLIENT_ID = 'http://localhost:8080/';
export const REDIRECT_URI = 'http://localhost:8080?route_path=/auth';
export const SECRET = 'SECRET';

const authOptions = {
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  secret: SECRET
}

export function getAuthOptions () {
  return Object.assign({}, authOptions)
}
