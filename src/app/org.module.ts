import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// testing charts organizations
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { OAuthStorage } from "angular-oauth2-oidc";
import { MarkdownModule } from "ngx-markdown";
import { environment } from "src/environments/environment";
import {
  AuthenticationModule,
  CoreModule,
  Environment,
  OrganizationServiceNoAuth,
  OrganizationsModule,
  SearchModule,
  SearchService,
  StaticsModule,
  TocoFormsModule
} from "toco-lib";
import { AggregationsComponent } from "./aggregations/aggregations.component";
import { BarVerticalComponent } from "./charts/bar-vertical/bar-vertical.component";
import { ChartsComponent } from "./charts/charts.component";
import { GaugeChartComponent } from "./charts/gauge-chart/gauge-chart.component";
import { PieGridComponent } from "./charts/pie-grid/pie-grid.component";
import { PolarChartComponent } from "./charts/polar-chart/polar-chart.component";
import { DatepickerYearComponent } from "./datepicker-year/datepicker-year.component";
import { DisambiguateComponent } from "./disambiguate/disambiguate.component";
import { DisambiguateAccordChipsFieldComponent } from "./disambiguate/disambiguation/disambiguate-accord-chips-field/disambiguate-accord-chips-field.component";
import { DisambiguateCardChipsFieldComponent } from "./disambiguate/disambiguation/disambiguate-card-chips-field/disambiguate-card-chips-field.component";
import { DisambiguateCardFieldComponent } from "./disambiguate/disambiguation/disambiguate-card-field/disambiguate-card-field.component";
import { DisambiguateRelationshipsComponent } from "./disambiguate/disambiguation/disambiguate-relationships/disambiguate-relationships.component";
import { ShowOneRelationshipComponent } from "./disambiguate/disambiguation/disambiguate-relationships/show-one-relationship/show-one-relationship.component";
import { DisambiguateTextFieldComponent } from "./disambiguate/disambiguation/disambiguate-text-field/disambiguate-text-field.component";
import {
  DisambiguationComponent,
  Step3DisambiguateHelp,
} from "./disambiguate/disambiguation/disambiguation.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { Error404Component } from "./error404/error404.component";
import { CardItemInfoComponent } from "./home/card-item-info/card-item-info.component";
import { CardSvgComponent } from "./home/card-svg/card-svg.component";
import { CardsSliderComponent } from "./home/cards-slider/cards-slider.component";
import { HomeComponent } from "./home/home.component";
import { ImportComponent } from "./import/import.component";
import { InputFileComponent } from "./import/input-file/input-file.component";
import { SceibaMenuAppsComponent } from "./menu-apps/menu-apps.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { EditAddressComponent } from "./org-edit/edit-address/edit-address.component";
import {
  OrgEditFormComponent,
  OrganizationDialogDeleteConfirm,
  OrganizationDialogInfoConfirm,
  OrganizationDialogRelasionship,
  OrganizationDialogorgEditAddress,
} from "./org-edit/org-edit-form/org-edit-form.component";
import { OrgEditComponent } from "./org-edit/org-edit.component";
import { OrgFooterComponent } from "./org-footer/org-footer.component";
import { OrgGetComponent } from "./org-get/org-get.component";
import {
  CommentDialogComponent,
  OrgReviewerComponent,
} from "./org-reviewer/org-reviewer.component";
import { OrgRoutingModule } from "./org-routing.module";
import { OrgViewerComponent } from "./org-viewer/org-viewer.component";
import { OrgRootComponent } from "./org.component";
import { OrgService } from "./org.service";
import { OrgsMapComponent } from "./orgs-map/orgs-map.component";
import {
  PdfDialogComponent,
  PdfExcelComponent,
} from "./pdf-excel/pdf-excel.component";
import { RequestChangesListComponent } from "./request-changes-list/request-changes-list.component";
import { SearchListComponent } from "./search-list/search-list.component";
import { SearchComponent } from "./search/search.component";
import { SharedModule } from "./shared/shared.module";
import { StaticPagesComponent } from "./static-pages/static-pages.component";
import { ExpansionPanelLayoutComponent } from "./wiki-organizations/profile-layouts/expansion-panel-layout/expansion-panel-layout.component";
import { TableLayoutComponent } from "./wiki-organizations/profile-layouts/table-layout/table-layout.component";
import { WikiAuthorProfileComponent } from "./wiki-organizations/profiles/wiki-author-profile/wiki-author-profile.component";
import { WikiAuthorsProfileComponent } from "./wiki-organizations/profiles/wiki-authors-profile/wiki-authors-profile.component";
import { WikiOrgEmployesProfileComponent } from "./wiki-organizations/profiles/wiki-org-employes-profile/wiki-org-employes-profile.component";
import { WikiTopicProfileComponent } from "./wiki-organizations/profiles/wiki-topic-profile/wiki-topic-profile.component";
import { WikiTopicsProfileComponent } from "./wiki-organizations/profiles/wiki-topics-profile/wiki-topics-profile.component";
import { WikiVenueProfileComponent } from "./wiki-organizations/profiles/wiki-venue-profile/wiki-venue-profile.component";
import { WikiWorkProfileComponent } from "./wiki-organizations/profiles/wiki-work-profile/wiki-work-profile.component";
import { OrgSearchWikiComponent } from "./wiki-organizations/wiki-org-search/wiki-org-search.component";
import { WikiOrganizationsComponent } from "./wiki-organizations/wiki-organizations.component";

export function storageFactory(): OAuthStorage {
  return localStorage;
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    OrgRootComponent,
    HomeComponent,
    SearchComponent,
    SearchListComponent,
    StaticPagesComponent,
    OrgViewerComponent,
    OrgGetComponent,
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
    // DialogChartComponent
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
    OrgsMapComponent,
    Error404Component,
    ErrorPageComponent,
    RequestChangesListComponent,
    NotificationsComponent,

    PdfExcelComponent,
    PdfDialogComponent,
    SceibaMenuAppsComponent,
  ],
  imports: [
    NgxChartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ReactiveFormsModule,
    CoreModule,
    StaticsModule,
    OrganizationsModule,
    TocoFormsModule,
    FormsModule,
    FlexLayoutModule,
    OrgRoutingModule,
    SearchModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    AuthenticationModule,
    // MatomoModule.forRoot({
    //   trackers: [
    //     {
    //       trackerUrl: environment.matomoUrl,
    //       siteId: environment.matomoSiteId,
    //     },
    //   ],
    //   routeTracking: {
    //     enable: true,
    //   },
    // }),
    // NotificationModule
  ],
  providers: [
    SearchService,
    // EnvServiceProvider,
    OrganizationServiceNoAuth,
    OrgService,
    { provide: Environment, useValue: environment },
    // { provide: OAuthStorage, useFactory: storageFactory },
    // { provide: HTTP_INTERCEPTORS, useClass: OauthAuthenticationService, multi: true }
  ],

  bootstrap: [OrgRootComponent],
})
export class OrgModule {}
