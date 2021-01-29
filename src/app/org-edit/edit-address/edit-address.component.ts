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
  public org : Organization; 
  
  @Input()
  public formGroup : FormGroup;

  @Input()
  public addressesControl : FormArray;

  public address: Address;

  public dpa = [];

  filteredOptions: Observable<any>;

  constructor(private _formBuilder: FormBuilder, private _orgService: OrgService) { }

  ngOnInit() {
    this.address = new Address();
    this.address.country = "Cuba";
    this.address.country_code = "CU";

    this.formGroup = this._formBuilder.group({
      city: new FormControl(this.address.city),
      country: new FormControl({value: this.address.country, disabled: true}),
      country_code: new FormControl({value: this.address.country_code, disabled: true}),
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

    this.filteredOptions = this.formGroup.get('line_2').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    // this.formGroup.valueChanges.subscribe({
    //   next: ( ) =>{
    //     if( this.formGroup.valid ){
    //       this.addressEmiter.emit(this.formGroup);
    //     }
    //   }
    // })
    console.log(this.formGroup);
    
  }

  private _filter(value: string ): string[] {
    console.log(value);
    return this.dpa.filter((option : DPA) =>  option.name.toLocaleLowerCase().indexOf(value) === 0 || 
      ( option.municipalities != undefined  && option.municipalities.filter(municipality => municipality.name.toLocaleLowerCase().indexOf(value) === 0 ) ) );
  }

  displayFn(municipality: { dpa: string, name: string  }): string {
    return municipality && municipality.name ? municipality.name : '';
  }

}

export class DPA{
  name: string;
  iso: string;
  dpa: string;
  municipalities?: [ { dpa: string, name: string  } ];
}
