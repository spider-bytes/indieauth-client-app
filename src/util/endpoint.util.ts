import { IEndpoints } from '@spider-bytes/dataprovider-client/lib-esm';

// this endpoint replacement is for fixing cors issues
export function fixEndpoints (options: IEndpoints): IEndpoints { // eslint-disable-line @typescript-eslint/no-explicit-any
  // TODO add configuration for disabling this (after: edit documentation)
  const currentOrigin = window.location.origin

  if (options.authEndpoint === 'https://indieauth.com/auth') {
    options.authEndpoint = currentOrigin + '/indie-auth-com/auth'
  }
  if (options.tokenEndpoint === 'https://tokens.indieauth.com/token') {
    options.tokenEndpoint = currentOrigin + '/indie-auth-com/token'
  }
  return options
}
