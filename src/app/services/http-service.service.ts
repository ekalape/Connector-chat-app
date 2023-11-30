import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProfileResponse } from 'app/models/http-responses.model';
import { IHeaderData } from 'app/store/models/headers-data.model';
import { Observable, take } from 'rxjs';

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
    console.log("inside get profile service", httpOptions);

    const res = this.httpClient.get<IProfileResponse>("https://tasks.app.rs.school/angular/profile", httpOptions)
    //res.pipe(take(1)).subscribe(x => console.log(x))
    return res;

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
