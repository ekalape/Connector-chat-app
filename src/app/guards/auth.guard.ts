import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'app/services/auth.service';
import { selectLoggedIn } from 'app/store/selectors/auth.selectors';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Pathes } from 'app/utils/enums/pathes';
import { first, lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {


  const router = inject(Router);


  const isLogged = localStorage.getItem(StorageKeys.LOGIN_KEY)
  console.log('isLogged :>> ', isLogged);

  if (isLogged) {
    console.log("[auth] -- Logged, return true");
    return true;
  }
  else {
    console.log("[auth] -- Not Logged, return false");
    return router.parseUrl(Pathes.HOME);
  }
};

export const guestGuard: CanActivateFn = async () => {


  const router = inject(Router);


  const isLogged = localStorage.getItem(StorageKeys.LOGIN_KEY)
  console.log('isLogged inside guest :>> ', isLogged);

  if (!isLogged) {
    console.log("[guest] -- Not Logged, return true");
    return true;
  }
  else {
    console.log("[guest] -- Logged, return false");
    return router.parseUrl(Pathes.PROFILE);
  }
};

