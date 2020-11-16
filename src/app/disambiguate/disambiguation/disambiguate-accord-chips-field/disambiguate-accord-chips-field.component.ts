import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-disambiguate-accord-chips-field',
  templateUrl: './disambiguate-accord-chips-field.component.html',
  styleUrls: ['./disambiguate-accord-chips-field.component.scss']
})
export class DisambiguateAccordChipsFieldComponent implements OnInit {

  @Input() isMaster: boolean = true; 
  @Input() accordionChipsTitle: string = null;
  @Input() contentList: string[] = null;

  @Output() propagate = new EventEmitter<string[]>();
  
  constructor() { }

  ngOnInit() {
  }

  onPropagate(message){
    this.propagate.emit(message)
  }

}
