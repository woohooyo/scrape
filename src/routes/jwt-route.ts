import * as Router from 'koa-router';

export const jwtRoute = new Router();

const test = (ctx: Router.IRouterContext) => {
  ctx.body = { message: 'Checklist API Health: Application is running' };
};

jwtRoute.post('/', () => test);
