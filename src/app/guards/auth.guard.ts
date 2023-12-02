import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Pathes } from 'app/utils/enums/pathes';


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

    router.navigate([Pathes.SIGN_IN])
    return false;
  }
};


