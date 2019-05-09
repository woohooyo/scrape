import * as Router from 'koa-router';

import { healthRoute } from './health';
import { jwtRoute } from './jwt-route';

export const router = new Router();

router.use('/api/health', healthRoute.routes());
router.use('/api/token', jwtRoute.routes());
