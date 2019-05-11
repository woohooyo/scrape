import * as Router from 'koa-router';

import { healthRoute } from './health';
import { jwtRoute } from './jwt-route';
import { productRoute } from './product';
import { userRoute } from './user';

export const router = new Router();

router.use('/api/health', healthRoute.routes());
router.use('/api/token', jwtRoute.routes());
router.use('/api/user', userRoute.routes());
router.use('/api/product', productRoute.routes());
