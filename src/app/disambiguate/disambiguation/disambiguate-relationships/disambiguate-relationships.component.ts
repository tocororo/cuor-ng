import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Relationship } from 'toco-lib';


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

  children: Relationship[];
  parents: Relationship[];
  others: Relationship[];

  constructor() { }
  
  ngOnChanges(): void {
    if (this.parents != undefined && this.children != undefined && this.others != undefined )
      this.separatingRelationships();
  }

  ngOnInit() {
    this.separatingRelationships();
  }

  separatingRelationships() {
    this.children = new Array<Relationship>()
    this.parents = new Array<Relationship>()
    this.others = new Array<Relationship>()

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
