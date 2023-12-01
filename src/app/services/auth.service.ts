import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'app/utils/enums/pathes';
import { catchError, of, tap } from 'rxjs';

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
    return this.httpClient.post<{ token: string, uid: string }>(`${BASE_URL}/login`, {
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
    return this.httpClient.post(`${BASE_URL}/registration`,
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
  logout() {

    return this.httpClient.delete(`${BASE_URL}/logout`).pipe(catchError(err => this.handleError(err)))
  }


  private handleError(error: HttpErrorResponse) {
    console.log('error status:>> ', error.status);
    console.log('error all:>> ', error);

    return of({ type: error.error.type, message: error.error.message })
    //throwError(() => new Error(error.message))

  }
}
