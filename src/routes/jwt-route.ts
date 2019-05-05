import * as Joi from 'joi';
import * as Router from 'koa-router';
import * as _ from 'lodash';
import { AuthController } from '../controllers/jwt-controller';
import { IJoiValidatorSchema, validatorInterceptor } from '../interceptors/validator';

export const jwtRoute = new Router();

const userSchema: IJoiValidatorSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
};

jwtRoute.post('/', validatorInterceptor(userSchema), AuthController.post);
