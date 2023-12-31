import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'app/utils/enums/pathes';
import { catchError, of } from 'rxjs';

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
        catchError(this.handleError)
      )

  }


  register(name: string, email: string, password: string) {
    return this.httpClient.post(`${BASE_URL}/registration`,
      { email, name, password },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    ).pipe(
      catchError(err => this.handleError(err)))

  }
  logout() {
    return this.httpClient.delete(`${BASE_URL}/logout`).pipe(catchError(err => this.handleError(err)))
  }


  private handleError(error: HttpErrorResponse) {
    return of({ type: error.error.type, message: error.error.message })

  }
}
