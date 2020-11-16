import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Identifier, IdentifierSchemas, Relationship } from 'toco-lib';


@Component({
  selector: 'app-disambiguate-relationships',
  templateUrl: './disambiguate-relationships.component.html',
  styleUrls: ['./disambiguate-relationships.component.scss']
})
export class DisambiguateRelationshipsComponent implements OnInit, OnChanges {

  @Input() isMaster: boolean = true;
  @Input() contentList: Relationship[] = [];
  @Input() accordionTitle: string = '';
  //@Input() editingOrg: Hit<Organization> = null;

  @Output() propagate = new EventEmitter<Relationship[]>();

  children: Relationship[] = null;
  parents: Relationship[] = null;
  others: Relationship[] = null;

  constructor() { }
  ngOnChanges(): void {
    this.separatingRelationships();
  }

  ngOnInit() {
    this.children = new Array<Relationship>()
    this.parents = new Array<Relationship>()
    this.others = new Array<Relationship>()
    this.separatingRelationships();
  }

  separatingRelationships() {
    for (let item of this.contentList) {
      switch (item.type) {
        case 'parent':
          {
            this.parents.push(item);
            break;
          }

        case 'child':
          {
            this.children.push(item);
            break;
          }

        default:  /* 'related' */
          {
            this.others.push(item);
            break;
          }
      }
    }
  }

  onPropagate() {
    if (this.contentList && this.contentList.length) {
      this.propagate.emit(this.contentList)
    }
  }

  chageHere() {
    //esto es para probar, si sale hay hacer el metodo completo, que lleva mas logica quizas
    //this.editingOrg.metadata.relationships = this.contentList
  }

  getPropagateRelationships(relationships: []) {
    if (relationships && relationships.length) {
      this.propagate.emit(relationships)
    }
  }

}
