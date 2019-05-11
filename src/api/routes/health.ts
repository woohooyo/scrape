import * as Router from 'koa-router';

export const healthRoute = new Router();

const defaultHealthCheck = (ctx: Router.IRouterContext) => {
  ctx.body = { message: 'Checklist API Health: Application is running' };
};

healthRoute.get('/', defaultHealthCheck);
