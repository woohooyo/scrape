import { IRouterContext } from 'koa-router';
import { IUserAuth } from '../mongo/models/user-auth';
import { UserAuthService } from '../services/user-auth-service';

const userAuthService = new UserAuthService();

export class UserController {
  public static async post(ctx: IRouterContext) {
    const body: IUserAuth = ctx.request.body;
    const response = await userAuthService.addUser(body);
    ctx.body = response;
  }

}
