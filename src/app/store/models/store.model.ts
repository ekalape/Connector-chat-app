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
  messages: ISingleMessage[],
  since?: string | undefined
}

export interface IGroupsSlice {
  list: ISingleGroup[],
  history: IGroupsMessagesState[],
  errors: {
    main: IErrorState;
    private: IErrorState;
  },
  counters: {
    main: { active: boolean, time: number, current: number },
    private:
    { id: string | undefined, active: boolean, time: number, current: number }[],
  },
  loading: boolean
}

export interface IPeopleSlice {
  list: IUser[],
  myConvs: ISingleUserConversation[],
  history: {
    conversationID: string,
    messages: ISingleMessage[],
    since?: string | undefined
  }[],
  errors: {
    main: IErrorState;
    private: IErrorState;
  },
  counters: {
    main: { active: boolean, time: number, current: number },
    private:
    { id: string | undefined, active: boolean, time: number, current: number }[],
  },
  loading: boolean
}



export interface IErrorState {
  status: RequestStatus;
  type?: string | null | undefined;
  message?: string | null | undefined;
}

export interface IState {
  authorization: IAutorizationSlice,
  groups: IGroupsSlice,
  people: IPeopleSlice
}


