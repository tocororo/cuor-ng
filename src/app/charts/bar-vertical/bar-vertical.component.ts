import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

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
    // domain: [ //all grey
    //   // '#a6a6a6',
    //   '#828282',
    //   '#686868',
    //   '#4d4d4d',
    //   '#464646',
    //   '#3d3d3d',
    //   '#343434',
    //   '#252525',
    //   '#555555',
    //   '#434343',
    //   '#262626',
    //   '#000000'
    // ]
    domain: [ // all colors light
      '#A9A9A9',
      '#85E96E',
      '#E3E96E',
      '#E9AC6E',
      '#E96E70',
      '#E96EB6',
      '#AE6EE9',
      '#6F6EE9',
      '#6EBBE9',
      '#6EE9B5'
    ]
    // domain: [// all colors dark
    //   '#2F6E6F',
    //   '#2F6F40',
    //   '#6B6F2F',
    //   '#6F432F',
    //   '#6F2F4F',
    //   '#562F6F',
    //   '#302F6F',
    //   '#2F466F'
    // ]
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
