import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAutorizationSlice } from '../models/store.model';


export const selectProfileData = createFeatureSelector<IAutorizationSlice>('authorization');


export const selectProfileHeaders = createSelector(selectProfileData, (data) => ({ uid: data.id, email: data.email, token: data.token }));
