import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.css']
})
export class PolarChartComponent implements OnInit {
  view: any[] = [380, 370];

  @Input() public dataChild: string;
  @Input() _yAxisLabel
  xAxisLabel=""

  // options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
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
