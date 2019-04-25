import * as Router from 'koa-router';

import { healthRoute } from './health';

export const router = new Router();

router.use('/health', healthRoute.routes());
