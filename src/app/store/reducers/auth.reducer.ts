import { createReducer, on } from '@ngrx/store';
import { IAutorizationSlice } from '../models/store.model';
import { logInAction, logOutAction } from '../actions/auth.action';
import { StoreInitialState } from '..';


const initState: IAutorizationSlice = {
  id: "1",
  name: "aaa",
  email: "aaa@mail.ru",
  createdAt: "11/25/2023",
  loggedIn: false,
  token: ""

}

export const authReducer = createReducer(initState,
  on(logInAction, (state, { token, email, uid }) => ({
    ...state,
    loggedIn: true,
    token, email,
    id: uid
  })),
  on(logOutAction, (state) => ({
    ...state,
    loggedIn: false,
    token: ""
  })),

)
