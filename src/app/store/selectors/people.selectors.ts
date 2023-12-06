import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPeopleState } from '../models/store.model';
import { IUser } from 'app/models/conversations.model';

export const selectPeopleData = createFeatureSelector<IPeopleState>('people');


export const selectUsers = createSelector(selectPeopleData, (data) => data.users);
export const selectConversations = createSelector(selectPeopleData, (data) => data.conversations);
export const selectAllMessages = createSelector(selectPeopleData, (data) => data.messages);


export const selectMessagesByUser = (authorID: string) => createSelector(selectAllMessages, (data) =>
  data.filter(dialog => dialog.author === authorID));


