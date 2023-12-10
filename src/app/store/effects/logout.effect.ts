import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { logOutAction, logOutSuccessAction } from '../actions/auth.action';
import { EMPTY, catchError, concatMap, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'app/services/auth.service';
import { resetGroupSlice } from '../actions/group.action';
import { resetPeopleSlice } from '../actions/people.action';
import { ErrorHandlingService } from 'app/services/error-handling.service';
import { Router } from '@angular/router';
import { Pathes } from 'app/utils/enums/pathes';

@Injectable()
export class LogoutEffects {

  constructor(private actions$: Actions,
    private authService: AuthService,
    private errService: ErrorHandlingService,
    private router: Router
  ) {
  }

  logout$ = createEffect(() => this.actions$
    .pipe(
      ofType(logOutAction),
      switchMap((action) => {
        this.errService.setLoading(true);
        return this.authService.logout().pipe(
          concatMap(() => [logOutSuccessAction(),
          resetPeopleSlice(),
          resetGroupSlice()
          ]
          ),
          catchError((err) => {
            console.log('err :>> ', err);
            this.errService.handleError(err)
            return EMPTY
          })
        )
      }
      )
    )
  )

  loadSuccessLogout$ = createEffect(() => this.actions$
    .pipe(
      ofType(logOutSuccessAction),
      tap(() => {
        console.log("inside effect");
        this.router.navigate([Pathes.SIGN_IN])
      })

    ), { dispatch: false }

  )
}
