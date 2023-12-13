
import { createConversationSuccess, deleteConversationSuccess, getPeopleAndConversationsSuccess, getPrivateMessagesSuccess, resetPeopleError, resetPeopleSlice, sendPrivateMessageSuccess, setPeopleCounter, setPeopleError, setPeopleLoading, setPeopleSuccess } from '../actions/people.action';

import { createReducer, on } from '@ngrx/store';
import { IErrorState, IPeopleSlice } from '../models/store.model';
import { RequestStatus } from 'app/utils/enums/request-status';



export const peopleInitState: IPeopleSlice = {
  list: [],
  myConvs: [],
  history: [],
  errors: {
    main: {
      status: RequestStatus.WAITING
    },
    private: {
      status: RequestStatus.WAITING
    },
  },
  counters: {
    main: 0,
    private: 0,
  },
  loading: false
}


export const peopleReducer = createReducer(
  peopleInitState,
  on(getPeopleAndConversationsSuccess, (state, { users, conversations }) => ({
    ...state,
    list: users,
    myConvs: conversations
  })),
  on(createConversationSuccess, (state, { conversation }) => ({
    ...state,
    myConvs: [...state.myConvs, conversation]
  })),
  on(deleteConversationSuccess, (state, { conversationID }) => ({
    ...state,
    myConvs: state.myConvs.filter(c => c.id !== conversationID)
  })),
  on(getPrivateMessagesSuccess, (state, { conversationID, messages }) => {
    const existent = state.history.find(gr => gr.conversationID === conversationID);
    let newHistory = state.history
    if (existent) {
      newHistory = [...state.history.
        filter(gr => gr.conversationID !== conversationID), { conversationID, messages: [...existent.messages, ...messages] }]
    }
    else newHistory = [...state.history, { conversationID, messages }];
    return ({
      ...state,
      history: newHistory
    })
  }),
  on(sendPrivateMessageSuccess, (state, { conversationID, message }) => {
    const existent = state.history.find(gr => gr.conversationID === conversationID);
    let newHistory = state.history
    if (existent) {
      newHistory = [...state.history.filter(gr => gr.conversationID !== conversationID), { conversationID, messages: [...existent.messages, message] }]
    }
    else newHistory = [...state.history, { conversationID, messages: [message] }];
    return ({
      ...state,
      history: newHistory
    })
  }),
  on(resetPeopleSlice, (state) => peopleInitState),
  on(setPeopleSuccess, (state, { successType, comm }) => {
    return successType === 'main' ? { ...state, errors: { ...state.errors, main: { status: RequestStatus.SUCCESS, type: comm } }, loading: false } :
      { ...state, errors: { ...state.errors, private: { status: RequestStatus.SUCCESS, type: comm } }, loading: false }
  }),
  on(resetPeopleError, (state, { successType }) => {
    return successType === 'main' ? { ...state, errors: { ...state.errors, main: { status: RequestStatus.WAITING } }, loading: false } :
      { ...state, errors: { ...state.errors, private: { status: RequestStatus.WAITING } }, loading: false }
  }),
  on(setPeopleError, (state, { successType, errtype, message }) => {
    const error: IErrorState = {
      status: RequestStatus.ERROR,
      type: errtype,
      message
    }
    return successType === 'main' ? { ...state, errors: { ...state.errors, main: error }, loading: false } :
      { ...state, errors: { ...state.errors, private: error }, loading: false }
  }),
  on(setPeopleCounter, (state, { counterType, time }) => {
    return counterType === 'main' ? { ...state, counters: { ...state.counters, main: time } } :
      { ...state, counters: { ...state.counters, private: time } }
  }),
  on(setPeopleLoading, (state, { isLoading }) => ({
    ...state,
    loading: isLoading
  }))



)
