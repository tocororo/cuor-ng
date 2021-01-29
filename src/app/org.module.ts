
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// testing charts organizations
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from 'src/environments/environment';
import { AuthenticationModule, CoreModule, Environment, OrganizationServiceNoAuth, OrganizationsModule, SearchModule, SearchService, SharedModule, StaticsModule, TocoFormsModule } from 'toco-lib';
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
import { DisambiguationComponent } from './disambiguate/disambiguation/disambiguation.component';
import { HomeComponent } from './home/home.component';
import { ImportComponent } from './import/import.component';
import { InputFileComponent } from './import/input-file/input-file.component';
import { OrganizationDialogDeleteConfirm, OrganizationDialogInfoConfirm, OrganizationDialogorgEditAddress, OrganizationDialogRelasionship, OrgEditComponent } from './org-edit/org-edit.component';
import { OrgFooterComponent } from './org-footer/org-footer.component';
import { OrgRoutingModule } from './org-routing.module';
import { OrgViewerComponent } from './org-viewer/org-viewer.component';
import { OrgRootComponent } from './org.component';
import { OrgService } from './org.service';
import { SearchListComponent } from './search-list/search-list.component';
import { SearchComponent } from './search/search.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { CardSvgComponent } from './home/card-svg/card-svg.component';
import { CardItemInfoComponent } from './home/card-item-info/card-item-info.component';
import { CardsSliderComponent } from './home/cards-slider/cards-slider.component';
import { EditAddressComponent } from './org-edit/edit-address/edit-address.component';





export function storageFactory() : OAuthStorage {
  return localStorage
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
    EditAddressComponent
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
    OrganizationDialogDeleteConfirm,
    OrganizationDialogInfoConfirm,
    OrganizationDialogorgEditAddress
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
