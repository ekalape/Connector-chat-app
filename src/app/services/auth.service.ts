import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAuthResponse, IAuthServiceResponse, IHttpError } from 'app/models/auth.model';
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
        'Content-Type': 'text/plain',
        //Authorization: 'my-auth-token'
      })
    };
    return this.httpClient.post<IHttpError>("https://tasks.app.rs.school/angular/login", {
      email,
      password
    }, httpOptions)
      .pipe(
        tap(res => console.log('inside tap :>> ', res)),
        catchError(this.handleError)
      )
    //.subscribe(res => console.log('inside subs :>> ', res))

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
    )

  }
  logout() { }


  private handleError(error: HttpErrorResponse) {
    console.log('error status:>> ', error.status);
    console.log('error all:>> ', error);
    /*     if (error.status === 0) {
          console.error('An error occurred:', error.error);
        } else {
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        } */
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(error.message));
  }
}
