import { Environment } from 'toco-lib';

class EnvironmentImpl implements Environment {
  production = false;
  sceibaHost = 'https://cuba-iroko.sceiba.org/';
  cuorHost = 'https://cuba-iroko.sceiba.org/';
  sceibaApi = 'https://cuba-iroko.sceiba.org/api/';
  cuorApi = 'https://cuba-iroko.sceiba.org/api/';

  appHost = 'https://cuba-organizaciones.sceiba.org';
  appName = 'Orgs';
  oauthRedirectUri = 'https://cuba-organizaciones.sceiba.org/';
  oauthClientId = 'UZT1hqcvT1G2sMLN21LPWiML5yLZbRw7WZk0uPjE';
  oauthScope = 'user:email';
  topOrganizationPID = '';
  cachableUrls = [];

  //Variables para poner los usuarios del sistema en twitter y en facebook
  websiteUsername_Twitter = '@SceibaCuba';
  websiteUsername_Facebook = '@sceiba';

  matomoUrl = 'https://crai-stats.upr.edu.cu/';
  matomoSiteId = 7;

  sceiba = 'https://cuba.sceiba.org';
  discover = 'https://cuba.sceiba.org/search';
  catalog = 'https://cuba-catalogo.sceiba.org/';
  revistasmes = 'https://cuba-revistasmes.sceiba.org/';
  organizations = 'https://cuba-organizaciones.sceiba.org/';
  persons = 'https://cuba-personas.sceiba.org/';
  vocabularies = 'https://vocabularios.sceiba.cu/';
  moodle = 'https://courses.sceiba.org/';
  evaluations = 'https://evaluaciones.sceiba.org/';
}

export const environment = new EnvironmentImpl();

