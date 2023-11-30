import { createSelector } from '@ngrx/store';
import { selectProfileData } from './profile.selectors';

export const selectLoadingState = createSelector(selectProfileData, (data) => ({ loading: data.loading }));
export const selectAuthError = createSelector(selectProfileData, (data) => ({ error: data.error }));
