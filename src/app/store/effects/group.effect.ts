import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, mergeMap, map, catchError, EMPTY, switchMap, of, concatMap, tap, throwError } from 'rxjs';

import { addNewGroup, addNewGroupSuccess, deleteGroup, deleteGroupSuccess, getAllGroups, getAllGroupsSuccess, getGroupMessages, getGroupMessagesSuccess, sendGroupMessage, sendGroupMessagesSuccess } from '../actions/group.action';
import { ConversationsService } from 'app/services/conversations.service';
import { IGroupResponce, IGroups, ISingleGroup } from 'app/models/conversations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { selectAllGroupMessages, selectGroupMessages, selectGroups } from '../selectors/group.selectors';
import { selectMyID, selectProfileData } from '../selectors/profile.selectors';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';
import { ErrorHandlingService } from 'app/services/error-handling.service';


@Injectable()
export class GroupsEffects {

  constructor(private actions$: Actions,
    private store: Store,
    private service: ConversationsService,
    private errorHandlingService: ErrorHandlingService) {
  }

  loadGroups$ = createEffect(() => this.actions$
    .pipe(
      ofType(getAllGroups),
      switchMap((action) => {
        return this.service.getGroups()
          .pipe(
            map((res: IGroups) => {
              return res.Items.map((x) => ({ id: x.id.S, name: x.name.S, createdAt: x.createdAt.S, createdBy: x.createdBy.S }))
            }),
            map((res: ISingleGroup[]) =>
              getAllGroupsSuccess({ groups: res })
            ),
            catchError((err) => {
              this.errorHandlingService.handleError(err)
              return EMPTY
            })
          )
      })
    ));

  loadNewGroup$ = createEffect(() => this.actions$
    .pipe(
      ofType(addNewGroup),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, myData]) => {
        return this.service.addNewGroup(action.groupName)
          .pipe(
            map((res: IGroupResponce) => {
              if (myData.id) {
                return ({
                  id: res.groupID,
                  name: action.groupName,
                  createdAt: Date.now() + "",
                  createdBy: myData.id
                })
              } else return undefined;

            }),
            map((res: ISingleGroup | undefined) => {
              if (res) {
                return addNewGroupSuccess({ group: res })
              }
              else throw new HttpErrorResponse({ error: { type: "NoUserIDFund", message: "You have to login" } })
            }
            ),
            catchError((err) => {
              this.errorHandlingService.handleError(err)
              return EMPTY
            })
          )
      })
    ))

  loadDeleteGroup$ = createEffect(() => this.actions$
    .pipe(
      ofType(deleteGroup),
      //withLatestFrom(this.store.select(selectAllGroupMessages)),
      switchMap((action) => {
        return this.service.deleteGroup(action.groupId).pipe(
          map(res => {
            return deleteGroupSuccess({ groupId: action.groupId })
          }),
          catchError((err) => {
            this.errorHandlingService.handleError(err);
            return EMPTY
          })
        )
      })
    )
  )

  loadSendGroupMessage$ = createEffect(() => this.actions$
    .pipe(
      ofType(sendGroupMessage),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, mydata]) => {
        return this.service.sendGroupMessage(action.groupId, action.message).pipe(
          map(() => sendGroupMessagesSuccess({
            groupId: action.groupId, message: {
              authorID: mydata.id,
              message: action.message,
              createdAt: Date.now() + ""
            }
          })),
          catchError((err) => {
            this.errorHandlingService.handleError(err);
            return EMPTY;
          })
        )
      })

    ))


  loadGroupMessages$ = createEffect(() => this.actions$
    .pipe(
      ofType(getGroupMessages),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.select(selectGroupMessages(action.groupId))),
      )),
      mergeMap(([action, storedMessages]) => {
        let lastMessageDate: string | undefined;
        if (storedMessages) {
          const sortedMessages = [...storedMessages].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
          lastMessageDate = sortedMessages[sortedMessages.length - 1]?.createdAt;
        }

        return this.service.getMessages(action.groupId, Number(lastMessageDate) + 1).pipe(
          map(res => res.Items.map(x => ({
            authorID: x.authorID.S,
            message: x.message.S,
            createdAt: x.createdAt.S
          }))),
          map(messages => getGroupMessagesSuccess({ groupId: action.groupId, messages })),
          catchError((err) => {
            this.errorHandlingService.handleError(err);
            return EMPTY
          })
        )
      })
    )
  )



}

