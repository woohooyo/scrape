import Boom = require('boom');
import { IRouterContext } from 'koa-router';

const sendError = (ctx: IRouterContext, statusCode: number, errorMessage: string) => {
  ctx.status = statusCode;
  ctx.body = errorMessage;
  return ctx;
};

/*
  Please use ctx.throw(statusCode, detailedErrorInfoObject); to throw error,
  it will store statusCode and corresponding error text in the error object.
  For example : ctx.throw(401, 'detailed info');
  err = { statusCode: 401, message: 'detailed info'}
  The interceptor is also compatible for boom error.
*/
export const errorHandlerInterceptor = async (ctx: IRouterContext, next: any) => {
  try {
    await next();
  } catch (err) {
    if (Boom.isBoom(err)) {
      const castedError = err as Boom;
      sendError(ctx, castedError.output.statusCode, err.message);
    } else {
      sendError(ctx, err.statusCode || 500, err.message);
    }
  }
};
