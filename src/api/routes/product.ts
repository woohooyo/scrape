import * as Joi from 'joi';
import * as Router from 'koa-router';
import { ProductController } from '../controllers/product-controller';
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
  isSellerCoupon?: string;
}

const productSchema: IJoiValidatorSchema = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    productName: Joi.string(),
    minDiscountPrice: Joi.number(),
    maxDiscountPrice: Joi.number(),
    minCouponPrice: Joi.number(),
    maxCouponPrice: Joi.number(),
    minReceivedCouponAmount: Joi.number(),
    maxReceivedCouponAmount: Joi.number(),
    isTaoKeYi: Joi.bool(),
    isSellerCoupon: Joi.bool(),
  }).required(),
};

productRoute.get('/', validatorInterceptor(productSchema), ProductController.get);
productRoute.get('/export', validatorInterceptor(productSchema), ProductController.download);

productRoute.post('/', ProductController.post);
