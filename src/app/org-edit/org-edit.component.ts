import { Component, Inject, OnInit, ViewEncapsulation, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatFormField, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, HandlerComponent, Hit, Identifier, LabelDiffLang, MessageHandler, Organization, OrganizationRelationships, Relationship, StatusCode } from 'toco-lib';
import { isUndefined } from 'util';
import { OrgService } from '../org.service';
import { OrgViewerComponent } from '../org-viewer/org-viewer.component';

export declare enum IdentifierOrgSchemas {
  grid = "grid",
  wkdata = "wkdata",
  ror = "ror",
  isni = "isni",
  fudref = "fudref",
  orgref = "orgref",
  reup = "reup"
}


@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrgEditComponent implements OnInit {

  @Input() org: Organization;

  orgFormGroup: FormGroup = this._formBuilder.group({ id: ''},[]);

  @Input() disambiguating: boolean = false;

  @Input() loading: boolean = true;

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

  idtypes = ["grid","wkdata","ror","isni","fudref","orgref","reup"];

  iso639;

  selectOptionsIdType = [];

  orgRelationships = OrganizationRelationships;  

  urlRegExpression = '(https?://)?([\\da-z@:%=?$#._\+~#=.-]+)\\.([a-z@:%=?$#._\+~#=.]{2,6})[/\\w\\da-z@:%=?$#._\+~#= .-]*/?';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _orgService: OrgService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _router: Router) { }

  ngOnInit() {
    if(this.disambiguating && this.org){
      this.initData(this.org);                
      this.loading = false;      
    }
    else
    {
      this._activatedRoute.data.subscribe(
        (data: { 'org': Hit<Organization> }) => {
          this.org = new Organization();
          this.org.deepcopy(data.org.metadata);
          this.initData(this.org);                
          this.loading = false;
        }
      );
    }

    this.iso639 = this._orgService.getISO639();

    for (let key of this.idtypes) {
      this.selectOptionsIdType.push({ idtype: key, value: key})
    }
    // console.log('Data got for editing: ', this.org, this.orgFormGroup);
  }

  
  /******************************************************************
   * UPDATE FUNCTIONS
   ******************************************************************/

  private identifierCanBeDeleted(idType:string) {
    return (idType != 'reup');
  }

  reportIdentifiersError(pos){

  }

  private initData(orgInput: Organization){
        
    //this.orgFormGroup = this._formBuilder.group({},[]);
    /* Gets the `Organization` data. */

    this.orgFormGroup = this._formBuilder.group({
      id: new FormControl(orgInput.id, Validators.required),

      acronyms: this.addItemsFormArray(orgInput.acronyms),

      aliases: this.addItemsFormArray(orgInput.aliases),

      established: new FormControl( orgInput.established, Validators.required),

      identifiers: this.addItemsFormArrayIdentifiers(orgInput.identifiers),

      labels: this.addItemsFormArrayLabels(orgInput.labels),

      name: new FormControl({value: orgInput.name, disabled: true}, Validators.required),

      relationships: this.addItemsFormArrayRelationships(orgInput.relationships),

      status: new FormControl(orgInput.status? orgInput.status : "" ),

      types: this.addItemsFormArray(orgInput.types),


      addresses: this.addItemsFormArrayAddresses(orgInput.addresses),

      wikipedia_url: new FormControl(orgInput.wikipedia_url, Validators.pattern(this.urlRegExpression)),

      email_address: new FormControl(orgInput.email_address, Validators.email),

      ip_addresses: this.addItemsFormArray(orgInput.ip_addresses),

      links: this.addItemsFormArray(orgInput.links, this.urlRegExpression)
    });

    this.identifiersControl = this.addItemsFormArrayIdentifiers(orgInput.identifiers);

    this.labelsControl = this.addItemsFormArrayLabels(orgInput.labels);

    this.relationshipsControl = this.addItemsFormArrayRelationships(orgInput.relationships);

    this.addressesControl = this.addItemsFormArrayAddresses(orgInput.addresses);
  }


  /******************************************************************
   * UPDATE FUNCTIONS
   ******************************************************************/
  update(leave:boolean = false){
    this.loading = true;    
    // update orgFormGroup
    this.orgFormGroup.setControl('identifiers', this.identifiersControl);
    this.orgFormGroup.setControl('labels', this.labelsControl)
    // this.orgFormGroup.setControl('relationships', this.relationshipsControl)
    //console.log(this.orgFormGroup.value, this.orgFormGroup, 'QQWQWQWWWWssssszsaW')
    let edited = new Organization()
    edited.deepcopy(this.orgFormGroup.value)
    edited.name = this.orgFormGroup.controls['name'].value;
    //console.log(edited);

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
        m.showMessage(StatusCode.OK, err.message);
        this.loading = false;
      },
      complete: () => this.loading = false
    })

    if (leave){
      this._router.navigate(["/"+this.orgFormGroup.controls['id'].value+"/view"]);
    }

  }

  editInputName(){

    const dialogRef = this._dialog.open(OrganizationDialogInfoConfirm, {
      width: '40%',
      data: { label: this.orgFormGroup.controls['name'].value}
    });

    dialogRef.afterClosed().subscribe((isUpdated: boolean) => {
      if(isUpdated){
        this.orgFormGroup.setControl('name', new FormControl(this.orgFormGroup.controls['name'].value, Validators.required));
      }
    });

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
    (this.orgFormGroup.get('links') as FormArray).push(this._formBuilder.control('', Validators.pattern(this.urlRegExpression)));
  }

  deletelinks(pos: number){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: (this.orgFormGroup.get('links') as FormArray).value[pos]}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.links.splice(pos,1);
        (this.orgFormGroup.get('links') as FormArray).removeAt(pos);
      }
    });
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
   * TYPES FUNCTIONS
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
   * LABELS FUNCTIONS
   ******************************************************************/

  public labelsControl = this._formBuilder.array([]);
  addLabels(){
    this.org.labels.push(new LabelDiffLang());
    (this.orgFormGroup.get('labels') as FormArray).push(this._formBuilder.group({
        label: new FormControl(""),
        iso639: new FormControl("")
      })
    );
    this.labelsControl.push(this._formBuilder.group({
        label: new FormControl(""),
        iso639: new FormControl("")
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
        (this.orgFormGroup.get('labels') as FormArray).removeAt(pos);
        this.labelsControl.removeAt(pos);
      }
    });
  }

  addItemsFormArrayLabels(items: any[]){
    let formArrayGroup = this._formBuilder.array([]);
    for (const key in items) {
      formArrayGroup.push(this._formBuilder.group(
        {
          label: new FormControl(items[key].label),
          iso639: new FormControl(items[key].iso639)
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
          this.org.addresses.push((dialogRef.componentInstance.data.address as FormGroup).value);
          // changes other as `primary`
          if (this.org.addresses[this.org.addresses.length -1].primary){
          this.changeAddresPrimary(this.org.addresses.length -1)
          }
          this.orgFormGroup.setControl("addresses", this.addItemsFormArrayAddresses(this.org.addresses))
          this.addressesControl = this.addItemsFormArrayAddresses(this.org.addresses);
          console.log("despues de ADDRESS", this.org, this.orgFormGroup, this.addressesControl);
        }
      }
    });
  }

  editaddress(pos: number){
    //console.log("ANTES de editar ADDRESS", this.org, this.orgFormGroup, this.addressesControl, " --------- ", (this.orgFormGroup.get("addresses") as FormArray).value[pos]);
    const dialogRef = this._dialog.open(OrganizationDialogorgEditAddress, {
      width: '60%',
      data: { address: (this.orgFormGroup.get("addresses") as FormArray).value[pos] }
    });

    dialogRef.afterClosed().subscribe((result: Relationship) => {
      if (result) {
        this.org.addresses[pos] = (dialogRef.componentInstance.data.address as FormGroup).value;
        // changes other as `primary`
        if (this.org.addresses[pos].primary){
          this.changeAddresPrimary(pos);
        }
        this.orgFormGroup.setControl("addresses", this.addItemsFormArrayAddresses(this.org.addresses))
        this.addressesControl = this.addItemsFormArrayAddresses(this.org.addresses);
      }
    });
    console.log("Despues de editar ADDRESS", this.org, this.orgFormGroup, this.addressesControl);
  }

  deleteaddress(pos){
    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '40%',
      data: { label: this.addressesControl.value[pos].line_2 + ", " + this.addressesControl.value[pos].line_1 + ", " + this.addressesControl.value[pos].city + "..."}
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if(isDeleted){
        this.org.addresses.splice(pos,1);
        (this.orgFormGroup.get('addresses') as FormArray).removeAt(pos);
        this.addressesControl.removeAt(pos);
      }
    });
  }

  addItemsFormArrayAddresses(items: Array<Address>){
    let formArrayGroup = this._formBuilder.array([]);
    for (const key in items) {
      formArrayGroup.push(this._formBuilder.group(
        {
          city: new FormControl(items[key].city),
          country: new FormControl(items[key].country),
          country_code: new FormControl(items[key].country_code),
          lat: new FormControl(items[key].lat),
          lng: new FormControl(items[key].lng),
          line_1: new FormControl(items[key].line_1),
          line_2: new FormControl(items[key].line_2),
          line_3: new FormControl(items[key].line_3),
          postcode: new FormControl(items[key].postcode),
          primary: new FormControl(items[key].primary),
          state: new FormControl(items[key].state),
          state_code: new FormControl(items[key].state_code),
          municipality: new FormControl(items[key].municipality),
          municipality_dpa: new FormControl(items[key].municipality_dpa)
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
      //console.log('AAAAAAAAAAAA')
      //console.log(key)
      //console.log(items[key])
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
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial color="primary">Adicionar</button>
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
    //console.log(event);
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
  styleUrls: ['./org-edit.component.scss']
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
  styleUrls: ['./org-edit.component.scss']
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
