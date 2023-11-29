

export interface IAutorizationSlice {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  loggedIn: boolean,
  token: string

}

export interface IState {
  authorization: IAutorizationSlice
}
