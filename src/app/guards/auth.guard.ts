import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { IStorageInfo } from 'app/models/auth.model';
import { Location } from '@angular/common';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { Pathes } from 'app/utils/enums/pathes';
import { take } from 'rxjs';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const router = inject(Router);

  let isLogged;

  const loginInfo = localStorage.getItem(StorageKeys.LOGIN_KEY)
  if (loginInfo) { isLogged = (JSON.parse(loginInfo) as IStorageInfo).token }
  console.log("isLogged in authGuard", isLogged);

  if (isLogged) {
    if (["/signin", "signup"].includes(state.url)) router.navigate([Pathes.HOME])
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

  console.log("isLogged in guestGuard", isLogged);
  console.log('route :>> ', route);
  console.log('state :>> ', state);
  if (isLogged) {

    return false;
  }
  else return true;
};




