import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  public addressEmiter : EventEmitter<FormGroup> ;

  public formGroup: FormGroup;

  public autocompleteFormControl: FormControl;

  public dpa: DPA[] = [];

  public municipalities = [];

  public state;

  constructor(private _formBuilder: FormBuilder, private _orgService: OrgService) {
    this.addressEmiter = new EventEmitter<FormGroup>(true);
   }

  ngOnInit() {
    if (this.address == undefined){
      this.address = new Address();
      this.address.country = "Cuba";
      this.address.country_code = "CU";
    }

    this.autocompleteFormControl = new FormControl("");

    this.formGroup = this._formBuilder.group({
      city: new FormControl(this.address.city),
      country: new FormControl(this.address.country),
      country_code: new FormControl(this.address.country_code),
      lat: new FormControl(this.address.lat),
      lng: new FormControl(this.address.lng),
      line_1: new FormControl(this.address.line_1),
      line_2: new FormControl(this.address.line_2),
      line_3: new FormControl(this.address.line_3),
      postcode: new FormControl(this.address.postcode),
      primary: new FormControl(this.address.primary),
      state: new FormControl(this.address.state),
      state_code: new FormControl(this.address.state_code)
      //TODO: falta agregar GeoNamesCity... pero eso junto a `lat` y `lng` deben salir cuando se muestre un mapa para que el usuario seleccione
    });

    this.dpa = this._orgService.getDPA();

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
          this.formGroup.controls["line_2"].setValue("");
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
