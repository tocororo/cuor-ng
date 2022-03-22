
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Aggr, AggregationsSelection } from 'toco-lib';

import { ChartType } from "../charts/chart-utils";

@Component({
  selector: "toco-search-aggregations-visual",
  templateUrl: "./aggregations.component.html",
  styleUrls: ["./aggregations.component.scss"],
})
export class AggregationsComponent implements OnInit {
  @Input()
  aggregations: { [id: string]: Aggr } = { };

  @Input()
  chartType: ChartType;

  /***
   * {
   *  'country': ['Cuba','Peru'],
   *  'state': ['New York']
   *  ...
   * }
   *
   * in the aggregation country, buckets 'Cuba' and 'Peru' are selected
   * in the aggregation state, bucket 'New York' is selected
   *
   */
  @Input()
  selectedAggr: AggregationsSelection = { };

  @Output()
  keySelect = new EventEmitter<AggregationsSelection>();

  /* @Output()
  aggrSelected = new EventEmitter<object>(); */

  keys = [];

  constructor() {}

  ngOnInit() {
    for (const key in this.aggregations) {
      if (this.aggregations.hasOwnProperty(key)) {
        const element = this.aggregations[key];
        //this.keys.push(key);
        this.keys.push({"key":key, "sp":this._translate(key)});
      }
    }
  }

  //aqui se agregan los casos que puedan haber en las agregaciones para q salgan siempre en español
  // o traducirse
  private _translate(key){
    switch (key)
    {
      case "status": {
        return "Estado";
      }
      case "country": {
        return "País";
      }
      case "state": {
        return "Provincia (Estado)";
      }
      case "types": {
        return "Tipos";
      }

    }

    return key;
  }


  /* isSelected(aggrKey, bucket: AggrBucket) {

    if (this.selectedAggr.hasOwnProperty(aggrKey)) {
      for (let index = 0; index < this.selectedAggr[aggrKey].length; index++) {
        const element = this.selectedAggr[aggrKey][index];
        if (element == bucket.key) {
          // console.log(this.selectedAggr, aggrKey, bucket);
          // console.log("--------------------");

          return true;
        }
      }
      // this.selectedAggr[aggrKey].forEach((key) => {
      //   if (key == bucket.key) {
      //     console.log(this.selectedAggr, aggrKey, bucket);
      //     console.log("--------------------");

      //     return true;
      //   }
      // });
    }
    // console.log("FALSE");

    return false;
  } */

  selectionChange(new_aggr) {

    if (!this.selectedAggr.hasOwnProperty(new_aggr.key)){
      this.selectedAggr[new_aggr.key] = [];
    }

      if (this.selectedAggr[new_aggr.key].find(k => k == new_aggr.bucket.name)){
        this.selectedAggr[new_aggr.key] = this.selectedAggr[new_aggr.key].filter(k => k != new_aggr.bucket.name);
      } else{
        this.selectedAggr[new_aggr.key].push(new_aggr.bucket.name)
      }


    this.keySelect.emit(this.selectedAggr);
  }

  /* _aggrSelect(e){
    this.aggrSelected.emit(e)
  } */
}
