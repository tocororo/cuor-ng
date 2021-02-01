
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
// import { AuthConfig, JwksValidationHandler, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthBackend, Environment, OauthAuthenticationService, OauthInfo, User, UserProfile } from 'toco-lib';
import { UserService } from './org.service';
import { Permission } from './permission.service';


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

  public userProfile: UserProfile;

  public cuorHost: string;

  public authBackend: AuthBackend;

  public oauthInfo: OauthInfo = {
    serverHost: this.environment.cuorHost,
    loginUrl: this.environment.cuorHost + 'oauth/cuor/authorize',
    tokenEndpoint: this.environment.cuorHost + 'oauth/token',
    userInfoEndpoint: this.environment.cuorApi + 'me',
    appHost: this.environment.appHost,
    appName: this.environment.appName,
    oauthRedirectUri: this.environment.oauthRedirectUri,
    oauthClientId: this.environment.oauthClientId,
    oauthScope: this.environment.oauthScope,
  }

	public constructor(
    private _userService: UserService,
    private authenticationService: OauthAuthenticationService,
    private oauthStorage: OAuthStorage,
    private oauthService: OAuthService,
    protected http: HttpClient,
    private router: Router,
    private environment: Environment
    ) {

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

        this.userProfile = JSON.parse(this.oauthStorage.getItem('user'))
        if(this.userProfile != undefined){
          this.configRoles();
        }
        this.authenticationService.authenticationSubjectObservable.subscribe(
          (user) => {
            if (user != null) {
              this.userProfile = user;
              this.configRoles();
            } else {
              this.logout();
            }
          },
          (error: any) => {
            this.userProfile = null;
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
    for (const rol in this.userProfile.user.roles) {
      const element = this.userProfile.user.roles[rol];
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
    this.userProfile = undefined;
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

  public get isHome(){
    return this.router.url == '/';
  }
}
