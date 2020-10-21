import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Hit, Identifier, IdentifierSchemas, Organization, OrganizationService, OrganizationRelationships, Relationship } from 'toco-lib';
import { isUndefined } from 'util';


@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrgEditComponent implements OnInit {

  org: Organization = new Organization();

  public orgFormGroup: FormGroup;

  // TODO: pasar para organization.entity, es similar a organizationRelationship
  selectOptions = [
    {
      'label': 'Educación',
      'value': 'Education'
    },
    {
      'label': 'Salud',
      'value': 'Healthcare'
    },
    {
      'label': 'Compañía',
      'value': 'Company'
    },
    {
      'label': 'Archivo',
      'value': 'Archive'
    },
    {
      'label': 'Sin fines de Lucro',
      'value': 'Nonprofit'
    },
    {
      'label': 'Gobierno',
      'value': 'Government'
    },
    {
      'label': 'Instalación',
      'value': 'Facility'
    },
    {
      'label': 'Otra',
      'value': 'Other'
    }
  ];

  selectOptionsIdType = [];

  orgRelationships = OrganizationRelationships;


  constructor(
    private _activatedRoute: ActivatedRoute, 
    private _formBuilder: FormBuilder,
    private _orgservice: OrganizationService,
    private _dialog: MatDialog) { }

  ngOnInit() {
    this.orgFormGroup = this._formBuilder.group({},[])
    /* Gets the `Organization` data. */
		this._activatedRoute.data.subscribe(
			(data: { 'org': Hit<Organization> }) => {

        this.org.deepcopy(data.org.metadata);

        this.orgFormGroup = this._formBuilder.group({
          id: new FormControl(this.org.id, Validators.required),

          acronyms: this.addItemsFormArray(this.org.acronyms),

          aliases: this.addItemsFormArray(this.org.aliases),

          addresses: new FormControl({value: this.org.addresses, disabled: true}, Validators.required),

          established: new FormControl( this.org.established, Validators.required),

          identifiers: this.addItemsFormArrayIdentifiers(this.org.identifiers),

          labels: this.addItemsFormArray(this.org.labels),

          name: new FormControl({value: this.org.name, disabled: true}, Validators.required),

          relationships: this.addItemsFormArrayRelationships(this.org.relationships),

          status: new FormControl({value: this.org.status? this.org.status : "" , disabled: true}, Validators.required),

          types: this.addItemsFormArray(this.org.types),
        });

      }
    )
    for (const key in IdentifierSchemas) {
      this.selectOptionsIdType.push({ idtype: IdentifierSchemas[key], value: IdentifierSchemas[key]})
    }
    // console.log('Data got for editing: ', this.org, this.orgFormGroup);
  }

  /******************************************************************
   * UPDATE FUNCTIONS
   ******************************************************************/
  update(){
    console.log("update: ", this.orgFormGroup.valid, this.orgFormGroup);
    // this._orgservice.update()
  }


  /******************************************************************
   * ACRONYMS FUNCTIONS
   ******************************************************************/
  addAcronyms(){
    this.org.acronyms.push("");
    (this.orgFormGroup.get('acronyms') as FormArray).push(this._formBuilder.control(''));
  }

  deleteAcronyms(pos: number){
    this.org.acronyms.splice(pos,1);
    console.log(pos, this.org.acronyms);
    (this.orgFormGroup.get('acronyms') as FormArray).removeAt(pos);
  }

  addItemsFormArray(items: any[]){
    let formArrayGroup = this._formBuilder.array([]);
    if (isUndefined(items)){
      formArrayGroup.push(this._formBuilder.control(''));
    }
    else {
      for (const key in items) {
        formArrayGroup.push(this._formBuilder.control(items[key]));
      }
    }
    return formArrayGroup
  }

  /******************************************************************
   * ALIASES FUNCTIONS
   ******************************************************************/
  addAliases(){
    this.org.aliases.push("");
    (this.orgFormGroup.get('aliases') as FormArray).push(this._formBuilder.control(''));
  }

  deleteAliases(pos: number){
    this.org.aliases.splice(pos,1);
    console.log(pos, this.org.aliases);
    (this.orgFormGroup.get('aliases') as FormArray).removeAt(pos);
  }

  /******************************************************************
   * ACRONYMS FUNCTIONS
   ******************************************************************/
  addTypes(){
    this.org.types.push("");
    (this.orgFormGroup.get('types') as FormArray).push(this._formBuilder.control(''));
  }

  deleteTypes(pos: number){
    this.org.types.splice(pos,1);
    console.log(pos, this.org.types);
    (this.orgFormGroup.get('types') as FormArray).removeAt(pos);
  }

  /******************************************************************
   * IDENTIFIERS FUNCTIONS
   ******************************************************************/

  addIdentifiers(){
    this.org.identifiers.push(new Identifier());
    (this.orgFormGroup.get('identifiers') as FormArray).push(this._formBuilder.group({
        idtype: new FormControl(""),
        value: new FormControl("")
      }))
  }

  deleteidentifiers(pos){
    this.org.identifiers.splice(pos,1);
    (this.orgFormGroup.get('identifiers') as FormArray).removeAt(pos);
  }

  addItemsFormArrayIdentifiers(items: any[]){
    let formArrayGroup = this._formBuilder.array([]);
    for (const key in items) {
      formArrayGroup.push(this._formBuilder.group(
        {
          idtype: new FormControl(items[key].idtype),
          value: new FormControl(items[key].value)
        })
      );
    }
    return formArrayGroup
  }

  /******************************************************************
   * RELATIONSHIPS FUNCTIONS
   ******************************************************************/

  addItemsFormArrayRelationships(items: any[]){
    let formArrayGroup = this._formBuilder.array([]);
    for (const key in items) {
      formArrayGroup.push(this._formBuilder.group(
        {
          id: new FormControl(items[key].id),
          identifiers: this.addItemsFormArrayIdentifiers(items[key].identifiers),
          label: new FormControl(items[key].label),
          type: new FormControl(items[key].type)
        })
      );
    }
    return formArrayGroup
  }

  deleteRelationship(pos){
    this.org.identifiers.splice(pos,1);
    (this.orgFormGroup.get('relationships') as FormArray).removeAt(pos);
  }

  openDialog(type: string): void {
    const dialogRef = this._dialog.open(OrganizationDialogRelasionship, {
      width: '60%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Relationship) => {
      console.log('The dialog was closed');
      console.log("dialog-result", result);
      result.type = type;
      this.org.relationships.push(result);
      this.orgFormGroup.setControl("relationships", this.addItemsFormArrayRelationships(this.org.relationships))
    });
  }

}




@Component({
  selector: 'org-dialog-relationship-add',
  template: `
    <h1 mat-dialog-title> Seleccione la Organización </h1>
    <div mat-dialog-content>
      <toco-org-search (selectedOrg)="selectedOrg($event)"></toco-org-search>
      <br />
      <mat-form-field appearance="outline" class="w-100">
          <mat-label>Nombre</mat-label>
          <input matInput placeholder="Escriba el nombre de la Organización" [value]="org.name" disabled>
      </mat-form-field>
      <!-- *ngIf="org.identifiers && org.identifiers.length" -->
      <static-table 
          [desc]="'Lista de los identificadores de la organización'" [value]="org.identifiers"
          [columnsObjectProperty]="['idtype', 'value']"
          [columnsHeaderText]="['Identifier type', 'Identifier value']">
      </static-table>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Adicionar</button>
    </div>
  `,
  styleUrls: ['./org-edit.component.scss']
})
export class OrganizationDialogRelasionship {

  org:Organization = new Organization;

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogRelasionship>,
    @Inject(MAT_DIALOG_DATA) public data: Relationship) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedOrg(event){
    this.org.deepcopy(event)
    console.log(event);
    this.data.id = this.org.id;
    this.data.identifiers = this.org.identifiers;
    this.data.label = this.org.name;
  }

}
