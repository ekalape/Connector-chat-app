import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPeopleSlice } from '../models/store.model';
import { selectMyID } from './profile.selectors';

export const selectPeopleData = createFeatureSelector<IPeopleSlice>('people');

export const selectUsers = createSelector(selectPeopleData, selectMyID, (data, myData) => data.list.filter(us => us.uid !== myData.id));
export const selectMyConversations = createSelector(selectPeopleData, (data) => data.myConvs);

export const selectUserByConversationID = (convID: string) => createSelector(selectPeopleData, selectUsers, (data, users) => {
  const oppID = data.myConvs.find(c => c.id === convID)?.companionID
  return users.find(us => us.uid === oppID)
})

export const selectMessagesByConversationId = (convID: string) => createSelector(selectPeopleData, (data) => {
  return data.history.find(c => c.conversationID === convID)?.messages
})
export const selectSingleConversationByConversationId = (convID: string) => createSelector(selectPeopleData, (data) => {
  return data.history.find(c => c.conversationID === convID)
})

export const selectConversationByCompanion = (opponentID: string) => createSelector(selectMyConversations,
  data => data.find(c => c.companionID === opponentID)?.id)

export const selectFirstLoadedPeople = createSelector(selectUsers, (users) => {
  if (users.length) return true;
  return false;
})


export const selectMainPeopleErrorState = createSelector(selectPeopleData, (data) => data.errors.main);
export const selectPrivatePeopleErrorState = createSelector(selectPeopleData, (data) => data.errors.private);

export const selectPeopleMainCounterState = createSelector(selectPeopleData, (data) => data.counters.main);
export const selectPeoplePrivateCounterState = createSelector(selectPeopleData, (data) => data.counters.private);
export const selectPeoplePrivateCounterStateByID = (ID: string) => createSelector(selectPeopleData, (data) => data.counters.private.find(x => x.id === ID));


export const selectPeopleLoadingState = createSelector(selectPeopleData, (data) => data.loading);
