import { createReducer, on } from '@ngrx/store';

import { addNewGroupSuccess, deleteGroupSuccess, getAllGroups, getAllGroupsSuccess, getGroupMessagesSuccess, sendGroupMessages, sendGroupMessagesSuccess } from '../actions/group.action';
import { ISingleGroup } from 'app/models/conversations.model';
import { IGroupsMessagesState } from '../models/store.model';
/* import { GroupsActions } from './groups.actions'; */

export const groupsFeatureKey = 'groups';



export const initialState: ISingleGroup[] = [
  {
    id: "11111",
    name: "New group",
    createdAt: "1701534041400",
    createdBy: "vxgdbfu"
  }
]
export const messagesInitialState: IGroupsMessagesState[] = [
  {
    groupId: "11111",
    messages: [
      {
        authorID: "290jaobb6b8",
        message: "hello there",
        createdAt: "1701534041600"
      },
      {
        authorID: "tsfsrdk",
        message: "Nice to meet you",
        createdAt: "1701534041690"
      },
    ]
  }
]

export const groupsReducer = createReducer(
  initialState,
  on(getAllGroupsSuccess, (state, { groups }) => {
    //add logic to check if there some deleted group, that I still have messages history in the store
    return groups;
  }),
  on(addNewGroupSuccess, (state, { group }) => ([
    ...state,
    group
  ])),
  on(deleteGroupSuccess, (state, { groupId }) => {
    return [
      ...state.filter(d => d.id !== groupId)
    ]
  })
);

export const groupMessagesReducer = createReducer(
  messagesInitialState,
  on(getGroupMessagesSuccess, (state, { groupId, messages }) => {
    const group = state.find(d => d.groupId === groupId)
    if (group) {
      return [...state.filter(s => s.groupId !== groupId), { groupId, messages: [...group.messages, ...messages] }]
    }
    else return [...state, { groupId, messages }]
  }),
  on(sendGroupMessagesSuccess, (state, { groupId, message }) => {
    const group = state.find(d => d.groupId === groupId);
    console.log('inside reducer send message, group :>> ', group);
    if (group) {
      return [...state.filter(s => s.groupId !== groupId), { groupId, messages: [...group.messages, message] }]
    }
    else return [...state, { groupId, messages: [message] }]
  })

)

