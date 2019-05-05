import * as Joi from 'joi';
import * as _ from 'lodash';

import * as Router from 'koa-router';

export interface IJoiValidatorSchema {
  header?: Joi.AnySchema;
  body?: Joi.AnySchema;
  query?: Joi.AnySchema;
  params?: Joi.AnySchema;
}

export const validatorInterceptor = (schemas: IJoiValidatorSchema, options?: Joi.ValidationOptions) => {
  return async (ctx: Router.IRouterContext, next: any) => {
    try {
      for (const key of _.keys(schemas)) {
        await Joi.validate(_.get(ctx.request, key), _.get(schemas, key), options || {});
      }
    } catch (err) {
      ctx.throw(400, `validation failed on: ${err.message}`);
    }
    await next();
  };
};
