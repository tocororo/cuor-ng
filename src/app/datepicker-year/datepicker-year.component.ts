import { AfterViewInit, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';




export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'cuor-datepicker-year',
  templateUrl: './datepicker-year.component.html',
  styleUrls: ['./datepicker-year.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerYearComponent),
      multi: true,
    },
  ],
})
export class DatepickerYearComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  /** custom form-field class */
  @Input() jpCustomFormFieldClass = '';

  /** Component label */
  @Input() label = '';
  @Input() disabled = false;

  _max: Moment;
  @Input()
  get max(): number | Date {
    return this._max ? this._max.year() : undefined;
  }
  set max(max: number | Date) {
    if (max) {
      const momentDate = moment(max);
       // typeof max === 'number' ? moment([max, 0, 1]) : moment(max);
      this._max = momentDate.isValid() ? momentDate : undefined;
    }
  }

  _min: Moment;
  @Input()
  get min(): number | Date {
    return this._min ? this._min.year() : undefined;
  }
  set min(min: number | Date) {
    if (min) {
      const momentDate =
        typeof min === 'number' ? moment([min, 0, 1]) : moment(min);
      this._min = momentDate.isValid() ? momentDate : undefined;
    }
  }

  @Input() touchUi = false;

  @ViewChild(MatDatepicker) _picker: MatDatepicker<Moment>;

  _inputCtrl: UntypedFormControl = new UntypedFormControl();

  // Function to call when the date changes.
  onChange = (year: number) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  /** send the focus away from the input so it doesn't open again */
  _takeFocusAway = (datepicker: MatDatepicker<Moment>) => { };

  constructor() { }

  ngAfterViewInit() {
    // this._takeFocusAway = this.parent._takeFocusAway;
  }

  ngOnInit() {
    // this.value = moment(this.value.toString()).format("YYYY")
   }

  writeValue(date: Date): void {
    //if (date && this._isYearEnabled(date.getFullYear())) {
    const momentDate = moment(date.toString(), "YYYY");
    if (momentDate.isValid()) {
      this._inputCtrl.setValue(momentDate.set({ date: 1 }), { emitEvent: true });
    }
    //}
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? (this._picker.disabled = true)
      : (this._picker.disabled = false);

    isDisabled ? this._inputCtrl.disable() : this._inputCtrl.enable();
  }

  _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.close();

    if (!this._isYearEnabled(chosenDate.year())) {
      return;
    }
    this._inputCtrl.setValue(chosenDate, { emitEvent: true });
    this.onChange(chosenDate.year());
    this.onTouched();
  }

  _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }

  /** Whether the given year is enabled. */
  private _isYearEnabled(year: number) {
    // disable if the year is greater than maxDate lower than minDate
    if (
      year === undefined ||
      year === null ||
      (this._max && year > this._max.year()) ||
      (this._min && year < this._min.year())
    ) {
      return false;
    }

    return true;
  }
}
