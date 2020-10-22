import { Component, Input, OnInit } from '@angular/core';

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
    //Object.assign(this, { single });
  }

  ngOnInit(): void{
    this.xAxisLabel = this._yAxisLabel
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

}
