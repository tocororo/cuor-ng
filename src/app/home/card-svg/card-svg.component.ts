
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-svg',
  templateUrl: './card-svg.component.html',
  styleUrls: ['./card-svg.component.scss']
})
export class CardSvgComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public text: string;

  public constructor()
  {
    this.title = '';
    this.text = '';
  }

  public ngOnInit(): void
  { }
}
