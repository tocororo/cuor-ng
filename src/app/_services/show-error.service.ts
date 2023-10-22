import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface IError {
  title: string;
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShowErrorService {

    /**
     * A Subject that behaves as the bridge between the two components.
     * It emits an IError if there is an HTTP request error.
     */

  public errorSubject = new Subject<IError>();

  constructor() { }

  sendErrors(err: IError) {
    this.errorSubject.next(err);
  }

  clearErrors() {
      this.errorSubject.next(null);
  }

  getErrors(): Observable<IError> {
      return this.errorSubject.asObservable();
  }

}

