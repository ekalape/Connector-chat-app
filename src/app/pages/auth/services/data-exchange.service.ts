import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ISuccessfulAction {
  action: string | null;
  success?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataExchangeService {
  successful = new BehaviorSubject<ISuccessfulAction>({ action: null })

  setSuccess(message: string, action: string) {
    this.successful.next({ action, success: true, message })
  }
  setFail(message: string, action: string) {
    this.successful.next({ action, success: false, message })
  }

  reset() {
    this.successful.next({ action: null })
  }

}
