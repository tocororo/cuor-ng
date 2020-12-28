import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-disambiguate-text-field',
  templateUrl: './disambiguate-text-field.component.html',
  styleUrls: ['./disambiguate-text-field.component.scss']
})
export class DisambiguateTextFieldComponent implements OnInit {

  @Input() isMaster: boolean = true;
  @Input() textLabel: string = null;
  @Input() textContent: string = null;

  @Output() propagate = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit() {
  }

  onPropagate(message){
    this.propagate.emit(message)
  }

}
