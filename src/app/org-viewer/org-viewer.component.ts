
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import { Organization } from 'toco-lib';
import { Permission } from '../permission.service';

@Component({
  selector: 'app-org-view',
  templateUrl: './org-viewer.component.html',
  styleUrls: ['./org-viewer.component.scss']
})
export class OrgViewerComponent implements OnInit {
  public org: Organization = null;

  public constructor(private _activatedRoute: ActivatedRoute, private router: Router, public iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }
  loading = true;
  view_type:boolean = true;
  data:any = '';

  public ngOnInit(): void {

    this.iconRegistry.addSvgIcon('wikidata',this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/Wikidata-logo.svg'));
    /* Gets the `Organization` data. */

    this._activatedRoute.data.subscribe(
      (data) => {
        this.org = data.org.metadata;
        this.loading = false;
        // this.org = data.org;
      }
    );
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
