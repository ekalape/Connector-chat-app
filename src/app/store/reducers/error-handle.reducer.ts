import { createReducer, on } from '@ngrx/store';
import { errorHandleAction, resetErrorAction, setMainLoadingState, setSuccessAction } from '../actions/error-handle.action';
import { RequestStatus } from 'app/utils/enums/request-status';
import { IErrorHandle } from '../models/store.model';


const initState: IErrorHandle = {
  isLoading: false,
  errorType: null,
  errorMessage: null,
  status: RequestStatus.WAITING,
};

export const errorHandleReducer = createReducer(initState,
  on(errorHandleAction, (state, { error, kind }) => ({
    ...state,
    isLoading: false,
    errorType: error.type,
    errorMessage: error.message,
    status: RequestStatus.ERROR,
    kind
  })),
  on(resetErrorAction, (state => initState)),
  on(setMainLoadingState, (state, { isLoading }) => ({
    ...initState,
    isLoading
  })),
  on(setSuccessAction, (state, { kind }) => ({
    ...state,
    isLoading: false,
    status: RequestStatus.SUCCESS,
    kind
  }))

)
