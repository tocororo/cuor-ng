import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatStepper, MatDialogRef } from '@angular/material';
import { Hit, MessageHandler, Organization, StatusCode, MetadataService } from 'toco-lib';
import { isUndefined } from 'util';
import { OrgService } from '../org.service';
import { Router } from '@angular/router';
import { OrgEditFormComponent, OrganizationDialogDeleteConfirm } from '../org-edit/org-edit-form/org-edit-form.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DisambiguationComponent } from './disambiguation/disambiguation.component';



@Component({
  selector: 'app-disambiguate',
  templateUrl: './disambiguate.component.html',
  styleUrls: ['./disambiguate.component.scss']
})
export class DisambiguateComponent implements OnInit {

  @ViewChild('orgeditcomp', { static: false }) private _orgEdit: OrgEditFormComponent;
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;
  @ViewChild('disambiguatecomp', {static: false}) private _disambiguateComp: DisambiguationComponent;


  masterOrganization: Organization;
  secundariesOrganizations: Organization[];

  masterFormControl: FormControl;

  secundaryFormGroup: FormGroup;
  orgMasterCtrl: FormControl;

  step = -1;

  orgFilter = { type: "country", value: "Cuba" };

  loading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _orgService: OrgService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private metadata: MetadataService
  ) { }

  ngOnInit() {
    this.secundariesOrganizations = new Array();

    this.orgMasterCtrl = new FormControl('', Validators.required);

    this.masterFormControl = new FormControl(null, Validators.required)

    this.secundaryFormGroup = this._formBuilder.group({
      analogas: this.addItemsFormArray(null)
    })

    this.activatedRoute.data.subscribe(
      (data) => {
        this.metadata.meta.updateTag({name:"DC.title", content:this.masterOrganization.name});
        this.metadata.meta.updateTag({name:"description", content:"Desambiguando organizaciones: " + this.masterOrganization.name});
        this.metadata.meta.updateTag({name:"generator", content:"Sceiba en Proyecto Vlir Joint"});
        this.metadata.meta.updateTag({name:"keywords", content:"Sceiba, organizaciones, identificación persistente, Cuba"});
        this.metadata.meta.updateTag({name:"robots", content:"index,nofollow"});

      })

  }

  /***********************************************************
   * Stepper work
   ***********************************************************/
  public setStep(index: number) {
    this.step = index;
  }

  public nextStep() {
    if (this.step < this.secundariesOrganizations.length) {
      this.step++;
    }
    else {
      this.step = 0;
    }
  }

  public prevStep() {
    if (this.step > 0) {
      this.step--;
    } else {
      this.step = this.secundariesOrganizations.length - 1;
    }
  }


  /***********************************************************
   * addItemsFormArray build a form array group
   ***********************************************************/
  private addItemsFormArray(items: any[]) {
    let formArrayGroup = this._formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    if (isUndefined(items)) {
      formArrayGroup.push(this._formBuilder.group(
        {
          id: new FormControl("", Validators.required),
          name: new FormControl("", Validators.required),
        }
      ));
    }
    else {
      for (const item in items) {
        formArrayGroup.push(this._formBuilder.group(
          {
            id: new FormControl(item['id']),
            name: new FormControl(item['name'])
          }
        ));
      }
    }
    return formArrayGroup
  }

  /***********************************************************
   * add Organizations to formgroup or formarray
   ***********************************************************/

  receivingMaster(master: Organization) {
    this.loading = false;
    this.masterOrganization = new Organization();
    this.masterOrganization.deepcopy(master);
    this.masterFormControl.setValue(master)
    //console.log(" Reciving master ********** ", master, "*******", this.masterOrganization, " ****** ", this.masterFormControl);

  }

  receivingSecundaries(secundaryOrg: Organization) {
    this.loading = false;
    const m = new MessageHandler(this._snackBar);
    if (secundaryOrg.id == this.masterOrganization.id) {
      m.showMessage(StatusCode.OK, "Ya esta organización fue seleccionada como principal.");
    } else if (this.secundariesOrganizations.some(x => x.id == secundaryOrg.id)) {
      m.showMessage(StatusCode.OK, "Ya existe la organización como análoga.");
    }
    else {
      this.secundariesOrganizations.push(secundaryOrg);
      this.addSecundaryOrgControl(secundaryOrg);
    }
  }

  addSecundaryOrgControl(secundaryOrg) {
    (this.secundaryFormGroup.get('analogas') as FormArray).push(this._formBuilder.group(
      {
        id: new FormControl(secundaryOrg.id),
        name: new FormControl(secundaryOrg.name),
      }
    ));
  }


  /***********************************************************
   * delete element in formarray
   ***********************************************************/
  deleteSecundaryOrg(pos) {

    const dialogRef = this._dialog.open(OrganizationDialogDeleteConfirm, {
      width: '60%',
      data: { label: (this.secundaryFormGroup.get('analogas') as FormArray).value[pos].name }
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if (isDeleted) {
        this.secundariesOrganizations.splice(pos, 1);
        (this.secundaryFormGroup.get('analogas') as FormArray).removeAt(pos);

        this._disambiguateComp.changingSecundaryPos(pos);
      }
    });

  }

  /***********************************************************
   * Update organizations with new information
   ***********************************************************/
  goDisambiguate(leave:boolean = false) {
    //console.log('EDITAR LA ORGANIZACION PRIONCIPA GOOOO DESAMBIGUATE.....')
    // editar la organizacion principal
    const toD = new Organization();
    this._orgEdit.fillObjectControls(); //esto debe hacerlo el form por el mismo
    toD.deepcopy(this._orgEdit.orgFormGroup.value);
    toD.status = "active"

    console.log("go disambiguate ", toD, this.secundariesOrganizations);


    this._orgService.editOrganization(toD).subscribe({
      next: (result: Hit<Organization>) => {
        console.log(result);
        const m = new MessageHandler(this._snackBar);
        m.showMessage(StatusCode.OK, "La Organización fue modificada correctamente");
      },
      error: err => {
        console.log(err);

        const m = new MessageHandler(this._snackBar);
        m.showMessage(StatusCode.OK, err.message)
      }
    })

    // cambiar el estado de las secundarias a reconect
    this.secundariesOrganizations.forEach(secOrg => {
      secOrg.status = "redirected";
      let rec = new Organization();
      rec.deepcopy(secOrg);
      this._orgService.editOrganization(rec).subscribe({
        next: (result: Hit<Organization>) => {
          console.log("sec org ", result);
        },
        error: err => {
          console.log("reconnect", err);
        }
      })
    });

    this._resetStepper();

    if (leave){
      this._router.navigate(["/"]);
    }

  }

  changingStep(stepVar:StepperSelectionEvent){
    //console.log(" changing stepper ", stepVar);
    if (stepVar.selectedIndex == 3 && stepVar.previouslySelectedIndex == 2) {
      let newOrg = new Organization();
      newOrg.deepcopy(this.masterOrganization);
      this.masterOrganization = newOrg;
    }

    if (stepVar.selectedIndex == 2 && stepVar.previouslySelectedIndex == 3) {
      let newOrg = new Organization();
      newOrg.deepcopy(this._orgEdit.orgFormGroup.value);
      this.masterOrganization = newOrg;
    }

  }

  private _resetStepper(){
    this.masterOrganization = undefined;
    this.myStepper.reset();
    this.ngOnInit();
  }

  isValidForm(){
    try {
        if(this._orgEdit) {
          return this._orgEdit.isValidForm();
        }
    } catch(err) {
      console.log(err);

    }

    return false;
  }


}
