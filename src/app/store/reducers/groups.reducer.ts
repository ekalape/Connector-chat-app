import { createReducer, on } from '@ngrx/store';

import { addNewGroupSuccess, deleteGroupSuccess, getAllGroups, getAllGroupsSuccess, getGroupMessagesSuccess, resetGroupError, resetGroupSlice, sendGroupMessage, sendGroupMessagesSuccess, setGroupCounter, setGroupError, setGroupLoading, setGroupSuccess } from '../actions/group.action';
import { ISingleGroup } from 'app/models/conversations.model';
import { IErrorState, IGroupsMessagesState, IGroupsSlice } from '../models/store.model';

import { RequestStatus } from 'app/utils/enums/request-status';
/* import { GroupsActions } from './groups.actions'; */

export const groupsFeatureKey = 'groups';



export const initialState: IGroupsSlice = {
  list: [],
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


export const groupsReducer = createReducer(
  initialState,
  on(getAllGroupsSuccess, (state, { groups }) => ({
    ...state,
    list: groups,

  })),
  on(addNewGroupSuccess, (state, { group }) => ({
    ...state,
    list: [...state.list, group]
  })),
  on(deleteGroupSuccess, (state, { groupId }) => ({
    ...state,
    list: state.list.filter(gr => gr.id !== groupId)
  })),
  on(getGroupMessagesSuccess, (state, { groupId, messages }) => {
    const existent = state.history.find(gr => gr.groupId === groupId);
    let newHistory = state.history
    if (existent) {
      newHistory = [...state.history.filter(gr => gr.groupId !== groupId),
      { groupId, messages: [...existent.messages, ...messages] }]
    }
    else newHistory = [...state.history, { groupId, messages }];
    return ({
      ...state,
      history: newHistory
    })
  }),
  on(sendGroupMessagesSuccess, (state, { groupId, message }) => {
    const existent = state.history.find(gr => gr.groupId === groupId);
    let newHistory = state.history
    if (existent) {
      newHistory = [...state.history.filter(gr => gr.groupId !== groupId),
      { groupId, messages: [...existent.messages, message] }]
    }
    else newHistory = [...state.history, { groupId, messages: [message] }];
    return ({
      ...state,
      history: newHistory
    })
  }),
  on(resetGroupSlice, (state) => initialState),
  on(setGroupSuccess, (state, { successType, comm }) => {
    return successType === 'main' ?
      { ...state, errors: { ...state.errors, main: { status: RequestStatus.SUCCESS, type: comm } } } :
      { ...state, errors: { ...state.errors, private: { status: RequestStatus.SUCCESS, type: comm } } }
  }),
  on(resetGroupError, (state, { successType }) => {
    return successType === 'main' ?
      { ...state, errors: { ...state.errors, main: { status: RequestStatus.WAITING } } } :
      { ...state, errors: { ...state.errors, private: { status: RequestStatus.WAITING } } }
  }),
  on(setGroupError, (state, { successType, errtype, message }) => {
    const error: IErrorState = {
      status: RequestStatus.ERROR,
      type: errtype,
      message
    }
    return successType === 'main' ?
      { ...state, errors: { ...state.errors, main: error } } :
      { ...state, errors: { ...state.errors, private: error } }
  }),
  on(setGroupCounter, (state, { counterType, time }) => {
    return counterType === 'main' ?
      { ...state, counters: { ...state.counters, main: time } } :
      { ...state, counters: { ...state.counters, private: time } }
  }),
  on(setGroupLoading, (state, { isLoading }) => ({
    ...state,
    loading: isLoading
  }))
);



