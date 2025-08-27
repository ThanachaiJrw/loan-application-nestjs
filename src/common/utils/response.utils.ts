import { HttpStatus } from '@nestjs/common'
import { ResponseMessage } from '../constants/response-message.constant'
import { ApiResponse } from '../dto/api-response.dto'

export class ResponseUtils {
  static success<T>(data: T, message = ResponseMessage.SUCCESS): ApiResponse<T> {
    return new ApiResponse(HttpStatus.OK, message, data)
  }

  static notFound(message = ResponseMessage.NOT_FOUND): ApiResponse<null> {
    return new ApiResponse(HttpStatus.NOT_FOUND, message, null)
  }

  static error(message = ResponseMessage.INTERNAL_ERROR): ApiResponse<null> {
    return new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, message, null)
  }
}
