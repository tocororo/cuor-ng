import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pie-grid',
  templateUrl: './pie-grid.component.html',
  styleUrls: ['./pie-grid.component.scss']
})
export class PieGridComponent implements OnInit{

  view: any[] = [400, 400];

  @Input() public dataChild: Array<Object> = [];

  @Input() public _yAxisLabel: string;

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

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
    /* Object.assign(this, { multi }); */
  }

  ngOnInit() {
    //Object.assign(this, this.dataChild );
  
  }

  onSelect(event) {
  }

}
