import { createAction, props } from '@ngrx/store';

export const logInAction = createAction("[auth] Login", props<{ token: string, email: string, uid: string }>())
export const logOutAction = createAction("[auth] Logout");


