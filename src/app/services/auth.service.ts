import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAuthResponse, IAuthServiceResponse, IHttpError } from 'app/models/auth.model';
import { IHeaderData } from 'app/store/models/headers-data.model';
import { catchError, map, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;

  constructor(private httpClient: HttpClient) { }


  login(email: string, password: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.httpClient.post<{ token: string, uid: string }>("https://tasks.app.rs.school/angular/login", {
      email,
      password
    }, httpOptions)
      .pipe(
        tap(res => console.log('inside tap :>> ', res)),
        catchError(this.handleError)
      )

  }


  register(name: string, email: string, password: string) {
    console.log("inside service");
    return this.httpClient.post("https://tasks.app.rs.school/angular/registration",
      { email, name, password },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    ).pipe(
      tap(res => console.log("get on register response -->", res)),
      catchError(err => this.handleError(err)))

  }
  logout(headersData: IHeaderData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        'rs-uid': headersData.uid,
        'rs-email': headersData.email,
        'Authorization': "Bearer " + headersData.token
      })
    };
    return this.httpClient.delete("https://tasks.app.rs.school/angular/logout", httpOptions).pipe(catchError(err => this.handleError(err)))
  }


  private handleError(error: HttpErrorResponse) {
    console.log('error status:>> ', error.status);
    console.log('error all:>> ', error);

    return of({ type: error.error.type, message: error.error.message })
    /* throwError(() => new Error(error.message)) */

  }
}
