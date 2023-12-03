export interface IProfileResponse {
  email: {
    S: string
  },
  name: {
    S: string
  },
  uid: {
    S: string
  },
  createdAt: {
    S: string // unix timestamp in milliseconds
  }
}
export interface ILoginResponse {
  token: string, uid: string
}
