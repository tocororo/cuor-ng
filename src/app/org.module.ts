
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrganizationServiceNoAuth, SharedModule, StaticsModule } from 'toco-lib';
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
import { OrganizationDialogRelasionship, OrgEditComponent } from './org-edit/org-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerYearComponent } from './datapicker-year/datapicker-year.component';

@NgModule({
	declarations: [
		OrgRootComponent,
		HomeComponent,
		SearchComponent,
		SearchListComponent,
		StaticPagesComponent,
		OrgViewerComponent,
		OrgEditComponent,
		OrganizationDialogRelasionship,
		DatepickerYearComponent
	],

	imports: [
		BrowserAnimationsModule,
		SharedModule,
		CoreModule,
		StaticsModule,
		// The `HttpClientInMemoryWebApiModule` module intercepts HTTP requests 
		// and returns simulated server responses. 
		// Remove it when a real server is ready to receive requests. 
		// HttpClientInMemoryWebApiModule.forRoot(
		// 	InMemoryDataService, { dataEncapsulation: false }
		// ),
		ReactiveFormsModule,
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
	entryComponents: [
		OrganizationDialogRelasionship
	],
	providers: [
		SearchService,
		EnvServiceProvider,
		OrganizationServiceNoAuth
	],

	bootstrap: [OrgRootComponent]
})
export class OrgModule { }
