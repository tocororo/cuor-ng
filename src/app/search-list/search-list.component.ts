
import { Component, OnInit, Input } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';

import { HitList, Organization } from 'toco-lib';
import { Permission } from '../permission.service';

@Component({
	selector: 'search-list',
	templateUrl: './search-list.component.html',
	styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit
{

	@Input()
	public hitList: HitList<Organization>;

    public constructor(private oauthStorage: OAuthStorage)
	{ }

	public ngOnInit(): void
	{

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
