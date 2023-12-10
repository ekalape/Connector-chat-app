import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ConversationsService } from 'app/services/conversations.service';
import { HttpService } from 'app/services/http-service.service';
import { createConversation, createConversationSuccess, deleteConversation, deleteConversationSuccess, getActiveConversations, getActiveConversationsSuccess, getPeople, getPeopleAndConversations, getPeopleAndConversationsSuccess, getPeopleSuccess, getPrivateMessages, getPrivateMessagesSuccess, sendPrivateMessage, sendPrivateMessageSuccess } from '../actions/people.action';
import { map, switchMap, catchError, of, EMPTY, mergeMap, concatMap, withLatestFrom, delay, tap } from 'rxjs';
import { IPeople, ISingleMessage, ISingleUserConversation, IUser, IUserConversations } from 'app/models/conversations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { selectMyID } from '../selectors/profile.selectors';

import { ErrorHandlingService } from 'app/services/error-handling.service';
import { selectMessagesByConversationId } from '../selectors/people.selectors';
import { errorHandleAction, resetErrorAction, setMainLoadingState, setSuccessAction } from '../actions/error-handle.action';
import { titleKinds } from 'app/utils/enums/title-controls';

@Injectable()
export class PeopleEffects {

  constructor(private actions$: Actions,
    private store: Store,
    private service: ConversationsService,
  ) {
  }

  loadPeopleAndConversations$ = createEffect(() => this.actions$
    .pipe(
      ofType(getPeopleAndConversations),
      tap(() => {
        this.store.dispatch(resetErrorAction())
        this.store.dispatch(setMainLoadingState({ isLoading: true }))
      }),
      mergeMap((action) => {
        return this.service.getPeople().pipe(
          map((res: IPeople) => res.Items.map(p => ({ name: p.name.S, uid: p.uid.S }))),
          mergeMap((users: IUser[]) => {
            return this.service.getActiveConversations().pipe(
              map((res: IUserConversations) => res.Items.map(p => ({ id: p.id.S, companionID: p.companionID.S }))),
              map((res: ISingleUserConversation[]) => {
                this.store.dispatch(setSuccessAction({ kind: titleKinds.PEOPLE }))
                return getPeopleAndConversationsSuccess({ users, conversations: res })
              }),
              catchError((err) => {
                return of(errorHandleAction({ error: err.error }));
              })
            )
          }),

        )
      }))
  )

  loadGetPrivateMessages$ = createEffect(() => this.actions$
    .pipe(
      ofType(getPrivateMessages),
      concatMap(action => of(action).pipe(
        tap(() => {
          this.store.dispatch(setMainLoadingState({ isLoading: true }))
        }),
        withLatestFrom(this.store.select(selectMessagesByConversationId(action.conversationID)))
      )),
      concatMap(([action, storedMessages]) => {
        let lastMessageDate: number | undefined;
        if (storedMessages && storedMessages.length) {
          const sortedMessages = [...storedMessages].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
          lastMessageDate = Number(sortedMessages[sortedMessages.length - 1]?.createdAt) + 1;
        }
        console.log("ID sent to get messages from", action.conversationID)
        return this.service.getPrivateMessages(action.conversationID, lastMessageDate).pipe(
          map(res => res.Items.map(m => ({
            authorID: m.authorID.S,
            message: m.message.S,
            createdAt: m.createdAt.S
          }))),
          map(res => {
            this.store.dispatch(setSuccessAction({ kind: titleKinds.PRIVATE_CONVERSATION }))
            return getPrivateMessagesSuccess({ conversationID: action.conversationID, dialog: res })
          }),
          catchError((err) => {
            return of(errorHandleAction({ error: err.error, kind: titleKinds.PRIVATE_CONVERSATION })); EMPTY
          })
        )
      })
    )
  )

  loadCreateConversation$ = createEffect(() => this.actions$
    .pipe(
      ofType(createConversation),
      switchMap((action) => this.service.createConversations(action.companion).pipe(
        tap((res) => console.log("ID returns from create request", res.conversationID)),
        map(({ conversationID }) => {
          this.store.dispatch(setSuccessAction({ kind: null }))
          return createConversationSuccess({ conversation: { id: conversationID, companionID: action.companion } })
        }),
        catchError((err) => {
          console.log("catching error in effect");
          return of(errorHandleAction({ error: err.error }));
        })
      ))
    ))

  loadDeleteConversation$ = createEffect(() => this.actions$
    .pipe(
      ofType(deleteConversation),
      tap(() => { this.store.dispatch(setMainLoadingState({ isLoading: true })) }),
      switchMap((action) => this.service.deleteConversations(action.conversationID).pipe(
        map(() => {
          this.store.dispatch(setSuccessAction({ kind: null }))
          return deleteConversationSuccess({ conversationID: action.conversationID })
        }),
        catchError((err) => {
          //this.errorHandlingService.handleError(err);
          return of(errorHandleAction({ error: err.error }));
        })
      ))
    ))

  loadSendPrivateMessage$ = createEffect(() => this.actions$
    .pipe(
      ofType(sendPrivateMessage),
      tap(() => { this.store.dispatch(setMainLoadingState({ isLoading: true })) }),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, myData]) => this.service.sendPrivateMessage(action.conversationID, action.message).pipe(
        map(() => {
          this.store.dispatch(setSuccessAction({ kind: null }))
          const newMessage: ISingleMessage = { authorID: myData.id, message: action.message, createdAt: Date.now() + "" }
          return sendPrivateMessageSuccess({ conversationID: action.conversationID, message: newMessage })
        }),
        catchError((err) => {
          //this.errorHandlingService.handleError(err);
          return of(errorHandleAction({ error: err.error }));
        })
      ))
    ))


}
