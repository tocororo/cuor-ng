// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from 'toco-lib';

class EnvironmentImpl implements Environment {
  production = false;
  sceibaHost = 'https://127.0.0.1:5000/';
  cuorHost = 'https://127.0.0.1:5000/';
  sceibaApi = 'https://127.0.0.1:5000/api/';
  cuorApi = 'https://127.0.0.1:5000/api/';

  appHost = 'https://localhost:4100';
  appName = 'Organizaciones - Sceiba';

  websiteUsername_Twitter = '@SceibaCuba';
  websiteUsername_Facebook = '@sceiba';

  oauthRedirectUri = 'https://localhost:4100/';
  oauthClientId = 'LYnMUzdJDrOtMDQY7fXicXuSdXYuaUtCwjRh1olp';
  oauthScope = 'user:email';
  topOrganizationPID = 'orgaid.223';
  cachableUrls = [];


  matomoUrl = 'https://crai-stats.upr.edu.cu/';
  matomoSiteId = 7;

  sceiba = 'https://cuba.sceiba.org';
  discover = 'https://cuba.sceiba.org/search';
  catalog = 'https://cuba-catalogo.sceiba.org/';
  revistasmes = 'https://cuba-revistasmes.sceiba.org/';
  organizations = '';
  persons = 'https://cuba-personas.sceiba.org/';
  vocabularies = 'https://vocabularios.sceiba.cu/';
  moodle = 'https://courses.sceiba.org/';
  evaluations = 'https://evaluaciones.sceiba.org/';


  oauthInfo = {
    serverHost: this.sceibaHost,
    loginUrl: this.sceibaHost + 'oauth/internal/authorize',
    tokenEndpoint: this.sceibaHost + 'oauth/token',
    userInfoEndpoint: this.sceibaApi + 'me',
    appHost: this.appHost,
    appName: this.appName,
    oauthRedirectUri: this.oauthRedirectUri,
    oauthClientId: this.oauthClientId,
    oauthScope: this.oauthScope,
  }

}

export const environment = new EnvironmentImpl();



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
