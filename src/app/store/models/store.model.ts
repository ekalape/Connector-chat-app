import { IHttpError } from 'app/models/auth.model'


export interface IAutorizationSlice {
  id: string,
  name: string,
  email: string,
  createdAt: string,
  loggedIn: boolean,
  token: string,
  loading: boolean,
  error: IHttpError | null
}

export interface IState {
  authorization: IAutorizationSlice
}
