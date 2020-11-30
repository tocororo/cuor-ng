import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrgService } from '../org.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  public fileUploadGRID: File;

  constructor(private orgservice: OrgService) { }

  ngOnInit() {
    this.fileUploadGRID = null;
  }

  /**
   * handleFileInput, saves file in a variable according to type
   * @param file is a `File` object
   * @param type is a `string` with the type of the file, example "GRID"
   */
  public handleFileInput(file: File, type: string){
    switch (type) {
      case "GRID":
        this.fileUploadGRID = file;
        console.log(file);
        
        break;

      default:
        break;
    }
  }

  /**
   * Import files in backend
   */
  public import(){
    this.orgservice.fileUpload(this.fileUploadGRID, "GRID").subscribe({
      next: data => {
        console.log(data);
      }
    });
  }
}
