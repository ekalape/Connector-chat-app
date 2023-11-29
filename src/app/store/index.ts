import { ActionReducerMap } from '@ngrx/store';
import { IState } from './models/store.model';
import { authReducer } from './reducers/auth.reducer';




export const StoreInitialState: IState = {
  authorization: {
    id: "1",
    name: "aaa",
    email: "aaa@mail.ru",
    createdAt: "11/25/2023",
    loggedIn: false,
    token: ""

  }
}


export const reducers: ActionReducerMap<IState> = {
  authorization: authReducer
}
