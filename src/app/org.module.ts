
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@toco/tools/shared';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { OrganizationsModule } from '@toco/tools/organizations';
import { TocoFormsModule } from '@toco/tools/forms';
import { SearchService } from '@toco/tools/backend';

import { EnvServiceProvider } from '@tocoenv/tools/env.service.provider';

import { OrgRoutingModule } from './org-routing.module';
import { OrgRootComponent } from './org.component';
import { InMemoryDataService }  from './in-memory-data.service';
import { SearchModule } from '@toco/tools/search';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { SearchListComponent } from './search-list/search-list.component';
import { CoreModule } from '@toco/tools/core';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OrgViewerComponent } from './org-viewer/org-viewer.component';

@NgModule({
	declarations: [
		OrgRootComponent,
		HomeComponent,
		SearchComponent,
		SearchListComponent,
		StaticPagesComponent,
		OrgViewerComponent
	],

	imports: [
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
