
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'toco-lib';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { OrganizationsModule } from 'toco-lib';
import { TocoFormsModule } from 'toco-lib';
import { SearchService } from 'toco-lib';

import { EnvServiceProvider } from 'toco-lib';

import { OrgRoutingModule } from './org-routing.module';
import { OrgRootComponent } from './org.component';
import { SearchModule } from 'toco-lib';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { SearchListComponent } from './search-list/search-list.component';
import { CoreModule } from 'toco-lib';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OrgViewerComponent } from './org-viewer/org-viewer.component';
import { ChartsComponent } from './charts/charts.component';

// testing charts organizations
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PolarChartComponent } from './charts/polar-chart/polar-chart.component';
import { BarVerticalComponent } from './charts/bar-vertical/bar-vertical.component';
import { PieGridComponent } from './charts/pie-grid/pie-grid.component';
import { AggregationsComponent } from './aggregations/aggregations.component';
import { MatRadioModule } from '@angular/material';
import { GaugeChartComponent } from './charts/gauge-chart/gauge-chart.component'
@NgModule({
	declarations: [
		OrgRootComponent,
		HomeComponent,
		SearchComponent,
		SearchListComponent,
		StaticPagesComponent,
		OrgViewerComponent,
		// testing charts organizations
		ChartsComponent,
		PolarChartComponent,
		BarVerticalComponent,
		PieGridComponent,
		AggregationsComponent,
		GaugeChartComponent
		//DialogChartComponent
	],
	imports: [
		NgxChartsModule,
		MatRadioModule,

		BrowserAnimationsModule,
		SharedModule,
		CoreModule,
		// The `HttpClientInMemoryWebApiModule` module intercepts HTTP requests 
		// and returns simulated server responses. 
		// Remove it when a real server is ready to receive requests. 
		// HttpClientInMemoryWebApiModule.forRoot(
		// 	InMemoryDataService, { dataEncapsulation: false }
		// ),
		//    ReactiveFormsModule,    
		OrganizationsModule,
		// AuthenticationModule,
		TocoFormsModule,
		OrgRoutingModule, 
		SearchModule,
		HttpClientModule,
		MarkdownModule.forRoot({
			loader: HttpClient
		  })
	],

	providers: [
		SearchService,
		EnvServiceProvider
	],

	bootstrap: [OrgRootComponent]
})
export class OrgModule { }
