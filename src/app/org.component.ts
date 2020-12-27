
import { Component } from '@angular/core';
// import { AuthConfig, JwksValidationHandler, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthBackend, OauthAuthenticationService, OauthInfo, SimpleAuthenticationService, User } from 'toco-lib';
import { OrgService, UserService } from './org.service';
import { Permission } from './permission.service';

import { environment } from 'src/environments/environment';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
	selector: 'toco-org-root',
	templateUrl: './org.component.html',
	styleUrls: ['./org.component.scss']
})
export class OrgRootComponent
{
  public title = "Catálogo de Organizaciones Cubanas";

  public footerSites: Array< { name: string, url: string, useRouterLink: boolean } >;

  public footerInformation: Array< { name: string, url: string, useRouterLink: boolean } >;

  public user: User;

  public cuorHost: string;

  public authBackend: AuthBackend;

  public oauthInfo: OauthInfo = {
    serverHost: environment.cuorHost,
    loginUrl: environment.cuorHost + 'oauth/cuor/authorize',
    tokenEndpoint: environment.cuorHost + 'oauth/token',
    userInfoEndpoint: environment.cuorApi + 'me',
    appHost: environment.appHost,
    appName: environment.appName,
    oauthRedirectUri: environment.oauthRedirectUri,
    oauthClientId: environment.oauthClientId,
    oauthScope: environment.oauthScope,
  }

	public constructor(
    private _userService: UserService,
    private authenticationService: OauthAuthenticationService,
    private oauthStorage: OAuthStorage,
    private oauthService: OAuthService,
    protected http: HttpClient,
    // private router: Router
    // private env: EnvService
    ) {

    }

    public ngOnInit(): void
    {
        this.cuorHost = environment.cuorHost;
        this.footerSites =  Array();
        this.footerInformation =  Array();

        this.footerSites.push({ name: "MES", url: "https://www.mes.gob.cu", useRouterLink: false});
        this.footerSites.push({ name: "ONEI", url: "http://www.onei.gob.cu/", useRouterLink:false});
        this.footerSites.push({ name: "GRID", url: "https://www.grid.ac", useRouterLink: false});
        this.footerSites.push({ name: "ROR", url: "https://ror.org/", useRouterLink: false});
        this.footerSites.push({ name: "Wikidata", url: "https://www.wikidata.org/wiki/Wikidata:Main_Page", useRouterLink: false});

        // this.footerInformation.push({ name: "Términos de uso", url: "https://sceiba-lab.upr.edu.cu/page/politicas", useRouterLink: false});
        // this.footerInformation.push({ name: "Privacidad", url: "https://sceiba-lab.upr.edu.cu/page/politicas", useRouterLink: false});
        this.footerInformation.push({ name: "Contacto", url: "/contact", useRouterLink: true});
        this.footerInformation.push({ name: "FAQs", url: "/faq", useRouterLink: true});

        this.user = JSON.parse(this.oauthStorage.getItem('user'))
        if(this.user != undefined){
          this.configRoles();
        }
        this.authenticationService.authenticationSubjectObservable.subscribe(
          (user) => {
            if (user != null) {
              this.user = user;
              this.configRoles();
            } else {
              this.logout();
            }
          },
          (error: any) => {
            this.user = null;
          },
          () => {
          }
        )
          // {
          //   next: (logguedChange) => {
          //     if (logguedChange){
          //       // this.user = JSON.parse(this.oauthStorage.getItem('user'))
          //       // console.log(this.user)
          //       // console.log(this.oauthStorage.getItem('user'))
          //       // let roles = '';
          //       // for (const rol in this.user.roles) {
          //       //   const element = this.user.roles[rol];
          //       //   roles += "," + element.name;
          //       // }
          //       // this.oauthStorage.setItem("roles", roles)
          //       // this.user.email = this.oauthStorage.getItem("email");

          //       // pedir la info del usuario para guardar los roles
          //       // this.authenticationService.getUserInfo().subscribe({
          //       //   next: (response) => {
          //       //     this.user = response;
          //       //     let roles = '';
          //       //     for (const rol in response.roles) {
          //       //       const element = response.roles[rol];
          //       //       roles += "," + element.name;
          //       //     }
          //       //     this.oauthStorage.setItem("roles", roles)
          //       //   },
          //       //   error: e => console.log(e)
          //       // });
          //     }
          //   },
          //   error: (err) => {
          //     console.log("logguedChange", err);
          //   }
          // }
        // )
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
  public logout() {
    this.oauthService.logOut();
    this.oauthStorage.removeItem("user");
    this.oauthStorage.removeItem("roles");
    this.user = undefined;
    // this.router.navigateByUrl(this.cuorHost + 'logout/');
    // this.http.get<any>(environment.cuorHost + 'logout/').subscribe({
    //   next: (response) => {
    //     console.log('logout', response);
    //     this.oauthService.logOut();
    //     localStorage.removeItem("user");
    //     localStorage.removeItem("roles");
    //     this.user = undefined;
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {},
    // });
  }

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
}
