import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

@Catch()
export class HttpErrorFilter implements ExceptionFilter, GqlExceptionFilter {
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
  ) {
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message =
      `[${exception.code}]: ` + this.exceptionShortMessage(exception.message);

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return exception;
    }

    return new HttpException({ statusCode, message }, statusCode);
  }

  private catchNotFoundError({ message }: Prisma.NotFoundError) {
    const statusCode = HttpStatus.NOT_FOUND;

    return new HttpException({ statusCode, message }, statusCode);
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request?.method} ${request?.url}`,
        JSON.stringify(exception),
        'ExceptionFilter',
      );
    }

    let newException: HttpException | Prisma.PrismaClientKnownRequestError =
      exception;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      newException = this.catchClientKnownRequestError(exception);
    }
    if (exception instanceof Prisma.NotFoundError) {
      newException = this.catchNotFoundError(exception);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toLocaleDateString(),
      error:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? newException.message || null
          : 'Internal server error',
    };

    // This is for REST petitions
    if (request) {
      const error = {
        ...errorResponse,
        path: request?.url,
        method: request?.method,
      };

      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(error),
        'ExceptionFilter',
      );

      response.status(status).json(errorResponse);
      return newException;
    } else {
      // This is for GRAPHQL petitions
      const error = {
        ...errorResponse,
        type: info.parentType,
        field: info.fieldName,
      };

      Logger.error(
        `${info.parentType} ${info.fieldName}`,
        JSON.stringify(error),
        'ExceptionFilter',
      );

      return newException;
    }
  }
}
