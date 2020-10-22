import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Aggr } from 'toco-lib';

export interface AggregationsSelection{
  [id: string]: string[] 
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit  {

  @Input() 
  aggregation_value: Aggr ;
  @Input() 
  _yAxisLabel: string; 
  @Input()
  typeChart:string
  charts:Array<any>;
  @Output()
  aggrSelected = new EventEmitter<object>();
  

  ngOnInit(): void{
    
    this.charts = new Array()
    for (let index = 0; index < this.aggregation_value.buckets.length; index++) {
        this.charts.push({name:this.aggregation_value.buckets[index].key, value:this.aggregation_value.buckets[index].doc_count});      
    }
  }

  _aggrSelect(new_aggr){
    
    this.aggrSelected.emit(new_aggr)
  }
  // @Input() dataMulti = multi
  // @Input() dataSingle = single
  // @Input() type: string = 'Vertical Bar'
  // @Input() xAxis = 
  // @Input() yAxis = 
  //dataMulti = multi
  //dataSingle = single

}
