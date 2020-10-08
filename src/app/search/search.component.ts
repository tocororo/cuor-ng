import { Component, OnInit } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { SearchResponse, Organization } from "@toco/tools/entities";
import { SearchService } from "@toco/tools/backend";
import { PageEvent } from "@angular/material";
import { AggregationsSelection } from "@toco/tools/search/aggregations/aggregations.component";
import {
  ActivatedRoute,
  Router,
  NavigationExtras,
  Params,
} from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
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
        console.log(initQueryParams);

        for (let index = 0; index < initQueryParams.keys.length; index++) {
          const key = initQueryParams.keys[index];
          console.log(initQueryParams.get(key));

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
        
        console.log(this.aggrsSelection);
        
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
    console.log(event);
    this.aggrsSelection = event;
    this.updateQueryParams();
  }

  queryChange(event?: string) {
    console.log(event);
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
