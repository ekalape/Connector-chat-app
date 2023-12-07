import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ConversationsService } from 'app/services/conversations.service';
import { HttpService } from 'app/services/http-service.service';
import { createConversation, createConversationSuccess, deleteConversation, deleteConversationSuccess, getActiveConversations, getActiveConversationsSuccess, getPeople, getPeopleAndConversations, getPeopleAndConversationsSuccess, getPeopleSuccess, sendPrivateMessage, sendPrivateMessageSuccess } from '../actions/people.action';
import { map, switchMap, catchError, of, EMPTY, mergeMap, concatMap, withLatestFrom } from 'rxjs';
import { IPeople, ISingleMessage, ISingleUserConversation, IUser, IUserConversations } from 'app/models/conversations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { selectMyID } from '../selectors/profile.selectors';

import { ErrorHandlingService } from 'app/services/error-handling.service';

@Injectable()
export class PeopleEffects {

  constructor(private actions$: Actions,
    private store: Store,
    private service: ConversationsService,
    private errorHandlingService: ErrorHandlingService) {
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
                this.errorHandlingService.handleError(err);
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

  loadCreateConversation$ = createEffect(() => this.actions$
    .pipe(
      ofType(createConversation),
      switchMap((action) => this.service.createConversations(action.companion).pipe(
        map(({ conversationID }) => createConversationSuccess({ conversation: { id: conversationID, companionID: action.companion } })),
        catchError((err) => {
          this.errorHandlingService.handleError(err);
          return EMPTY;
        })
      ))
    ))

  loadDeleteConversation$ = createEffect(() => this.actions$
    .pipe(
      ofType(deleteConversation),
      switchMap((action) => this.service.deleteConversations(action.conversationID).pipe(
        map(() => deleteConversationSuccess({ conversationID: action.conversationID })),
        catchError((err) => {
          this.errorHandlingService.handleError(err);
          return EMPTY;
        })
      ))
    ))

  loadSendPrivateMessage$ = createEffect(() => this.actions$
    .pipe(
      ofType(sendPrivateMessage),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, myData]) => this.service.sendPrivateMessage(action.conversationID, action.message).pipe(
        map(() => {
          const newMessage: ISingleMessage = { authorID: myData.id, message: action.message, createdAt: Date.now() + "" }
          return sendPrivateMessageSuccess({ conversationID: action.conversationID, message: newMessage })
        }),
        catchError((err) => {
          this.errorHandlingService.handleError(err);
          return EMPTY;
        })
      ))
    ))


}
