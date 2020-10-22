import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AggregationsSelection } from 'toco-lib';

@Component({
  selector: 'app-bar-vertical',
  templateUrl: './bar-vertical.component.html',
  styleUrls: ['./bar-vertical.component.scss']
})
export class BarVerticalComponent implements OnInit{

  //single: any[];
  //multi: any[];

  bucket: Array<any> = new Array<any>() //{name:e.name, value:e.value}

  @Input()
  dataChild: Array<Object> = [];
  @Input()
  _yAxisLabel;
  @Output()
  aggrSelect = new EventEmitter<object>();

  // options
  view: any[] = [300, 300];
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  xAxisLabel = '';
  yAxisLabel = "";
  maxYAxisTickLength = false
  maxXAxisTickLength = false

  colorScheme = {
    domain: [
      // '#a6a6a6',
      '#828282',
      '#686868',
      '#4d4d4d',
      '#464646',
      '#3d3d3d',
      '#343434',
      '#252525',
      '#555555',
      '#434343',
      '#262626',
      '#000000'
    ]
  };

  constructor() {
    // Object.assign(this, this.dataChild)
  }

  ngOnInit(): void{
    this.xAxisLabel = this._yAxisLabel
    
  }

  onSelect(e) {
    this.aggrSelect.emit({key:this._yAxisLabel, buckets:{name:e.name, value:e.value}})
  }

}
