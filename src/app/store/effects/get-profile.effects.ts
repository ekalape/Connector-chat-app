import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { getProfileAction, getProfileSuccessAction, updateProfileAction, updateProfileSuccessAction } from '../actions/profile.action';
import { EMPTY, catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectProfileHeaders } from '../selectors/profile.selectors';
import { HttpService } from 'app/services/http-service.service';
import { IProfileResponse } from 'app/models/http-responses.model';



@Injectable()
export class GetProfileEffects {


  constructor(private actions$: Actions,
    private store: Store,
    private httpService: HttpService) {
  }

  loadProfile$ = createEffect(() => this.actions$
    .pipe(
      ofType(getProfileAction),
      withLatestFrom(this.store.select(selectProfileHeaders)),
      mergeMap(([action, headersData]) => {
        return this.httpService.getProfile(headersData)
          .pipe(
            tap(res => console.log(res)),
            map((res: IProfileResponse) =>
              getProfileSuccessAction({ name: res.name.S, createdAt: res.createdAt.S })
            ),
            catchError((err: any) => {
              console.log('err :>> ', err);
              return EMPTY
            })
          )
      })
    ));

  loadUpdateProfile$ = createEffect(() => this.actions$
    .pipe(
      ofType(updateProfileAction),
      withLatestFrom(this.store.select(selectProfileHeaders)),
      mergeMap(([action, headersData]) => {
        return this.httpService.updateProfile(action.name, headersData).pipe(
          map((response) => {
            /*  if ("status" in response && response.status === 201) { */
            return updateProfileSuccessAction({ name: action.name });
            /*           } else {

                        console.error('Unexpected status code:', response.status);
                        return  of(new Error()) */
          })
        )

      }),

    )
  )
}

