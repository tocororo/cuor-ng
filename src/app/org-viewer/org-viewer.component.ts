
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import { Organization, MetadataService } from 'toco-lib';
import { Permission } from '../permission.service'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-org-view',
  templateUrl: './org-viewer.component.html',
  styleUrls: ['./org-viewer.component.scss']
})
export class OrgViewerComponent implements OnInit {
  public org: Organization = null;

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    public iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private metadata: MetadataService
    ) { }
  loading = true;
  view_type:boolean = true;
  data:any = '';

  identifiers = [];

  public ngOnInit(): void {

    this.iconRegistry.addSvgIcon('wikidata',this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/Wikidata-logo.svg'));
    /* Gets the `Organization` data. */

    this._activatedRoute.data.subscribe(
      (data) => {
        this.org = data.org.metadata;
        this.loading = false;
        // this.org = data.org;

        this.identifiers = data.org.metadata.identifiers.map( (ident) => ([{text: ident.idtype, style: 'text'}, {text: ident.value, style: 'text'}]));
      }
    );

    this._activatedRoute.data.subscribe(
      (data) => {
        this.metadata.meta.updateTag({name:"DC.title", content:this.org.name});
        this.metadata.meta.updateTag({name:"description", content:"Metadatos de organización en Sistema de identificación de Organizaciones Cubanas"});
        this.metadata.meta.updateTag({name:"generator", content:"Sceiba en Organizaciones Cubanas Proyecto Vlir Joint"});
        this.metadata.meta.updateTag({name:"keywords", content:"Sceiba, organizaciones, identificación persistente, Cuba"});
        this.metadata.meta.updateTag({name:"robots", content:"index,follow"});
        console.log("entrando en metadata");

      })

  }

  /**
  * hasPermission return true if the user have permission
  */
  public get hasPermission(): boolean {
    let permission = new Permission();

    if (permission.hasPermissions("curator") || permission.hasPermissions("admin")) {
      return true;
    }
    return false;
  }

  showWikidataButton(){
    return this.org.identifiers.find(id => id.idtype === "wkdata" ) !== undefined;
  }

    /* This function redirect to the profile for employes and afiliates od the organization
   *
   */
  /* redirectProfile() {
    this.router.navigate(['wiki-organizations/organization'], {
      queryParams: { QID: this.org.identifiers.find(id => id.idtype === "wkdata" ).value, label: this.org.name, lang: "es" },
      queryParamsHandling: 'merge'
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }; */

  changeView(): void {
    this.view_type = !this.view_type;
    this.showWikidata();
  }

  showWikidata() {
    this.data = {
      QID: this.org.identifiers.find(id => id.idtype === "wkdata" ).value,
      //label: this.org.name,
      label: this.org.labels.find(id => id.iso639 === "es" ).label,
      lang: this.org.labels.find(id => id.iso639 === "es" ).iso639
    }
    console.log( this.data);
  };
}
