import { FilterQuery } from 'mongodb';
import { jwtConfig, mongoConfig } from '../config';
import { IUserAuth, UserAuth } from '../mongo/models/user-auth';

import { unauthorized } from 'boom';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

export class UserAuthService {
  private userAuthModel = new UserAuth(mongoConfig);

  public async getUser(where: FilterQuery<IUserAuth>) {
    return (await this.userAuthModel.get(where))[0];
  }

  public async getToken(user: IUserAuth) {
    const DbUser = await this.getUser({ username: user.username });
    this.verifyUser(DbUser, user.password);
    return this.signToken(user);
  }

  private verifyUser(user: IUserAuth, inputPassword: string) {
    if (user.password !== inputPassword) {
      throw unauthorized('User password is invalid.');
    }
  }

  private signToken(user: IUserAuth) {
    return jwt.sign(
      Object.assign({}, user, {password: undefined}),
      user.password + jwtConfig.key,
      {
        algorithm: 'HS256',
        expiresIn: jwtConfig.expire,
      },
    );
  }
}
