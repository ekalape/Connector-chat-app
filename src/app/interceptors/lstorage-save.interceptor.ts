import { HttpEvent, HttpEventType, HttpHandler, HttpHeaders, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ILoginResponse, IProfileResponse } from 'app/models/http-responses.model';
import { selectProfileHeaders } from 'app/store/selectors/profile.selectors';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Observable, first, map, switchMap } from 'rxjs';

/* export const lstorageSaveInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        // Do something with the response body
        const resp = event.body;
        console.log("resp-->", resp);
      }
      // Always return the event, not the response body
      return event;
    })
  );

  //return next(req)
}; */
@Injectable()
export class LstorageSaveInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("inside response interceptor ");
    console.log('request.url :>> ', request.url);
    if (request.url.includes("login")) {
      return next.handle(request).pipe(
        map((event) => {
          if (event.type === HttpEventType.Response) {
            const resp = event.body as ILoginResponse;
            console.log('resp :>> ', resp);
            localStorage.setItem(StorageKeys.LOGIN_KEY, resp.token)
          }
          return event
        }))
    }
    if (request.url.includes("logout")) {
      return next.handle(request).pipe(
        map((event) => {
          if (event.type === HttpEventType.Response) {
            console.log('event on logout:>> ', event);
            localStorage.removeItem(StorageKeys.LOGIN_KEY)
          }
          return event
        }))
    }

    return next.handle(request)
  }
}
