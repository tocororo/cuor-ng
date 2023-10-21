import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OrgService } from 'src/app/org.service';
import { Address, Organization } from 'toco-lib';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {

  @Input()
  public address: Address;

  @Output()
  public addressEmiter : EventEmitter<UntypedFormGroup> ;

  public formGroup: UntypedFormGroup;

  public autocompleteFormControl: UntypedFormControl;

  public dpa: DPA[] = [];

  public municipalities = []; //En este modelo la ciudad seria el municipio

  public state;

  postalRegExpression = '\\d{5}([-]\\d{4})?';
  coordinatesRegExpression = '^[+-]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?,\\s*[-+]?(180(\\.0+)?|((1]0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$';

  constructor(private _formBuilder: UntypedFormBuilder, private _orgService: OrgService) {
    this.addressEmiter = new EventEmitter<UntypedFormGroup>(true);
    
   }

  ngOnInit() {
    this.dpa = this._orgService.getDPA();

    if (this.address == undefined){
      this.address = new Address();
      this.address.country = "Cuba";
      this.address.country_code = "CU";
    }
    else {
      if (this.address.state) {        
        const first_state =  this.dpa.find((option : DPA) =>  option.iso == this.address.state_code);
        
        if(first_state != undefined){          
          this.municipalities = first_state.municipalities;          
          console.log("minicipalities -------->>>> ", this.municipalities);
          
        }
      }
    }   

    this.autocompleteFormControl = new UntypedFormControl("");

    this.formGroup = this._formBuilder.group({
      city: new UntypedFormControl(this.address.city),
      country: new UntypedFormControl(this.address.country),
      country_code: new UntypedFormControl(this.address.country_code),
      lat: new UntypedFormControl(this.address.lat),
      lng: new UntypedFormControl(this.address.lng),
      line_1: new UntypedFormControl(this.address.line_1),
      line_2: new UntypedFormControl(this.address.line_2),
      line_3: new UntypedFormControl(this.address.line_3),
      postcode: new UntypedFormControl(this.address.postcode, Validators.pattern(this.postalRegExpression)),
      primary: new UntypedFormControl(this.address.primary),
      state: new UntypedFormControl(this.address.state),
      state_code: new UntypedFormControl(this.address.state_code),
      municipality: new UntypedFormControl(this.address.municipality),
      municipality_dpa: new UntypedFormControl(this.address.municipality_dpa)
      //TODO: falta agregar GeoNamesCity... pero eso junto a `lat` y `lng` deben salir cuando se muestre un mapa para que el usuario seleccione
    });    

    console.log("Form group address: ", this.formGroup);
    

    this.formGroup.valueChanges.subscribe({
      next: ( ) =>{
        if( this.formGroup.valid ){
          this.addressEmiter.emit(this.formGroup);
        }
      }
    });

    this.formGroup.controls["state_code"].valueChanges.subscribe({
      next: selectedState => {
        const state =  this.dpa.find((option : DPA) =>  option.iso == selectedState);

        if(state != undefined){
          this.formGroup.controls["state"].setValue(state.name);
          this.municipalities = state.municipalities;
        }
        // if state or municipalities are undefined, means some error or `Isla de la Juventud` is selected and not has municipalities, then clean `line_2`
        if( state == undefined || state.municipalities == undefined){
          this.formGroup.controls["line_1"].setValue("");
          this.formGroup.controls["line_2"].setValue("");
        }

      }
    })

    this.formGroup.controls["municipality_dpa"].valueChanges.subscribe({
      next: selectedMunicpality => {
        for (let index = 0; index < this.municipalities.length; index++) {
          if(this.municipalities[index]["dpa"] == selectedMunicpality) {
            this.formGroup.controls["municipality"].setValue(this.municipalities[index]["name"]);
            index = this.municipalities.length;
          }
        }
      }
    })
  }


}


export class DPA{
  name: string;
  iso: string;
  dpa: string;
  municipalities?: Array<{ dpa: string, name: string  }> = [];
}
