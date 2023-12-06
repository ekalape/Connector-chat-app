import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ConversationsService } from 'app/services/conversations.service';
import { HttpService } from 'app/services/http-service.service';
import { getActiveConversations, getActiveConversationsSuccess, getPeople, getPeopleAndConversations, getPeopleAndConversationsSuccess, getPeopleSuccess } from '../actions/people.action';
import { map, switchMap, catchError, of, EMPTY, mergeMap, concatMap } from 'rxjs';
import { IPeople, ISingleUserConversation, IUser, IUserConversations } from 'app/models/conversations.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PeopleEffects {

  constructor(private actions$: Actions,
    private store: Store,
    private service: ConversationsService) {
  }

  loadPeopleAndConversations$ = createEffect(() => this.actions$
    .pipe(
      ofType(getPeopleAndConversations),
      mergeMap((action) => {
        return this.service.getPeople().pipe(
          map((res: IPeople) => res.Items.map(p => ({ name: p.name.S, uid: p.uid.S }))),
          mergeMap((users: IUser[]) => {
            return this.service.getActiveConversations().pipe(
              map((res: IUserConversations) => res.Items.map(p => ({ id: p.id.S, companionID: p.companionID.S }))),
              map((res: ISingleUserConversation[]) => {
                return getPeopleAndConversationsSuccess({ users, conversations: res })
              }),
              catchError((err) => {
                console.log('err :>> ', err);
                this.handleError(err);
                return EMPTY;
              })
            )
          }),

        )
      }))
  )
  /*
    loadPeople$ = createEffect(() => this.actions$
      .pipe(
        ofType(getPeople),
        switchMap((action) => {
          return this.service.getPeople().pipe(
            map((res: IPeople) => res.Items.map(p => ({ name: p.name.S, uid: p.uid.S }))),
            map(users => getPeopleSuccess({ users })),
            catchError((err) => {
              console.log('err :>> ', err);
              this.handleError(err);
              return EMPTY;
            })
          )
        })
      ))

    loadActiveConversations$ = createEffect(() => this.actions$
      .pipe(
        ofType(getActiveConversations),
        switchMap((action) => {
          return this.service.getActiveConversations().pipe(
            map((res: IUserConversations) => res.Items.map(p => ({ id: p.id.S, companionID: p.companionID.S }))),
            map(conversations => getActiveConversationsSuccess({ conversations })),
            catchError((err) => {
              console.log('err :>> ', err);
              this.handleError(err);
              return EMPTY;
            })
          )
        })
      )) */



  private handleError(error: HttpErrorResponse) {
    console.log('error :>> ', error.error);
    return of({ type: error.error.type, message: error.error.message })


  }
}
