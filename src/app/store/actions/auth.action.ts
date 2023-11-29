import { createAction, props } from '@ngrx/store';

export const logInAction = createAction("[auth] Login", props<{ token: string }>())
export const logOutAction = createAction("[auth] Logout")
