import { Component, OnInit, Input } from '@angular/core';

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
