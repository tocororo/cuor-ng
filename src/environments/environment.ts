// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'toco-lib';

class EnvironmentImpl implements Environment {
  production = false;
  sceibaHost = 'https://sceiba.cu';
  cuorHost = 'https://localhost:5001/';
  sceibaApi = 'https://sceiba.cu/api/';
  cuorApi = 'https://localhost:5001/api/';

  appHost = 'https://127.0.0.1:4200';
  appName = 'Orgs';
  oauthRedirectUri = 'https://localhost:4200/';
  oauthClientId = 'I8wktQLfssUUsch9g7v7cTjahmegXeiz5suZy0Cl';
  oauthScope = 'user:email';
  topOrganizationPID = '';
  cachableUrls = [];

  //Variables para poner los usuarios del sistema en twitter y en facebook
  websiteUsername_Twitter = '@SceibaCuba';
  websiteUsername_Facebook = '@sceiba';

  matomoUrl = 'https://crai-stats.upr.edu.cu/';
  matomoSiteId = 7;
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
