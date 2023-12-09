import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RequestStatus } from 'app/utils/enums/request-status';
import { BehaviorSubject } from 'rxjs';


export interface IErrorHandle {
  isLoading: boolean;
  errorType: string | null;
  errorMessage: string | null;
  status: RequestStatus
}

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
    this.errHandle.next({ isLoading: false, errorType: err.error.type, errorMessage: err.error.message, status: RequestStatus.ERROR })
  }
  reset() {
    this.errHandle.next({
      isLoading: false,
      errorType: null,
      errorMessage: null,
      status: RequestStatus.WAITING
    })

    //console.log("error service resetted", this.errHandle.value);
  }

}
