import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Hit, MessageHandler, Organization, StatusCode } from 'toco-lib';
import { isUndefined } from 'util';
import { OrganizationDialogDeleteConfirm, OrgEditComponent } from '../org-edit/org-edit.component';
import { OrgService } from '../org.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-disambiguate',
  templateUrl: './disambiguate.component.html',
  styleUrls: ['./disambiguate.component.scss']
})
export class DisambiguateComponent implements OnInit {

  @ViewChild('orgeditcomp', { static: false }) private _orgEdit: OrgEditComponent;

  masterOrganization: Organization;
  secundariesOrganizations: Organization[];

  masterFormControl: FormControl;

  secundaryFormGroup: FormGroup;
  orgMasterCtrl: FormControl;

  newPosSecundaryOrg: number = 0;

  step = -1;

  orgFilter = { type: "country", value: "Cuba" };

  loading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _orgService: OrgService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.secundariesOrganizations = new Array();

    this.orgMasterCtrl = new FormControl('', Validators.required);

    this.masterFormControl = new FormControl(null, Validators.required)

    this.secundaryFormGroup = this._formBuilder.group({
      analogas: this.addItemsFormArray(null)
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
    console.log(" Reciving master ********** ", master, "*******", this.masterOrganization, " ****** ", this.masterFormControl);
    
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
        this.newPosSecundaryOrg = 0;
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
    toD.deepcopy(this._orgEdit.orgFormGroup.value);
    toD.status = "active"       
        
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

    if (leave){
      this._router.navigate(["/"]);
    }

  }

}
