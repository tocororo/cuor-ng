import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent implements OnInit {

  @Input()
  public accept: string;

  @Input()
  public enctype: string;

  @Input()
  public control: UntypedFormControl

  @Input()
  public placeholder: string;

  @Input()
  public width: string;

  @Input()
  public label: string;


  @Output()
  public file = new EventEmitter<File>();

  @ViewChild("inputElement", {static: true})
  public inputElement: ElementRef

  constructor() { }

  ngOnInit() {
    if (this.placeholder == undefined) this.placeholder = "Click para seleccionar un fichero";
    if (this.width == undefined) this.width = "100%";
    if (this.accept == undefined) this.accept = ".json";
    if (this.enctype == undefined) this.enctype = "multipart/form-data";
    if (this.control == undefined) this.control = new UntypedFormControl();
  }

  /**
   * handleFileInput, emit file in a variable
   * @param files is a `FileList` object
   */
  public handleFileInput(files: FileList){
    if (files && files.item(0)){
      this.placeholder = files.item(0).name;
      this.control.setValue(files.item(0))
      this.file.emit(files.item(0));
    }
    else {
      this.placeholder = "Click para seleccionar un fichero";
      this.control.setValue(null)
      this.file.emit(null);
    }
  }
}
