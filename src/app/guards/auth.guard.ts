import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { IStorageInfo } from 'app/models/auth.model';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Pathes } from 'app/utils/enums/pathes';



export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const router = inject(Router);

  let isLogged;

  const loginInfo = localStorage.getItem(StorageKeys.LOGIN_KEY)
  if (loginInfo) { isLogged = (JSON.parse(loginInfo) as IStorageInfo).token }

  if (isLogged) {
    return true;
  }
  else {
    router.navigate([Pathes.SIGN_IN])
    return false;
  }
};
export const guestGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const router = inject(Router);

  let isLogged;

  const loginInfo = localStorage.getItem(StorageKeys.LOGIN_KEY)
  if (loginInfo) { isLogged = (JSON.parse(loginInfo) as IStorageInfo).token }

  if (isLogged) {
    if (["/signin", "/signup"].includes(state.url)) router.navigate([Pathes.HOME])
    return false;
  }
  else return true;
};




