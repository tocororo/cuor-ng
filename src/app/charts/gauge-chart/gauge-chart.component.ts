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
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
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
