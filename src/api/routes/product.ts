import * as Joi from 'joi';
import * as Router from 'koa-router';
import { ProductController } from '../controllers/product-controller';
import { verifyAuth } from '../interceptors/jwt-auth';
import { IJoiValidatorSchema, validatorInterceptor } from '../interceptors/validator';

export const productRoute = new Router();

export interface IProductQuery {
  limit?: string;
  page?: string;
  productName?: string;
  minDiscountPrice?: string;
  maxDiscountPrice?: string;
  minCouponPrice?: string;
  maxCouponPrice?: string;
  minReceivedCouponAmount?: string;
  maxReceivedCouponAmount?: string;
  isTaoKeYi?: string;
  isTmall?: string;
  isSellerCoupon?: string;
}

const productSchema: IJoiValidatorSchema = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    token: Joi.string(),
    productName: Joi.string(),
    minDiscountPrice: Joi.number(),
    maxDiscountPrice: Joi.number(),
    minCouponPrice: Joi.number(),
    maxCouponPrice: Joi.number(),
    minReceivedCouponAmount: Joi.number(),
    maxReceivedCouponAmount: Joi.number(),
    isTaoKeYi: Joi.bool(),
    isTmall: Joi.bool(),
    isSellerCoupon: Joi.bool(),
  }).required(),
};

const jwtAuthQuery = async (ctx: Router.IRouterContext, next: any) => {
  const token: string = ctx.request.query.token;
  await verifyAuth(token);
  await next();
  return;
};

productRoute.get('/', validatorInterceptor(productSchema), ProductController.get);
productRoute.get('/export', jwtAuthQuery, validatorInterceptor(productSchema), ProductController.download);

productRoute.post('/', ProductController.post);
