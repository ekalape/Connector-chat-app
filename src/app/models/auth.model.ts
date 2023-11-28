export interface IAuthResponse {
  statusCode: number,
  errors: IHttpError | null
}

export interface IHttpError {
  type: string,
  message: string
}

export interface IAuthServiceResponse {
  success: boolean,
  message?: string
}
