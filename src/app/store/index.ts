import { ActionReducerMap } from '@ngrx/store';
import { IState } from './models/store.model';

import { profileReducer } from './reducers/profile.reducer';




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
  }
}


export const reducers: ActionReducerMap<IState> = {
  authorization: profileReducer

}
