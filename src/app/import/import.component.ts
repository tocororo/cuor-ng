import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageHandler, StatusCode } from 'toco-lib';
import { OrgService } from '../org.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  private fileUploadGRID: File;

  public importFormGroup: UntypedFormGroup;

  constructor(private orgservice: OrgService, private _builder: UntypedFormBuilder, private _snackbar: MatSnackBar) { }

  ngOnInit() {
    this.importFormGroup = this._builder.group({
      grid: new UntypedFormControl(null, this.isFile),
      C_orga: new UntypedFormControl(null, this.isFile),
      C_Uniones: new UntypedFormControl(null, this.isFile),
      RE0420: new UntypedFormControl(null, this.isFile),
      CNOA0420: new UntypedFormControl(null, this.isFile),
      ME0420: new UntypedFormControl(null, this.isFile),
      dpa: new UntypedFormControl(null, this.isFile)
    });
  }

  private isFile(control: AbstractControl): {[key: string]: any} | null{
    if ( control.value instanceof File) return null
    return {invalid: 'El valor no es un fichero'};
  }

  // /**
  //  * handleFileInput, saves file in a variable according to type
  //  * @param file is a `File` object
  //  * @param type is a `string` with the type of the file, example "GRID"
  //  */
  // public handleFileInput(file: File, type: string){
  //   switch (type) {
  //     case "GRID":
  //       this.fileUploadGRID = file;
  //       console.log(file);

  //       break;

  //     default:
  //       break;
  //   }
  // }

  /**
   * Import files in backend
   */
  public import(){
    console.log(this.importFormGroup);

    if (this.importFormGroup.valid){
      const formData = new FormData();
      formData.append("grid",(this.importFormGroup.value.grid as File), (this.importFormGroup.value.grid as File).name);
      formData.append("C_orga",(this.importFormGroup.value.C_orga as File), (this.importFormGroup.value.C_orga as File).name);
      formData.append("C_Uniones",(this.importFormGroup.value.C_Uniones as File), (this.importFormGroup.value.C_Uniones as File).name);
      formData.append("RE0420",(this.importFormGroup.value.RE0420 as File), (this.importFormGroup.value.RE0420 as File).name);
      formData.append("CNOA0420",(this.importFormGroup.value.CNOA0420 as File), (this.importFormGroup.value.CNOA0420 as File).name);
      formData.append("ME0420",(this.importFormGroup.value.ME0420 as File), (this.importFormGroup.value.ME0420 as File).name);
      formData.append("dpa",(this.importFormGroup.value.dpa as File), (this.importFormGroup.value.dpa as File).name);
      this.orgservice.fileUpload(formData).subscribe({
        next: data => {
          console.log(data);
        }
      });
    }
    else {
      const m = new MessageHandler(this._snackbar);
      m.showMessage(StatusCode.OK, "Debe importar todos los ficheros");
    }
  }
}
