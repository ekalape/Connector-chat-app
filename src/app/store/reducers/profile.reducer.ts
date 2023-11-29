import { createReducer, on } from '@ngrx/store';
import { getProfileSuccessAction, updateProfileSuccessAction } from '../actions/profile.action';

import { IAutorizationSlice } from '../models/store.model';


const initState: IAutorizationSlice = {
  id: "1",
  name: "aaa",
  email: "aaa@mail.ru",
  createdAt: "11/25/2023",
  loggedIn: false,
  token: ""

}


export const profileReducer = createReducer(initState,
  on(getProfileSuccessAction,
    (state, { name, createdAt }) => ({
      ...state,
      name, createdAt
    })),
  on(updateProfileSuccessAction,
    (state, { name }) => ({
      ...state,
      name
    }))
)
