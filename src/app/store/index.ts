import { ActionReducerMap } from '@ngrx/store';
import { IState } from './models/store.model';
import { authReducer } from './reducers/auth.reducer';




export const StoreInitialState: IState = {
  authorization: {
    loggedIn: false,
    token: ""

  }
}

export const reducers: ActionReducerMap<IState> = {
  authorization: authReducer
}
