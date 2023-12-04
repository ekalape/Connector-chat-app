import { HttpEvent, HttpEventType, HttpHandler, HttpHeaders, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ISigninRequest } from 'app/models/auth.model';
import { ILoginResponse, IProfileResponse } from 'app/models/http-responses.model';
import { selectProfileData, selectProfileHeaders } from 'app/store/selectors/profile.selectors';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Observable, first, map, switchMap, withLatestFrom } from 'rxjs';


@Injectable()
export class LstorageSaveInterceptor implements HttpInterceptor {

  constructor(private store: Store) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes("login")) {
      return next.handle(request).pipe(
        map((event) => {
          if (event.type === HttpEventType.Response) {
            const resp = event.body;
            if ("token" in resp) {
              const authInfo = JSON.stringify({ uid: resp.uid, token: resp.token, email: (request.body as ISigninRequest).email })
              localStorage.setItem(StorageKeys.LOGIN_KEY, authInfo)
            }
          }
          return event
        }))
    }

    if (request.url.includes("logout")) {
      return next.handle(request).pipe(
        map((event) => {
          if (event.type === HttpEventType.Response) {
            localStorage.removeItem(StorageKeys.LOGIN_KEY)
          }
          return event
        }))
    }

    return next.handle(request)
  }
}
