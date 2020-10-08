import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SearchService } from '@toco/tools/backend';
import { SearchResponse, Organization } from '@toco/tools/entities';

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {

	public organizationsTotal: number = 0;
	public cubanOrganizationTotal: number = 0;

	public constructor(private router: Router, private activatedRoute: ActivatedRoute, private _searchService: SearchService)
	{ }

	public ngOnInit(): void
	{
		this._searchService.getOrganizations(null).subscribe({
			next: (searchResponse: SearchResponse<Organization>) => {
				console.log(searchResponse);

				this.organizationsTotal = searchResponse.hits.total;

				searchResponse.aggregations['country'].buckets.forEach(element => {
					if (!element.key.localeCompare("Cuba"))
						this.cubanOrganizationTotal = element.doc_count;
				});

			}
		})
	}

	public queryChange(event?: string): void
	{
		this.router.navigate(["search"], {
			relativeTo: this.activatedRoute,
			queryParams: { q: event },
			queryParamsHandling: "",
		});
	}
}
