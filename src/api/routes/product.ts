import * as Router from 'koa-router';
import { ProductController } from '../controllers/product-controller';

export const productRoute = new Router();

productRoute.get('/', ProductController.get);

productRoute.post('/', ProductController.post);
