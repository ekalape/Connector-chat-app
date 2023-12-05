import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, mergeMap, map, catchError, EMPTY, switchMap, of, concatMap, tap, throwError } from 'rxjs';

import { addNewGroup, addNewGroupSuccess, deleteGroup, deleteGroupSuccess, getAllGroups, getAllGroupsSuccess, getGroupMessages, getGroupMessagesSuccess } from '../actions/group.action';
import { ConversationsService } from 'app/services/conversations.service';
import { IGroupResponce, IGroups, ISingleGroup } from 'app/models/conversations.model';
import { HttpErrorResponse } from '@angular/common/http';
import { selectAllGroupMessages, selectGroupMessages, selectGroups } from '../selectors/group.selectors';
import { selectMyID, selectProfileData } from '../selectors/profile.selectors';
import { StorageKeys } from 'app/utils/enums/local-storage-keys';

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

  loadNewGroup$ = createEffect(() => this.actions$
    .pipe(
      ofType(addNewGroup),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, myData]) => {
        return this.service.addNewGroup(action.groupName)
          .pipe(
            map((res: IGroupResponce) => {
              if (myData.id) {
                console.log("inside effect, map, groupId: ", res.groupID, "groupName: ", action.groupName, "myId: ", myData.id);
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
                console.log("inside map after mergeMap", res);
                return addNewGroupSuccess({ group: res })
              }
              else throw new HttpErrorResponse({ error: { type: "NoUserIDFund", message: "You have to login" } })
            }
            ),
            catchError((err) => {
              this.handleError(err)
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
            console.log('err :>> ', err);
            this.handleError(err);
            return EMPTY
          })
        )
      })
    )
  )


  loadGroupMessages$ = createEffect(() => this.actions$
    .pipe(
      ofType(getGroupMessages),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.select(selectGroupMessages(action.groupId))),
      )),
      mergeMap(([action, storedMessages]) => {
        console.log('storedMessages :>> ', storedMessages);
        console.log('action groupId:>> ', action.groupId);

        let lastMessageDate: string | undefined;
        if (storedMessages) {
          storedMessages.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
          lastMessageDate = storedMessages[storedMessages.length - 1]?.createdAt;
        }

        console.log('lastMessageDate :>> ', lastMessageDate);
        return this.service.getMessages(action.groupId, Number(lastMessageDate)).pipe(
          tap(res => { console.log('inside tap, res--> :>> ', res); }),
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

