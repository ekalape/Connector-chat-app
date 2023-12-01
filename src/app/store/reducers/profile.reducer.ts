import { createReducer, on } from '@ngrx/store';
import { getProfileSuccessAction, setErrorAction, updateProfileSuccessAction } from '../actions/profile.action';

import { IAutorizationSlice } from '../models/store.model';
import { logInAction, logOutAction, setLoadingAction } from '../actions/auth.action';


const initState: IAutorizationSlice = {
  id: "",
  name: "",
  email: "",
  createdAt: "",
  loggedIn: false,
  token: "",
  loading: false,
  error: null

}


export const profileReducer = createReducer(initState,
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
  on(setLoadingAction, (state, { loading }) => ({
    ...state,
    loading
  })),
  on(getProfileSuccessAction,
    (state, { name, createdAt }) => {
      console.log("inside reducer", "name:", name, "createdAt:", createdAt);
      return {
        ...state,
        name, createdAt, loading: false
      }
    }),
  on(updateProfileSuccessAction,
    (state, { name }) => ({
      ...state,
      name, loading: false
    })),
  on(setErrorAction, (state, { error }) => ({
    ...state,
    error, loading: false
  }))

)
