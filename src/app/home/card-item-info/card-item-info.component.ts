import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-item-info',
  templateUrl: './card-item-info.component.html',
  styleUrls: ['./card-item-info.component.scss']
})
export class CardItemInfoComponent implements OnInit {

  @Input()
  title : string = '';

  @Input()
  info = [];

  selectedText: string = '';

  constructor() { }

  ngOnInit() {
    if (this.info) {
      this.selectedText = this.info[0].text;
    }
  }

  /**
   * selectedText
   */
  public selectedTextByPos(pos: number = 0) {
    this.selectedText = this.info[pos].text;
  }

}
