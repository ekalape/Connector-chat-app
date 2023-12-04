import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IStorageInfo } from 'app/models/auth.model';

import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Pathes } from 'app/utils/enums/pathes';


export const authGuard: CanActivateFn = async () => {


  const router = inject(Router);
  let isLogged;

  const loginInfo = localStorage.getItem(StorageKeys.LOGIN_KEY)
  if (loginInfo) { isLogged = (JSON.parse(loginInfo) as IStorageInfo).token }
  console.log('isLogged :>> ', isLogged);

  if (isLogged) {
    return true;
  }
  else {
    router.navigate([Pathes.SIGN_IN])
    return false;
  }
};


