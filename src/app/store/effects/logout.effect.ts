import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { logOutAction, logOutSuccessAction } from '../actions/auth.action';
import { EMPTY, catchError, map, switchMap } from 'rxjs';
import { AuthService } from 'app/services/auth.service';

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
          map(() => logOutSuccessAction()
          ),
          catchError((err) => {
            return EMPTY
          })
        )
      }
      )
    )
  )
}
