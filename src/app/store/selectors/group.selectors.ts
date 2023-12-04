import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAutorizationSlice, IGroupsMessagesState } from '../models/store.model';
import { ISingleGroup } from 'app/models/conversations.model';
import { selectMyID, selectProfileData } from './profile.selectors';


export const selectGroups = createFeatureSelector<ISingleGroup[]>('groups');
export const selectAllGroupMessages = createFeatureSelector<IGroupsMessagesState[]>('groupsMessages');


export const selectMyGroups = createSelector(selectGroups, selectMyID, (data, myId) => {
  return data.filter(d => d.id === myId.id).map(x => x.id)
});

export const selectSingleGroup = (groupId: string) =>
  createSelector(selectGroups, (data) => data.find(gr => gr.id === groupId))


export const selectGroupMessages = (groupId: string) =>
  createSelector(selectAllGroupMessages, (data) => data.find(d => d.groupId === groupId)?.messages.sort((a, b) => Number(a.createdAt) - Number(b.createdAt)))
