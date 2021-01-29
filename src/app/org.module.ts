
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule, AuthenticationService, OrganizationServiceNoAuth, SharedModule, StaticsModule } from 'toco-lib';
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
import { OrganizationDialogDeleteConfirm, OrganizationDialogRelasionship, OrgEditComponent } from './org-edit/org-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerYearComponent } from './datepicker-year/datepicker-year.component';

// testing charts organizations
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PolarChartComponent } from './charts/polar-chart/polar-chart.component';
import { BarVerticalComponent } from './charts/bar-vertical/bar-vertical.component';
import { PieGridComponent } from './charts/pie-grid/pie-grid.component';
import { AggregationsComponent } from './aggregations/aggregations.component';
import { MatRadioModule } from '@angular/material';
import { GaugeChartComponent } from './charts/gauge-chart/gauge-chart.component'
import { ChartsComponent } from './charts/charts.component';
import { DisambiguationComponent } from './disambiguate/disambiguation/disambiguation.component';
import { DisambiguateCardFieldComponent } from './disambiguate/disambiguation/disambiguate-card-field/disambiguate-card-field.component';
import { DisambiguateCardChipsFieldComponent } from './disambiguate/disambiguation/disambiguate-card-chips-field/disambiguate-card-chips-field.component';
import { DisambiguateAccordChipsFieldComponent } from './disambiguate/disambiguation/disambiguate-accord-chips-field/disambiguate-accord-chips-field.component';
import { DisambiguateTextFieldComponent } from './disambiguate/disambiguation/disambiguate-text-field/disambiguate-text-field.component';
import { DisambiguateRelationshipsComponent } from './disambiguate/disambiguation/disambiguate-relationships/disambiguate-relationships.component';
import { ShowOneRelationshipComponent } from './disambiguate/disambiguation/disambiguate-relationships/show-one-relationship/show-one-relationship.component';
import { DisambiguateComponent } from './disambiguate/disambiguate.component';
import { ImportComponent } from './import/import.component';
import { InputFileComponent } from './import/input-file/input-file.component';

import { WikiOrganizationsComponent } from './wiki-organizations/wiki-organizations.component';
import { WikiOrgEmployesProfileComponent } from './wiki-organizations/profiles/wiki-org-employes-profile/wiki-org-employes-profile.component';
import { TableLayoutComponent } from './wiki-organizations/profile-layouts/table-layout/table-layout.component';
import { OrgSearchWikiComponent } from './wiki-organizations/wiki-org-search/wiki-org-search.component';
import { WikiAuthorProfileComponent } from './wiki-organizations/profiles/wiki-author-profile/wiki-author-profile.component';
import { WikiWorkProfileComponent } from './wiki-organizations/profiles/wiki-work-profile/wiki-work-profile.component';
import { WikiTopicProfileComponent } from './wiki-organizations/profiles/wiki-topic-profile/wiki-topic-profile.component';
import { WikiVenueProfileComponent } from './wiki-organizations/profiles/wiki-venue-profile/wiki-venue-profile.component';
import { WikiAuthorsProfileComponent } from './wiki-organizations/profiles/wiki-authors-profile/wiki-authors-profile.component';
import { ExpansionPanelLayoutComponent } from './wiki-organizations/profile-layouts/expansion-panel-layout/expansion-panel-layout.component';
import { WikiTopicsProfileComponent } from './wiki-organizations/profiles/wiki-topics-profile/wiki-topics-profile.component';

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
		DatepickerYearComponent,
		OrganizationDialogDeleteConfirm,
		// testing charts organizations
		ChartsComponent,
		PolarChartComponent,
		BarVerticalComponent,
		PieGridComponent,
		AggregationsComponent,
		GaugeChartComponent,
		//DialogChartComponent
		DisambiguateComponent,
		DisambiguationComponent,
		DisambiguateCardFieldComponent,
		DisambiguateCardChipsFieldComponent,
		DisambiguateAccordChipsFieldComponent,
		DisambiguateTextFieldComponent,
		DisambiguateRelationshipsComponent,
		ShowOneRelationshipComponent,
		ImportComponent,
		InputFileComponent,

		WikiOrganizationsComponent,
		WikiOrgEmployesProfileComponent,
		TableLayoutComponent,
		OrgSearchWikiComponent,
		WikiAuthorProfileComponent,
		WikiWorkProfileComponent,
		WikiTopicProfileComponent,
		WikiVenueProfileComponent,
		WikiAuthorsProfileComponent,
		ExpansionPanelLayoutComponent,
		WikiTopicsProfileComponent,
	], 
	imports: [
		MatRadioModule,
		NgxChartsModule,

		BrowserAnimationsModule,
		SharedModule,
		CoreModule,
		StaticsModule,
		ReactiveFormsModule,
		OrganizationsModule,
		TocoFormsModule,
		OrgRoutingModule, 
		SearchModule,
		HttpClientModule,
		MarkdownModule.forRoot({
			loader: HttpClient
		  }),
		AuthenticationModule
	],
	entryComponents: [
		OrganizationDialogRelasionship,
		OrganizationDialogDeleteConfirm
	],
	providers: [
		SearchService,
		EnvServiceProvider,
		OrganizationServiceNoAuth
	],

	bootstrap: [OrgRootComponent]
})
export class OrgModule { }
