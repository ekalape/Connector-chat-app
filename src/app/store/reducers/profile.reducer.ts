import { createReducer, on } from '@ngrx/store';
import { getProfileSuccessAction, setErrorAction, updateProfileSuccessAction } from '../actions/profile.action';
import { IAutorizationSlice } from '../models/store.model';
import { logInAction, logOutSuccessAction, setLoadingAction } from '../actions/auth.action';


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
  on(setLoadingAction, (state, { loading }) => ({
    ...state,
    loading
  })),
  on(getProfileSuccessAction,
    (state, { name, createdAt }) => {
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
  })),
  on(logOutSuccessAction, (state) => initState)

)
