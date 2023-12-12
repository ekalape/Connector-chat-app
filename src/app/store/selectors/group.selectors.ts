import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGroupsMessagesState, IGroupsSlice } from '../models/store.model';
import { ISingleGroup } from 'app/models/conversations.model';
import { selectMyID } from './profile.selectors';


export const selectGroups = createFeatureSelector<IGroupsSlice>('groups');

export const selectGroupsList = createSelector(selectGroups, data => data.list) //ISingleGroup[]

export const selectMyGroups = createSelector(selectGroupsList, selectMyID, (data, myId) => {  //string[]
  return data.filter(d => d.createdBy === myId.id).map(x => x.id)
});

export const selectFirstLoadedGroups = createSelector(selectGroupsList, (groups) => {
  if (groups.length) return true;
  return false;
})

export const selectSingleGroupDialog = (groupId: string) => createSelector(selectGroups,
  (data) => data.history.find(gr => gr.groupId === groupId)?.messages || []);

export const selectSingleGroup = (groupId: string) =>
  createSelector(selectGroupsList, (data) => data.find(gr => gr.id === groupId))


export const selectMainGroupErrorState = createSelector(selectGroups, (data) => data.errors.main);
export const selectPrivateGroupErrorState = createSelector(selectGroups, (data) => data.errors.private);

export const selectGroupMainCounterState = createSelector(selectGroups, (data) => data.counters.main);
export const selectGroupPrivateCounterState = createSelector(selectGroups, (data) => data.counters.private);

export const selectGroupLoadingState = createSelector(selectGroups, (data) => data.loading);
