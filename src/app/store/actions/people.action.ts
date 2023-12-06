import { createAction, props } from '@ngrx/store';
import { ISingleMessage, ISingleUserConversation, IUser } from 'app/models/conversations.model';

export const getPeopleAndConversations = createAction("[people] Get People And Conversations");
export const getPeopleAndConversationsSuccess = createAction("[people] Get People And Conversations Success",
  props<{ users: IUser[], conversations: ISingleUserConversation[] }>());

export const getPeople = createAction("[people] Get People");
export const getPeopleSuccess = createAction("[people] Get People Success",
  props<{ users: IUser[] }>());


export const getActiveConversations = createAction("[people] Get Active Conversations");
export const getActiveConversationsSuccess = createAction("[people] Get Active Conversations Success",
  props<{ conversations: ISingleUserConversation[] }>());


export const getPrivateMessages = createAction("[people] Get Private Messages", props<{ conversationID: string }>());
export const getPrivateMessagesSuccess = createAction("[people] Get Private Messages Success",
  props<{ messages: ISingleMessage[] }>());

export const sendPrivateMessage = createAction("[people] Send Private Message", props<{ conversationID: string, message: string }>());
export const sendPrivateMessageSuccess = createAction("[people] Send Private Message Success",
  props<{ message: ISingleMessage }>());

//TODO delete conversation

export const createConversation = createAction("[people] Create Conversation", props<{ companion: string }>());
export const createConversationSuccess = createAction("[people] Create Conversation Success",
  props<{ conversation: ISingleUserConversation }>());
