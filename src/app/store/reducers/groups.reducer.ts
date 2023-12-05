import { createReducer, on } from '@ngrx/store';

import { addNewGroupSuccess, deleteGroupSuccess, getAllGroups, getAllGroupsSuccess, getGroupMessagesSuccess } from '../actions/group.action';
import { ISingleGroup } from 'app/models/conversations.model';
import { IGroupsMessagesState } from '../models/store.model';
/* import { GroupsActions } from './groups.actions'; */

export const groupsFeatureKey = 'groups';



export const initialState: ISingleGroup[] = [
  {
    id: "11111",
    name: "New group",
    createdAt: "847365200",
    createdBy: "vxgdbfu"
  }
]
export const messagesInitialState: IGroupsMessagesState[] = []

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
      //group.messages = [...group.messages, ...messages]
      return [...state, { ...group, messages: [...group.messages, ...messages] }]
    }
    else return [...state, { groupId, messages }]
  })

)

