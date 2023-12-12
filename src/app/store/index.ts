import { ActionReducerMap } from '@ngrx/store';
import { IErrorState, IState } from './models/store.model';

import { profileReducer } from './reducers/profile.reducer';
import { groupsReducer } from './reducers/groups.reducer';
import { peopleReducer } from './reducers/people.reducer';
import { RequestStatus } from 'app/utils/enums/request-status';


export const initErrorState: IErrorState = {
  status: RequestStatus.WAITING
}

export const StoreInitialState: IState = {
  authorization: {
    id: "",
    name: "",
    email: "",
    createdAt: "",
    loggedIn: false,
    token: "",
    loading: false,
    error: null
  },
  groups: {
    list: [],
    history: [],
    errors: {
      main: initErrorState,
      private: initErrorState,
    },
    counters: {
      main: 0,
      private: 0,
    },
    loading: false
  },
  people: {
    list: [],
    myConvs: [],
    history: [],
    errors: {
      main: initErrorState,
      private: initErrorState,
    },
    counters: {
      main: 0,
      private: 0,
    },
    loading: false
  },

}


export const reducers: ActionReducerMap<IState> = {
  authorization: profileReducer,
  groups: groupsReducer,
  people: peopleReducer

}
