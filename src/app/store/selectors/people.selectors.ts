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


/* export const selectUsers = createSelector(selectPeopleData, selectMyID, (data, myData) => data.users.filter(us => us.uid !== myData.id));
export const selectConversations = createSelector(selectPeopleData, (data) => data.conversations);
export const selectAllMessages = createSelector(selectPeopleData, (data) => data.messages);



export const selectSingleUser = (convID: string) => createSelector(selectUsers, selectConversations, (users, dialog) => {
  const conversation = dialog.find(d => d.id === convID);
  const user = users.find(u => u.uid === conversation?.companionID);
  return user;
})

export const selectMessagesByConversationId = (convID: string) => createSelector(selectAllMessages,
  (data) => data.find(d => d.conversationID === convID)?.dialog)


export const selectSingleConversation = (opponentID: string) => createSelector(selectConversations,
  (data) => data.find(d => d.companionID === opponentID))


export const selectFirstLoadedPeople = createSelector(selectUsers, (users) => {
  if (users.length) return true;
  return false;
}) */


export const selectMainPeopleErrorState = createSelector(selectPeopleData, (data) => data.errors.main);
export const selectPrivatePeopleErrorState = createSelector(selectPeopleData, (data) => data.errors.private);

export const selectPeopleMainCounterState = createSelector(selectPeopleData, (data) => data.counters.main);
export const selectPeoplePrivateCounterState = createSelector(selectPeopleData, (data) => data.counters.private);


export const selectPeopleLoadingState = createSelector(selectPeopleData, (data) => data.loading);
