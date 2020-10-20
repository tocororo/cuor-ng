import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pie-grid',
  templateUrl: './pie-grid.component.html',
  styleUrls: ['./pie-grid.component.css']
})
export class PieGridComponent implements OnInit{

  view: any[] = [400, 400];

  @Input() public dataChild: string

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    /* Object.assign(this, { multi }); */
  }

  ngOnInit() {
    //Object.assign(this, this.dataChild );
  console.log(this.dataChild);
  
  }

  onSelect(event) {
    console.log(event);
  }

}
