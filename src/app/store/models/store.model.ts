import { IHttpError } from 'app/models/auth.model'
import { ISingleGroup, ISingleMessage } from 'app/models/conversations.model'


export interface IAutorizationSlice {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  loggedIn: boolean,
  token: string,
  loading: boolean,
  error: IHttpError | null
}

export interface IGroupsMessagesState {
  groupId: string,
  messages: ISingleMessage[]
}


export interface IState {
  authorization: IAutorizationSlice,
  groups: ISingleGroup[],
  groupsMessages: IGroupsMessagesState[]
}
