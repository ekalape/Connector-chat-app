import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IStorageInfo } from 'app/models/auth.model';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private store: Store) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes("profile") || request.url.includes("logout")
      || request.url.includes("groups") || request.url.includes("conversations")
      || request.url.includes("users")) {
      let headersData;
      const storageData = localStorage.getItem(StorageKeys.LOGIN_KEY)
      if (storageData) {
        headersData = JSON.parse(storageData) as IStorageInfo;
        const finalizedReq = request.clone(
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'rs-uid': headersData.uid,
              'rs-email': headersData.email,
              'Authorization': "Bearer " + headersData.token
            })

          },
        );
        return next.handle(finalizedReq);
      }
      return next.handle(request)
      /*       return this.store.select(selectProfileHeaders)
              .pipe(first(),
                switchMap(headers => {
                  const finalizedReq = request.clone(
                    {
                      headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'rs-uid': headers.uid,
                        'rs-email': headers.email,
                        'Authorization': "Bearer " + headers.token
                      })

                    },
                  );
                  return next.handle(finalizedReq);
                }
                )
              ) */
    }
    return next.handle(request)
  }
}
