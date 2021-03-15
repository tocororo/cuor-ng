
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, OAuthStorage, JwksValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { AuthBackend, Environment, User } from 'toco-lib';
import { UserService } from './org.service';
import { Permission } from './permission.service';
import { MatomoInjector } from 'ngx-matomo';

@Component({
	selector: 'toco-org-root',
	templateUrl: './org.component.html',
	styleUrls: ['./org.component.scss']
})
export class OrgRootComponent
{
  public title = "Sistema de identificación de Organizaciones Cubanas";

  public footerSites: Array< { name: string, url: string, useRouterLink: boolean } >;

  public footerInformation: Array< { name: string, url: string, useRouterLink: boolean } >;

  public user: User;

  public cuorHost: string;

  public urlSignUp = 'https://personas.sceiba.cu/auth/realms/sceiba/clients-registrations/openid-connect/sceiba-angular-dev';

  public constructor(
    private _userService: UserService,
    private oauthStorage: OAuthStorage,
    private oauthService: OAuthService,
    protected http: HttpClient,
    private router: Router,
    private environment: Environment,
    private matomoInjector: MatomoInjector) {
      this.configure();
      this.matomoInjector.init( environment.matomoUrl, environment.matomoSiteId);
  }

  public ngOnInit(): void
  {
      this.cuorHost = this.environment.cuorHost;
      this.footerSites =  Array();
      this.footerInformation =  Array();

      this.footerSites.push({ name: "MES", url: "https://www.mes.gob.cu", useRouterLink: false});
      this.footerSites.push({ name: "Sceiba", url: "https://sceiba.cu", useRouterLink: false});
      this.footerSites.push({ name: "ONEI", url: "http://www.onei.gob.cu/", useRouterLink:false});
      this.footerSites.push({ name: "GRID", url: "https://www.grid.ac", useRouterLink: false});
      this.footerSites.push({ name: "ROR", url: "https://ror.org/", useRouterLink: false});
      this.footerSites.push({ name: "Wikidata", url: "https://www.wikidata.org/wiki/Wikidata:Main_Page", useRouterLink: false});
      this.footerSites.push({ name: "ISSN", url: "https://isni.org/", useRouterLink: false});

      this.footerInformation.push({ name: "Términos de uso", url: "/terms", useRouterLink: true});
      this.footerInformation.push({ name: "Privacidad", url: "/privacy", useRouterLink: true});
      this.footerInformation.push({ name: "Contacto", url: "/contact", useRouterLink: true});
      this.footerInformation.push({ name: "FAQs", url: "/faq", useRouterLink: true});

      // TODO: Cuando este invenio, falta hacer la peticion para obtener los roles del usuario en esa aplicacion
      this.user = JSON.parse(this.oauthStorage.getItem('user'))
      if(this.user != undefined){
        this.configRoles();
      }
      console.log("this.userProfile", this.user);
      

  }

  private configRoles(){
    let roles = '';
    for (const rol in this.user.roles) {
      const element = this.user.roles[rol];
      roles += "," + element.name;
    }
    this.oauthStorage.setItem("roles", roles)
  }
  /**
   * logout
   */

  /**
   * hasPermission return true if the user have permission
   */
  public get hasPermission(): boolean {
    let permission = new Permission();

    if (permission.hasPermissions("curator") || permission.hasPermissions("admin")){
      return true;
    }
    return false;
  }

    /**
   * hasPermission return true if the user have permission
   */
  public get hasPermissionAdmin(): boolean {
    let permission = new Permission();

    if (permission.hasPermissions("admin")){
      return true;
    }
    return false;
  }

  public get isHome(){
    return this.router.url == '/';
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logoff() {
      this.oauthService.logOut();
  }

  public get name() {
      let claims = this.oauthService.getIdentityClaims();
      if (!claims) return null;
      return claims['given_name'];
  }
}


export const authConfig: AuthConfig = {
 
  // Url of the Identity Provider
  issuer: "https://personas.sceiba.cu/auth/realms/sceiba",

  loginUrl: 'https://personas.sceiba.cu/auth/realms/sceiba/protocol/openid-connect/auth',

  tokenEndpoint: 'https://personas.sceiba.cu/auth/realms/sceiba/protocol/openid-connect/token',
 
  logoutUrl: 'https://personas.sceiba.cu/auth/realms/sceiba/protocol/openid-connect/logout',

  oidc: true,

  requireHttps: true,

  userinfoEndpoint: 'https://personas.sceiba.cu/auth/realms/sceiba/protocol/openid-connect/userinfo',

  // URL of the SPA to redirect the user to after login
  redirectUri: 'https://localhost:4200',
 
  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'sceiba-angular-dev',


  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email',
}