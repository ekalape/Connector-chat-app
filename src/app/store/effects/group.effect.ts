import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, mergeMap, map, catchError, switchMap, of, concatMap, tap } from 'rxjs';
import { addNewGroup, addNewGroupSuccess, deleteGroup, deleteGroupSuccess, getAllGroups, getAllGroupsSuccess, getGroupMessages, getGroupMessagesSuccess, resetGroupError, sendGroupMessage, sendGroupMessagesSuccess, setGroupError, setGroupLoading, setGroupSuccess } from '../actions/group.action';
import { ConversationsService } from 'app/services/conversations.service';
import { IGroupResponce, IGroups, ISingleGroup } from 'app/models/conversations.model';
import { selectMyID } from '../selectors/profile.selectors';
import { selectSingleGroupDialog } from '../selectors/group.selectors';


@Injectable()
export class GroupsEffects {

  constructor(private actions$: Actions,
    private store: Store,
    private service: ConversationsService,
  ) {
  }

  loadGroups$ = createEffect(() => this.actions$
    .pipe(
      ofType(getAllGroups),
      tap(() => {
        this.store.dispatch(setGroupLoading({ isLoading: true }));
      }),
      switchMap((action) => {
        return this.service.getGroups()
          .pipe(
            map((res: IGroups) => {
              return res.Items.map((x) => ({ id: x.id.S, name: x.name.S, createdAt: x.createdAt.S, createdBy: x.createdBy.S }))
            }),
            concatMap((res: ISingleGroup[]) => {
              return [getAllGroupsSuccess({ groups: res }),
              setGroupSuccess({ successType: "main", comm: "update" }),
              setGroupLoading({ isLoading: false })]
            }),

            catchError((err) => {
              return of(setGroupError({
                successType: "main",
                errtype: err.error.type || err.type || "Unknown",
                message: err.error.message || err.message || "Something went wrong"
              }));
            })
          )
      })
    ));

  loadNewGroup$ = createEffect(() => this.actions$
    .pipe(
      ofType(addNewGroup),
      tap(() => { this.store.dispatch(setGroupLoading({ isLoading: true })) }),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, myData]) => {
        return this.service.addNewGroup(action.groupName)
          .pipe(
            map((res: IGroupResponce) => {
              return ({
                id: res.groupID,
                name: action.groupName,
                createdAt: Date.now() + "",
                createdBy: myData.id
              })
            }),
            concatMap((res: ISingleGroup) => ([
              addNewGroupSuccess({ group: res }),
              setGroupSuccess({ successType: "main", comm: "create" }),
              setGroupLoading({ isLoading: false })
            ])),

            catchError((err) => {
              return of(setGroupError({
                successType: "main",
                errtype: err.error.type || err.type || "Unknown",
                message: err.error.message || err.message || "Something went wrong"
              }));
            })
          )
      })
    ))

  loadDeleteGroup$ = createEffect(() => this.actions$
    .pipe(
      ofType(deleteGroup),
      tap(() => { this.store.dispatch(setGroupLoading({ isLoading: true })) }),
      switchMap((action) => {
        return this.service.deleteGroup(action.groupId).pipe(
          concatMap(res => ([
            deleteGroupSuccess({ groupId: action.groupId }),
            setGroupSuccess({ successType: "main", comm: "delete" }),
            setGroupLoading({ isLoading: false })
          ])),
          catchError((err) => {
            return of(setGroupError({
              successType: "main",
              errtype: err.error.type || err.type || "Unknown",
              message: err.error.message || err.message || "Something went wrong"
            }));
          })
        )
      })
    )
  )

  loadSendGroupMessage$ = createEffect(() => this.actions$
    .pipe(
      ofType(sendGroupMessage),
      tap(() => { this.store.dispatch(setGroupLoading({ isLoading: true })) }),
      withLatestFrom(this.store.select(selectMyID)),
      switchMap(([action, mydata]) => {
        return this.service.sendGroupMessage(action.groupId, action.message).pipe(
          concatMap(() => (
            [sendGroupMessagesSuccess({
              groupId: action.groupId, message: {
                authorID: mydata.id,
                message: action.message,
                createdAt: Date.now() + ""
              }
            }),
            setGroupSuccess({ successType: "private", comm: "send" }),
            setGroupLoading({ isLoading: false })
            ]
          )
          ),
          catchError((err) => {
            return of(setGroupError({
              successType: "private",
              errtype: err.error.type || err.type || "Unknown",
              message: err.error.message || err.message || "Something went wrong"
            }));
          })
        )
      })

    ))


  loadGroupMessages$ = createEffect(() => this.actions$
    .pipe(
      ofType(getGroupMessages),
      tap(() => { this.store.dispatch(setGroupLoading({ isLoading: true })) }),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.select(selectSingleGroupDialog(action.groupId, true))),
      )),
      mergeMap(([action, storedMessages]) => {
        let lastMessageDate: string | undefined;
        let lastMessageDateNum: number | undefined;
        let sinceParam: string | undefined;
        if (storedMessages && 'groupId' in storedMessages) {
          if (storedMessages.messages.length) {
            const sortedMessages = [...storedMessages.messages].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
            lastMessageDate = sortedMessages[sortedMessages.length - 1]?.createdAt;
          } else {
            if (storedMessages.since) {
              lastMessageDate = storedMessages.since;
            }
          }
        }
        sinceParam = Date.now() + ""
        if (lastMessageDate) lastMessageDateNum = Number(lastMessageDate) + 1;

        return this.service.getMessages(action.groupId, lastMessageDateNum).pipe(
          map(res => res.Items.map(x => ({
            authorID: x.authorID.S,
            message: x.message.S,
            createdAt: x.createdAt.S
          }))),
          concatMap((messages) => ([
            getGroupMessagesSuccess({ groupId: action.groupId, messages, since: sinceParam }),
            setGroupSuccess({ successType: "private", comm: "update" }),
            setGroupLoading({ isLoading: false })
          ])),
          catchError((err) => {
            return of(setGroupError({
              successType: "private",
              errtype: err.error.type || err.type || "Unknown",
              message: err.error.message || err.message || "Something went wrong"
            }));
          })
        )
      })
    )
  )



}

