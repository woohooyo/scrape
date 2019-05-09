import { IRouterContext } from 'koa-router';
import { IUserAuth } from '../mongo/models/user-auth';
import { UserAuthService } from '../services/user-auth-service';

const userAuthService = new UserAuthService();

export class UserController {
  public static async post(ctx: IRouterContext) {
    const body: IUserAuth = ctx.request.body;
    ctx.body = await userAuthService.addUser(body);
  }

  public static async put(ctx: IRouterContext) {
    const body: IUserAuth = ctx.request.body;
    ctx.body = await userAuthService.updateUser(body);
  }
}
