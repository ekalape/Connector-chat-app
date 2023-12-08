import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGroupsMessagesState } from '../models/store.model';
import { ISingleGroup } from 'app/models/conversations.model';
import { selectMyID } from './profile.selectors';


export const selectGroups = createFeatureSelector<ISingleGroup[]>('groups');
export const selectAllGroupMessages = createFeatureSelector<IGroupsMessagesState[]>('groupsMessages');


export const selectMyGroups = createSelector(selectGroups, selectMyID, (data, myId) => {
  return data.filter(d => d.createdBy === myId.id).map(x => x.id)
});

export const selectSingleGroup = (groupId: string) =>
  createSelector(selectGroups, (data) => data.find(gr => gr.id === groupId))


export const selectGroupMessages = (groupId: string | null) =>
  createSelector(selectAllGroupMessages, (data) => {
    if (groupId) {
      const storedMessages = data.find(d =>
        d.groupId === groupId)?.messages;
      return storedMessages ? storedMessages : []
    }
    else return []
  })

export const selectFirstLoadedGroups = createSelector(selectGroups, (groups) => {
  if (groups.length) return true;
  return false;
})
