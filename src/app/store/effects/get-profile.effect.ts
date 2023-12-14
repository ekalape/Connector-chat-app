import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { getProfileAction, getProfileSuccessAction, setErrorAction, updateProfileAction, updateProfileSuccessAction } from '../actions/profile.action';
import { EMPTY, catchError, map, mergeMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpService } from 'app/services/http-service.service';
import { IProfileResponse } from 'app/models/http-responses.model';
import { setLoadingAction } from '../actions/auth.action';
import { selectLoggedIn } from '../selectors/auth.selectors';



@Injectable()
export class GetProfileEffects {

  constructor(private actions$: Actions,
    private store: Store,
    private httpService: HttpService) {
  }

  loadProfile$ = createEffect(() => this.actions$
    .pipe(
      ofType(getProfileAction),
      withLatestFrom(this.store.select(selectLoggedIn)),

      mergeMap(([action, loggedIn]) => {
        if (loggedIn) {
          this.store.dispatch(setLoadingAction({ loading: true }));
          return this.httpService.getProfile()
            .pipe(
              map((res: IProfileResponse) =>
                getProfileSuccessAction({ name: res.name.S, createdAt: res.createdAt.S })
              ),
              catchError((err) => {
                this.store.dispatch(setErrorAction({ error: err.error }));
                return EMPTY
              })
            )
        } else return EMPTY
      })

    ));

  loadUpdateProfile$ = createEffect(() => this.actions$
    .pipe(
      ofType(updateProfileAction),
      withLatestFrom(this.store.select(selectLoggedIn)),
      mergeMap(([action, loggedIn]) => {
        if (loggedIn) {
          this.store.dispatch(setLoadingAction({ loading: true }));
          return this.httpService.updateProfile(action.name).pipe(
            map(() => {
              return updateProfileSuccessAction({ name: action.name });
            }),
            catchError((err) => {
              this.store.dispatch(setErrorAction({ error: err.error }))
              return EMPTY
            })
          )
        } else return EMPTY
      }),

    )
  )
}

