// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cuorHost: 'https://192.168.1.100:5001/',
  sceibaApi: 'https://localhost:5000/api/',
  cuorApi: 'https://192.168.1.100:5001/api/',

  appHost: 'https://192.168.1.100:4200',
  appName: 'Orgs',
  oauthRedirectUri: 'https://192.168.1.100:4200/',
  oauthClientId: 'jrlAUANdljGrgHkkWmbcuRfPEObe1tLyJ2f7og2f',
  oauthScope: 'user:email',
  topOrganizationPID: '',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
