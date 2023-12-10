import { IHttpError } from 'app/models/auth.model'
import { ISingleGroup, ISingleMessage, ISingleUserConversation, IUser } from 'app/models/conversations.model'

import { RequestStatus } from 'app/utils/enums/request-status'
import { titleKinds } from 'app/utils/enums/title-controls'


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

export interface IPeopleState {
  users: IUser[],
  conversations: ISingleUserConversation[],
  messages: {
    conversationID: string,
    dialog: ISingleMessage[]
  }[]
}
export interface IErrorHandle {
  isLoading: boolean;
  errorType: string | null | undefined;
  errorMessage: string | null;
  status: RequestStatus;
  kind?: titleKinds | null
}

export interface IState {
  authorization: IAutorizationSlice,
  groups: ISingleGroup[],
  groupsMessages: IGroupsMessagesState[],
  people: IPeopleState,
  error: IErrorHandle

}
