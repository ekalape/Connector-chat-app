import { createReducer, on } from '@ngrx/store';
import { IAutorizationSlice } from '../models/store.model';
import { getProfileSuccessAction, logInAction, logOutAction } from '../actions/auth.action';


const authInitState: IAutorizationSlice = {
  id: "1",
  name: "aaa",
  email: "aaa@mail.ru",
  createdAt: "11/25/2023",
  loggedIn: false,
  token: ""

}

export const authReducer = createReducer(authInitState,
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
  on(getProfileSuccessAction,
    (state, { name, createdAt }) => ({
      ...state,
      name, createdAt
    }))
)
