import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {HandlerComponent, Hit, MessageHandler, Organization, StatusCode} from 'toco-lib';
import {OrgEditFormComponent} from '../org-edit/org-edit-form/org-edit-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {OrgService} from '../org.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  comment: string;
}


@Component({
  selector: 'app-org-reviewer',
  templateUrl: './org-reviewer.component.html',
  styleUrls: ['./org-reviewer.component.scss']
})
export class OrgReviewerComponent implements OnInit {
  org: Organization;
  comment: string;

  @Input() loading = true;

  @ViewChild('orgeditform') private _orgEditForm: OrgEditFormComponent;


constructor(
    private _activatedRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _orgService: OrgService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this._activatedRoute.data.subscribe(
      (data: { 'org': Hit<Organization> }) => {
        this.org = new Organization();
        this.org.deepcopy(data.org.metadata);

        this.loading = false;
      }
    );

  }

  openCommentDialog(): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '60%',
      data: {comment: this.comment}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.comment = result;
    });
  }

  /******************************************************************
   * UPDATE FUNCTIONS
   ******************************************************************/
  update(leave: boolean = false) {
    this.loading = true;
    // update orgFormGroup
    this._orgEditForm.fillObjectControls();

    const edited = new Organization();
    edited.deepcopy(this._orgEditForm.orgFormGroup.value);
    edited.name = this._orgEditForm.orgFormGroup.controls.name.value;
    // console.log(edited);

    this._orgService.editOrganization(edited).subscribe({
      next: (result: Hit<Organization>) => {
        console.log(result.metadata);
        const newOrg = new Organization();
        newOrg.deepcopy(result.metadata);
        this.org = newOrg;
        this._orgEditForm.orgFormGroup.patchValue(this.org);
        this._orgEditForm.initData();

        const m = new MessageHandler(null, this._dialog);
        m.showMessage(StatusCode.OK, 'La Organización fue modificada correctamente', HandlerComponent.dialog, 'Operación exitosa', '50%');

        if (leave) {
          this._router.navigate(['/' + this.org.id + '/view']);
        }
      },
      error: err => {
        console.log(err);
        const m = new MessageHandler(this._snackBar);
        m.showMessage(StatusCode.OK, err.message);
        this.loading = false;
      },
      complete: () => this.loading = false
    });

    // console.log("after edit ", edited);

  }

  isValidForm() {
    try {
      return this._orgEditForm.isValidForm();

    } catch (err) {
      console.log(err);

    }

    return false;
  }

}



@Component({
  selector: 'comment-dialog',
  template: `<h1 mat-dialog-title>Por favor escriba un comentario donde explique porque fue rechazada la solicitud </h1>
  <div mat-dialog-content>
    <mat-form-field appearance="outline">
      <mat-label>Comentario</mat-label>
      <textarea matInput  [(ngModel)]="data.comment"></textarea>
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="data.comment" cdkFocusInitial>Enviar</button>
    <button mat-button (click)="onNoClick()">Cancelar</button>
  </div>`,
})
export class CommentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

