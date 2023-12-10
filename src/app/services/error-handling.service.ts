import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IErrorHandle } from 'app/store/models/store.model';
import { RequestStatus } from 'app/utils/enums/request-status';
import { BehaviorSubject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  private errHandle = new BehaviorSubject<IErrorHandle>({
    isLoading: false,
    errorType: null,
    errorMessage: null,
    status: RequestStatus.WAITING
  })
  errorHandling$ = this.errHandle.asObservable()

  constructor() { }

  setLoading(isLoading: boolean) {
    this.errHandle.next({ ...this.errHandle.value, isLoading })
  }
  handleError(err: HttpErrorResponse) {
    //console.log('err :>> ', err);
    console.log("inside error service", err);
    this.errHandle.next({ ...this.errHandle.value, isLoading: false, errorType: err.error.type, errorMessage: err.error.message, status: RequestStatus.ERROR })
    console.log('this.errHandle.value :>> ', this.errHandle.value);
  }

  setSuccess() {
    this.errHandle.next({ ...this.errHandle.value, isLoading: false, errorType: null, errorMessage: "Success!", status: RequestStatus.SUCCESS })
  }

  reset() {
    this.errHandle.next({
      isLoading: false,
      errorType: null,
      errorMessage: null,
      status: RequestStatus.WAITING
    })

    console.log("error service resetted");
  }

}
