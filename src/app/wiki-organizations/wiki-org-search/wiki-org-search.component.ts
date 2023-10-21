import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Organization } from 'toco-lib';
import { QueryOrgSearch } from '../../../services/query-wiki-org-search.service';

export interface Country {
  QID: string;
  label: string;
}

@Component({
  selector: 'wiki-org-search',  //'app-org-search-wiki',
  templateUrl: './wiki-org-search.component.html',
  styleUrls: ['./wiki-org-search.component.scss']
})
export class OrgSearchWikiComponent implements OnInit {

  orgCtrl = new UntypedFormControl('');
  country: string = 'Q241';
  position: string = 'below'
  filteredOrg: any = [];
  filteredSimilarsOrg = [];
  searchLabel = "";
  toSearch = 0;
  search = null;
  filteredCountry: Country[] = [];
  filteredOptions: Observable<Country[]>;
  countryCtrl = new UntypedFormControl('Cuba');
  filtro = false;
  autocompleteFilter=false;
  checkedAll = false;
  checkedOne = false;
  checkedCuba = true;



  @Input()
  width: number = 100;

  @Input()
  placeholder: string = "Escriba al menos 3 letras";

  @Input()
  label: string = "Busque una organización";

  @Input()
  orgLabel: string = "";

  @Input()
  appearance: string = "outline";

  /**
   * Input `cleaning` is a boolen, if true then clean the search
   */
  @Input()
  cleaning: boolean = false;

  @Output()
  selectedOrg: EventEmitter<Organization> = new EventEmitter<Organization>();

 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private queryQueryOrgSearch: QueryOrgSearch,
    private querySimilar: QueryOrgSearch) { }

   ngOnInit() {
    this.orgCtrl.valueChanges
      .subscribe({
        next:  (orgValueChanges) => {
          this.toSearch++;
          // this condition check if the param is a `string` an if at least write 3 letters
          if (this.toSearch > 3 && typeof orgValueChanges === 'string') {
            this.toSearch = 0;
            //this.filteredOrg =  queryOrganizations(orgValueChanges, this.country)
            this.queryQueryOrgSearch.queryOrganizations(orgValueChanges, this.country).subscribe({
              next: res => {
                this.filteredOrg = res;
              },
              error: err => console.log(err)
            });

          }
        }
      })

    this.queryQueryOrgSearch.queryCountries().subscribe({
      next: res => {
        this.filteredCountry = res;
        this.filteredOptions = this.countryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filter(label) : res.slice())
      );
        console.log(res);        
      },
      error: err => console.log(err)      
    })
  }

  searchOrg() {
    if (typeof this.orgCtrl.value === 'string' && this.orgCtrl.value != '') {
    this.querySimilar.getSimilars(this.orgCtrl.value).subscribe({
      next: res => {  
        if (res && typeof res === 'object') {
              this.filteredSimilarsOrg = res;  
              if (this.filteredSimilarsOrg.length > 0) {
                this.search = true;
                this.searchLabel = this.orgCtrl.value;
                this.orgCtrl.setValue("");
              } else {
                this.search = false;
                this.orgCtrl.setValue("");
              }     
        }      
      },
      error: err => console.log(err)
    });      
  }
  }

  /* This function redirect to the profile for employes and afiliates od the organization
   * 
   */
  redirectProfile(QID, newlabel, lang) {
    //localStorage.setItem('localParams',JSON.stringify({QID:QID, label:newlabel, lang:lang}))
    this.router.navigate(['wiki-organizations/organization'], {
      queryParams: { QID: QID, label: newlabel, lang: lang },
      queryParamsHandling: 'merge'
    })
    this.search = null;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  };

  chooseCountry(QID) {
    this.country = QID;
    this.filtro = false;
    this.autocompleteFilter = false;
    this.checkedCuba = false;
  };

  changeOne() {
    this.checkedOne = true;
    this.autocompleteFilter = true;
    this.checkedCuba = false;
    this.checkedAll = false;
  };

  defaultCountry(){
    this.country = 'Q241';
    this.checkedCuba = true;
    this.checkedAll = false;
    this.checkedOne = false;
    this.filtro = false;
    this.autocompleteFilter = false;
  };

  changeAll() {
    this.country = '';
    this.checkedAll = true;
    this.checkedOne = false;
    this.checkedCuba = false;
    this.filtro = false;
    this.autocompleteFilter = false;
  };

  displayFiltro(){
    this.filtro = true
  }

  displayFn(country: Country): string {
    return country && country.label ? country.label : '';
  };

  private _filter(label: string): Country[] {
    const filterValue = label.toLowerCase();

    this.filteredCountry = this.filteredCountry.filter((arr, index) => {
      const _arr = JSON.stringify(arr);
      return index === this.filteredCountry.findIndex(obj => {
            return JSON.stringify(obj) === _arr
      });
    });
    return this.filteredCountry.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  };

}
