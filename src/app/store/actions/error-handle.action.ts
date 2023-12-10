import { createAction, props } from '@ngrx/store';
import { IErrorHandle } from '../models/store.model';
import { IHttpError } from 'app/models/auth.model';
import { titleKinds } from 'app/utils/enums/title-controls';


export const errorHandleAction = createAction("[error] Error Handle Action", props<{ error: IHttpError, kind?: titleKinds }>());
export const resetErrorAction = createAction("[error] Error Reset Action");
export const setSuccessAction = createAction("[error] Success Action", props<{ kind: titleKinds | null }>());
export const setMainLoadingState = createAction("[error] Set Loading State", props<{ isLoading: boolean }>());
