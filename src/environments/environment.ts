// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'toco-lib';

class EnvironmentImpl implements Environment {
  production = false;
  sceibaHost = 'https://sceiba.cu';
  //cuorHost = 'https://orgs.sceiba.cu/';
  cuorHost = 'https://cuor-lab.upr.edu.cu/';
  sceibaApi = 'https://sceiba.cu/api/';
  //cuorApi = 'https://orgs.sceiba.cu/api/';
  cuorApi = 'https://cuor-lab.upr.edu.cu/api/';

  appHost = 'https://192.168.1.100:4200';
  appName = 'Orgs';
  //oauthRedirectUri = 'https://192.168.1.100:4200/';
  //oauthClientId = 'jrlAUANdljGrgHkkWmbcuRfPEObe1tLyJ2f7og2f';
  oauthRedirectUri = 'YcCPhezOuOdr3psX3XXXuanHUdohDQABuvGBeGOk';
  oauthClientId = 'YcCPhezOuOdr3psX3XXXuanHUdohDQABuvGBeGOk';
  oauthScope = 'user:email';
  topOrganizationPID = '';
  cachableUrls = [];
}

export const environment = new EnvironmentImpl();



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
