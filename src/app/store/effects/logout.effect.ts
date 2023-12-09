import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { logOutAction, logOutSuccessAction } from '../actions/auth.action';
import { EMPTY, catchError, concatMap, map, switchMap } from 'rxjs';
import { AuthService } from 'app/services/auth.service';
import { resetGroupSlice } from '../actions/group.action';
import { resetPeopleSlice } from '../actions/people.action';

@Injectable()
export class LogoutEffects {

  constructor(private actions$: Actions,
    private authService: AuthService
  ) {
  }

  logout$ = createEffect(() => this.actions$
    .pipe(
      ofType(logOutAction),
      switchMap((action) => {
        return this.authService.logout().pipe(
          concatMap(() => [logOutSuccessAction(),
          resetPeopleSlice(),
          resetGroupSlice()
          ]
          ),
          catchError((err) => {
            console.log('err :>> ', err);
            return EMPTY
          })
        )
      }
      )
    )
  )
}
