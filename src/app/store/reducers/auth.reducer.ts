import { createReducer, on } from '@ngrx/store';
import { IAutorizationSlice } from '../models/store.model';
import { logInAction, logOutAction } from '../actions/auth.action';


const authInitState: IAutorizationSlice = {
  loggedIn: false,
  token: ""

}

export const authReducer = createReducer(authInitState,
  on(logInAction, (state, { token }) => ({
    ...state,
    loggedIn: true,
    token
  })),
  on(logOutAction, (state) => ({
    ...state,
    loggedIn: false,
    token: ""
  }))
)
