import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPeopleState } from '../models/store.model';
import { IUser } from 'app/models/conversations.model';
import { selectMyID } from './profile.selectors';

export const selectPeopleData = createFeatureSelector<IPeopleState>('people');


export const selectUsers = createSelector(selectPeopleData, (data) => data.users);
export const selectConversations = createSelector(selectPeopleData, (data) => data.conversations);
export const selectAllMessages = createSelector(selectPeopleData, (data) => data.messages);



export const selectSingleUser = (convID: string) => createSelector(selectUsers, selectConversations, (users, dialog) => {
  const conversation = dialog.find(d => d.id === convID);
  const user = users.find(u => u.uid === conversation?.companionID);
  return user;
})

export const selectMessagesByConversationId = (convID: string) => createSelector(selectAllMessages,
  (data) => data.find(d => d.conversationID === convID)?.dialog)


