import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ConversationsService } from 'app/services/conversations.service';
import {
  createConversation, createConversationSuccess,
  deleteConversation, deleteConversationSuccess, getPeopleAndConversations,
  getPeopleAndConversationsSuccess, getPrivateMessages, getPrivateMessagesSuccess,
  sendPrivateMessage, sendPrivateMessageSuccess, setPeopleError, setPeopleLoading, setPeopleSuccess
} from '../actions/people.action';
import { map, switchMap, catchError, of, EMPTY, mergeMap, concatMap, withLatestFrom, tap } from 'rxjs';
import { IPeople, ISingleMessage, ISingleUserConversation, IUser, IUserConversations } from 'app/models/conversations.model';
import { selectMyID } from '../selectors/profile.selectors';
import { selectMessagesByConversationId, selectSingleConversationByConversationId } from '../selectors/people.selectors';


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
        /*   this.store.dispatch(resetErrorAction()) */
        this.store.dispatch(setPeopleLoading({ isLoading: true }))
      }),
      mergeMap((action) => {
        return this.service.getPeople().pipe(
          map((res: IPeople) => res.Items.map(p => ({ name: p.name.S, uid: p.uid.S }))),
          mergeMap((users: IUser[]) => {
            return this.service.getActiveConversations().pipe(
              map((res: IUserConversations) => res.Items.map(p => ({ id: p.id.S, companionID: p.companionID.S }))),
              concatMap((res: ISingleUserConversation[]) => ([
                getPeopleAndConversationsSuccess({ users, conversations: res }),
                setPeopleSuccess({ successType: "main", comm: "update" }),
                setPeopleLoading({ isLoading: false })
              ])),
              catchError((err) => {
                return of(setPeopleError({
                  successType: "main",
                  errtype: err.error.type || err.type || "Unknown",
                  message: err.error.message || err.message || "Something went wrong"
                }));
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
          this.store.dispatch(setPeopleLoading({ isLoading: true }))
        }),
        withLatestFrom(this.store.select(selectSingleConversationByConversationId(action.conversationID)))
      )),
      concatMap(([action, conversation]) => {
        let lastMessageDate: string | undefined;
        let lastMessageDateNum: number | undefined;
        let sinceParam: string | undefined;
        if (conversation) {
          if (conversation.messages && conversation.messages.length) {
            const sortedMessages = [...conversation.messages].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
            lastMessageDate = sortedMessages[sortedMessages.length - 1]?.createdAt;
          }
          else {
            if (conversation.since) {
              lastMessageDate = conversation.since;
            }
          }
        }
        sinceParam = Date.now() + ""
        if (lastMessageDate) lastMessageDateNum = Number(lastMessageDate) + 1;
        return this.service.getPrivateMessages(action.conversationID, lastMessageDateNum).pipe(
          map(res => res.Items.map(m => ({
            authorID: m.authorID.S,
            message: m.message.S,
            createdAt: m.createdAt.S
          }))),
          concatMap(res => ([
            getPrivateMessagesSuccess({ conversationID: action.conversationID, messages: res, since: sinceParam }),
            setPeopleSuccess({ successType: "private", comm: "update" }),
            setPeopleLoading({ isLoading: false })
          ])),
          catchError((err) => {
            return of(setPeopleError({
              successType: "private",
              errtype: err.error.type || err.type || "Unknown",
              message: err.error.message || err.message || "Something went wrong"
            }));
          })
        )
      })
    )
  )

  loadCreateConversation$ = createEffect(() => this.actions$
    .pipe(
      ofType(createConversation),
      tap(() => { this.store.dispatch(setPeopleLoading({ isLoading: true })) }),
      switchMap((action) => this.service.createConversations(action.companion).pipe(
        concatMap(({ conversationID }) => ([
          createConversationSuccess({ conversation: { id: conversationID, companionID: action.companion } }),
          setPeopleSuccess({ successType: "main", comm: "create" }),
          setPeopleLoading({ isLoading: false })
        ])),
        catchError((err) => {
          return of(setPeopleError({
            successType: "main",
            errtype: err.error.type || err.type || "Unknown",
            message: err.error.message || err.message || "Something went wrong"
          }));
        })
      ))
    ))

  loadDeleteConversation$ = createEffect(() => this.actions$
    .pipe(
      ofType(deleteConversation),
      tap(() => { this.store.dispatch(setPeopleLoading({ isLoading: true })) }),
      switchMap((action) => this.service.deleteConversations(action.conversationID).pipe(
        concatMap(() => ([
          deleteConversationSuccess({ conversationID: action.conversationID }),
          setPeopleSuccess({ successType: "private", comm: "delete" }),
          setPeopleLoading({ isLoading: false })
        ])),
        catchError((err) => {
          return of(setPeopleError({
            successType: "main",
            errtype: err.error.type || err.type || "Unknown",
            message: err.error.message || err.message || "Something went wrong"
          }));
        })
      ))
    ))

  loadSendPrivateMessage$ = createEffect(() => this.actions$
    .pipe(
      ofType(sendPrivateMessage),
      tap(() => { this.store.dispatch(setPeopleLoading({ isLoading: true })) }),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, myData]) => this.service.sendPrivateMessage(action.conversationID, action.message).pipe(
        concatMap(() => {
          const newMessage: ISingleMessage = { authorID: myData.id, message: action.message, createdAt: Date.now() + "" }
          return [sendPrivateMessageSuccess({ conversationID: action.conversationID, message: newMessage }),
          setPeopleSuccess({ successType: "private", comm: "send" }),
          setPeopleLoading({ isLoading: false })
          ]
        }),
        catchError((err) => {
          return of(setPeopleError({
            successType: "private",
            errtype: err.error.type || err.type || "Unknown",
            message: err.error.message || err.message || "Something went wrong"
          }));
        })
      ))
    ))


}
