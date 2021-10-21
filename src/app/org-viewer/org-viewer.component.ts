
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import {Organization, MetadataService, Environment} from 'toco-lib';
import { Permission } from '../permission.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OAuthStorage} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-org-view',
  templateUrl: './org-viewer.component.html',
  styleUrls: ['./org-viewer.component.scss']
})
export class OrgViewerComponent implements OnInit {
  public org: Organization = null;

  public isAnomaly = true;
  public isDuplicate = false;
  public appHost: string;
  public user: string;
  orgFilter = [{ type: 'country', value: 'Cuba' }, { type: 'status', value: 'active' }];
  public form = new FormGroup({
    anomalyDescription: new FormControl('', Validators.required),
    duplicateDescription: new FormControl(''),
  });

  masterOrganization: Organization;
  masterFormControl: FormControl;


  public constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    public iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private metadata: MetadataService,
    private env: Environment,
    private oauthStorage: OAuthStorage,

  ) { }
  loading = true;
  view_type = true;
  data: any = '';

  public ngOnInit(): void {
    this.user = JSON.parse(this.oauthStorage.getItem('user'));
    console.log('user===', JSON.parse(this.oauthStorage.getItem('user')));
    this.iconRegistry.addSvgIcon('wikidata', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/Wikidata-logo.svg'));
    /* Gets the `Organization` data. */

    this._activatedRoute.data.subscribe(
      (data) => {
        this.org = data.org.metadata;
        this.loading = false;
        // this.org = data.org;
      }
    );

    this._activatedRoute.data.subscribe(
      (data) => {
        this.metadata.meta.updateTag({name: 'DC.title', content: this.org.name});
        this.metadata.meta.updateTag({name: 'description', content: 'Metadatos de organización en Sistema de identificación de Organizaciones Cubanas'});
        this.metadata.meta.updateTag({name: 'generator', content: 'Sceiba en Organizaciones Cubanas Proyecto Vlir Joint'});
        this.metadata.meta.updateTag({name: 'keywords', content: 'Sceiba, organizaciones, identificación persistente, Cuba'});
        this.metadata.meta.updateTag({name: 'robots', content: 'index,follow'});
        console.log('entrando en metadata');

      });

  }

  receivingMaster(master: Organization) {
    this.loading = false;
    this.masterOrganization = new Organization();
    this.masterOrganization.deepcopy(master);
    this.masterFormControl.setValue(master);
  }

  /**
  * hasPermission return true if the user have permission
  */
  public get hasPermission(): boolean {
    const permission = new Permission();

    if (permission.hasPermissions('curator') || permission.hasPermissions('admin')) {
      return true;
    }
    return false;
  }

  showWikidataButton() {
    return this.org.identifiers.find(id => id.idtype === 'wkdata' ) !== undefined;
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
      QID: this.org.identifiers.find(id => id.idtype === 'wkdata' ).value,
      // label: this.org.name,
      label: this.org.labels.find(id => id.iso639 === 'es' ).label,
      lang: this.org.labels.find(id => id.iso639 === 'es' ).iso639
    };
    console.log( this.data);
  }

  public onAnomalyChange(e): void {
    this.isAnomaly = e.checked;
    this.isDuplicate = !e.checked;
  }
  public onDuplicateChange(e): void {
    this.isDuplicate = e.checked;
    this.isAnomaly = !e.checked;
  }

  public onSubmitReport(): any {
    console.log('date===', new Date());
    console.log('appHost===', `${this.env.appHost}/${this.org.id}/view`);
    if (this.isAnomaly) {
      console.log('anomalyDescription===', this.form.get('anomalyDescription').value);
    }
    if (this.isDuplicate) {
      console.log('duplicateDescription===', this.form.get('duplicateDescription').value);
    }
  }

}
