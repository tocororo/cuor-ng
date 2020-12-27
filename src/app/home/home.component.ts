import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SearchService } from 'toco-lib';
import { SearchResponse, Organization } from 'toco-lib';
import { OrgService } from "../org.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {

	public organizationsTotal: number = 0;
	public cubanOrganizationTotal: number = 0;

	public homeCharts = {
		type: [],
		total: []
	}
	loadCharts= false;

	public constructor(private router: Router, private activatedRoute: ActivatedRoute, private _cuorService: OrgService)
	{ }

	public ngOnInit(): void
	{
		this._cuorService.getOrganizations(null).subscribe({
			next: (searchResponse: SearchResponse<Organization>) => {

				this.organizationsTotal = searchResponse.hits.total;

				searchResponse.aggregations['country'].buckets.forEach(element => {
					if (!element.key.localeCompare("Cuba"))
						this.cubanOrganizationTotal = element.doc_count;
				});

				searchResponse.aggregations['types'].buckets.forEach(element => {
					this.homeCharts.type.push({ name: element.key, value: element.doc_count})
				});
				this.homeCharts.total = [
					{name: "Internacionales", value: searchResponse.hits.total - this.cubanOrganizationTotal},
					{name: "Cubanas", value: this.cubanOrganizationTotal}
				]
				this.loadCharts = true;
			}
		})
	}

	public queryChange(event?: string): void
	{
		this.router.navigate(["search"], {
			relativeTo: this.activatedRoute,
			queryParams: { q: event, country: 'Cuba', status: 'active' },
			queryParamsHandling: "",
		});
	}
}
