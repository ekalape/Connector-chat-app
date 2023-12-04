import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGroupResponce, IGroups, IMessages } from 'app/models/conversations.model';
import { BASE_URL } from 'app/utils/enums/pathes';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  constructor(private httpClient: HttpClient) { }

  getGroups() {
    return this.httpClient.get<IGroups>(`${BASE_URL}/groups/list`)

  }

  addNewGroup(name: string) {
    return this.httpClient.post<IGroupResponce>(`${BASE_URL}/groups/create`, { name })
  }

  deleteGroup(groupId: string) {
    const params = new HttpParams().set("groupID", groupId)
    return this.httpClient.delete(`${BASE_URL}/groups/delete`, { params })
  }

  getMessages(groupId: string, since: number) {
    const params = new HttpParams().set("groupID", groupId);
    params.append("since", since);
    return this.httpClient.get<IMessages>(`${BASE_URL}/groups/read`, { params })
  }

}
