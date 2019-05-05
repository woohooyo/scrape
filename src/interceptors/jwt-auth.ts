import { unauthorized } from 'boom';
import * as jwt from 'jsonwebtoken';
import { IRouterContext } from 'koa-router';
import { jwtConfig, jwtIncludeRoutes } from '../config';
import { IUserAuth } from '../mongo/models/user-auth';
import { UserAuthService } from '../services/user-auth-service';

const userAuthService = new UserAuthService();

export const jwtAuth = async (ctx: IRouterContext, next: any) => {
  if (jwtIncludeRoutes.includes(ctx.path)) {
    try {
      const token: string = ctx.request.headers.authorization;
      const decoded = jwt.decode(token) as IUserAuth;
      const apiUser = await userAuthService.getUser({ username: decoded.username });
      jwt.verify(token, apiUser.password + jwtConfig.key, { algorithms: ['HS256'] });
    } catch (error) {
      console.log(error);
      throw unauthorized('Authorization failed');
    }
  }
  await next();
  return;
};
