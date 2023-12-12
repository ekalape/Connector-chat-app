import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGroupResponce, IGroups, IMessages, IPeople, IUserConversations, IUserConversationsResponse } from 'app/models/conversations.model';
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
    console.log("inside service, group with name ", name);
    return this.httpClient.post<IGroupResponce>(`${BASE_URL}/groups/create`, { name })
  }

  deleteGroup(groupId: string) {
    const params = new HttpParams().set("groupID", groupId)
    return this.httpClient.delete(`${BASE_URL}/groups/delete`, { params })
  }

  getMessages(groupId: string, since?: number) {
    let params = new HttpParams().set("groupID", groupId);
    if (since)
      params = params.append("since", since);
    console.log('params :>> ', params);
    return this.httpClient.get<IMessages>(`${BASE_URL}/groups/read`, { params })
  }

  sendGroupMessage(groupID: string, message: string) {
    return this.httpClient.post(`${BASE_URL}/groups/append`, { groupID, message })
  }

  getPeople() {
    return this.httpClient.get<IPeople>(`${BASE_URL}/users`);
  }

  getActiveConversations() {
    return this.httpClient.get<IUserConversations>(`${BASE_URL}/conversations/list`);
  }

  createConversations(companion: string) {
    return this.httpClient.post<IUserConversationsResponse>(`${BASE_URL}/conversations/create`, { companion })
  }

  deleteConversations(convID: string) {
    const params = new HttpParams().set("conversationID", convID)
    return this.httpClient.delete(`${BASE_URL}/conversations/delete`, { params });
  }


  getPrivateMessages(conversationID: string, since?: number) {
    let params = new HttpParams().set("conversationID", conversationID);
    if (since)
      params = params.append("since", since);
    console.log('inside service since :>> ', since, "conversationID :>>", conversationID);

    return this.httpClient.get<IMessages>(`${BASE_URL}/conversations/read`, { params });
  }

  sendPrivateMessage(conversationID: string, message: string) {
    return this.httpClient.post(`${BASE_URL}/conversations/append`, { conversationID, message });
  }


}
