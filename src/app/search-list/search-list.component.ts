
import { Component, OnInit, Input } from '@angular/core';

import { HitList, Organization } from '@toco/tools/entities';

@Component({
	selector: 'search-list',
	templateUrl: './search-list.component.html',
	styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit
{

	@Input()
	public hitList: HitList<Organization>;

    public constructor()
	{ }

	public ngOnInit(): void
	{

    }
}
