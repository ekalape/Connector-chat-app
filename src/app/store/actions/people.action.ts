import { createAction, props } from '@ngrx/store';
import { ISingleMessage, ISingleUserConversation, IUser } from 'app/models/conversations.model';

export const getPeopleAndConversations = createAction("[people] Get People And Conversations");
export const getPeopleAndConversationsSuccess = createAction("[people] Get People And Conversations Success",
  props<{ users: IUser[], conversations: ISingleUserConversation[] }>());


export const getPrivateMessages = createAction("[people] Get Private Messages", props<{ conversationID: string }>());
export const getPrivateMessagesSuccess = createAction("[people] Get Private Messages Success",
  props<{ conversationID: string, messages: ISingleMessage[] }>());

export const sendPrivateMessage = createAction("[people] Send Private Message", props<{ conversationID: string, message: string }>());
export const sendPrivateMessageSuccess = createAction("[people] Send Private Message Success",
  props<{ conversationID: string, message: ISingleMessage }>());

export const createConversation = createAction("[people] Create Conversation", props<{ companion: string }>());
export const createConversationSuccess = createAction("[people] Create Conversation Success",
  props<{ conversation: ISingleUserConversation }>());

export const deleteConversation = createAction("[people] Delete Conversation", props<{ conversationID: string }>());
export const deleteConversationSuccess = createAction("[people] Delete Conversation Success",
  props<{ conversationID: string }>());

export const resetPeopleSlice = createAction("[people] Reset People Slice");


export const setPeopleSuccess = createAction("[people] Set People Success", props<{ successType: 'main' | 'private', comm: string }>());
export const resetPeopleError = createAction("[people] Reset People Error", props<{ successType: 'main' | 'private' }>());
export const setPeopleError = createAction("[people] Set People Error", props<{ successType: 'main' | 'private', errtype: string, message: string }>());

export const setPeopleCounter = createAction("[people] Set People Counter", props<{ counterType: 'main' | 'private', time: number }>());


export const setPeopleLoading = createAction("[people] Set People Loading State", props<{ isLoading: boolean }>())
