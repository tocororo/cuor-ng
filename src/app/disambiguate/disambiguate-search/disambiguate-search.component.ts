import { Component, OnInit } from '@angular/core';
import { AggregationsSelection, Organization, SearchResponse, SearchService } from 'toco-lib';
import { HttpParams } from '@angular/common/http';
import { NavigationExtras, ActivatedRoute, Router, Params } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-disambiguate-search',
  templateUrl: './disambiguate-search.component.html',
  styleUrls: ['./disambiguate-search.component.scss']
})
export class DisambiguateSearchComponent implements OnInit {

  // begin Layout stuff
  layoutPosition = [
    {
      name: "Derecha",
      layout: "row-reverse",
      aling: "center baseline",
      width: "22",
    },
    {
      name: "Izquierda",
      layout: "row",
      aling: "center baseline",
      width: "22",
    },
    {
      name: "Arriba",
      layout: "column",
      aling: "center center",
      width: "90",
    },
    {
      name: "Abajo",
      layout: "column-reverse",
      aling: "center center",
      width: "90",
    },
  ];
  currentlayout = this.layoutPosition[0];
  public changeLayoutPosition(index: number) {
    this.currentlayout = this.layoutPosition[index];
  }
  // end Layout stuff

  // begin paginator stuff
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 15, 25, 50, 100];
  // end paginator stuff

  query = "";
  aggrsSelection: AggregationsSelection = {};

  params: HttpParams;
  sr: SearchResponse<Organization>;
  queryParams: Params;
  navigationExtras: NavigationExtras;
  public constructor(
    private _searchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    
    this.query = "";

    this.activatedRoute.queryParamMap.subscribe({
      next: (initQueryParams) => {
        this.aggrsSelection = {};

        for (let index = 0; index < initQueryParams.keys.length; index++) {
          const key = initQueryParams.keys[index];

          switch (key) {
            case "size":
              this.pageSize = Number.parseInt(initQueryParams.get(key));
              break;

            case "page":
              this.pageIndex = Number.parseInt(initQueryParams.get(key));
              break;

            case "q":
              this.query = initQueryParams.get(key);
              break;

            default:
              if (!this.aggrsSelection.hasOwnProperty(key)) {
                this.aggrsSelection[key] = [];
              }
              this.aggrsSelection[key].push(initQueryParams.get(key));
              break;
          }
        }
        
        
        this.updateFetchParams();
        this.fetchSearchRequest();
      },

      error: (e) => {},
      
      complete: () => {},
    });
  }

  private updateFetchParams() {
    this.params = new HttpParams();

    this.params = this.params.set("size", this.pageSize.toString(10));

    this.params = this.params.set("page", (this.pageIndex + 1).toString(10));

    this.params = this.params.set("country", "Cuba");
    
    this.params = this.params.set("q", this.query);

    for (const aggrKey in this.aggrsSelection) {
      this.aggrsSelection[aggrKey].forEach((bucketKey) => {
        this.params = this.params.set(aggrKey, bucketKey);
      });
    }
  }

  public fetchSearchRequest() {
    this._searchService.getOrganizations(this.params).subscribe(
      (response: SearchResponse<Organization>) => {
        console.log(response);
        console.log("RESPONSE", response);

        // this.pageEvent.length = response.hits.total;
        this.sr = response;
        delete this.sr.aggregations["country"]
      },
      (error: any) => {
        console.log("ERROPR");
      },
      () => {
        console.log("END...");
      }
    );
  }

  public pageChange(event?: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateQueryParams();
  }

  public aggrChange(event?: AggregationsSelection): void {
    //console.log(event);
    this.aggrsSelection = event;
    this.updateQueryParams();
  }

  queryChange(event?: string) {
    //console.log(event);
    this.query = event;
    this.updateQueryParams();
  }

  private updateQueryParams() {
    this.queryParams = {};

    this.queryParams["size"] = this.pageSize.toString(10);

    this.queryParams["page"] = this.pageIndex.toString(10);

    this.queryParams["q"] = this.query;
    
    for (const aggrKey in this.aggrsSelection) {
      this.aggrsSelection[aggrKey].forEach((bucketKey) => {
        this.queryParams[aggrKey] = bucketKey;
      });
    }
    this.navigationExtras = {
      relativeTo: this.activatedRoute,
      queryParams: this.queryParams,
      queryParamsHandling: "",
    };

    this.router.navigate(["."], this.navigationExtras);
  }

}
