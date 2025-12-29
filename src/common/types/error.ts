export interface ErrorResponse<C> {
  code: C | string;
  message: string;
}

/**
 * @example
 * type SomeErrorCode = "SOME_ERROR_CODE"|"SOME_ERROR_CODE_2";
 * type SomeError = {
 *  field1: string
 * }
 * type SomeErrorResponse = CustomErrorResponse<SomeErrorCode, SomeError>;
 */

export type CustomErrorResponse<C, T> = ErrorResponse<C> & T;
