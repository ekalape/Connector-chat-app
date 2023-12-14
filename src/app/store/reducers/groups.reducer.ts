import { createReducer, on } from '@ngrx/store';
import {
  addNewGroupSuccess, deleteGroupSuccess,
  getAllGroupsSuccess, getGroupMessagesSuccess,
  resetGroupError, resetGroupSlice,
  sendGroupMessagesSuccess, setGroupCounter, setGroupError, setGroupLoading,
  setGroupSuccess
} from '../actions/group.action';
import { IErrorState, IGroupsSlice } from '../models/store.model';
import { RequestStatus } from 'app/utils/enums/request-status';


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
    main: { active: false, time: 0, current: 60 },
    private: [],
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
  on(getGroupMessagesSuccess, (state, { groupId, messages, since }) => {
    const existent = state.history.find(gr => gr.groupId === groupId);
    let newHistory = state.history
    if (existent) {
      newHistory = [...state.history.filter(gr => gr.groupId !== groupId),
      { groupId, messages: [...existent.messages, ...messages], since }]
    }
    else newHistory = [...state.history, { groupId, messages, since }];
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
      { ...state, errors: { ...state.errors, main: { status: RequestStatus.SUCCESS, type: comm } }, loading: false } :
      { ...state, errors: { ...state.errors, private: { status: RequestStatus.SUCCESS, type: comm } }, loading: false }
  }),
  on(resetGroupError, (state, { successType }) => {
    return successType === 'main' ?
      { ...state, errors: { ...state.errors, main: { status: RequestStatus.WAITING } }, loading: false } :
      { ...state, errors: { ...state.errors, private: { status: RequestStatus.WAITING } }, loading: false }
  }),
  on(setGroupError, (state, { successType, errtype, message }) => {
    const error: IErrorState = {
      status: RequestStatus.ERROR,
      type: errtype,
      message
    }
    return successType === 'main' ?
      { ...state, errors: { ...state.errors, main: error }, loading: false } :
      { ...state, errors: { ...state.errors, private: error }, loading: false }
  }),
  on(setGroupCounter, (state, { counterType, active, time, current, id }) => {
    return counterType === 'main' ? { ...state, counters: { ...state.counters, main: { active, time, current } } } :
      { ...state, counters: { ...state.counters, private: [...state.counters.private.filter(x => x.id !== id), { id, active, time, current }] } }
  }),
  on(setGroupLoading, (state, { isLoading }) => ({
    ...state,
    loading: isLoading
  }))
);



