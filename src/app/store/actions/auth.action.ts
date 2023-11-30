import { createAction, props } from '@ngrx/store';

export const logInAction = createAction("[auth] Login", props<{ token: string, email: string, uid: string }>())
export const logOutAction = createAction("[auth] Logout");


export const setLoadingAction = createAction("[auth] Set Loading", props<{ loading: boolean }>());
