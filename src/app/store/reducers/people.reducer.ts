import { createConversationSuccess, deleteConversationSuccess, getActiveConversationsSuccess, getPeople, getPeopleAndConversationsSuccess, getPeopleSuccess, getPrivateMessagesSuccess, resetPeopleSlice, sendPrivateMessageSuccess } from '../actions/people.action';
import { IPeopleState } from '../models/store.model';
import { createReducer, on } from '@ngrx/store';

export const peopleInitState: IPeopleState = {
  users: [],
  conversations: [],
  messages: []
}


export const peopleReducer = createReducer(
  peopleInitState,
  on(getPeopleSuccess, (state, { users }) => ({
    ...state,
    users
  })),
  on(getActiveConversationsSuccess, (state, { conversations }) => ({
    ...state,
    conversations
  })),
  on(getPeopleAndConversationsSuccess, (state, { users, conversations }) => ({
    ...state,
    users,
    conversations
  })),
  on(getPrivateMessagesSuccess, (state, { conversationID, dialog }) => {
    const existent = state.messages.find(d => d.conversationID === conversationID);
    if (existent) {
      return ({
        ...state, messages: [...state.messages
          .filter(d => d.conversationID !== conversationID), { conversationID, dialog: [...existent.dialog, ...dialog] }]
      })
    }
    else return ({ ...state, messages: [...state.messages, { conversationID, dialog }] })
  }),
  on(createConversationSuccess, (state, { conversation }) => ({
    ...state,
    conversations: [...state.conversations, conversation],
    messages: [...state.messages, {
      conversationID: conversation.id,
      dialog: []
    }]
  })),
  on(deleteConversationSuccess, (state, { conversationID }) => ({
    ...state,
    conversations: state.conversations.filter(c => c.id !== conversationID),
    messages: state.messages.filter(m => m.conversationID !== conversationID)
  })),
  on(sendPrivateMessageSuccess, (state, { conversationID, message }) => {
    const existent = state.messages.find(m => m.conversationID === conversationID);
    if (existent) {
      return {
        ...state,
        messages: [...state.messages.
          filter(m => m.conversationID !== conversationID), { conversationID, dialog: [...existent.dialog, message] }]
      }
    }
    else return {
      ...state,
      messages: [...state.messages, { conversationID, dialog: [message] }]
    }
  }),
  on(resetPeopleSlice, (state) => peopleInitState)

)
