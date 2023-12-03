export interface IGroups {
  Count: number,
  Items: [
    {
      id: {
        S: string
      },
      name: {
        S: string
      },
      createdAt: {
        S: string // unix timestamp
      },
      createdBy: {
        S: string
      }
    }
  ]
}

export interface ISingleGroup {
  id: string,
  name: string,
  createdAt: string,
  createdBy: string;
}

export interface IGroupResponce {
  groupID: string
}


export interface IMessages {
  Count: number,
  Items: [
    {
      authorID: {
        S: string
      },
      message: {
        S: string
      },
      createdAt: {
        S: string // unix timestamp
      }
    }
  ]
}

export interface ISingleMessage {
  authorID: string,
  message: string,
  createdAt: string
}


export interface IPeople {
  Count: number,
  Items: [
    {
      name: {
        S: string
      },
      uid: {
        S: string
      }
    }
  ]
}

export interface IUser {
  name: string,
  uid: string
}

export interface IUserConversations {
  Count: number,
  Items: [
    {
      id: {
        S: string
      },
      companionID: {
        S: string
      }
    }
  ]
}

export interface ISingleUserConversation {
  id: string,
  companionID: string
}

export interface IUserConversationsResponse {
  conversationID: string
}
