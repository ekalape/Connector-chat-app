

export interface IAutorizationSlice {
  loggedIn: boolean,
  token: string

}

export interface IState {
  authorization: IAutorizationSlice
}
