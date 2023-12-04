import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, mergeMap, map, catchError, EMPTY, switchMap, of, concatMap } from 'rxjs';

import { getAllGroups, getAllGroupsSuccess, getGroupMessages, getGroupMessagesSuccess } from '../actions/group.action';
import { ConversationsService } from 'app/services/conversations.service';
import { IGroups, ISingleGroup } from 'app/models/conversations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { selectAllGroupMessages, selectGroupMessages } from '../selectors/group.selectors';

@Injectable()
export class GroupsEffects {

  constructor(private actions$: Actions,
    private store: Store,
    private service: ConversationsService) {
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
              this.handleError(err)
              return EMPTY
            })
          )
      })
    ));

  loadGroupMessages = createEffect(() => this.actions$
    .pipe(
      ofType(getGroupMessages),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.select(selectGroupMessages(action.groupId))),
      )),
      mergeMap(([action, storedMessages]) => {
        const mes = storedMessages || []
        const lastMessageDate = mes[mes.length - 1]?.createdAt
        return this.service.getMessages(action.groupId, Number(lastMessageDate)).pipe(
          map(res => res.Items.map(x => ({
            authorID: x.authorID.S,
            message: x.message.S,
            createdAt: x.createdAt.S
          }))),
          map(messages => getGroupMessagesSuccess({ groupId: action.groupId, messages })),
          catchError((err) => {
            this.handleError(err);
            return EMPTY
          })
        )
      })
    )

  )



  private handleError(error: HttpErrorResponse) {
    console.log('error :>> ', error.error);
    return of({ type: error.error.type, message: error.error.message })
    //throwError(() => new Error(error.message))

  }
}

