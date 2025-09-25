import { HttpException, HttpStatus } from '@nestjs/common'
import { ResponseMessage } from '../constants/response-message.constant'
import { ApiResponse } from '../dto/api-response.dto'

export class ResponseUtils {
  static success<T>(data: T, message = ResponseMessage.SUCCESS): ApiResponse<T> {
    return new ApiResponse(HttpStatus.OK, message, data)
  }

  static error(message = ResponseMessage.INTERNAL_ERROR): ApiResponse<null> {
    return new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, message, null)
  }

  static badRequest(message = ResponseMessage.BAD_REQUEST): HttpException {
    return new HttpException(
      new ApiResponse(HttpStatus.BAD_REQUEST, message, null),
      HttpStatus.BAD_REQUEST,
    )
  }

  static unauthorized(message = ResponseMessage.UNAUTHORIZED): HttpException {
    return new HttpException(
      new ApiResponse(HttpStatus.UNAUTHORIZED, message, null),
      HttpStatus.UNAUTHORIZED,
    )
  }

  static notFound(message = ResponseMessage.NOT_FOUND): HttpException {
    return new HttpException(
      new ApiResponse(HttpStatus.NOT_FOUND, message, null),
      HttpStatus.NOT_FOUND,
    )
  }

  static forbideden(message = ResponseMessage.FORBIDDEN): HttpException {
    return new HttpException(
      new ApiResponse(HttpStatus.FORBIDDEN, message, null),
      HttpStatus.FORBIDDEN,
    )
  }

  static internalError(message = ResponseMessage.INTERNAL_ERROR): HttpException {
    return new HttpException(
      new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, message, null),
      HttpStatus.INTERNAL_SERVER_ERROR,
    )
  }
}
