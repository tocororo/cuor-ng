import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Relationship } from 'toco-lib';

@Component({
  selector: 'app-show-one-relationship',
  templateUrl: './show-one-relationship.component.html',
  styleUrls: ['./show-one-relationship.component.scss']
})
export class ShowOneRelationshipComponent implements OnInit {

  @Input() isMaster: boolean = true;
  @Input() accordionTitle: string = '';
  @Input() contentList: Relationship[] = null;
  //@Input() editingOrg: Hit<Organization> = null;

  @Output() propagate = new EventEmitter<Relationship[]>();

  constructor() { }

  ngOnInit() {
  }

  onPropagate(message){
    this.propagate.emit(message)
  }

  chageHere(){
    //esto es para probar, si sale hay hacer el metodo completo, que lleva mas logica quizas
    //this.editingOrg.metadata.relationships = this.contentList
  }

}
