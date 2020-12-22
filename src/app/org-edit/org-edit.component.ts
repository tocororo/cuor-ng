import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSelect, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Hit, Identifier, IdentifierSchemas, Organization, OrganizationService, OrganizationRelationships, Relationship, EnvService, SearchService, MessageHandler, StatusCode, HandlerComponent } from 'toco-lib';
import { isUndefined } from 'util';
import { OrgService } from '../org.service';


@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrgEditComponent implements OnInit {

  org: Organization = new Organization();

  public orgFormGroup: FormGroup = this._formBuilder.group({ id: ''},[]);

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

  loading: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _orgService: OrgService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this._activatedRoute.data.subscribe(
			(data: { 'org': Hit<Organization> }) => {
        this.org = new Organization();
        console.log(this.org)
        console.log('AAAAAAAA AAAAAAAA  WWWW DDDDD')
        this.org.deepcopy(data.org.metadata);
        console.log(this.org)
        this.initData(this.org);
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
  private initData(orgInput: Organization){
    this.orgFormGroup = this._formBuilder.group({},[]);
    /* Gets the `Organization` data. */

    this.orgFormGroup = this._formBuilder.group({
      id: new FormControl(orgInput.id, Validators.required),

      acronyms: this.addItemsFormArray(orgInput.acronyms),

      aliases: this.addItemsFormArray(orgInput.aliases),

      established: new FormControl( orgInput.established, Validators.required),

      identifiers: this.addItemsFormArrayIdentifiers(orgInput.identifiers),

      labels: this.addItemsFormArray(orgInput.labels),

      name: new FormControl(orgInput.name),

      relationships: this.addItemsFormArrayRelationships(orgInput.relationships),

      status: new FormControl(orgInput.status? orgInput.status : "" ),

      types: this.addItemsFormArray(orgInput.types),


      addresses: new FormControl(orgInput.addresses, Validators.required),

      wikipedia_url: new FormControl(orgInput.wikipedia_url),

      email_address: new FormControl(orgInput.email_address),

      ip_addresses: this.addItemsFormArray(orgInput.ip_addresses),

      links: this.addItemsFormArray(orgInput.links)
    });

    this.identifiersControl = this.addItemsFormArrayIdentifiers(orgInput.identifiers);

    this.relationshipsControl = this.addItemsFormArrayRelationships(orgInput.relationships);
  }


  /******************************************************************
   * UPDATE FUNCTIONS
   ******************************************************************/
  update(){
    this.loading = true;
    // update orgFormGroup
    this.orgFormGroup.setControl('identifiers', this.identifiersControl)
    // this.orgFormGroup.setControl('relationships', this.relationshipsControl)
    console.log(this.orgFormGroup.value, this.orgFormGroup, 'QQWQWQWWWWssssszsaW')
    let edited = new Organization()
    edited.deepcopy(this.orgFormGroup.value)
    console.log(edited);

    // for (let i = 0; i < edited.addresses.length; i++) {
    //   const element = edited.addresses[i];
    //   if(element.primary == 'True'){

    //   }

    // }
    this._orgService.editOrganization(edited).subscribe({
      next: (result: Hit<Organization>) => {

        const m = new MessageHandler(null,this._dialog);
        m.showMessage(StatusCode.OK, "La Organización fue modificada correctamente", HandlerComponent.dialog, "Operación exitosa", "50%");

        this.initData(result.metadata);
      },
      error: err => {
        console.log(err);

        const m = new MessageHandler(this._snackBar);
        m.showMessage(StatusCode.OK, err.message)
      },
      complete: () => this.loading = false
    })
  }


  /******************************************************************
   * ACRONYMS FUNCTIONS
   ******************************************************************/
  addAcronyms(){
    this.org.acronyms.push("");
    (this.orgFormGroup.get('acronyms') as FormArray).push(this._formBuilder.control(''));
  }

  deleteAcronyms(pos: number){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('acronyms') as FormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.acronyms.splice(pos,1);
        (this.orgFormGroup.get('acronyms') as FormArray).removeAt(pos);
      }
    });
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

    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('aliases') as FormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.aliases.splice(pos,1);
        (this.orgFormGroup.get('aliases') as FormArray).removeAt(pos);
      }
    });

  }

  /******************************************************************
   * ACRONYMS FUNCTIONS
   ******************************************************************/

  addTypes(){
    this.org.types.push("");
    (this.orgFormGroup.get('types') as FormArray).push(this._formBuilder.control(''));
  }

  deleteTypes(pos: number){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('types') as FormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.types.splice(pos,1);
        (this.orgFormGroup.get('types') as FormArray).removeAt(pos);
      }
    });
  }
  typeSelectChanges(event){
    console.log("typeSelectChanges",event);
  }


  /******************************************************************
   * IDENTIFIERS FUNCTIONS
   ******************************************************************/

   public identifiersControl = this._formBuilder.array([]);

  addIdentifiers(){
    this.org.identifiers.push(new Identifier());
    (this.orgFormGroup.get('identifiers') as FormArray).push(this._formBuilder.group({
        idtype: new FormControl(""),
        value: new FormControl("")
      })
    );
    this.identifiersControl.push(this._formBuilder.group({
        idtype: new FormControl(""),
        value: new FormControl("")
      })
    );
  }

  deleteidentifiers(pos){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: this.identifiersControl.value[pos].idtype + ": " + this.identifiersControl.value[pos].value}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.identifiers.splice(pos,1);
        (this.orgFormGroup.get('identifiers') as FormArray).removeAt(pos);
        this.identifiersControl.removeAt(pos);
      }
    });
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

   public relationshipsControl = this._formBuilder.array([]);

  addItemsFormArrayRelationships(items: Array<Relationship>){
    let formArrayGroup = this._formBuilder.array([]);
    // items.forEach(element => {
    //   console.log('AAAAAAAAAAAA QWERR')
    //   console.log(element)
    //   formArrayGroup.push(this._formBuilder.group(
    //     {
    //       id: new FormControl(element.id),
    //       identifiers: this.addItemsFormArrayIdentifiers(element.identifiers),
    //       label: new FormControl(element.label),
    //       type: new FormControl(element.type)
    //     })
    //   );
    // });
    for (const key in items) {
      console.log('AAAAAAAAAAAA')
      console.log(key)
      console.log(items[key])
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
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: this.relationshipsControl.value[pos].label}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.relationships.splice(pos,1);
        (this.orgFormGroup.get('relationships') as FormArray).removeAt(pos);
        this.relationshipsControl.removeAt(pos);
      }
    });
  }

  addToRelationship(type: string): void {
    const dialogRef = this._dialog.open(OrganizationDialogRelasionship, {
      width: '60%',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Relationship) => {
      if (result) {
        result.type = type;
        this.org.relationships.push(result);
        this.orgFormGroup.setControl("relationships", this.addItemsFormArrayRelationships(this.org.relationships))
        this.relationshipsControl = this.addItemsFormArrayRelationships(this.org.relationships);
      }
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
    <div mat-dialog-actions align="end">
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
    this.data.identifiers = this.org.identifiers;
    this.data.label = this.org.name;
  }

}

@Component({
  selector: 'org-delete-confirm-dialog',
  template: `
    <h1 mat-dialog-title> Está usted seguro que desea eliminar a</h1>
    <div mat-dialog-content>
      {{data.label}}
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial color="warning">Eliminar</button>
    </div>
  `,
  styleUrls: ['./org-edit.component.scss']
})
export class OrganizationDialogDeleteConfirm {

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogDeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
