import { createAction, props } from '@ngrx/store';

export const getProfileAction = createAction("[profile] Get Profile");
export const getProfileSuccessAction = createAction("[profile] Get Profile Success", props<{ name: string, createdAt: string }>());


export const updateProfileAction = createAction("[profile] Update Profile", props<{ name: string }>());
export const updateProfileSuccessAction = createAction("[profile] Update Profile Success", props<{ name: string }>());
