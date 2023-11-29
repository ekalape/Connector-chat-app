import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProfileResponse } from 'app/models/http-responses.model';
import { IHeaderData } from 'app/store/models/headers-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {

  }

  getProfile(headersData: IHeaderData): Observable<IProfileResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        'rs-uid': headersData.uid,
        'rs-email': headersData.email,
        'Authorization': "Bearer " + headersData.token
      })
    };

    return this.httpClient.get<IProfileResponse>("https://tasks.app.rs.school/angular/profile", httpOptions)

  }

  updateProfile(name: string, headersData: IHeaderData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        'rs-uid': headersData.uid,
        'rs-email': headersData.email,
        'Authorization': "Bearer " + headersData.token
      })
    };

    return this.httpClient.put(" https://tasks.app.rs.school/angular/profile", { name }, httpOptions)

  }
}
