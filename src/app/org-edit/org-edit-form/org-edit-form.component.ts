import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Address, Identifier, LabelDiffLang, Organization, OrganizationRelationships, Relationship } from 'toco-lib';
import { isUndefined } from 'util';
import { OrgService } from '../../_services/org.service';


@Component({
  selector: 'org-edit-form',
  templateUrl: './org-edit-form.component.html',
  styleUrls: ['./org-edit-form.component.scss']
})
export class OrgEditFormComponent implements OnInit, OnChanges {

  @Input() org: Organization;
  @Input() loading: boolean = true;
  @Input() editDisabled: boolean = false;
  public pathname: string;
  public indicator: string = 'Nuevos cambios';
  orgFormGroup: UntypedFormGroup = this._formBuilder.group({ id: ''},[]);

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

  idtypes = ["grid","wkdata","ror","isni","fudref","orgref","reup", "orgaid"];

  iso639;

  selectOptionsIdType = [];

  orgRelationships = OrganizationRelationships;

  urlRegExpression = '(https?://)?([\\da-z@:%=?$#._\+~#=.-]+)\\.([a-z@:%=?$#._\+~#=.]{2,6})[/\\w\\da-z@:%=?$#._\+~#= .-]*/?';

  today = Date.now();
  dateMin : Date = new Date(1900);


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _orgService: OrgService) { }

  copyOrg(){
    let newOrg = new Organization();
    newOrg.deepcopy(this.org);
    this.org = newOrg;
  }

  ngOnInit() {
    this._activatedRoute.url.subscribe(path => {
      this.pathname = path[1].path;
    });

    this.copyOrg();
    this.initData();
    this.loading = false;
    console.log("init before date inic ", this.org);

    if(this.org.established)
    {
      this.setDateYearMin(this.org.established);
      console.log("onei ", this.dateMin);

    }

    this.iso639 = this._orgService.getISO639();

    for (let key of this.idtypes) {
      this.selectOptionsIdType.push({ idtype: key, value: key})
    }
    // console.log('Data got for editing: ', this.org, this.orgFormGroup);
  }

  ngOnChanges(){

    this.copyOrg();
    this.initData();
    this.loading = false;

    //console.log("entro a el onchanges ", this.org);

  }

  setDateYearMin(newYear){
    this.dateMin.setFullYear(newYear);
  }

  /******************************************************************
   * UPDATE FUNCTIONS
   ******************************************************************/

  public identifierCanBeDeleted(idType:string) {
    return (idType != 'reup');
  }

  reportIdentifiersError(pos){

  }

  initData(){

    if(this.org){
      this.orgFormGroup = this._formBuilder.group({
        id: new UntypedFormControl(this.org.id, Validators.required),

        acronyms: this.addItemsFormArray(this.org.acronyms),

        aliases: this.addItemsFormArray(this.org.aliases),

        established: new UntypedFormControl( this.org.established, Validators.required),

        onei_registry: new UntypedFormControl( this.org.onei_registry),

        identifiers: this.addItemsFormArrayIdentifiers(this.org.identifiers),

        labels: this.addItemsFormArrayLabels(this.org.labels),

        name: new UntypedFormControl({value: this.org.name, disabled: true}, Validators.required),

        relationships: this.addItemsFormArrayRelationships(this.org.relationships),

        status: new UntypedFormControl(this.org.status? this.org.status : "" ),

        types: this.addItemsFormArray(this.org.types),


        addresses: this.addItemsFormArrayAddresses(this.org.addresses),

        wikipedia_url: new UntypedFormControl(this.org.wikipedia_url, [Validators.nullValidator, Validators.pattern(this.urlRegExpression)]),

        email_address: new UntypedFormControl(this.org.email_address, [Validators.nullValidator, Validators.email]),

        ip_addresses: this.addItemsFormArray(this.org.ip_addresses),

        links: this.addItemsFormArray(this.org.links, this.urlRegExpression)
      });

      this.identifiersControl = this.addItemsFormArrayIdentifiers(this.org.identifiers);

      this.labelsControl = this.addItemsFormArrayLabels(this.org.labels);

      this.relationshipsControl = this.addItemsFormArrayRelationships(this.org.relationships);

      this.addressesControl = this.addItemsFormArrayAddresses(this.org.addresses);

    }

  }

  fillObjectControls(){
    this.orgFormGroup.setControl('identifiers', this.identifiersControl);
    this.orgFormGroup.setControl('labels', this.labelsControl)
  }

  editInputName(){

    const dialogRef = this._dialog.open(OrganizationDialogInfoConfirm, {
      width: '40%',
      data: { label: this.orgFormGroup.controls['name'].value}
    });

    dialogRef.afterClosed().subscribe((isUpdated: boolean) => {
      if(isUpdated){
        this.orgFormGroup.setControl('name', new UntypedFormControl(this.orgFormGroup.controls['name'].value, Validators.required));
      }
    });

  }

  /******************************************************************
   * ACRONYMS FUNCTIONS
   ******************************************************************/
  addAcronyms(){
    this.org.acronyms.push("");
    (this.orgFormGroup.get('acronyms') as UntypedFormArray).push(this._formBuilder.control(''));
  }

  deleteAcronyms(pos: number){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('acronyms') as UntypedFormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.acronyms.splice(pos,1);
        (this.orgFormGroup.get('acronyms') as UntypedFormArray).removeAt(pos);
      }
    });
  }

  addItemsFormArray(items: any[], pattern: string = ""){
    let formArrayGroup = this._formBuilder.array([]);
    if (isUndefined(items)){
      formArrayGroup.push(this._formBuilder.control('', Validators.pattern(pattern)));
    }
    else {
      for (const key in items) {
        formArrayGroup.push(this._formBuilder.control(items[key], Validators.pattern(pattern)));
      }
    }
    return formArrayGroup
  }

  /******************************************************************
   * LINKS FUNCTIONS
   ******************************************************************/
  addlinks(){
    //const regUrl = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.org.links.push("");
    (this.orgFormGroup.get('links') as UntypedFormArray).push(this._formBuilder.control('', Validators.pattern(this.urlRegExpression)));
  }

  deletelinks(pos: number){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('links') as UntypedFormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.links.splice(pos,1);
        (this.orgFormGroup.get('links') as UntypedFormArray).removeAt(pos);
      }
    });
  }

  /******************************************************************
   * ALIASES FUNCTIONS
   ******************************************************************/
  addAliases(){
    this.org.aliases.push("");
    (this.orgFormGroup.get('aliases') as UntypedFormArray).push(this._formBuilder.control(''));
  }

  deleteAliases(pos: number){

    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('aliases') as UntypedFormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.aliases.splice(pos,1);
        (this.orgFormGroup.get('aliases') as UntypedFormArray).removeAt(pos);
      }
    });

  }

  /******************************************************************
   * TYPES FUNCTIONS
   ******************************************************************/

  addTypes(){
    this.org.types.push("");
    (this.orgFormGroup.get('types') as UntypedFormArray).push(this._formBuilder.control(''));
  }

  deleteTypes(pos: number){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('types') as UntypedFormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.types.splice(pos,1);
        (this.orgFormGroup.get('types') as UntypedFormArray).removeAt(pos);
      }
    });
  }
  typeSelectChanges(event){
    console.log("typeSelectChanges",event);
  }

  /******************************************************************
   * LABELS FUNCTIONS
   ******************************************************************/

  public labelsControl = this._formBuilder.array([]);
  addLabels(){
    this.org.labels.push(new LabelDiffLang());
    (this.orgFormGroup.get('labels') as UntypedFormArray).push(this._formBuilder.group({
        label: new UntypedFormControl(""),
        iso639: new UntypedFormControl("")
      })
    );
    this.labelsControl.push(this._formBuilder.group({
        label: new UntypedFormControl(""),
        iso639: new UntypedFormControl("")
      })
    );
    //console.log(this.org, this.orgFormGroup, this.labelsControl);
  }

  deleteLabels(pos){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: this.labelsControl.value[pos].iso639 + ": " + this.labelsControl.value[pos].label}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.labels.splice(pos,1);
        (this.orgFormGroup.get('labels') as UntypedFormArray).removeAt(pos);
        this.labelsControl.removeAt(pos);
      }
    });
  }

  addItemsFormArrayLabels(items: any[]){
    let formArrayGroup = this._formBuilder.array([]);
    for (const key in items) {
      formArrayGroup.push(this._formBuilder.group(
        {
          label: new UntypedFormControl(items[key].label),
          iso639: new UntypedFormControl(items[key].iso639)
        })
      );
    }
    return formArrayGroup
  }

  /******************************************************************
   * ADDRESSES FUNCTIONS
   ******************************************************************/

  public addressesControl = this._formBuilder.array([]);
  addaddress(){
    const dialogRef = this._dialog.open(OrganizationDialogorgEditAddress, {
      width: '60%',
      data: { }
    });

    dialogRef.afterClosed().subscribe({
      next: (result: Address) => {
        if (result && dialogRef.componentInstance.data.address) {
          //console.log("result", result, dialogRef.componentInstance.data);
          this.org.addresses.push((dialogRef.componentInstance.data.address as UntypedFormGroup).value);
          // changes other as `primary`
          if (this.org.addresses[this.org.addresses.length -1].primary){
          this.changeAddresPrimary(this.org.addresses.length -1)
          }
          this.orgFormGroup.setControl("addresses", this.addItemsFormArrayAddresses(this.org.addresses))
          this.addressesControl = this.addItemsFormArrayAddresses(this.org.addresses);
          //console.log("despues de ADDRESS", this.org, this.orgFormGroup, this.addressesControl);
        }
      }
    });
  }

  editaddress(pos: number){
    //console.log("ANTES de editar ADDRESS", this.org, this.orgFormGroup, this.addressesControl, " --------- ", (this.orgFormGroup.get("addresses") as FormArray).value[pos]);
    const dialogRef = this._dialog.open(OrganizationDialogorgEditAddress, {
      width: '60%',
      data: { address: (this.orgFormGroup.get("addresses") as UntypedFormArray).value[pos] }
    });

    dialogRef.afterClosed().subscribe((result: Relationship) => {
      if (result) {
        this.org.addresses[pos] = (dialogRef.componentInstance.data.address as UntypedFormGroup).value;
        // changes other as `primary`
        if (this.org.addresses[pos].primary){
          this.changeAddresPrimary(pos);
        }
        this.orgFormGroup.setControl("addresses", this.addItemsFormArrayAddresses(this.org.addresses))
        this.addressesControl = this.addItemsFormArrayAddresses(this.org.addresses);
      }
    });
    //console.log("Despues de editar ADDRESS", this.org, this.orgFormGroup, this.addressesControl);
  }

  deleteaddress(pos){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: this.addressesControl.value[pos].line_2 + ", " + this.addressesControl.value[pos].line_1 + ", " + this.addressesControl.value[pos].city + "..."}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.addresses.splice(pos,1);
        (this.orgFormGroup.get('addresses') as UntypedFormArray).removeAt(pos);
        this.addressesControl.removeAt(pos);
      }
    });
  }

  addItemsFormArrayAddresses(items: Array<Address>){
    let formArrayGroup = this._formBuilder.array([]);
    for (const key in items) {
      formArrayGroup.push(this._formBuilder.group(
        {
          city: new UntypedFormControl(items[key].city),
          country: new UntypedFormControl(items[key].country),
          country_code: new UntypedFormControl(items[key].country_code),
          lat: new UntypedFormControl(items[key].lat),
          lng: new UntypedFormControl(items[key].lng),
          line_1: new UntypedFormControl(items[key].line_1),
          line_2: new UntypedFormControl(items[key].line_2),
          line_3: new UntypedFormControl(items[key].line_3),
          postcode: new UntypedFormControl(items[key].postcode),
          primary: new UntypedFormControl(items[key].primary),
          state: new UntypedFormControl(items[key].state),
          state_code: new UntypedFormControl(items[key].state_code),
          municipality: new UntypedFormControl(items[key].municipality),
          municipality_dpa: new UntypedFormControl(items[key].municipality_dpa)
        })
      );
    }
    return formArrayGroup
  }

  changeAddresPrimary(primaryPos: number){
    for (let index = 0; index < this.org.addresses.length; index++) {
      const element = this.org.addresses[index];
      if ( index != primaryPos){
        element.primary = false;
      }
    }
  }

  /******************************************************************
   * IDENTIFIERS FUNCTIONS
   ******************************************************************/

  public identifiersControl = this._formBuilder.array([]);

  addIdentifiers(){
    this.org.identifiers.push(new Identifier());
    (this.orgFormGroup.get('identifiers') as UntypedFormArray).push(this._formBuilder.group({
        idtype: new UntypedFormControl(""),
        value: new UntypedFormControl("")
      })
    );
    this.identifiersControl.push(this._formBuilder.group({
        idtype: new UntypedFormControl(""),
        value: new UntypedFormControl("")
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
        (this.orgFormGroup.get('identifiers') as UntypedFormArray).removeAt(pos);
        this.identifiersControl.removeAt(pos);
      }
    });
  }

  addItemsFormArrayIdentifiers(items: any[]){
    let formArrayGroup = this._formBuilder.array([]);
    for (const key in items) {
      formArrayGroup.push(this._formBuilder.group(
        {
          idtype: new UntypedFormControl(items[key].idtype),
          value: new UntypedFormControl(items[key].value)
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
      //console.log('AAAAAAAAAAAA')
      //console.log(key)
      //console.log(items[key])
      //console.log("agregando de item relations", items[key])
      formArrayGroup.push(this._formBuilder.group(
        {
          id: new UntypedFormControl(items[key].id),
          identifiers: this.addItemsFormArrayIdentifiers(items[key].identifiers),
          label: new UntypedFormControl(items[key].label),
          type: new UntypedFormControl(items[key].type)
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
        (this.orgFormGroup.get('relationships') as UntypedFormArray).removeAt(pos);
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

  isValidForm(){
    try {
      return this.orgFormGroup.valid;
    } catch(err) {
      console.log(err);

    }

    return false;
  }

  getOrgFromForm(): Organization {
    this.fillObjectControls();
    return this.orgFormGroup.value;
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
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial color="primary">Adicionar</button>
    </div>
  `,
  styleUrls: ['./org-edit-form.component.scss']
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
    //console.log(event);
    this.data.id = this.org.id;
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
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial color="warn">Eliminar</button>
    </div>
  `,
  styleUrls: ['./org-edit-form.component.scss']
})
export class OrganizationDialogDeleteConfirm {

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogDeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'org-info-confirm-dialog',
  template: `
    <h1 mat-dialog-title> Está usted seguro que desea modificar a</h1>
    <div mat-dialog-content>
      {{data.label}}
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial color="primary">Modificar</button>
    </div>
  `,
  styleUrls: ['./org-edit-form.component.scss']
})
export class OrganizationDialogInfoConfirm {

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogInfoConfirm>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'org-edit-address-dialog',
  template: `
    <h1 mat-dialog-title *ngIf="data.address != undefined"> Editar la dirección</h1>
    <h1 mat-dialog-title *ngIf="data.address == undefined"> Adicionar nueva dirección</h1>
    <div mat-dialog-content>
      <app-edit-address [address]="data.address"
       (addressEmiter)="addAddress($event)"></app-edit-address>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button *ngIf="data.address == undefined" [mat-dialog-close]="true" cdkFocusInitial color="primary" (click)="saveData()">Adicionar</button>
      <button mat-button *ngIf="data.address != undefined" [mat-dialog-close]="true" cdkFocusInitial color="primary" (click)="saveData()">Guardar</button>
    </div>
  `,
  styleUrls: ['./org-edit-form.component.scss']
})
export class OrganizationDialogorgEditAddress{
  private temporalAddress: Address;

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogorgEditAddress>,
    @Inject(MAT_DIALOG_DATA) public data, private _dialog: MatDialog) {}

    addAddress(event: Address){
      this.temporalAddress = event;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
    saveData(){
      this.data.address = this.temporalAddress;
    }

    deleteaddress(pos){
      const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
        width: '40%',
        data: { label: ""}
      });

      dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
        if(isDeleted){
          // this.org.addresses.splice(pos,1);
          // (this.orgFormGroup.get('addresses') as FormArray).removeAt(pos);
          // this.addressesControl.removeAt(pos);
        }
      });
    }

}
