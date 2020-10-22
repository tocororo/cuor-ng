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
  dataChild:[] = [];
  @Input()
  _yAxisLabel;
  @Output()
  aggrSelect = new EventEmitter<object>();

  // options
  view: any[] = [400, 300];
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
    domain: [/* '#5AA454', '#A10A28', '#C7B42C', */ '#4d4d4d']
  };

  constructor() {
    // Object.assign(this, this.dataChild)
  }

  ngOnInit(): void{
    this.xAxisLabel = this._yAxisLabel
    console.log("this.dataChild", this.dataChild);
    
  }

  onSelect(e) {
   
    console.log({key:this._yAxisLabel, bucket:{name:e.name, value:e.value}});
    this.aggrSelect.emit({key:this._yAxisLabel, buckets:{name:e.name, value:e.value}})
  }

}
