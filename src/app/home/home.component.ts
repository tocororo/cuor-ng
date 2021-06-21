
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Organization, SearchResponse } from 'toco-lib';

import { OrgService } from '../org.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

	public organizationsTotal: number = 0;
	public cubanOrganizationTotal: number = 0;

	public homeCharts = {
		type: [],
		total: []
	}
	loadCharts= false;
	// xAxisLabel = 'Total de Organizaciones';
	view: any[] = [300, 300];
	barView: any[] = [340, 300]
	gradient: boolean = false;
	showLegend: boolean = true;
	showLabels: boolean = false;
	isDoughnut: boolean = false;
	legendPosition: string = 'below';
	colorScheme = {
		domain: [ // all colors light
			'#A9A9A9',
			'#85E96E',
			'#E3E96E',
			'#E9AC6E',
			'#E96E70',
			'#E96EB6',
			'#AE6EE9',
			'#6F6EE9',
			'#6EBBE9',
			'#6EE9B5'
		]
	};

	showXAxis = false;
	showYAxis = false;

	harvesterInfo: { label: string, icon: string, text: string }[];

	public constructor(private router: Router, 
		private activatedRoute: ActivatedRoute, 
		private _cuorService: OrgService,
		public transServ: TranslateService)
	{ }

	public ngOnInit(): void
	{
		this.harvesterInfo = [
			{ 'label': 'ONEI', 'icon': 'assets/images/logo_onei.jpg', 'text': 'CARD_ITEM_INFO_HARV_INFO_TEXT_1' },
			{ 'label': 'GRID', 'icon': 'assets/images/grid.jpg', 'text': 'CARD_ITEM_INFO_HARV_INFO_TEXT_2' },
			{ 'label': 'Wikidata', 'icon': 'assets/images/wikidatawiki.png', 'text': 'CARD_ITEM_INFO_HARV_INFO_TEXT_3' }
		];

		this._cuorService.getOrganizations(null).subscribe({
			next: (searchResponse: SearchResponse<Organization>) => {

				this.organizationsTotal = searchResponse.hits.total;

				searchResponse.aggregations['country'].buckets.forEach(element => {
					if (!element.key.localeCompare('Cuba'))
						this.cubanOrganizationTotal = element.doc_count;
				});

				searchResponse.aggregations['types'].buckets.forEach(element => {
					this.homeCharts.type.push({ name: element.key, value: element.doc_count})
				});
				this.homeCharts.total = [
					{name: 'Internacionales', value: searchResponse.hits.total - this.cubanOrganizationTotal},
					{name: 'Cubanas', value: this.cubanOrganizationTotal}
				]
				this.loadCharts = true;
			}
		})
	}

	public queryChange(event?: string): void
	{
		this.router.navigate(['search'], {
			relativeTo: this.activatedRoute,
			queryParams: { q: event, country: 'Cuba', status: 'active' },
			queryParamsHandling: '',
		});
	}

	public goAbout(){
		this.router.navigate(['about'],  {
			relativeTo: this.activatedRoute,
			queryParams: { q: event, country: 'Cuba', status: 'active' },
			queryParamsHandling: '',
		})
	}
}
