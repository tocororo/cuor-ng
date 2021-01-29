import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent  {

  @Input() public dataChild: string;
  @Input() public _yAxisLabel: string;

  view: any[] = [400, 300];
  legend: boolean = false;
  legendPosition: string = 'below';
  xAxisLabel=''

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
    //Object.assign(this, { single });
  }

  ngOnInit(): void{
    this.xAxisLabel = this._yAxisLabel
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

}
