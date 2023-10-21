import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HandlerComponent, Hit, MessageHandler, Organization, StatusCode } from 'toco-lib';
import { OrgService } from '../org.service';
import { OrgEditFormComponent } from './org-edit-form/org-edit-form.component';


@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrgEditComponent implements OnInit {

  org: Organization;
  public pathname: string

  @Input() loading: boolean = true;

  @ViewChild('orgeditform') private _orgEditForm: OrgEditFormComponent;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _orgService: OrgService
    ) { }

  ngOnInit() {

    this._activatedRoute.url.subscribe(path => {
      this.pathname = path[1].path;
    });

    this._activatedRoute.data.subscribe(
      (data: { 'org': Hit<Organization> }) => {
        this.org = new Organization();
        this.org.deepcopy(data.org.metadata);

        this.loading = false;
      }
    );

  }

  /******************************************************************
   * UPDATE FUNCTIONS
   ******************************************************************/
  update(leave:boolean = false){
    this.loading = true;
    // update orgFormGroup
    this._orgEditForm.fillObjectControls();

    let edited = new Organization()
    console.log(this._orgEditForm.orgFormGroup.value);

    edited.deepcopy(this._orgEditForm.orgFormGroup.value)
    edited.name = this._orgEditForm.orgFormGroup.controls['name'].value;
    console.log(edited);

    this._orgService.editOrganization(edited).subscribe({
      next: (result: Hit<Organization>) => {
        console.log("Comprobando result", result)
        // let newOrg = new Organization();
        // newOrg.deepcopy(result.metadata);
        // this.org = newOrg;
        // this._orgEditForm.orgFormGroup.patchValue(this.org);
        // this._orgEditForm.initData();

        const m = new MessageHandler(null,this._dialog);
        m.showMessage(StatusCode.OK, "La Organización fue modificada correctamente", HandlerComponent.dialog, "Operación exitosa", "50%");
        this.loading = false;

        if (leave){
          this._router.navigate(["/"+this.org.id+"/view"]);
        }
      },
      error: err => {
        console.log(err);
        const m = new MessageHandler(this._snackBar);
        m.showMessage(StatusCode.serverError, err.message);
        this.loading = false;
      },
      complete: () => this.loading = false
    })

    //console.log("after edit ", edited);

  }

  isValidForm(){
    try {
          return this._orgEditForm.isValidForm();

    } catch(err) {
      console.log(err);

    }

    return false;
  }

}
