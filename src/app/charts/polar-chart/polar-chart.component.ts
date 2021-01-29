import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.scss']
})
export class PolarChartComponent implements OnInit {
  view: any[] = [380, 370];

  @Input() public dataChild: Array<Object> = [];
  @Input() _yAxisLabel
  xAxisLabel=""

  // options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

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
    //console.log(this.dataChild);

    //Object.assign(this, {data:this.dataChild});
  }


  ngOnInit(): void{

    this.xAxisLabel = this._yAxisLabel
  }

  onSelect(event) {
    console.log(event);
  }

}
