
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { Organization } from 'toco-lib';
import { Permission } from '../permission.service';

@Component({
	selector: 'app-org-view',
	templateUrl: './org-viewer.component.html',
	styleUrls: ['./org-viewer.component.scss']
})
export class OrgViewerComponent implements OnInit {
	public org: Organization;

	public constructor(private oauthStorage: OAuthStorage, private _activatedRoute: ActivatedRoute) { }

	public ngOnInit(): void {
		/* Gets the `Organization` data. */
		this._activatedRoute.data.subscribe(
			(data) => {
				this.org = data.org.metadata;
				// this.org = data.org;
			}
		);
	}

	/**
	* hasPermission return true if the user have permission
	*/
	public get hasPermission(): boolean {
		let permission = new Permission(this.oauthStorage);

		if (permission.hasPermissions("admin")) {
			return true;
		}
		return false;
	}
}
