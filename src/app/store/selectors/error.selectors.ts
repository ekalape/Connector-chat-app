import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IErrorHandle } from '../models/store.model';



export const selectErrorState = createFeatureSelector<IErrorHandle>('error');
export const selectMainLoadingState = createSelector(selectErrorState, data => data.isLoading)
