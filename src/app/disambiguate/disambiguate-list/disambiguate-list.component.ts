import { Component, OnInit, Input } from '@angular/core';
import { HitList, Organization, Hit, MessageHandler, StatusCode } from 'toco-lib';
import { MatCheckbox, MatSnackBar, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'app-disambiguate-list',
  templateUrl: './disambiguate-list.component.html',
  styleUrls: ['./disambiguate-list.component.scss']
})
export class DisambiguateListComponent implements OnInit {

  @Input()
  public hitList: HitList<Organization> ;

  displayedColumns: string[] = ['master', 'secundary', 'name', 'identifiers'];
  selection = new SelectionModel<Organization>(true, []);

  masterOrganization: Hit<Organization>;
  secundariesOrganizations: Hit<Organization>[] = [];

  checkBoxList: Array<MatCheckbox> = new Array()
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.hitList == undefined){
      this.hitList = new HitList();
    }
    
  }

  masterChanges(event){
    console.log("evento radioGroup", event, this.secundariesOrganizations);

    const postToDelete = this.secundariesOrganizations.indexOf(event.value);
    
    // eliminar el elemento secundario si ya esta marcado como master
    this.secundariesOrganizations.splice( postToDelete,1)
    // DESMARCAR el checkBox correspondiente al elemento secundario
    this.checkBoxList[postToDelete].checked = false
    // eliminar el checkbox de la lista para matener la correspondencia entre los dos arreglos
    this.checkBoxList.splice(postToDelete,1)
    console.log(this.secundariesOrganizations);
    
  }

  secundaryChanges(event, row : Hit<Organization>, checkBox: MatCheckbox){
    console.log("evento checkBox: ", event, row, checkBox);

    if (event.checked){
      if (this.masterOrganization === row){
        //event.preventDefault(); 
        //event.stopPropagation();
        const m = new MessageHandler(this._snackBar)
        m.showMessage(StatusCode.OK, "Esta organización ya está seleccionada como principal")
        checkBox.checked = false
      }
      else{
        this.secundariesOrganizations.push(row); 
        this.checkBoxList.push(checkBox);
      }
      
    }
    else {
      let pos = this.secundariesOrganizations.indexOf(row);
      this.secundariesOrganizations = this.secundariesOrganizations.filter(e => { return e.id !== row.id});
      // this.secundariesOrganizations = this.secundariesOrganizations.splice(pos-1, 1);
    }
    console.log("secundarios: ", this.secundariesOrganizations);
    
  }

  thereIsSelecion(){
    if (this.masterOrganization && this.secundariesOrganizations.length > 0){
      return true; 
    }

    return false;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Hit<Organization>): string {
    if (!row) {
      return 'deselect all';
    }
    return 'select row' + row.metadata.name;
  }

  goDisambiguate(){
    localStorage.setItem('master', JSON.stringify(this.masterOrganization));
    localStorage.setItem('secundaries', JSON.stringify(this.secundariesOrganizations));
    //console.log("Lista secundaria: -------- ", this.secundariesOrganizations);
    
    this.router.navigate(['disambiguation']);
  }

}
