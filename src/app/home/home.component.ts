import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Organization, SearchResponse } from 'toco-lib';
import { OrgService } from "../org.service";
import { HttpClient } from "@angular/common/http";


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
	// xAxisLabel = "Total de Organizaciones";
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

	// harvesterInfo = [
	// 	{ label: "ONEI", icon: "assets/images/logo_onei.jpg", text : "ONEI: Oficina Nacional de Estadísticas e Información constituye uno de los principales componentes del Sistema de información del Gobierno cubano y contribuye a satisfacer las necesidades informativas relacionadas con los objetivos y planes del mismo en todos los niveles de dirección, en los ámbitos económico, social, demográfico y medioambiental."},
	// 	{ label: "GRID", icon: "assets/images/grid.jpg", text : "GRID: De sus siglas en inglés, Global Research Identifier Database, es una base de datos global gratuita y abiertamente disponible de organizaciones relacionadas con la investigación, que cataloga organizaciones relacionadas con la investigación y proporciona a cada una un identificador único persistente. El registro de Grid selecciona cuidadosamente sus datos para identificar y distinguir instituciones relacionadas con la investigación en todo el mundo."},
	// 	{ label: "Wikidata", icon: "assets/images/wikidatawiki.png", text : "Wikidata: Es una base de conocimientos editada en colaboración y alojada por la Fundación Wikimedia. Tiene el objetivo de proporcionar una fuente común de datos, en nuestro caso de organizaciones cubanas, que pueden ser utilizados por cualquier proyecto bajo licencia de dominio público."},
	// ];

	public harvesterInfo: any = []
	public apiText:string;	
	public homeCards: any = [];

	public constructor(
		private router: Router, 
		private activatedRoute: ActivatedRoute, 
		private _cuorService: OrgService,
		private httpClient: HttpClient)
	{ }

	public ngOnInit(): void
	{
		this.httpClient.get("assets/home-texts/es.json").subscribe(data =>{
			console.log(data);
			this.homeCards = data["cards"]; //cards es el key del json es.json
			this.harvesterInfo = data["harvesterInfo"]; 	
			this.apiText = data["apiText"];				
			
		  })
		  console.log("fffff", this.harvesterInfo);
		  

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

	public goAbout(){
		this.router.navigate(["about"],  {
			relativeTo: this.activatedRoute,
			queryParams: { q: event, country: 'Cuba', status: 'active' },
			queryParamsHandling: "",
		})
	}
}
