import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-svg',
  templateUrl: './card-svg.component.html',
  styleUrls: ['./card-svg.component.scss']
})
export class CardSvgComponent implements OnInit {

  @Input()
  title: string = '';

  @Input()
  text: string = '';
  constructor() { }

  ngOnInit() {
  }

}
