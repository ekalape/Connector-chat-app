import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { logOutAction, logOutSuccessAction, setLoadingAction } from '../actions/auth.action';
import { EMPTY, catchError, concatMap, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'app/services/auth.service';
import { resetGroupSlice } from '../actions/group.action';
import { resetPeopleSlice } from '../actions/people.action';

import { Router } from '@angular/router';
import { Pathes } from 'app/utils/enums/pathes';
import { Store } from '@ngrx/store';

@Injectable()
export class LogoutEffects {

  constructor(private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
  }

  logout$ = createEffect(() => this.actions$
    .pipe(
      ofType(logOutAction),
      tap(() => this.store.dispatch(setLoadingAction({ loading: true }))),
      switchMap((action) => {
        return this.authService.logout().pipe(
          concatMap(() => [logOutSuccessAction(),
          resetPeopleSlice(),
          resetGroupSlice(),
          setLoadingAction({ loading: false })
          ]
          ),
          catchError((err) => {
            this.store.dispatch(setLoadingAction({ loading: true }))
            return of({ type: err.error.type || "unknown", message: err.error.message || "Something went wrong" })
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
        this.router.navigate([Pathes.SIGN_IN])
      })
    ), { dispatch: false }

  )
}
