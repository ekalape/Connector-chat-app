import { ActionReducerMap } from '@ngrx/store';
import { IState } from './models/store.model';

import { profileReducer } from './reducers/profile.reducer';
import { groupMessagesReducer, groupsReducer } from './reducers/groups.reducer';




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
  groups: [],
  groupsMessages: []
}


export const reducers: ActionReducerMap<IState> = {
  authorization: profileReducer,
  groups: groupsReducer,
  groupsMessages: groupMessagesReducer

}
