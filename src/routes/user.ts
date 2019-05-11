import * as Router from 'koa-router';
import { UserController } from '../controllers/user-controller';

export const userRoute = new Router();

const validatorInterceptor = () => {
  return async (ctx: Router.IRouterContext, next: any) => {
    if (ctx.query.operateUserKey !== process.env.OPERATE_USER_KEY) {
      ctx.throw(400, 'Please send correct operateUserKey!');
    }
    await next();
  };
};

userRoute.post('/', validatorInterceptor(), UserController.post);
userRoute.put('/', validatorInterceptor(), UserController.put);
