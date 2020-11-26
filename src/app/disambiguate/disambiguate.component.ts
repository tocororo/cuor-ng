import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Hit, Organization, MessageHandler, StatusCode } from 'toco-lib';
import { MatSnackBar, MatDialog } from '@angular/material';

import { isUndefined } from 'util';
import { OrgService } from '../org.service';
import { OrganizationDialogDeleteConfirm } from '../org-edit/org-edit.component';
import { OrgSearchComponent } from 'toco-lib/lib/organizations/org-search/org-search.component';


@Component({
  selector: 'app-disambiguate',
  templateUrl: './disambiguate.component.html',
  styleUrls: ['./disambiguate.component.scss']
})
export class DisambiguateComponent implements OnInit {

  masterOrganization: Organization;
  secundariesOrganizations: Organization[];

  masterFormControl: FormControl;

  secundaryFormGroup: FormGroup;
  orgMasterCtrl: FormControl;

  step = -1;

  orgFilter = { type: "country", value: "Cuba" };

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _orgService: OrgService
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
    this.masterOrganization = master
    this.masterFormControl.setValue(master)
  }

  receivingSecundaries(secundaryOrg: Organization) {
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
      width: '40%',
      data: { label: (this.secundaryFormGroup.get('analogas') as FormArray).value[pos].name }
    });

    dialogRef.afterClosed().subscribe((isDeleted: boolean) => {
      if (isDeleted) {
        this.secundariesOrganizations.splice(pos, 1);
        (this.secundaryFormGroup.get('analogas') as FormArray).removeAt(pos);
      }
    });

  }

  /***********************************************************
   * Update organizations with new information
   ***********************************************************/
  goDisambiguate() {
    // editar la organizacion principal
    this._orgService.editOrganization(this.masterOrganization).subscribe({
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
      secOrg.status = "reconnect";
      this._orgService.editOrganization(secOrg).subscribe({
        next: (result: Hit<Organization>) => {
          console.log(result);
        },
        error: err => {
          console.log("reconnect", err);
        }
      })
    });
  }

}