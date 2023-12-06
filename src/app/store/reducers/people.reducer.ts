import { getActiveConversationsSuccess, getPeople, getPeopleAndConversationsSuccess, getPeopleSuccess } from '../actions/people.action';
import { IPeopleState } from '../models/store.model';
import { createReducer, on } from '@ngrx/store';

export const peopleInitState: IPeopleState = {
  users: [],
  conversations: [],
  messages: []
}


export const peopleReducer = createReducer(
  peopleInitState,
  on(getPeopleSuccess, (state, { users }) => ({
    ...state,
    users
  })),
  on(getActiveConversationsSuccess, (state, { conversations }) => ({
    ...state,
    conversations
  })),
  on(getPeopleAndConversationsSuccess, (state, { users, conversations }) => ({
    ...state,
    users,
    conversations
  })),

)
