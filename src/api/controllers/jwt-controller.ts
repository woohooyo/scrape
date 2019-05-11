import * as Router from 'koa-router';
import { IUserAuth } from '../../mongo/models/user-auth';
import { UserAuthService } from '../services/user-auth-service';

const userAuthService = new UserAuthService();

export class AuthController {
  public static async post(ctx: Router.IRouterContext) {
    const body: IUserAuth = ctx.request.body;
    ctx.body = await userAuthService.getToken(body);
  }
}
