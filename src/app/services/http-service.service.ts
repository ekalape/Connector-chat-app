import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IProfileResponse } from 'app/models/http-responses.model';
import { setLoadingAction } from 'app/store/actions/auth.action';
import { setErrorAction } from 'app/store/actions/profile.action';
import { IHeaderData } from 'app/store/models/headers-data.model';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient, private store: Store) {
  }

  getProfile(headersData: IHeaderData): Observable<IProfileResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'rs-uid': headersData.uid,
        'rs-email': headersData.email,
        'Authorization': "Bearer " + headersData.token
      })
    };
    console.log("inside get profile service", httpOptions);

    const res = this.httpClient.get<IProfileResponse>("https://tasks.app.rs.school/angular/profile", httpOptions)

    return res;

  }

  updateProfile(name: string, headersData: IHeaderData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'rs-uid': headersData.uid,
        'rs-email': headersData.email,
        'Authorization': "Bearer " + headersData.token
      })
    };

    return this.httpClient.put(" https://tasks.app.rs.school/angular/profile", { name }, httpOptions)
  }

}
