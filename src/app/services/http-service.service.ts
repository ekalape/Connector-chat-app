import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IProfileResponse } from 'app/models/http-responses.model';
import { BASE_URL } from 'app/utils/enums/pathes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

  getProfile(): Observable<IProfileResponse> {
    const res = this.httpClient.get<IProfileResponse>(`${BASE_URL}/profile`)

    return res;

  }

  updateProfile(name: string) {
    return this.httpClient.put(`${BASE_URL}/profile`, { name })
  }

}
