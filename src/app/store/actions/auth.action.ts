import { createAction, props } from '@ngrx/store';

export const logInAction = createAction("[auth] Login", props<{ token: string, email: string, uid: string }>())
export const logOutAction = createAction("[auth] Logout");

export const getProfileAction = createAction("[auth] Get Profile");
export const getProfileSuccessAction = createAction("[auth] Get Profile Success", props<{ name: string, createdAt: string }>());

