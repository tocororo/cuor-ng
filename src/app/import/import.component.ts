import { Component, OnInit } from '@angular/core';
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
   * @param files is a `FileList` object
   * @param type is a `string` with the type of the file, example "GRID"
   */
  public handleFileInput(files: FileList, type: string){
    switch (type) {
      case "GRID":
        console.log(files);
        
        this.fileUploadGRID = files.item(0);
        var formData = new FormData();
        formData.append("fileGRID",this.fileUploadGRID, this.fileUploadGRID.name);
        console.log(formData);
        
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
