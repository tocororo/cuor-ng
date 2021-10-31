
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
// testing charts organizations
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MarkdownModule } from 'ngx-markdown';
import { MatomoModule } from 'ngx-matomo';

import { AuthenticationModule, CoreModule, Environment, OrganizationServiceNoAuth,
  OrganizationsModule, SearchModule, SearchService, SharedModule, StaticsModule,
  TocoFormsModule } from 'toco-lib';

import { environment } from 'src/environments/environment';

import { AggregationsComponent } from './aggregations/aggregations.component';
import { BarVerticalComponent } from './charts/bar-vertical/bar-vertical.component';
import { ChartsComponent } from './charts/charts.component';
import { GaugeChartComponent } from './charts/gauge-chart/gauge-chart.component';
import { PieGridComponent } from './charts/pie-grid/pie-grid.component';
import { PolarChartComponent } from './charts/polar-chart/polar-chart.component';
import { DatepickerYearComponent } from './datepicker-year/datepicker-year.component';
import { DisambiguateComponent } from './disambiguate/disambiguate.component';
import { DisambiguateAccordChipsFieldComponent } from './disambiguate/disambiguation/disambiguate-accord-chips-field/disambiguate-accord-chips-field.component';
import { DisambiguateCardChipsFieldComponent } from './disambiguate/disambiguation/disambiguate-card-chips-field/disambiguate-card-chips-field.component';
import { DisambiguateCardFieldComponent } from './disambiguate/disambiguation/disambiguate-card-field/disambiguate-card-field.component';
import { DisambiguateRelationshipsComponent } from './disambiguate/disambiguation/disambiguate-relationships/disambiguate-relationships.component';
import { ShowOneRelationshipComponent } from './disambiguate/disambiguation/disambiguate-relationships/show-one-relationship/show-one-relationship.component';
import { DisambiguateTextFieldComponent } from './disambiguate/disambiguation/disambiguate-text-field/disambiguate-text-field.component';
import { DisambiguationComponent, Step3DisambiguateHelp } from './disambiguate/disambiguation/disambiguation.component';
import { CardItemInfoComponent } from './home/card-item-info/card-item-info.component';
import { CardSvgComponent } from './home/card-svg/card-svg.component';
import { CardsSliderComponent } from './home/cards-slider/cards-slider.component';
import { HomeComponent } from './home/home.component';
import { ImportComponent } from './import/import.component';
import { InputFileComponent } from './import/input-file/input-file.component';
import { EditAddressComponent } from './org-edit/edit-address/edit-address.component';
import { OrgFooterComponent } from './org-footer/org-footer.component';
import { OrgRoutingModule } from './org-routing.module';
import { OrgViewerComponent } from './org-viewer/org-viewer.component';
import { OrgRootComponent } from './org.component';
import { OrgService } from './org.service';
import { SearchListComponent } from './search-list/search-list.component';
import { SearchComponent } from './search/search.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';

import { ExpansionPanelLayoutComponent } from './wiki-organizations/profile-layouts/expansion-panel-layout/expansion-panel-layout.component';
import { TableLayoutComponent } from './wiki-organizations/profile-layouts/table-layout/table-layout.component';
import { WikiAuthorProfileComponent } from './wiki-organizations/profiles/wiki-author-profile/wiki-author-profile.component';
import { WikiAuthorsProfileComponent } from './wiki-organizations/profiles/wiki-authors-profile/wiki-authors-profile.component';
import { WikiOrgEmployesProfileComponent } from './wiki-organizations/profiles/wiki-org-employes-profile/wiki-org-employes-profile.component';
import { WikiTopicProfileComponent } from './wiki-organizations/profiles/wiki-topic-profile/wiki-topic-profile.component';
import { WikiTopicsProfileComponent } from './wiki-organizations/profiles/wiki-topics-profile/wiki-topics-profile.component';
import { WikiVenueProfileComponent } from './wiki-organizations/profiles/wiki-venue-profile/wiki-venue-profile.component';
import { WikiWorkProfileComponent } from './wiki-organizations/profiles/wiki-work-profile/wiki-work-profile.component';
import { OrgSearchWikiComponent } from './wiki-organizations/wiki-org-search/wiki-org-search.component';
import { WikiOrganizationsComponent } from './wiki-organizations/wiki-organizations.component';
import { OrgEditFormComponent, OrganizationDialogRelasionship, OrganizationDialogDeleteConfirm,
  OrganizationDialogInfoConfirm, OrganizationDialogorgEditAddress } from './org-edit/org-edit-form/org-edit-form.component';
import { OrgEditComponent } from './org-edit/org-edit.component';
import {CommentDialogComponent, OrgReviewerComponent} from './org-reviewer/org-reviewer.component';
import { RequestChangesListComponent } from './request-changes-list/request-changes-list.component';

export function storageFactory() : OAuthStorage
{
  return localStorage
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader
{
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    OrganizationDialogInfoConfirm,
    OrganizationDialogorgEditAddress,
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
    OrgFooterComponent,
    CardSvgComponent,
    CardItemInfoComponent,
    CardsSliderComponent,
    EditAddressComponent,

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
    OrgEditFormComponent,
    CommentDialogComponent,

    Step3DisambiguateHelp,

    OrgReviewerComponent,

    RequestChangesListComponent
  ],
  imports: [
    MatRadioModule,
    NgxChartsModule,

    BrowserAnimationsModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    CoreModule,
    StaticsModule,
    OrganizationsModule,
    TocoFormsModule,
    OrgRoutingModule,
    SearchModule,

    MarkdownModule.forRoot({
      loader: HttpClient
      }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    AuthenticationModule,
    MatomoModule
  ],
  entryComponents: [
    OrganizationDialogRelasionship,
    OrganizationDialogDeleteConfirm,
    OrganizationDialogInfoConfirm,
    OrganizationDialogorgEditAddress,
    Step3DisambiguateHelp,
    CommentDialogComponent,

  ],
  providers: [
    SearchService,
    // EnvServiceProvider,
    OrganizationServiceNoAuth,
    OrgService,
    { provide: Environment, useValue: environment }
    // { provide: OAuthStorage, useFactory: storageFactory },
    // { provide: HTTP_INTERCEPTORS, useClass: OauthAuthenticationService, multi: true }
  ],

  bootstrap: [OrgRootComponent]
})
export class OrgModule { }
