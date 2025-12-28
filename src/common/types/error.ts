export interface ErrorResponse {
  code: string;
  message: string;
}

export type CustomErrorResponse<T> = ErrorResponse & T;
