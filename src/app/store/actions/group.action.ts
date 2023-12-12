import { createAction, props } from '@ngrx/store';
import { ISingleGroup, ISingleMessage } from 'app/models/conversations.model';


export const addNewGroup = createAction("[group] Add Group",
  props<{ groupName: string }>())
export const addNewGroupSuccess = createAction("[group] Add Group Success",
  props<{ group: ISingleGroup }>());


export const getAllGroups = createAction("[group] Get All Groups");
export const getAllGroupsSuccess = createAction("[group] Get All Groups Success",
  props<{ groups: ISingleGroup[] }>());


export const deleteGroup = createAction("[group] Delete Group",
  props<{ groupId: string }>())
export const deleteGroupSuccess = createAction("[group] Delete Group Success",
  props<{ groupId: string }>());


export const getGroupMessages = createAction("[group] Get Group Messages",
  props<{ groupId: string }>());
export const getGroupMessagesSuccess = createAction("[group] Get Group Messages Success",
  props<{ groupId: string, messages: ISingleMessage[] }>());


export const sendGroupMessage = createAction("[group] Send Group Messages",
  props<{ groupId: string, message: string }>());
export const sendGroupMessagesSuccess = createAction("[group] Send Group Messages Success",
  props<{ groupId: string, message: ISingleMessage }>());


export const resetGroupSlice = createAction("[group] Reset Group Slice");


export const setGroupSuccess = createAction("[group] Set Group Success", props<{ successType: 'main' | 'private' }>());
export const resetGroupError = createAction("[group] Reset Group Error", props<{ successType: 'main' | 'private' }>());
export const setGroupError = createAction("[group] Set Group Error", props<{ successType: 'main' | 'private', errtype: string, message: string }>());

export const setGroupCounter = createAction("[group] Set Group Counter", props<{ counterType: 'main' | 'private', time: number }>());


export const setGroupLoading = createAction("[group] Set Group Loading State", props<{ isLoading: boolean }>())
