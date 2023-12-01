import { createAction, props } from '@ngrx/store';
import { IHttpError } from 'app/models/auth.model';

export const getProfileAction = createAction("[profile] Get Profile");
export const getProfileSuccessAction = createAction("[profile] Get Profile Success Action", props<{ name: string, createdAt: string }>());


export const updateProfileAction = createAction("[profile] Update Profile", props<{ name: string }>());
export const updateProfileSuccessAction = createAction("[profile] Update Profile Success", props<{ name: string }>());

export const setErrorAction = createAction("[profile] Set Error", props<{ error: IHttpError | null }>());
