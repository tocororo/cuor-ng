
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Organization } from '@toco/tools/entities';

@Component({
	selector: 'app-org-view',
	templateUrl: './org-viewer.component.html',
	styleUrls: ['./org-viewer.component.scss']
})
export class OrgViewerComponent implements OnInit
{
	public org: Organization;

	public constructor(private _router: Router, private _activatedRoute: ActivatedRoute)
	{ }

	public ngOnInit(): void
	{
		/* Gets the `Organization` data. */
		this._activatedRoute.data.subscribe(
			(data) => {
				this.org = data.org.metadata;
				// this.org = data.org;

				console.log('Data got for viewing: ', this.org);
			}
		);
	}
}
