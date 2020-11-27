
import { Component } from '@angular/core';
import { AuthConfig, JwksValidationHandler, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthBackend, AuthenticationService, EnvService, User } from 'toco-lib';
import { OrgService } from './org.service';
import { Permission } from './permission.service';

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

	public constructor(
    private authenticationService: AuthenticationService, 
    private oauthStorage: OAuthStorage,
    private oauthService: OAuthService,
    private env: EnvService) {

    }

    public ngOnInit(): void
    {
        this.cuorHost = this.env.cuorHost;
        this.footerSites =  Array();
        this.footerInformation =  Array();

        this.footerSites.push({ name: "MES", url: "https://www.mes.gob.cu", useRouterLink: false});
        this.footerSites.push({ name: "ONEI", url: "http://www.onei.gob.cu/", useRouterLink:false});
        this.footerSites.push({ name: "GRID", url: "https://www.grid.ac", useRouterLink: false});
        this.footerSites.push({ name: "ROR", url: "https://ror.org/", useRouterLink: false});
        this.footerSites.push({ name: "Wikidata", url: "https://www.wikidata.org/wiki/Wikidata:Main_Page", useRouterLink: false});

        this.footerInformation.push({ name: "Términos de uso", url: "https://sceiba-lab.upr.edu.cu/page/politicas", useRouterLink: false});
        this.footerInformation.push({ name: "Privacidad", url: "https://sceiba-lab.upr.edu.cu/page/politicas", useRouterLink: false});
        this.footerInformation.push({ name: "Contacto", url: "/contact", useRouterLink: true});
        this.footerInformation.push({ name: "FAQs", url: "/faq", useRouterLink: true});

        this.authBackend = AuthBackend.cuor;
        this.authenticationService.authBackend = this.authBackend;

        this.authenticationService.authenticationSubjectObservable.subscribe(
          {
            next: (logguedChange) => {
              if (logguedChange){
                this.user = new User();
                this.user.email = this.oauthStorage.getItem("email");

                // pedir la info del usuario para guardar los roles
                this.authenticationService.getUserInfo().subscribe({
                  next: (response) => {
                    let roles = '';
                    for (const rol in response.roles) {
                      const element = response.roles[rol];
                      roles += "," + element.name;
                    }
                    this.oauthStorage.setItem("roles", roles)
                  },
                  error: e => console.log(e)
                });
              }
            },
            error: (err) => {
              console.log("logguedChange", err);
            }
          }
        )
    }

  /**
   * logout
   */
  public logout() {
    this.oauthService.logOut();
    this.oauthStorage.removeItem("email");
    this.oauthStorage.removeItem("roles");
    this.user = undefined;
  }

  /**
   * hasPermission return true if the user have permission
   */
  public get hasPermission(): boolean {
    let permission = new Permission(this.oauthStorage);

    if (permission.hasPermissions("curator") || permission.hasPermissions("admin")){
      return true;
    }
    return false;
  }

    /**
   * hasPermission return true if the user have permission
   */
  public get hasPermissionAdmin(): boolean {
    let permission = new Permission(this.oauthStorage);

    if (permission.hasPermissions("admin")){
      return true;
    }
    return false;
  }
}
