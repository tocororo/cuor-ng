
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import { Organization } from 'toco-lib';
import { Permission } from '../permission.service';

@Component({
  selector: 'app-org-view',
  templateUrl: './org-viewer.component.html',
  styleUrls: ['./org-viewer.component.scss']
})
export class OrgViewerComponent implements OnInit {
  public org: Organization;

  public constructor(private _activatedRoute: ActivatedRoute) { }
  loading = true;

  public ngOnInit(): void {
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

    if (permission.hasPermissions("curator")) {
      return true;
    }
    return false;
  }
}
