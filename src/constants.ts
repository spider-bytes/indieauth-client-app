import { DataProvider } from '@spider-bytes/dataprovider-client/lib-esm';
import { fixEndpoints } from '@/util/endpoint.util';

export const SCOPES = ['spider-bytes:demo-scope1', 'spider-bytes:demo-scope2', 'spider-bytes:db'];
export const CLIENT_ID = 'http://localhost:8080/';
export const REDIRECT_URI = 'http://localhost:8080?route_path=/auth';
export const SECRET = 'SECRET';

export function getDataProvider() {
  return new DataProvider(
    SCOPES,
    CLIENT_ID,
    REDIRECT_URI,
    SECRET,
    sessionStorage,
    'spider-bytes.',
    (endpoints) => fixEndpoints(endpoints),
  );
}
