// import * as Joi from 'joi';
import * as Router from 'koa-router';
import { ProductController } from '../controllers/product-controller';
// import { IJoiValidatorSchema, validatorInterceptor } from '../interceptors/validator';

export const productRoute = new Router();

// const productSchema: IJoiValidatorSchema = {
//   query: Joi.object().keys({
//     name: Joi.string(),
//   }),
// };

// productRoute.get('/', validatorInterceptor(productSchema), ProductController.post);
productRoute.get('/', ProductController.get);
